import { useEffect, useState } from 'react';

import { DirectusImageProps } from './types';
import { useDirectus } from './DirectusProvider';

export const DirectusImage = ({
  apiUrl: propsApiUrl,
  accsessToken: propsAccsessToken,
  asset,
  width,
  height,
  quality = 75,
  key,
  fit,
  format,
  withoutEnlargement,
  transforms,
  render,
}: DirectusImageProps): JSX.Element => {
  const { directus, apiUrl } = useDirectus();
  const [imageUrl, setImageUrl] = useState<string | undefined>();

  const generateImageUrl = async () => {
    const assetId = asset && 'object' === typeof asset ? asset.id : asset;

    if (!assetId) {
      return;
    }

    let accessToken: string | null = null;
    let url: string | null = null;

    if (propsAccsessToken) {
      accessToken = propsAccsessToken;
    } else if (directus) {
      accessToken = await directus.auth.token;
    }

    if (propsApiUrl) {
      url = propsApiUrl;
    } else if (apiUrl) {
      url = apiUrl;
    } else {
      // must be in directusprovider or have defined apiUrl
      throw new Error('DirectusImage has to be used within <DirectusProvider> or have defined apiUrl');
    }

    const params = new URLSearchParams();

    if (accessToken) params.append('access_token', accessToken);

    if (key) {
      params.append('key', key);
    } else {
      if (width) params.append('width', width.toString());
      if (height) params.append('height', height.toString());
      if (quality) params.append('quality', quality.toString());
      if (fit) params.append('fit', fit);
      if (format) params.append('format', format);
      if (withoutEnlargement) params.append('withoutEnlargement', 'true');
      if (transforms) {
        params.append('transforms', JSON.stringify(transforms));
      }
    }
    const tempUrl = `${url}/assets/${assetId}?${params.toString()}`;

    setImageUrl(tempUrl);
  };

  useEffect(() => {
    generateImageUrl();
  }, [
    directus,
    asset,
    propsApiUrl,
    propsAccsessToken,
    width,
    height,
    quality,
    key,
    fit,
    format,
    withoutEnlargement,
    transforms,
  ]);

  return render({
    asset,
    width,
    height,
    quality,
    key,
    fit,
    format,
    withoutEnlargement,
    transforms,
    url: imageUrl,
    apiUrl: propsApiUrl || apiUrl,
  });
};
