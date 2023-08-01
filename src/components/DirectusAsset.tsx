import * as React from 'react';

import { generateAssetUrl, toID } from '@/utils/directus';
import { DirectusAssetProps } from '@/types';
import { DirectusContext } from '@/DirectusProvider';

export const DirectusAsset = ({
  apiUrl: propsApiUrl,
  accessToken: propsAccessToken,
  asset,
  download = false,
  render,
}: DirectusAssetProps): JSX.Element => {
  const directusContext = React.useContext(DirectusContext);
  const [assetUrl, setAssetUrl] = React.useState<string | undefined>();

  const { directus, apiUrl: contextApiUrl } = directusContext || {};

  const apiUrl = propsApiUrl || contextApiUrl;
  if (!apiUrl) {
    throw new Error('DirectusAsset requires either a DirectusProvider or an apiUrl prop');
  }

  const assetId = toID(asset);

  if (!assetId) {
    throw new Error('DirectusAsset requires an asset id');
  }

  const generateUrl = async () => {
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
    if (download) {
      params.append('download', '');
    }
    setAssetUrl(generateAssetUrl(apiUrl, assetId, params));
  };

  React.useEffect(() => {
    generateUrl();
  }, [directusContext, asset, propsApiUrl, propsAccessToken, download]);

  return render({
    apiUrl,
    asset,
    download,
    url: assetUrl,
  });
};
