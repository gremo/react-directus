import { DirectusAssetProps } from './types';

export const DirectusAsset = ({ apiUrl, asset, download = false, render }: DirectusAssetProps): JSX.Element => {
  let params = {};
  if (download) {
    params = { ...params, download: '' };
  }

  return render({
    apiUrl,
    asset,
    download,
    url: `${apiUrl}/assets/${'object' === typeof asset ? asset.id : asset}?${new URLSearchParams(params).toString()}`,
  });
};
