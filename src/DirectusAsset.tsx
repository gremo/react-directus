import { useEffect, useState } from 'react';

import { DirectusAssetProps } from './types';
import { useDirectus } from './DirectusProvider';

export const DirectusAsset = ({
  apiUrl: propsApiUrl,
  accsessToken: propsAccsessToken,
  asset,
  download = false,
  render,
}: DirectusAssetProps): JSX.Element => {
  const { directus, apiUrl } = useDirectus();
  const [assetUrl, setAssetUrl] = useState<string | undefined>();

  const generateUrl = async () => {
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
      throw new Error('DirectusAsset has to be used within <DirectusProvider> or have defined apiUrl');
    }

    const params = new URLSearchParams();

    if (accessToken) params.append('access_token', accessToken);
    if (download) params.append('download', '');

    const tempUrl = `${url}/assets/${assetId}?${params.toString()}`;

    setAssetUrl(tempUrl);
  };

  useEffect(() => {
    generateUrl();
  }, [directus, asset, propsApiUrl, propsAccsessToken, download]);

  return render({
    asset,
    download,
    url: assetUrl,
    apiUrl: apiUrl || propsApiUrl,
  });
};
