import { DirectusAssetObject, DirectusFile, Fit, Format, RenderPropsFile } from '@components/DirectusFile';

export interface RenderPropsImage extends Omit<DirectusImageProps, 'render'> {
  url?: string;
}

export interface DirectusImageProps {
  apiUrl: string;
  asset: DirectusAssetObject;
  height?: number;
  width?: number;
  fit?: 'contain' | 'cover' | 'inside' | 'outside';
  quality?: number;
  format?: 'auto' | 'jpg' | 'png' | 'webp' | 'tiff';
  render: (props: RenderPropsImage) => JSX.Element;
}

/**
 * @deprecated  Please import the new `DirectusFile` component instead.
 */
export const DirectusImage = ({
  apiUrl,
  asset,
  render,
  height,
  width,
  fit,
  quality,
  format,
}: DirectusImageProps): JSX.Element => {
  // Convert the the new props to the old props
  const renderOld = (props: RenderPropsFile): JSX.Element => {
    return render({
      apiUrl,
      url: props.url,
      asset,
      width,
      height,
      fit,
      quality,
      format,
    });
  };

  return (
    <DirectusFile
      apiUrl={apiUrl}
      asset={asset}
      directusTransform={{
        width,
        height,
        fit: fit ? Fit[fit] : undefined,
        quality,
        format: format ? Format[format] : undefined,
      }}
      render={renderOld}
    />
  );
};
