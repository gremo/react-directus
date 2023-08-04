import { DirectusAssetObject, DirectusFile, RenderPropsFile } from '@components/DirectusFile';

export interface RenderPropsAsset extends Omit<DirectusAssetProps, 'render'> {
  url?: string;
}

export interface DirectusAssetProps {
  apiUrl: string;
  asset: DirectusAssetObject;
  download?: boolean;
  render: (props: RenderPropsAsset) => JSX.Element;
}

/**
 * @deprecated  Please import the new `DirectusFile` component instead.
 */
export const DirectusAsset = ({ apiUrl, asset, download, render }: DirectusAssetProps): JSX.Element => {
  const renderOld = (props: RenderPropsFile): JSX.Element => {
    return render({
      apiUrl,
      url: props.url ?? '',
      asset: props.asset,
      download,
    });
  };

  return <DirectusFile apiUrl={apiUrl} asset={asset} download={download} render={renderOld} />;
};
