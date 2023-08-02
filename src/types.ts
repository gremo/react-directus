import { DirectusOptions, IDirectus, TypeMap, UserType } from '@directus/sdk';
import { Dispatch, ReactNode, SetStateAction } from 'react';
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

export interface DirectusProviderProps {
  /** url to your Directus instance. */
  apiUrl: string;
  /** A set of options to pass to the Directus client. {@link https://docs.directus.io/reference/old-sdk.html#custom-configuration | Directus Client configuration} */
  options?: DirectusOptions;
  /**
   * If `true`, the provider will try to login the user automatically on mount.
   * @defaultValue false
   */
  autoLogin?: boolean;
  children: ReactNode;
}

/**
 * Possible states of the authentication.
 * @defaultValue 'loading'
 */
export type AuthStates = 'loading' | 'authenticated' | 'unauthenticated';

/**
 * Shape of the main context.
 * @typeParam T - The `TypeMap` of your Directus instance.
 */
export interface DirectusContextType<T extends TypeMap> {
  /** url to your Directus instance. */
  apiUrl: string;
  /**
   * The Directus client instance configured with:
   * - the `TypeMap` you provided
   * - the `apiUrl` you provided
   * - the `options` you provided
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  directus: IDirectus<T>;
  /**
   * {@inheritDoc DirectusAsset}
   * @deprecated Please import the `DirectusAsset` component directly.
   */
  DirectusAsset: typeof DirectusAsset;
  /**
   * {@inheritDoc DirectusImage}
   * @deprecated Please import the `DirectusImage` component directly.
   */
  DirectusImage: typeof DirectusImage;
  /**
   * Please use the data provided by the `useDirectusAuth` hook instead.
   * @defaultValue 'loading'
   * @internal
   */
  _authState: AuthStates;
  /**
   * Please use the functions provided by the `useDirectusAuth` hook instead.
   * @internal
   */
  _setAuthState: Dispatch<SetStateAction<AuthStates>>;
  /**
   * Please use the data provided by the `useDirectusAuth` hook instead.
   * @defaultValue null
   * @internal
   */
  _directusUser: UserType | null;
  /**
   * Please use the functions provided by the `useDirectusAuth` hook instead.
   * @internal
   */
  _setDirectusUser: Dispatch<SetStateAction<UserType | null>>;
}

export type DirectusContextTypeGeneric<T extends TypeMap> = DirectusContextType<T> | null;

/**
 * A set of functions and data to manage authentication.
 */
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
   * @defaultValue 'loading'
   */
  authState: AuthStates;
  /**
   * The current authenticated user.
   * @defaultValue null
   */
  user: UserType | null;
}
