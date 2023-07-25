import * as React from 'react';
import {
  DirectusAssetProps,
  DirectusAssetPropsContextualized,
  DirectusContextTpye,
  DirectusImageProps,
  DirectusProviderProps,
} from './types';
import { Directus } from '@directus/sdk';
import { DirectusAsset } from './DirectusAsset';
import { DirectusImage } from './DirectusImage';

export const DirectusContext = React.createContext<DirectusContextTpye | null>(null);

export const DirectusProvider = ({ apiUrl, options, children }: DirectusProviderProps): JSX.Element => {
  const value = React.useMemo<DirectusContextTpye>(
    () => ({
      apiUrl: apiUrl,
      directus: new Directus(apiUrl, options),
      DirectusAsset: (props: DirectusAssetPropsContextualized<DirectusAssetProps>): JSX.Element => (
        <DirectusAsset apiUrl={apiUrl} {...props} />
      ),
      DirectusImage: (props: DirectusAssetPropsContextualized<DirectusImageProps>): JSX.Element => (
        <DirectusImage apiUrl={apiUrl} {...props} />
      ),
    }),
    [apiUrl]
  );

  return <DirectusContext.Provider value={value}>{children}</DirectusContext.Provider>;
};

export const useDirectus = (): null | DirectusContextTpye => React.useContext(DirectusContext);
