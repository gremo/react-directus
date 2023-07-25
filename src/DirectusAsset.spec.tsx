import { DirectusAsset } from './DirectusAsset';
import { DirectusAssetRenderer } from './types';
import React from 'react';
import { render } from '@testing-library/react';

const dummyRenderer = jest.fn<JSX.Element, [DirectusAssetRenderer]>(() => <></>);

beforeEach(() => {
  dummyRenderer.mockClear();
});

describe('Component', () => {
  it.each([
    [
      {
        apiUrl: 'http://example.com',
        asset: '11263b49-13b9-4ed8-ba39-01fe7cbeb284',
        download: true,
      },
    ],
    [
      {
        apiUrl: 'http://example.com',
        asset: { id: '1b86a776-34e5-4297-b8c5-58a85f15abe2' },
        download: false,
      },
    ],
  ])('pass the props to the renderer', props => {
    render(<DirectusAsset {...props} render={dummyRenderer} />);

    expect(dummyRenderer.mock.calls[1][0]).toMatchObject(props);
  });

  it.each([
    [
      {
        apiUrl: 'http://example.com',
        asset: '8237bae3-2667-472f-91b3-642408afd69c',
        download: true,
      },
      'http://example.com/assets/8237bae3-2667-472f-91b3-642408afd69c?download=',
    ],
    [
      {
        apiUrl: 'http://example.com',
        asset: { id: '177326d9-e0f2-4747-b078-76de4f2d4de2' },
      },
      'http://example.com/assets/177326d9-e0f2-4747-b078-76de4f2d4de2?',
    ],
  ])('build and pass the url to the renderer', (props, expectedUrl) => {
    render(<DirectusAsset {...props} render={dummyRenderer} />);

    expect(dummyRenderer.mock.calls[1][0].url).toBe(expectedUrl);
  });
});
