import * as React from 'react';

import { Directus, TypeMap } from '@directus/sdk';
import {
  DirectusAssetProps,
  DirectusContextType,
  DirectusContextTypeGeneric,
  DirectusImageProps,
  DirectusProviderProps,
} from '@/types';

import { DirectusAsset } from '@components/DirectusAsset';
import { DirectusImage } from '@components/DirectusImage';

// DirectusContextType with any thype that extends TypeMap

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DirectusContext = React.createContext<DirectusContextTypeGeneric<any>>(null);

// add generic type to DirectusProvider, this type will serve as directus instance type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DirectusProvider = <T extends TypeMap = TypeMap>({
  apiUrl,
  options,
  children,
}: DirectusProviderProps): JSX.Element => {
  const value = React.useMemo<DirectusContextType<T>>(
    () => ({
      apiUrl: apiUrl,
      directus: new Directus<T>(apiUrl, options),
      DirectusAsset: ({ asset, render, ...props }: DirectusAssetProps) => {
        console.warn('Deprecated: Please import DirectusAsset directly from react-directus');
        return <DirectusAsset asset={asset} render={render} {...props} />;
      },
      DirectusImage: ({ asset, render, ...props }: DirectusImageProps) => {
        console.warn('Deprecated: Please import DirectusImage directly from react-directus');
        return <DirectusImage asset={asset} render={render} {...props} />;
      },
    }),
    [apiUrl, options]
  );

  return <DirectusContext.Provider value={value}>{children}</DirectusContext.Provider>;
};

export const useDirectus = () => {
  const directusContext = React.useContext(DirectusContext);

  if (!directusContext) {
    throw new Error('useDirectus has to be used within the DirectusProvider');
  }

  return directusContext;
};
