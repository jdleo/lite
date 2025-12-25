import httpMocks from 'node-mocks-http';
import handler from '../../src/pages/api/stats';
import { neon } from '@neondatabase/serverless';

jest.mock('@neondatabase/serverless', () => ({
    neon: jest.fn(),
}));

describe('Handler: /api/stats', () => {
    let mockSql;

    beforeEach(() => {
        jest.clearAllMocks();
        mockSql = jest.fn();
        neon.mockReturnValue(mockSql);
    });

    it('should return the correct count from database', async () => {
        const { req, res } = httpMocks.createMocks({
            method: 'GET',
        });

        mockSql.mockResolvedValue([{ count: '42' }]);

        await handler(req, res);

        expect(res._getStatusCode()).toBe(200);
        expect(JSON.parse(res._getData())).toEqual({ count: 42 });
        expect(res._getHeaders()).toHaveProperty('cache-control', 's-maxage=3600, stale-while-revalidate');
    });

    it('should return 500 if database query fails', async () => {
        const { req, res } = httpMocks.createMocks({
            method: 'GET',
        });

        mockSql.mockRejectedValue(new Error('DB Fail'));

        await handler(req, res);

        expect(res._getStatusCode()).toBe(500);
        expect(JSON.parse(res._getData())).toEqual({ error: 'Failed to fetch stats' });
    });
});
