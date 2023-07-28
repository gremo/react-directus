import * as React from 'react';

import { DirectusContext } from '@/base/DirectusProvider';
import { DirectusImageProps } from '@/types';

export const DirectusImage = ({ apiUrl: propsApiUrl, asset, render, ...params }: DirectusImageProps): JSX.Element => {
  const directusContext = React.useContext(DirectusContext);

  if (!directusContext && !propsApiUrl) {
    throw new Error('DirectusAsset requires either a DirectusProvider or an apiUrl prop');
  }

  const apiUrl = propsApiUrl || directusContext?.apiUrl;

  return render({
    apiUrl,
    asset,
    ...params,
    url: `${apiUrl}/assets/${'object' === typeof asset ? asset.id : asset}?${new URLSearchParams(
      params as Record<string, string>
    ).toString()}`,
  });
};
