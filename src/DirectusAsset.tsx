import * as React from 'react';

import { DirectusAssetProps } from './types';
import { DirectusContext } from './DirectusProvider';

export const DirectusAsset = ({
  apiUrl: propsApiUrl,
  asset,
  download = false,
  render,
}: DirectusAssetProps): JSX.Element => {
  const directusContext = React.useContext(DirectusContext);

  if (!directusContext && !propsApiUrl) {
    throw new Error('DirectusAsset requires either a DirectusProvider or an apiUrl prop');
  }

  let params = {};
  if (download) {
    params = { ...params, download: '' };
  }

  const apiUrl = propsApiUrl || directusContext.apiUrl;

  return render({
    apiUrl,
    asset,
    download,
    url: `${apiUrl}/assets/${'object' === typeof asset ? asset.id : asset}?${new URLSearchParams(params).toString()}`,
  });
};
