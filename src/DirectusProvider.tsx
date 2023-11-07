import {
  authentication,
  AuthenticationClient,
  AuthenticationConfig,
  AuthenticationData,
  AuthenticationMode,
  createDirectus,
  DirectusClient,
  graphql,
  GraphqlClient,
  realtime,
  rest,
  RestClient,
  RestConfig,
  staticToken,
  StaticTokenClient,
  WebSocketClient,
  WebSocketConfig,
} from '@directus/sdk';
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

import { localAuthStorage } from 'authStores/localAuthStorage';

export enum AuthStates {
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
}

/**
 * Shape of the main context.
 * @typeParam T - The `TypeMap` of your Directus instance.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DirectusContextType<Schema extends object = any> {
  apiUrl: string;
  directus: DirectusClient<Schema> &
    AuthenticationClient<Schema> &
    GraphqlClient<Schema> &
    RestClient<Schema> &
    WebSocketClient<Schema> &
    StaticTokenClient<Schema>;
  authState: AuthStates;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DirectusContextTypeGeneric<Schema extends object = any> = DirectusContextType<Schema> | null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DirectusContext = createContext<DirectusContextTypeGeneric<any>>(null);

export interface DirectusProviderProps {
  /** url to your Directus instance. */
  apiUrl: string;
  /**
   * If `true`, the provider will try to login the user automatically on mount.
   * @defaultValue false
   */
  autoLogin?: boolean;
  onAuthStateChanged?: (authState: AuthStates) => void;
  authenticationConfig?: { mode: AuthenticationMode; config: Partial<AuthenticationConfig | undefined> };
  restConfig?: { config: Partial<RestConfig | undefined> };
  graphqlConfig?: boolean;
  realTimeConfig?: { config: Partial<WebSocketConfig | undefined> };
  staticTokenConfig?: { accsessToken: string };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DirectusProvider = <Schema extends object = any>({
  apiUrl,
  autoLogin,
  onAuthStateChanged,
  authenticationConfig,
  restConfig,
  graphqlConfig,
  realTimeConfig,
  staticTokenConfig,
  children,
}: PropsWithChildren<DirectusProviderProps>): JSX.Element => {
  const authStorage = localAuthStorage;
  const [authState, setAuthState] = useState<AuthStates>(autoLogin ? AuthStates.LOADING : AuthStates.UNAUTHENTICATED);

  const modAuthStorage = useMemo(() => {
    return {
      get: authStorage.get,
      set: async (value: AuthenticationData | null) => {
        if (!value?.access_token) {
          setAuthState(AuthStates.UNAUTHENTICATED);
        } else {
          setAuthState(AuthStates.AUTHENTICATED);
        }
        await authStorage.set(value);
      },
    };
  }, []);

  const directus = useMemo(() => {
    const directus = createDirectus<Schema>(apiUrl);

    if (authenticationConfig) {
      if ('boolean' === typeof authenticationConfig) {
        directus.with(authentication(undefined, { storage: modAuthStorage }));
      } else {
        directus.with(
          authentication(authenticationConfig.mode, { ...authenticationConfig.config, storage: modAuthStorage })
        );
      }
    }
    if (restConfig) {
      directus.with(rest(restConfig.config));
    }
    if (graphqlConfig) {
      directus.with(graphql());
    }
    if (realTimeConfig) {
      directus.with(realtime(realTimeConfig.config));
    }

    if (staticTokenConfig) {
      directus.with(staticToken(staticTokenConfig.accsessToken));
    }
    return directus as DirectusClient<Schema> &
      AuthenticationClient<Schema> &
      GraphqlClient<Schema> &
      RestClient<Schema> &
      WebSocketClient<Schema> &
      StaticTokenClient<Schema>;
  }, [apiUrl]);

  const value = useMemo<DirectusContextType<Schema>>(
    () => ({
      apiUrl,
      directus,
      authState,
    }),
    [apiUrl, directus, authState]
  );

  useEffect(() => {
    const checkAuth = async () => {
      const authData = await modAuthStorage.get();
      if (authData?.access_token) {
        setAuthState(AuthStates.AUTHENTICATED);
      } else {
        setAuthState(AuthStates.UNAUTHENTICATED);
      }
    };

    if (autoLogin) {
      checkAuth();
    }
  }, []);

  useEffect(() => {
    if (onAuthStateChanged) {
      onAuthStateChanged(authState);
    }
  }, [authState, onAuthStateChanged]);

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
