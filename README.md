<p align="center">
  <a href="https://directus.io"><img alt="Directus logo" src="https://user-images.githubusercontent.com/522079/158864859-0fbeae62-9d7a-4619-b35e-f8fa5f68e0c8.png" /></a>
</p>

<p align="center">
  A set of React components and utilities for <a href="https://directus.io">Directus</a> Headless CMS.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/react-directus"><img alt="NPM version" src="https://img.shields.io/npm/v/react-directus.svg" /></a>
  <a href="https://www.npmjs.com/package/react-directus"><img alt="NPM downloads" src="https://img.shields.io/npm/dw/react-directus.svg" /></a>
  <a href="https://paypal.me/marcopolichetti" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
</p>

<p align="center">
  <a href="https://github.com/gremo/react-directus/actions/workflows/test-on-push.yml"><img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/gremo/react-directus/Test"></a>
  <a href="https://github.com/gremo/react-directus/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/gremo/react-directus.svg" /></a>
  <a href="https://github.com/gremo/react-directus/pulls"><img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/gremo/react-directus"></a>
  <img alt="Libraries.io dependency status for GitHub repo" src="https://img.shields.io/librariesio/github/gremo/react-directus">
</p>

## 🚀 Quick start

Install this library along with `@directus/sdk`:

```bash
npm install react-directus @directus/sdk
```

The `<DirectusProvider>` component makes the [Directus JavaScript SDK](https://docs.directus.io/reference/sdk/) available to any nested components that need to access it. Assuming that `<App />` component is your root component:

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

You can optionally pass an `apiOptions` object to the provider, it will be passed to the client as the [`init`](https://docs.directus.io/reference/sdk/#reference) parameter.

## ⚙️ The hook `useDirectus`

After adding the provider, you can access the configured client anywhere in the app, using the `useDirectus` hook:

```jsx
import React, { useEffect, useState } from 'react';
import { useDirectus } from 'react-directus'

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

## 🧩 Components (so far...)

The hook exports a few components for working with Direcuts files [file access](https://docs.directus.io/reference/files/). They are all configured for using the `apiUrl` specified in the provider. Hopefully, more will come in the future 🤗.

> All components, when imported from `react-directus` directly (i.e. not imported using the hook `useDirectus`), can be used in a "standalone" way. It means that they are not bound to the `apiUrl` specified in the provider. In that case, they both accept an `apiUrl` prop.

### `<DirectusAsset>`

Computes the URL of the given resource `asset`, rendering it using the `render` prop:

- `asset`: the asset representing the resource (`string` or `object` with an `id` property)
- `download`: force browser to download the asset (force the `Content-Disposition` header)
- `render`: a function (which receives an object with the `url` property) that provides the component to render

```jsx
import React from 'react';
import { useDirectus } from 'react-directus';

export const TodoItem = ({ item }) => {
  const { DirectusAsset } = useDirectus();

  return (
    <div>
      <h1>Todo #{item.id}</h1>
      <DirectusAsset asset={item.attachment} download={true}
        render={({ asset, url }) => <a href={url}>{asset.filename_download}</a>} />
    </div>
  );
};
```

### `<DirectusImage>`

Computes the URL of the given resource `asset`, rendering it using the `render` prop:

- `asset`: the asset representing the resource (`string` or `object` with an `id` property)
- `fit`: fit of the thumbnail while always preserving the aspect ratio, can be any of the following options: `cover`, `contain`, `inside` or `outside`
- `height`: height of the thumbnail in pixels
- `quality`: quality of the thumbnail (`1` to `100`)
- `width`: width of the thumbnail in pixels
- `render`: a function (which receives an object with the `url` property) that provides the component to render

```jsx
import React from 'react';
import { useDirectus } from 'react-directus';

export const TodoItem = ({ item }) => {
  const { DirectusImage } = useDirectus();

  return (
    <div>
      <h1>Todo #{item.id}</h1>
      <DirectusImage asset={item.image} fit="cover" quality="75"
        render={({ asset, url }) => <img src={url} alt={asset.title} />} />
    </div>
  );
};
```

## ❤️ Contributing

New features and bug-fix are always welcome! In order to contribute to this project, follow a few easy steps:

<p align="center">
  <a href="https://paypal.me/marcopolichetti" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
</p>

1. [Fork](https://help.github.com/en/github/getting-started-with-github/fork-a-repo) this repository and clone it on your machine
2. Open the local repository with [Visual Studio Code](https://code.visualstudio.com/) with the remote development feature enabled (install the [Remote Development extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack))
3. Create a branch `my-awesome-feature` and commit to it
4. Run `npm run lint`, `npm run test` and `npm run build` and verify that they complete without errors
5. Push `my-awesome-feature` branch to GitHub and open a [pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-pull-requests)
6. Liked some of my work? Buy me a ☕ (or more likely 🍺)
