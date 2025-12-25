import httpMocks from 'node-mocks-http';
import handler from '../../src/pages/api/shrink';
import { neon } from '@neondatabase/serverless';
import crypto from 'crypto';

jest.mock('@neondatabase/serverless', () => ({
    neon: jest.fn(),
}));

jest.mock('crypto', () => ({
    // Mock randomInt to return 0 (picking first char 'a') for predictable testing
    randomInt: jest.fn().mockReturnValue(0),
}));

describe('Handler: /api/shrink', () => {
    let mockSql;

    beforeEach(() => {
        jest.clearAllMocks();
        mockSql = jest.fn();
        neon.mockReturnValue(mockSql);
    });

    it('should return 405 if method is not POST', async () => {
        const { req, res } = httpMocks.createMocks({
            method: 'GET',
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(405);
        expect(JSON.parse(res._getData())).toEqual({
            error: 'Method not allowed',
        });
    });

    it('should return 400 if link is missing', async () => {
        const { req, res } = httpMocks.createMocks({
            method: 'POST',
            body: {},
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(JSON.parse(res._getData())).toEqual({
            success: false,
            error: 'Link is required',
        });
    });

    it('should block self-shortening (circular loops)', async () => {
        const { req, res } = httpMocks.createMocks({
            method: 'POST',
            headers: { host: 'lite.fyi' },
            body: { link: 'https://lite.fyi/abc' },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(JSON.parse(res._getData()).error).toMatch(/Circular links/);
    });

    it('should return 400 if link is invalid URL', async () => {
        const { req, res } = httpMocks.createMocks({
            method: 'POST',
            body: { link: 'not-a-url' },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(JSON.parse(res._getData()).error).toMatch(/Invalid URL format/);
    });

    it('should return 400 if link uses unsupported protocol', async () => {
        const { req, res } = httpMocks.createMocks({
            method: 'POST',
            body: { link: 'ftp://example.com' },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(JSON.parse(res._getData()).error).toMatch(/protocol/);
    });

    it('should return 400 if link is an internal IP (SSRF protection)', async () => {
        const internalHosts = ['127.0.0.1', '192.168.1.1', '169.254.169.254', 'localhost'];
        for (const host of internalHosts) {
            const { req, res } = httpMocks.createMocks({
                method: 'POST',
                body: { link: `http://${host}/metadata` },
            });

            await handler(req, res);

            expect(res._getStatusCode()).toBe(400);
            expect(JSON.parse(res._getData()).error).toMatch(/restricted/i);
        }
    });

    it('should return 400 if link is too long', async () => {
        const longLink = 'https://example.com/' + 'a'.repeat(2001);
        const { req, res } = httpMocks.createMocks({
            method: 'POST',
            body: { link: longLink },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(JSON.parse(res._getData()).error).toMatch(/exceeds 2000 characters/);
    });

    it('should successfully shrink a link', async () => {
        const { req, res } = httpMocks.createMocks({
            method: 'POST',
            headers: { host: 'localhost:3000' },
            body: { link: 'https://google.com' },
        });

        mockSql.mockResolvedValueOnce(); // INSERT success

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        const data = JSON.parse(res._getData());
        expect(data.success).toBe(true);
        expect(data.shortLink).toMatch(/localhost:3000\/.+/);
        expect(mockSql).toHaveBeenCalledWith(
            expect.arrayContaining(['INSERT INTO links (url, code) VALUES (', ', ', ')']),
            'https://google.com',
            expect.any(String)
        );
    });

    it('should auto-prepend https:// if protocol is missing', async () => {
        const { req, res } = httpMocks.createMocks({
            method: 'POST',
            headers: { host: 'localhost:3000' },
            body: { link: 'google.com' },
        });

        mockSql.mockResolvedValueOnce(); // INSERT success

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        const data = JSON.parse(res._getData());
        expect(data.success).toBe(true);
        expect(mockSql).toHaveBeenCalledWith(
            expect.arrayContaining(['INSERT INTO links (url, code) VALUES (', ', ', ')']),
            'https://google.com',
            expect.any(String)
        );
    });

    it('should handle simple collision and retry', async () => {
        const { req, res } = httpMocks.createMocks({
            method: 'POST',
            headers: { host: 'localhost:3000' },
            body: { link: 'https://google.com' },
        });

        // 1st call (6 times for length=6): returns 0 -> 'aaaaaa'
        // 2nd call (7 times for length=7): returns 1 -> 'bbbbbbb'
        let callCount = 0;
        crypto.randomInt.mockImplementation(() => {
            callCount++;
            return callCount <= 6 ? 0 : 1;
        });

        mockSql
            .mockRejectedValueOnce({ code: '23505' }) // First INSERT fails
            .mockResolvedValueOnce(); // Second INSERT succeeds

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        const data = JSON.parse(res._getData());
        expect(data.success).toBe(true);
        expect(mockSql).toHaveBeenCalledTimes(2);
    });

    it('should return 500 if retry fails', async () => {
        const { req, res } = httpMocks.createMocks({
            method: 'POST',
            headers: { host: 'localhost:3000' },
            body: { link: 'https://google.com' },
        });

        mockSql
            .mockRejectedValueOnce({ code: '23505' }) // First collision
            .mockRejectedValueOnce(new Error('Retry failed completely')); // Second failure

        await handler(req, res);

        expect(res._getStatusCode()).toBe(500);
        expect(JSON.parse(res._getData()).error).toMatch(/Failed to generate short link/);
    });
});
