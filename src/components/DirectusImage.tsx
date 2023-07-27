import * as React from 'react';

import { DirectusContext } from '@/DirectusProvider';
import { DirectusImageProps } from '@/types';

export const DirectusImage = ({
  apiUrl: propsApiUrl,
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

    if (key) {
      params.append('key', key);
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

    const tempUrl = `${apiUrl}/assets/${assetId}?${params.toString()}`;

    return tempUrl;
  }, [directusContext, asset, propsApiUrl, width, height, quality, key, fit, format, withoutEnlargement, transforms]);

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
