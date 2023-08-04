/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DirectusAssetObject, DirectusFile, RenderPropsFile } from '@components/DirectusFile';

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
 * @deprecated Please use the `DirectusFile` component instead.
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
  const renderOld = (props: RenderPropsFile): JSX.Element => {
    let params = {};
    if ('object' === typeof props.directusTransform) {
      params = {
        ...props.directusTransform,
        width: props.directusTransform?.width ?? width,
        height: props.directusTransform?.height ?? height,
        fit: props.directusTransform?.fit ?? fit,
        quality: props.directusTransform?.quality ?? quality,
        format: props.directusTransform?.format ?? format,
      };
    }
    return render({
      apiUrl,
      url: props.url ?? '',
      asset: props.asset,
      ...params,
    });
  };

  return (
    <DirectusFile
      apiUrl={apiUrl}
      asset={asset}
      directusTransform={{
        width,
        height,
        // @ts-ignore
        fit,
        quality,
        // @ts-ignore
        format,
      }}
      render={renderOld}
    />
  );
};
