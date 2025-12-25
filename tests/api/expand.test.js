import httpMocks from 'node-mocks-http';
import handler from '../../src/pages/api/expand';
import { neon } from '@neondatabase/serverless';

jest.mock('@neondatabase/serverless', () => ({
    neon: jest.fn(),
}));

describe('Handler: /api/expand', () => {
    let mockSql;

    beforeEach(() => {
        jest.clearAllMocks();
        mockSql = jest.fn();
        neon.mockReturnValue(mockSql);
    });

    it('should redirect to the original link if code exists', async () => {
        const { req, res } = httpMocks.createMocks({
            method: 'GET',
            query: { code: 'test' },
        });

        mockSql.mockResolvedValue([{ url: 'google.com' }]);

        // Next.js res.redirect mock
        res.redirect = jest.fn();

        await handler(req, res);

        expect(res.redirect).toHaveBeenCalledWith(301, 'https://google.com');
        expect(res._getHeaders()).toHaveProperty('cache-control', 's-maxage=86400, stale-while-revalidate');
    });

    it('should not add https if link already has it', async () => {
        const { req, res } = httpMocks.createMocks({
            method: 'GET',
            query: { code: 'test' },
        });

        mockSql.mockResolvedValue([{ url: 'http://example.com' }]);
        res.redirect = jest.fn();

        await handler(req, res);

        expect(res.redirect).toHaveBeenCalledWith(301, 'http://example.com');
    });

    it('should redirect back to home if code does not exist', async () => {
        const { req, res } = httpMocks.createMocks({
            method: 'GET',
            query: { code: 'missing' },
        });

        mockSql.mockResolvedValue([]);
        res.redirect = jest.fn();

        await handler(req, res);

        expect(res.redirect).toHaveBeenCalledWith(301, '/');
        expect(res._getHeaders()).toHaveProperty('cache-control', 's-maxage=600');
    });
});
