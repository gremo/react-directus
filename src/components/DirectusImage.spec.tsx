import { DirectusImageProps, DirectusImageRenderer } from '@/types';
import { DirectusImage } from '@components/DirectusImage';
import React from 'react';
import { render } from '@testing-library/react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dummyRenderer = jest.fn<JSX.Element, [DirectusImageRenderer]>(arg => <></>);

beforeEach(() => {
  dummyRenderer.mockClear();
});

describe('Component', () => {
  it.each([
    [
      {
        apiUrl: 'http://example.com',
        asset: '11263b49-13b9-4ed8-ba39-01fe7cbeb284',
        width: 640,
        height: 480,
      },
    ],
    [
      {
        apiUrl: 'http://example.com',
        asset: { id: '1b86a776-34e5-4297-b8c5-58a85f15abe2' },
        quality: 75,
      },
    ],
    [
      {
        apiUrl: 'http://example.com',
        asset: '11263b49-13b9-4ed8-ba39-01fe7cbeb284',
        fit: 'cover',
      },
    ],
    [
      {
        apiUrl: 'http://example.com',
        asset: '11263b49-13b9-4ed8-ba39-01fe7cbeb284',
        presetKey: 'true',
      },
    ],
  ])('pass the props to the renderer', props => {
    render(<DirectusImage {...(props as DirectusImageProps)} render={dummyRenderer} />);

    const rendererArg = dummyRenderer.mock.calls[0][0];
    expect(rendererArg).toMatchObject(props);
  });

  it('build and pass the url to the renderer', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    render(
      <DirectusImage
        apiUrl='http://example.com'
        asset='8ac24997-cda5-4675-a1e0-1af72fddd220'
        width={640}
        height={480}
        quality={75}
        fit='outside'
        render={dummyRenderer}
      />
    );

    const { url } = dummyRenderer.mock.calls[0][0];
    expect(url).toContain('http://example.com/assets/8ac24997-cda5-4675-a1e0-1af72fddd220?');
    expect(url).toContain('width=640');
    expect(url).toContain('height=480');
    expect(url).toContain('quality=75');
    expect(url).toContain('fit=outside');
  });
});
