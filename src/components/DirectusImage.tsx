import * as React from 'react';

import { generateAssetUrl, toID } from '@/utils/directus';
import { DirectusContext } from '@/DirectusProvider';
import { DirectusImageProps } from '@/types';

export const DirectusImage = ({
  apiUrl: propsApiUrl,
  accessToken: propsAccessToken,
  asset,
  render,
  presetKey,
  width,
  height,
  quality,
  fit,
  format,
  withoutEnlargement,
  transforms,
}: DirectusImageProps): JSX.Element => {
  const directusContext = React.useContext(DirectusContext);
  const [imageUrl, setImageUrl] = React.useState<string | undefined>();

  const { directus, apiUrl: contextApiUrl } = directusContext || {};

  const apiUrl = propsApiUrl || contextApiUrl;

  if (!apiUrl) {
    throw new Error('DirectusImage requires either a DirectusProvider or an apiUrl prop');
  }

  const assetId = toID(asset);

  if (!assetId) {
    throw new Error('DirectusImage requires an asset id');
  }

  const generateImageUrl = async () => {
    let accessToken: string | null = null;

    if (propsAccessToken) {
      accessToken = propsAccessToken;
    } else if (directus) {
      accessToken = await directus.auth.token;
    }

    const params = new URLSearchParams();

    if (accessToken) {
      params.append('access_token', accessToken);
    }

    // test if props is DirectusImagePropsKeyed or DirectusImagePropsDynamic
    if ('string' === typeof presetKey) {
      params.append('key', presetKey);
    } else {
      if (width) {
        params.append('width', width.toString());
      }
      if (height) {
        params.append('height', height.toString());
      }
      if (quality) {
        params.append('quality', quality.toString());
      }
      if (fit) {
        params.append('fit', fit);
      }
      if (format) {
        params.append('format', format);
      }
      if (withoutEnlargement) {
        params.append('withoutEnlargement', 'true');
      }
      if (transforms) {
        params.append('transforms', JSON.stringify(transforms));
      }
    }

    setImageUrl(generateAssetUrl(apiUrl, assetId, params));
  };

  React.useEffect(() => {
    generateImageUrl();
  }, [
    directusContext,
    asset,
    propsApiUrl,
    presetKey,
    width,
    height,
    quality,
    fit,
    format,
    withoutEnlargement,
    transforms,
  ]);

  // test if props is DirectusImagePropsKeyed or DirectusImagePropsDynamic
  if ('string' === typeof presetKey) {
    return render({
      apiUrl,
      asset,
      url: imageUrl,
      presetKey,
    });
  }

  return render({
    apiUrl,
    asset,
    url: imageUrl,
    width,
    height,
    quality,
    fit,
    format,
    withoutEnlargement,
    transforms,
  });
};
