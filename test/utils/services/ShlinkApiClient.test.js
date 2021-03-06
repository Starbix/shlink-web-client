import ShlinkApiClient from '../../../src/utils/services/ShlinkApiClient';

describe('ShlinkApiClient', () => {
  const createAxiosMock = (data) => () => Promise.resolve(data);
  const createApiClient = (data) => new ShlinkApiClient(createAxiosMock(data));

  describe('listShortUrls', () => {
    it('properly returns short URLs list', async () => {
      const expectedList = [ 'foo', 'bar' ];

      const { listShortUrls } = createApiClient({
        data: {
          shortUrls: expectedList,
        },
      });

      const actualList = await listShortUrls();

      expect(expectedList).toEqual(actualList);
    });
  });

  describe('createShortUrl', () => {
    const shortUrl = {
      bar: 'foo',
    };

    it('returns create short URL', async () => {
      const { createShortUrl } = createApiClient({ data: shortUrl });
      const result = await createShortUrl({});

      expect(result).toEqual(shortUrl);
    });

    it('removes all empty options', async () => {
      const axiosSpy = jest.fn(createAxiosMock({ data: shortUrl }));
      const { createShortUrl } = new ShlinkApiClient(axiosSpy);

      await createShortUrl(
        { foo: 'bar', empty: undefined, anotherEmpty: null }
      );

      expect(axiosSpy).toHaveBeenCalledWith(expect.objectContaining({ data: { foo: 'bar' } }));
    });
  });

  describe('getShortUrlVisits', () => {
    it('properly returns short URL visits', async () => {
      const expectedVisits = [ 'foo', 'bar' ];
      const axiosSpy = jest.fn(createAxiosMock({
        data: {
          visits: {
            data: expectedVisits,
          },
        },
      }));
      const { getShortUrlVisits } = new ShlinkApiClient(axiosSpy);

      const actualVisits = await getShortUrlVisits('abc123', {});

      expect({ data: expectedVisits }).toEqual(actualVisits);
      expect(axiosSpy).toHaveBeenCalledWith(expect.objectContaining({
        url: '/short-urls/abc123/visits',
        method: 'GET',
      }));
    });
  });

  describe('getShortUrl', () => {
    it('properly returns short URL', async () => {
      const expectedShortUrl = { foo: 'bar' };
      const axiosSpy = jest.fn(createAxiosMock({
        data: expectedShortUrl,
      }));
      const { getShortUrl } = new ShlinkApiClient(axiosSpy);

      const result = await getShortUrl('abc123');

      expect(expectedShortUrl).toEqual(result);
      expect(axiosSpy).toHaveBeenCalledWith(expect.objectContaining({
        url: '/short-urls/abc123',
        method: 'GET',
      }));
    });
  });

  describe('updateShortUrlTags', () => {
    it('properly updates short URL tags', async () => {
      const expectedTags = [ 'foo', 'bar' ];
      const axiosSpy = jest.fn(createAxiosMock({
        data: { tags: expectedTags },
      }));
      const { updateShortUrlTags } = new ShlinkApiClient(axiosSpy);

      const result = await updateShortUrlTags('abc123', expectedTags);

      expect(expectedTags).toEqual(result);
      expect(axiosSpy).toHaveBeenCalledWith(expect.objectContaining({
        url: '/short-urls/abc123/tags',
        method: 'PUT',
      }));
    });
  });

  describe('listTags', () => {
    it('properly returns list of tags', async () => {
      const expectedTags = [ 'foo', 'bar' ];
      const axiosSpy = jest.fn(createAxiosMock({
        data: {
          tags: { data: expectedTags },
        },
      }));
      const { listTags } = new ShlinkApiClient(axiosSpy);

      const result = await listTags();

      expect(expectedTags).toEqual(result);
      expect(axiosSpy).toHaveBeenCalledWith(expect.objectContaining({ url: '/tags', method: 'GET' }));
    });
  });

  describe('deleteTags', () => {
    it('properly deletes provided tags', async () => {
      const tags = [ 'foo', 'bar' ];
      const axiosSpy = jest.fn(createAxiosMock({}));
      const { deleteTags } = new ShlinkApiClient(axiosSpy);

      await deleteTags(tags);

      expect(axiosSpy).toHaveBeenCalledWith(expect.objectContaining({
        url: '/tags',
        method: 'DELETE',
        params: { tags },
      }));
    });
  });

  describe('editTag', () => {
    it('properly edits provided tag', async () => {
      const oldName = 'foo';
      const newName = 'bar';
      const axiosSpy = jest.fn(createAxiosMock({}));
      const { editTag } = new ShlinkApiClient(axiosSpy);

      await editTag(oldName, newName);

      expect(axiosSpy).toHaveBeenCalledWith(expect.objectContaining({
        url: '/tags',
        method: 'PUT',
        data: { oldName, newName },
      }));
    });
  });

  describe('deleteShortUrl', () => {
    it('properly deletes provided short URL', async () => {
      const axiosSpy = jest.fn(createAxiosMock({}));
      const { deleteShortUrl } = new ShlinkApiClient(axiosSpy);

      await deleteShortUrl('abc123');

      expect(axiosSpy).toHaveBeenCalledWith(expect.objectContaining({
        url: '/short-urls/abc123',
        method: 'DELETE',
      }));
    });
  });

  describe('health', () => {
    it('returns health data', async () => {
      const expectedData = {
        status: 'pass',
        version: '1.19.0',
      };
      const axiosSpy = jest.fn(createAxiosMock({ data: expectedData }));
      const { health } = new ShlinkApiClient(axiosSpy);

      const result = await health();

      expect(axiosSpy).toHaveBeenCalled();
      expect(result).toEqual(expectedData);
    });
  });
});
