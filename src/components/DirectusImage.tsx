import * as React from 'react';

import { DirectusContext } from '@/DirectusProvider';
import { DirectusImageProps } from '@/types';

export const DirectusImage = ({
  apiUrl: propsApiUrl,
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

  if (!directusContext && !propsApiUrl) {
    throw new Error('DirectusImage requires either a DirectusProvider or an apiUrl prop');
  }

  const apiUrl = propsApiUrl || directusContext?.apiUrl;

  const imageUrl = React.useMemo((): string | undefined => {
    const assetId = asset && 'object' === typeof asset ? asset.id : asset;

    if (!assetId) {
      return undefined;
    }

    const params = new URLSearchParams();

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

    return `${apiUrl}/assets/${assetId}?${params.toString()}`;
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
