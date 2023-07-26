import * as React from 'react';
import { DirectusOptions, IDirectus } from '@directus/sdk';
import { DirectusAsset } from './DirectusAsset';
import { DirectusImage } from './DirectusImage';

/**
 * Shape of a generic asset.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DirectusAsset = string | ({ id: string } & Record<string, any>);

/**
 * Shape of the `DirectusAsset` component `render` prop.
 */
export type DirectusAssetRenderer = Omit<DirectusAssetProps, 'render'> & {
  url?: string;
};

/**
 * Shape of a generic asset component props.
 */
export interface DirectusAssetProps {
  /** Directus CMS API url. */
  apiUrl?: string;
  /** The asset as `string` or `object` with an `id` property of type `string`. */
  asset: DirectusAsset;
  /** Add `Content-Disposition` header and force browser to download file. */
  download?: boolean;
  /** A function that returns the React element to be rendered. It will receive an object with the `url` key and all the passed props. */
  render: (args: DirectusAssetRenderer) => JSX.Element;
}

/**
 * Shape of the `DirectusImage` component `render` prop.
 */
export type DirectusImageRenderer = Omit<DirectusImageProps, 'render'> & {
  url?: string;
};

/**
 * Shape of `DirectusImage` component props.
 */
export interface DirectusImageProps extends Omit<DirectusAssetProps, 'download' | 'render'> {
  /** The width of the thumbnail in pixels. */
  width?: number;
  /** The height of the thumbnail in pixels. */
  height?: number;
  /** The quality of the thumbnail (1 to 100). */
  quality?: number;
  /** The fit of the thumbnail while always preserving the aspect ratio. */
  fit?: 'cover' | 'contain' | 'inside' | 'outside';
  /** A function that returns the React element to be rendered. It will receive an object with the `url` key and all the passed props. */
  render: (args: DirectusImageRenderer) => JSX.Element;
}

/**
 * Shape of the context provider props.
 */
export interface DirectusProviderProps {
  /** Directus CMS API url. */
  apiUrl: string;
  /** A set of options to pass to the Directus client. */
  options?: DirectusOptions;
  children: React.ReactNode;
}

/**
 * Shape of the main context.
 */
export interface DirectusContextType {
  apiUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  directus: IDirectus<any>;
  /** The context-aware `DirectusAsset` component, with pre-filled props. */
  DirectusAsset: typeof DirectusAsset;
  /** The context-aware `DirectusImage` component, with pre-filled props. */
  DirectusImage: typeof DirectusImage;
}
