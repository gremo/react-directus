import * as React from 'react';
import { DirectusAssetProps, DirectusContextTpye, DirectusImageProps, DirectusProviderProps } from './types';
import { Directus } from '@directus/sdk';
import { DirectusAsset } from './DirectusAsset';
import { DirectusImage } from './DirectusImage';

export const DirectusContext = React.createContext<DirectusContextTpye | null>(null);

export const DirectusProvider = ({ apiUrl, options, children }: DirectusProviderProps): JSX.Element => {
  const value = React.useMemo<DirectusContextTpye>(
    () => ({
      apiUrl: apiUrl,
      directus: new Directus(apiUrl, options),
      DirectusAsset: ({ asset, render, ...props }: DirectusAssetProps) => {
        console.warn('Deprecated: Please import DirectusAsset directly from react-directus');
        return <DirectusAsset asset={asset} render={render} {...props} />;
      },
      DirectusImage: ({ asset, render, ...props }: DirectusImageProps) => {
        console.warn('Deprecated: Please import DirectusImage directly from react-directus');
        return <DirectusImage asset={asset} render={render} {...props} />;
      },
    }),
    [apiUrl]
  );

  return <DirectusContext.Provider value={value}>{children}</DirectusContext.Provider>;
};

export const useDirectus = (): null | DirectusContextTpye => React.useContext(DirectusContext);
