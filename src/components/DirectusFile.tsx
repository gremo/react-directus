import { useContext, useEffect, useState } from 'react';
import { DirectusContext } from '@/DirectusProvider';

/**
 * DirectusAssetObject is the object that is returned by the Directus API when you request an asset.
 * It can be either the id of the asset or an object containing the id and additional information.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DirectusAssetObject = string | ({ id: string } & Record<string, any>);

/**
 * The fit of the thumbnail while always preserving the aspect ratio.
 */
export enum Fit {
  /** Covers both width/height by cropping/clipping to fit */
  Cover = 'cover',
  /** Contain within both width/height using "letterboxing" as needed */
  Contain = 'contain',
  /** Resize to be as large as possible, ensuring dimensions are less than or equal to the requested width and height */
  Inside = 'inside',
  /** Resize to be as small as possible, ensuring dimensions are greater than or equal to the requested width and height */
  Outside = 'outside',
}

/**
 *  What file format to return the image in.
 */
export enum Format {
  /** Will try to format it in ´webp´ or ´avif´ if the browser supports it, otherwise it will fallback to ´jpg´. */
  Auto = 'auto',
  Jpg = 'jpg',
  Png = 'png',
  Webp = 'webp',
  Tiff = 'tiff',
}

/**
 * Represents the {@link https://docs.directus.io/reference/files.html#requesting-a-thumbnail | Custom Transformations} you can apply to an image.
 */
export interface TransformCustomProp {
  /** The width of the thumbnail in pixels.*/
  width: number;
  /** The height of the thumbnail in pixels. */
  height: number;
  /** The quality of the thumbnail (1 to 100). */
  quality: number;
  /** The fit of the thumbnail while always preserving the aspect ratio. */
  fit: Fit;
  /** The file format of the thumbnail. */
  format: Format;
  /** Disable image up-scaling. */
  withoutEnlargement: boolean;
  /** An array of sharp operations to apply to the image. {@link https://sharp.pixelplumbing.com/api-operation | Sharp API}*/
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transforms: [string, ...any[]][];
}

export interface RenderPropsFile extends Omit<DirectusFileProps, 'render'> {
  url: string | undefined;
}

export type DirectusFileRenderer = (props: RenderPropsFile) => JSX.Element;

export interface DirectusFileProps {
  /** url to your Directus instance. */
  apiUrl?: string;
  /** The current user's access token. */
  accessToken?: string;
  /** The asset that should be rendered. */
  asset: DirectusAssetObject;
  /** If the asset should be downloaded instead of rendered. */
  download?: boolean;
  /** Either a preset key or a custom transform object. */
  directusTransform?: Partial<TransformCustomProp> | string;
  /**
   * The filename of the image. If the filename is not provided, the image will be downloaded with the asset's id as filename.
   * {@link https://docs.directus.io/reference/files.html#accessing-a-file| SEO}
   */
  filename?: string;
  /** A function that returns the React element to be rendered.*/
  render: DirectusFileRenderer;
}

/**
 * DirectusFile is a React Component that renders an image from your Directus API.
 * @example Here is an example of how to use DirectusFile with a custom transform
 * ```tsx
 * import { DirectusFile } from 'react-directus';
 *
 * export const MyImage = ({ imageId }) => (
 *  <DirectusFile
 *   asset={imageId}
 *   directusTransforms={{ width: 200, height: 200 }}
 *   render={({ url }) => <img src={url}
 * />}
 * ```
 *
 * @example Here is an example of how to use DirectusFile to download an file
 * ```tsx
 * import { DirectusFile } from 'react-directus';
 *
 * export const MyImage = ({ imageId }) => (
 *  <DirectusFile
 *   asset={imageId}
 *   download
 *   filename="my-file-name.jpg"
 *   render={({ url, filename })<a href={url} download={filename}}>Download</a>
 * />}
 *
 * ```
 */

export const DirectusFile = ({
  apiUrl: propsApiUrl,
  accessToken: propsAccessToken,
  asset,
  download,
  filename,
  directusTransform,
  render,
}: DirectusFileProps): JSX.Element => {
  const directusContext = useContext(DirectusContext);
  const { directus, apiUrl: contextApiUrl, _authState } = directusContext || {};
  const apiUrl = propsApiUrl || contextApiUrl;

  if (!apiUrl) {
    throw new Error('DirectusFile requires either a DirectusProvider or an apiUrl prop');
  }

  const assetId = asset && 'object' === typeof asset ? asset.id : asset;

  if (!assetId) {
    throw new Error('DirectusFile requires an asset id');
  }

  const generateImageUrl = (token: string | null = null): string => {
    const params = new URLSearchParams();

    if (token) {
      params.append('access_token', token);
    }

    if (download) {
      params.append('download', '');
    }

    if ('string' === typeof directusTransform) {
      params.append('key', directusTransform);
    } else if ('object' === typeof directusTransform) {
      // Adds all the custom transforms to the params
      for (const [key, value] of Object.entries(directusTransform)) {
        if (value) {
          params.append(key, value.toString());
        }
      }
    }

    return `${apiUrl}/assets/${assetId}${filename ? '/' + filename : ''}?${params.toString()}`;
  };

  const getInitialImageUrl = (): string | undefined => {
    if (propsAccessToken) {
      return generateImageUrl(propsAccessToken);
    } else if ('authenticated' !== _authState) {
      return generateImageUrl();
    }
    return undefined;
  };

  const [imageUrl, setImageUrl] = useState<string | undefined>(getInitialImageUrl());

  useEffect(() => {
    const gen = async () => {
      const token = propsAccessToken || (await directus?.auth.token);

      setImageUrl(generateImageUrl(token));
    };
    gen();
  }, [directusContext, asset, propsApiUrl, propsAccessToken, download, directusTransform]);

  return render({
    apiUrl,
    asset,
    url: imageUrl,
    download,
    directusTransform: directusTransform,
  });
};
