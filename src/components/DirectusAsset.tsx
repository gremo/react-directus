import { useContext, useEffect, useState } from 'react';
import { DirectusContext } from '@/DirectusProvider';

/**
 * Shape of a generic asset.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DirectusAsset = string | ({ id: string } & Record<string, any>);

/**
 * Shape of the `DirectusAsset` component `render` prop.
 */
export type DirectusAssetRenderer = Omit<DirectusAssetProps, 'render'> & {
  /** The url of the asset. */
  url?: string;
};

export interface DirectusAssetProps {
  /** url to your Directus instance. */
  apiUrl?: string;
  /** The current user's access token. */
  accessToken?: string;
  /** The asset that should be rendered. */
  asset: DirectusAsset;
  /** If the asset should be downloaded instead of rendered. */
  download?: boolean;
  /** A function that returns the React element to be rendered.*/
  render: (args: DirectusAssetRenderer) => JSX.Element;
}

/**
 * DirectusAsset is a React Component that renders an asset from your Directus API.
 * @example Here is an example of how to use DirectusAsset
 * ```tsx
 * import { DirectusAsset } from 'react-directus';
 * import { createRoot } from 'react-dom/client';
 *
 * const root = createRoot(document.getElementById('root'));
 * root.render(
 *  <DirectusAsset asset={1} render={({ url }) => <img src={url} />} />
 * );
 * ```
 */
export const DirectusAsset = ({
  apiUrl: propsApiUrl,
  accessToken: propsAccessToken,
  asset,
  download = false,
  render,
}: DirectusAssetProps): JSX.Element => {
  const directusContext = useContext(DirectusContext);
  const [assetUrl, setAssetUrl] = useState<string | undefined>();

  if (!directusContext && !propsApiUrl) {
    throw new Error('DirectusAsset requires either a DirectusProvider or an apiUrl prop');
  }

  const assetId = asset && 'object' === typeof asset ? asset.id : asset;

  if (!assetId) {
    throw new Error('DirectusAsset requires an asset id');
  }

  const { directus, apiUrl: contextApiUrl } = directusContext || {};

  const apiUrl = propsApiUrl || contextApiUrl;

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
    setAssetUrl(`${apiUrl}/assets/${assetId}?${params.toString()}`);
  };

  useEffect(() => {
    generateUrl();
  }, [directusContext, asset, propsApiUrl, propsAccessToken, download]);

  return render({
    apiUrl,
    asset,
    download,
    url: assetUrl,
  });
};
