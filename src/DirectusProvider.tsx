import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState } from 'react';
import { Directus, DirectusOptions, IDirectus, TypeMap, UserType } from '@directus/sdk';
import { DirectusAsset, DirectusAssetProps } from '@components/DirectusAsset';
import { DirectusImage, DirectusImageProps } from '@components/DirectusImage';
import { AuthStates } from '@hooks/useDirectusAuth';

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
 * DirectusContext is a React Context that provides an instance of the Directus SDK and the apiUrl to all child components.
 * @typeParam T - TypeMap of your Directus Collections
 * @returns DirectusContext
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DirectusContext = createContext<DirectusContextTypeGeneric<any>>(null);

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
 * DirectusProvider is a React Context Provider that provides an instance of the Directus SDK and the apiUrl to all child components.
 * @param apiUrl - The URL of your Directus API
 * @param options - Directus SDK options
 * @typeParam T - TypeMap of your Directus Collections
 * @returns DirectusProvider
 * @example Here is an example of how to use DirectusProvider
 * ```tsx
 *   import { App } from './App';
 *   import { DirectusProvider } from 'react-directus';
 *   import { createRoot } from 'react-dom/client';
 *
 *   const root = createRoot(document.getElementById('root'));
 *   root.render(
 *     <DirectusProvider apiUrl="https://api.example.com" options={{}} >
 *       <App />
 *     </DirectusProvider>
 *   );
 * ```
 */
export const DirectusProvider = <T extends TypeMap = TypeMap>({
  apiUrl,
  options,
  autoLogin,
  children,
}: DirectusProviderProps): JSX.Element => {
  const [user, setUser] = useState<UserType | null>(null);
  const [authState, setAuthState] = useState<AuthStates>(autoLogin ? AuthStates.LOADING : AuthStates.UNAUTHENTICATED);

  const directus = useMemo(() => new Directus<T>(apiUrl, options), [apiUrl, options]);

  const value = useMemo<DirectusContextType<T>>(
    () => ({
      apiUrl,
      directus,
      DirectusAsset: ({ asset, render, ...props }: DirectusAssetProps) => {
        console.warn('Deprecated: Please import DirectusAsset directly from react-directus');
        return <DirectusAsset asset={asset} render={render} {...props} />;
      },
      DirectusImage: ({ asset, render, ...props }: DirectusImageProps) => {
        console.warn('Deprecated: Please import DirectusImage directly from react-directus');
        return <DirectusImage asset={asset} render={render} {...props} />;
      },
      _directusUser: user,
      _setDirectusUser: setUser,
      _authState: authState,
      _setAuthState: setAuthState,
    }),
    [apiUrl, directus, user, authState]
  );

  useEffect(() => {
    const checkAuth = async () => {
      let newAuthState: AuthStates = AuthStates.UNAUTHENTICATED;
      try {
        await directus.auth.refresh();
        const token = await directus.auth.token;

        if (token) {
          const dUser = (await directus.users.me.read({
            // * is a valid field, but typescript doesn't like it
            // It's a wildcard, so it will return all fields
            // This is the only way to get all fields
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            fields: ['*'] as any,
          })) as UserType;

          if (dUser) {
            newAuthState = AuthStates.AUTHENTICATED;
            setUser(dUser);
          }
        }
      } catch (error) {
        console.log('auth-error', error);
      } finally {
        setAuthState(newAuthState || AuthStates.UNAUTHENTICATED);
      }
    };
    if (autoLogin) {
      checkAuth();
    }
  }, [directus, autoLogin]);

  return <DirectusContext.Provider value={value}>{children}</DirectusContext.Provider>;
};

/**
 * useDirectus is a React Hook that provides an instance of the Directus SDK and the apiUrl
 * @returns DirectusContextType
 * @example Here is an example of how to use useDirectus
 * ```tsx
 *   const { directus } = useDirectus();
 *   directus.auth.login({ email: '', password: '' });
 * ```
 */
export const useDirectus = () => {
  const directusContext = useContext(DirectusContext);

  if (!directusContext) {
    throw new Error('useDirectus has to be used within the DirectusProvider');
  }

  return directusContext;
};
