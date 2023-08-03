import { useContext, useEffect, useState } from 'react';
import { DirectusAssetProps } from '@components/DirectusAsset';
import { DirectusContext } from '@/DirectusProvider';

/**
 * Shape of the `DirectusImage` component `render` prop, with `presetKey` prop.
 */
export type DirectusImageRendererKeyed = Omit<DirectusImagePropsKeyed, 'render'> & {
  /** The url of the asset. */
  url?: string;
};

/**
 * Shape of the `DirectusImage` component `render` prop, with dynamic props.
 */
export type DirectusImageRendererDynamic = Omit<DirectusImagePropsDynamic, 'render'> & {
  /** The url of the asset. */
  url?: string;
};

/**
 * Shape of the `DirectusImage` component `render` prop.
 */
export type DirectusImageRenderer = DirectusImageRendererKeyed | DirectusImageRendererDynamic;

/**
 * Shape of a generic image component props.
 */
export type DirectusImagePropsBase = Omit<DirectusAssetProps, 'download' | 'render'> & {
  render: (args: DirectusImageRenderer) => JSX.Element;
};

/**
 * Represents the {@link https://docs.directus.io/reference/files.html#requesting-a-thumbnail | Custom Transformations} you can apply to an image.
 */
export interface DirectusImageCustomProps {
  /** The width of the thumbnail in pixels.*/
  width?: number;
  /** The height of the thumbnail in pixels. */
  height?: number;
  /** The quality of the thumbnail (1 to 100). */
  quality?: number;
  /** The fit of the thumbnail while always preserving the aspect ratio. */
  fit?: 'cover' | 'contain' | 'inside' | 'outside';
  /** The file format of the thumbnail. */
  format?: 'auto' | 'jpg' | 'png' | 'webp' | 'tiff';
  /** Disable image up-scaling. */
  withoutEnlargement?: boolean;
  /** An array of sharp operations to apply to the image. {@link https://sharp.pixelplumbing.com/api-operation | Sharp API}*/
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transforms?: [string, ...any[]][];
}

/**
 * Shape of the `DirectusImage` component props, with dynamic props.
 */
export type DirectusImagePropsDynamic = {
  /** Key for Storage Asset Preset ( https://docs.directus.io/user-guide/cloud/project-settings.html#files-thumbnails ). */
  presetKey?: never;
} & DirectusImageCustomProps &
  DirectusImagePropsBase;

/**
 * Shape of the `DirectusImage` component props, with `presetKey` prop.
 */
export type DirectusImagePropsKeyed = {
  /** Key for Storage Asset Preset ( https://docs.directus.io/user-guide/cloud/project-settings.html#files-thumbnails ). */
  presetKey: string;
} & { [p in keyof DirectusImageCustomProps]: never } & DirectusImagePropsBase;

/**
 * Shape of the `DirectusImage` component props.
 */
export type DirectusImageProps = DirectusImagePropsDynamic | DirectusImagePropsKeyed;

/**
 * DirectusImage is a React Component that renders an image from your Directus API.
 * @example Here is an example of how to use DirectusImage
 * ```tsx
 * import { DirectusImage } from 'react-directus';
 *
 * export const MyImage = ({ imageId }) => (
 *  <DirectusImage
 *   asset={imageId}
 *   quality={50}
 *   render={({ url }) => <img src={url}
 * />}
 * ```
 */
export const DirectusImage = ({
  apiUrl: propsApiUrl,
  accessToken: propsAccessToken,
  asset,
  render,
  presetKey,
  width,
  height,
  quality,
  fit,
  format,
  withoutEnlargement,
  transforms,
}: DirectusImageProps): JSX.Element => {
  const directusContext = useContext(DirectusContext);
  const [imageUrl, setImageUrl] = useState<string | undefined>();

  if (!directusContext && !propsApiUrl) {
    throw new Error('DirectusImage requires either a DirectusProvider or an apiUrl prop');
  }

  const assetId = asset && 'object' === typeof asset ? asset.id : asset;

  if (!assetId) {
    throw new Error('DirectusImage requires an asset id');
  }

  const { directus, apiUrl: contextApiUrl } = directusContext || {};

  const apiUrl = propsApiUrl || contextApiUrl;
  const generateImageUrl = async () => {
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

    // test if props is DirectusImagePropsKeyed or DirectusImagePropsDynamic
    if ('string' === typeof presetKey) {
      params.append('key', presetKey);
    } else {
      if (width) {
        params.append('width', width.toString());
      }
      if (height) {
        params.append('height', height.toString());
      }
      if (quality) {
        params.append('quality', quality.toString());
      }
      if (fit) {
        params.append('fit', fit);
      }
      if (format) {
        params.append('format', format);
      }
      if (withoutEnlargement) {
        params.append('withoutEnlargement', 'true');
      }
      if (transforms) {
        params.append('transforms', JSON.stringify(transforms));
      }
    }

    setImageUrl(`${apiUrl}/assets/${assetId}?${params.toString()}`);
  };

  useEffect(() => {
    generateImageUrl();
  }, [
    directusContext,
    asset,
    propsApiUrl,
    presetKey,
    width,
    height,
    quality,
    fit,
    format,
    withoutEnlargement,
    transforms,
  ]);

  // test if props is DirectusImagePropsKeyed or DirectusImagePropsDynamic
  if ('string' === typeof presetKey) {
    return render({
      apiUrl,
      asset,
      url: imageUrl,
      presetKey,
    });
  }

  return render({
    apiUrl,
    asset,
    url: imageUrl,
    width,
    height,
    quality,
    fit,
    format,
    withoutEnlargement,
    transforms,
  });
};
