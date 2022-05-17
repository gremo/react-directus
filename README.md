<p align="center">
  <a href="https://directus.io"><img src="https://user-images.githubusercontent.com/522079/89687381-23943700-d8ce-11ea-9a4d-ae3eae136423.png" alt="Directus logo" width="320" /></a>
</p>

<p align="center">
  A set of React components and utilities for <a href="https://directus.io">Directus</a> Headless CMS.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/react-directus"><img src="https://img.shields.io/npm/v/react-directus.svg" alt="NPM version" /></a>
  <a href="https://www.npmjs.com/package/react-directus"><img src="https://img.shields.io/npm/dw/react-directus.svg" alt="NPM downloads" /></a>
  <a href="https://travis-ci.com/gremo//react-directus"><img src="https://travis-ci.com/gremo//react-directus.svg?branch=master" alt="Travis build" /></a>
  <a href="https://github.com/gremo/react-directus/issues"><img src="https://img.shields.io/github/issues/gremo/react-directus.svg" alt="GitHub issues" /></a>
  <img alt="Libraries.io dependency status for GitHub repo" src="https://img.shields.io/librariesio/github/gremo/react-directus">
</p>

## 🚀 Quick start

Install this library along with `@directus/sdk`:

```bash
npm install react-directus @directus/sdk
```

The `<DirectusProvider>` component makes the Directus SDK available to any nested components that need to access it. Assuming that the `<App />` component is the root-level component:

```jsx
import { App } from './App';
import { DirectusProvider } from 'react-directus';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <DirectusProvider apiUrl="https://api.example.com">
    <App />
  </DirectusProvider>,
  document.getElementById('root')
);
```

You can optionally pass an `apiOptions` object to the provider, it will be passed to the client [`options`](https://docs.directus.io/reference/sdk/#advanced-example).

## ⚙️ The hook `useDirectus`

After adding the provider, you can access the configured client anywhere in the app, using the `useDirectus` hook:

```jsx
import React, { useEffect, useState } from 'react';
import { useDirectus } from 'directus-react'

export const TodoList = () => {
  // Get the Directus SDK object
  const { directus } = useDirectus();
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const todos = (await directus.items('todos').readMany()).data;
      setTodos(todos);
    };

    fetchTodos();
  }, [directus]);

  return todos.map(item => <TodoItem key={item.id} item={item} />);
};
```

## Components

The hook exports also the `<DirectusAsset>` and `<DirectusImage>` components, for easy access to API [assets](https://docs.directus.io/reference/api/assets/). They are configured for using the `apiUrl` specified in the provider.

These components, when imported from `react-directus` directly (i.e. not using the hook), can be used in a "standalone" way, meaning that they are not bound to the `apiUrl` specified in the provider. In that case, they both accept an `apiUrl` prop.

### `<DirectusAsset>`

Computes the URL of the given resource `asset`, rendering it using the `render` prop:

- `asset`: the asset representing the resource (`string` or `object` with an `id` property)
- `render`: a function (which receive an object with the `url` property) that should return the component to render
- `download`: force browser to download the asset (force the `Content-Disposition` header)

```jsx
import React from 'react';
import { useDirectus } from 'directus-react'

export const TodoItem = ({ item }) => {
  const { DirectusAsset } = useDirectus();

  return (
    <div>
      <h1>Todo #{item.id}</h1>
      <DirectusAsset asset={item.attachment}
        download={true}
        render={({ asset, url }) => <a href={url}>{asset.filename_download}</a>} />
    </div>
  );
};
```

### `<DirectusImage>`

Computes the URL of the given resource `asset`, rendering it using the `render` prop:

- `asset`: the asset representing the resource (`string` or `object` with an `id` property)
- `render`: a function (which receive an object with the `url` property) that should return the component to render
- `fit`: fit of the thumbnail while always preserving the aspect ratio, can be any of the following options: `cover`, `contain`, `inside` or `outside`
- `height`: height of the thumbnail in pixels
- `quality`: quality of the thumbnail (`1` to `100`)
- `width`: width of the thumbnail in pixels

```jsx
import React from 'react';
import { useDirectus } from 'directus-react'

export const TodoItem = ({ item }) => {
  const { DirectusImage } = useDirectus();

  return (
    <div>
      <DirectusImage asset={item.image}
        fit="cover" quality="75"
        render={({ asset, url }) => <img src={url} alt={asset.title} />} />
      <h1>Todo #{item.id}</h1>
    </div>
  );
};
```

## ❤️ Contributing

New features and bugfix are always welcome! In order to contribute to this project, follow a few easy steps:

1. [Fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) this repository, clone it on your machine and run `npm install`
2. Open your local repository with [Visual Studio Code](https://code.visualstudio.com) and install all the suggested extensions
3. Create a branch `my-awesome-feature` and commit to it
4. Run `npm run lint` and `npm run build` and verify that they complete without errors
5. Push `my-awesome-feature` branch to GitHub and open a [pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests)
