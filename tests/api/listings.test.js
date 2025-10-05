/**
 * Tests for listings API
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getListings } from '../../src/js/api/listings/read.js';

describe('Listings API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getListings', () => {
    it('should fetch listings successfully', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          data: [
            {
              id: '1',
              title: 'Test Listing',
              description: 'A test listing',
              created: '2024-01-01T00:00:00Z',
              endsAt: '2024-12-31T23:59:59Z',
            },
          ],
          meta: {
            isLastPage: false,
            pageCount: 5,
            currentPage: 1,
          },
        }),
      };

      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      const result = await getListings(1, 9, 'created', 'desc');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=1&limit=9&sort=created&sortOrder=desc&_active=true')
      );

      expect(result).toEqual({
        listings: expect.arrayContaining([
          expect.objectContaining({
            id: '1',
            title: 'Test Listing',
          }),
        ]),
        meta: expect.objectContaining({
          isLastPage: false,
          currentPage: 1,
        }),
        currentPage: 1,
      });
    });

    it('should handle API errors', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(getListings()).rejects.toThrow('API request failed with status 500');
    });

    it('should handle network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(getListings()).rejects.toThrow('Network error');
    });

    it('should use default parameters', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          data: [],
          meta: { isLastPage: true },
        }),
      };

      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      await getListings();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=1&limit=9&sort=created&sortOrder=desc')
      );
    });

    it('should handle empty response data', async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({}),
      };

      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      const result = await getListings();

      expect(result.listings).toEqual([]);
      expect(result.meta.isLastPage).toBe(true);
    });
  });
});