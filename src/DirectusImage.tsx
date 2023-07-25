import { DirectusImageProps } from './types';

export const DirectusImage = ({ apiUrl, asset, render, ...params }: DirectusImageProps): JSX.Element => {
  return render({
    apiUrl,
    asset,
    ...params,
    url: `${apiUrl}/assets/${'object' === typeof asset ? asset.id : asset}?${new URLSearchParams(
      params as Record<string, string>
    ).toString()}`,
  });
};
