import { createContext, useContext, useMemo, useState } from 'react';
import {
  AuthStates,
  DirectusAssetProps,
  DirectusContextType,
  DirectusContextTypeGeneric,
  DirectusImageProps,
  DirectusProviderProps,
} from '@/types';

import { Directus, TypeMap, UserType } from '@directus/sdk';

import { DirectusAsset } from '@components/DirectusAsset';
import { DirectusImage } from '@components/DirectusImage';

// DirectusContextType with any thype that extends TypeMap

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DirectusContext = createContext<DirectusContextTypeGeneric<any>>(null);

// add generic type to DirectusProvider, this type will serve as directus instance type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DirectusProvider = <T extends TypeMap = TypeMap>({
  apiUrl,
  options,
  autoLogin,
  children,
}: DirectusProviderProps): JSX.Element => {
  const [user, setUser] = useState<UserType | null>(null);
  const [authState, setAuthState] = useState<AuthStates>('loading');

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
      _setDirecctusUser: setUser,
      _authState: authState,
      _setAuthState: setAuthState,
    }),
    [apiUrl, directus, user, authState]
  );

  React.useEffect(() => {
    const checkAuth = async () => {
      let newAuthState: AuthStates = 'unauthenticated';
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
            newAuthState = 'authenticated';
            setUser(dUser);
          }
        }
      } catch (error) {
        console.log('auth-error', error);
      } finally {
        setAuthState(newAuthState || 'unauthenticated');
      }
    };
    if (autoLogin) {
      checkAuth();
    }
  }, [directus, autoLogin]);

  return <DirectusContext.Provider value={value}>{children}</DirectusContext.Provider>;
};

export const useDirectus = () => {
  const directusContext = useContext(DirectusContext);

  if (!directusContext) {
    throw new Error('useDirectus has to be used within the DirectusProvider');
  }

  return directusContext;
};
