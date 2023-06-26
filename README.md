<p align="center">
  <a href="https://directus.io"><img alt="Directus logo" src="https://directus.io/assets/favicon.svg" width="120" /></a>
</p>

<h1 align="center">
  react-directus
</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/react-directus"><img alt="NPM version" src="https://img.shields.io/npm/v/react-directus.svg?style=flat-square"></a>
  <a href="https://www.npmjs.com/package/react-directus"><img alt="NPM downloads" src="https://img.shields.io/npm/dw/react-directus.svg?style=flat-square"></a>
  <a href="https://paypal.me/marcopolichetti" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg?style=flat-square"></a>
</p>

<p align="center">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/gremo/react-directus?style=flat-square">
  <a href="https://github.com/gremo/react-directus/actions/workflows/test.yaml"><img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/gremo/react-directus/test.yaml?style=flat-square"></a>
  <a href="https://github.com/gremo/react-directus/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/gremo/react-directus.svg?style=flat-square"></a>
  <a href="https://github.com/gremo/react-directus/pulls"><img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/gremo/react-directus?style=flat-square"></a>
  <img alt="Libraries.io dependency status for GitHub repo" src="https://img.shields.io/librariesio/github/gremo/react-directus?style=flat-square">
</p>

<p align="center">
  A set of React components and utilities for <a href="https://directus.io">Directus</a> Headless CMS.
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

All types of contributions are encouraged and valued. See the [Contributing](CONTRIBUTING.md) guidelines, the community looks forward to your contributions!

## 📘 License

This project is released under the under terms of the [ISC License](LICENSE).
