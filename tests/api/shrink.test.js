import { createHash } from 'crypto';
import httpMocks from 'node-mocks-http';
import handler from '../../src/pages/api/shrink';
import { neon } from '@neondatabase/serverless';

jest.mock('@neondatabase/serverless', () => ({
    neon: jest.fn(),
}));

const SALT = 'lite-fyi-2026-experimental-salt';

describe('Handler: /api/shrink', () => {
    let mockSql;

    beforeEach(() => {
        jest.clearAllMocks();
        mockSql = jest.fn();
        neon.mockReturnValue(mockSql);
    });

    const generateValidProof = (ts) => {
        return createHash('sha256').update(String(ts) + SALT).digest('hex');
    };

    it('should return 403 if timestamp is missing', async () => {
        const { req, res } = httpMocks.createMocks({
            method: 'POST',
            body: { link: 'https://google.com' },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(403);
        expect(JSON.parse(res._getData())).toEqual({
            success: false,
            error: 'Unauthorized: Proof expired. Please try again.',
        });
    });

    it('should return 403 if proof is expired', async () => {
        const oldTs = Date.now() - 5000;
        const { req, res } = httpMocks.createMocks({
            method: 'POST',
            body: {
                link: 'https://google.com',
                ts: oldTs,
                proof: generateValidProof(oldTs)
            },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(403);
        expect(JSON.parse(res._getData())).toEqual({
            success: false,
            error: 'Unauthorized: Proof expired. Please try again.',
        });
    });

    it('should return 403 if proof is invalid', async () => {
        const ts = Date.now();
        const { req, res } = httpMocks.createMocks({
            method: 'POST',
            body: {
                link: 'https://google.com',
                ts: ts,
                proof: 'invalid-proof'
            },
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(403);
        expect(JSON.parse(res._getData())).toEqual({
            success: false,
            error: 'Unauthorized: Invalid request signature.',
        });
    });

    it('should successfully shrink a link', async () => {
        const ts = Date.now();
        const { req, res } = httpMocks.createMocks({
            method: 'POST',
            headers: { host: 'localhost:3000' },
            body: {
                link: 'https://google.com',
                ts: ts,
                proof: generateValidProof(ts)
            },
        });

        // Mock SQL queries
        mockSql.mockImplementation((strings, ...values) => {
            const query = strings.join('');
            if (query.includes('COUNT(*)')) {
                return Promise.resolve([{ count: '10' }]);
            }
            if (query.includes('INSERT INTO')) {
                return Promise.resolve();
            }
            return Promise.resolve();
        });

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        const data = JSON.parse(res._getData());
        expect(data.success).toBe(true);
        expect(data.shortLink).toMatch(/localhost:3000\/[a-zA-Z0-9]+/);
    });

    it('should handle collisions and retry', async () => {
        const ts = Date.now();
        const { req, res } = httpMocks.createMocks({
            method: 'POST',
            headers: { host: 'localhost:3000' },
            body: {
                link: 'https://google.com',
                ts: ts,
                proof: generateValidProof(ts)
            },
        });

        // Mock SQL queries
        mockSql
            .mockResolvedValueOnce([{ count: '10' }]) // getOptimalCodeLength
            .mockRejectedValueOnce({ code: '23505' }) // first INSERT collision
            .mockResolvedValueOnce(); // second INSERT success

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        const data = JSON.parse(res._getData());
        expect(data.success).toBe(true);
        expect(mockSql).toHaveBeenCalledTimes(3);
    });

    it('should return 500 on other database errors', async () => {
        const ts = Date.now();
        const { req, res } = httpMocks.createMocks({
            method: 'POST',
            body: {
                link: 'https://google.com',
                ts: ts,
                proof: generateValidProof(ts)
            },
        });

        mockSql
            .mockResolvedValueOnce([{ count: '10' }])
            .mockRejectedValueOnce(new Error('Random DB Error'));

        await handler(req, res);

        expect(res._getStatusCode()).toBe(500);
        expect(JSON.parse(res._getData())).toEqual({
            success: false,
            error: 'Internal Server Error',
        });
    });

    it('should use length 1 if n < 2', async () => {
        const ts = Date.now();
        const { req, res } = httpMocks.createMocks({
            method: 'POST',
            headers: { host: 'localhost:3000' },
            body: {
                link: 'https://google.com',
                ts: ts,
                proof: generateValidProof(ts)
            },
        });

        mockSql.mockResolvedValueOnce([{ count: '0' }]).mockResolvedValueOnce();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        const data = JSON.parse(res._getData());
        // n=0 should result in length 1
        expect(data.shortLink).toMatch(/localhost:3000\/[a-zA-Z0-9]$/);
    });

    it('should handle stringified body', async () => {
        const ts = Date.now();
        const body = JSON.stringify({
            link: 'https://google.com',
            ts: ts,
            proof: generateValidProof(ts)
        });

        const { req, res } = httpMocks.createMocks({
            method: 'POST',
            headers: { host: 'localhost:3000' },
            body,
        });

        mockSql.mockResolvedValueOnce([{ count: '10' }]).mockResolvedValueOnce();

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        expect(JSON.parse(res._getData()).success).toBe(true);
    });
});
