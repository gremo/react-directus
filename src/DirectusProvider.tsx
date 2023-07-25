import * as React from 'react';

import { DirectusContextType, DirectusProviderProps } from './types';

import { Directus } from '@directus/sdk';
import { DirectusAsset } from './DirectusAsset';
import { DirectusImage } from './DirectusImage';

export const DirectusContext = React.createContext<DirectusContextType>({} as DirectusContextType);

export const DirectusProvider = ({ apiUrl, options, children }: DirectusProviderProps): JSX.Element => {
  const value = React.useMemo<DirectusContextType>(
    () => ({
      apiUrl: apiUrl,
      directus: new Directus(apiUrl, options),
      DirectusAsset,
      DirectusImage,
    }),
    [apiUrl]
  );

  return <DirectusContext.Provider value={value}>{children}</DirectusContext.Provider>;
};

export const useDirectus = () => {
  const directusContext = React.useContext(DirectusContext);

  if (!directusContext) {
    throw new Error('useDirectus has to be used within <DirectusProvider>');
  }

  return directusContext;
};
