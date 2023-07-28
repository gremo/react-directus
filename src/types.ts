import * as React from 'react';
import { DirectusOptions, IDirectus, TypeMap, UserType } from '@directus/sdk';
import { DirectusAsset } from '@components/DirectusAsset';
import { DirectusImage } from '@components/DirectusImage';

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
  /**
   * If `true`, the provider will try to login the user automatically on mount.
   * @default false
   */
  autoLogin?: boolean;
  children: React.ReactNode;
}

export type AuthStates = 'loading' | 'authenticated' | 'unauthenticated';

/**
 * Shape of the main context.
 */
export interface DirectusContextType<T extends TypeMap> {
  apiUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  directus: IDirectus<T>;
  /** The context-aware `DirectusAsset` component, with pre-filled props. */
  DirectusAsset: typeof DirectusAsset;
  /** The context-aware `DirectusImage` component, with pre-filled props. */
  DirectusImage: typeof DirectusImage;
  /**
   * Please use the data provided by the `useDirectusAuth` hook instead.
   * @default 'loading'
   * @internal
   */
  _authState: AuthStates;
  /**
   * Please use the functions provided by the `useDirectusAuth` hook instead.
   * @internal
   */
  _setAuthState: React.Dispatch<React.SetStateAction<AuthStates>>;
  /**
   * Please use the data provided by the `useDirectusAuth` hook instead.
   * @default null
   * @internal
   */
  _directusUser: UserType | null;
  /**
   * Please use the functions provided by the `useDirectusAuth` hook instead.
   * @internal
   */
  _setDirecctusUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}

export type DirectusContextTypeGeneric<T extends TypeMap> = DirectusContextType<T> | null;

export interface DirectusAuthHook {
  /**
   * Login the user. If successful, the user will be stored in the context.
   * Else, an error will be thrown.
   * @param email - The user email.
   * @param password - The user password.
   * @throws {Error} - If the login fails.
   */
  login: (email: string, password: string) => Promise<void>;
  /**
   * Logout the user. If successful, the user will be removed from the context.
   * Else, an error will be thrown.
   * @throws {Error} - If the logout fails.
   */
  logout: () => Promise<void>;
  /**
   * Represents the current authentication state.
   * @default 'loading'
   */
  authState: AuthStates;
  /**
   * The current authenticated user.
   * @default null
   */
  user: UserType | null;
}
