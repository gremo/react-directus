import { DirectusItem } from '../types';

/**
 * Convert a DirectusItem or string to an id
 * @param item - DirectusItem or string
 * @returns id
 * @example
 * toID('123') // '123'
 * toID({ id: '123' }) // '123'
 * toID({ id: '123', name: 'foo' }) // '123'
 * toID({ name: 'foo' }) // undefined
 */
export function toID(item: Partial<DirectusItem> | string): string | undefined {
  return 'string' === typeof item ? item : item.id;
}

/**
 * Generate the url for an asset in Directus
 * @param apiUrl - Directus API url
 * @param assetId - Directus asset id
 * @param params - Parameters to add to the url. See {@link https://docs.directus.io/reference/files.html}
 * @returns url linking to the asset
 * @example
 * const exampleApiUrl = 'https://example.com';
 * const exampleAssetId = '123';
 *
 * generateAssetUrl(exampleApiUrl, exampleAssetId, new URLSearchParams({ width: '100' })); // 'https://example.com/assets/123?width=100'
 * generateAssetUrl(exampleApiUrl, exampleAssetId, new URLSearchParams({ width: '100', height: '100' })); // 'https://example.com/assets/123?width=100&height=100'
 * generateAssetUrl(exampleApiUrl, exampleAssetId, new URLSearchParams({ width: '100', height: '100', download: '' })); // 'https://example.com/assets/123?width=100&height=100&download'
 * generateAssetUrl(exampleApiUrl, exampleAssetId, new URLSearchParams({ key: 'thumbnail' })); // 'https://example.com/assets/123?key=thumbnail'
 */
export function generateAssetUrl(apiUrl: string, assetId: string, params: URLSearchParams): string {
  return `${apiUrl}/assets/${assetId}?${params.toString()}`;
}
