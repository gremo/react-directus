<p align="center">
  <a href="https://directus.io"><img alt="Directus logo" src="https://directus.io/assets/favicon.svg" width="120" /></a>
</p>

<h1 align="center">
  react-directus
</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/react-directus"><img alt="NPM version" src="https://img.shields.io/npm/v/react-directus.svg"></a>
  <a href="https://www.npmjs.com/package/react-directus"><img alt="NPM downloads" src="https://img.shields.io/npm/dw/react-directus.svg"></a>
  <a href="https://paypal.me/marcopolichetti" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"></a>
</p>

<p align="center">
  <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/gremo/react-directus">
  <a href="https://github.com/gremo/react-directus/actions/workflows/test.yaml"><img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/gremo/react-directus/test.yaml"></a>
  <a href="https://github.com/gremo/react-directus/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/gremo/react-directus.svg"></a>
  <a href="https://github.com/gremo/react-directus/pulls"><img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/gremo/react-directus"></a>
</p>

<p align="center">
  A set of React components and utilities for <a href="https://directus.io">Directus</a> Headless CMS.
</p>

## 🚀 Quick start

Install this library along with `@directus/sdk@` (version 10 or below):

> **Note**: Directus SDK version 11 and upwards are currently not supported, but active work is in progress to add support for these versions in future releases.

```bash
npm install react-directus @directus/sdk@^10
```

The `<DirectusProvider>` component makes the [Directus JavaScript SDK](https://docs.directus.io/reference/sdk/) available to any nested components that need to access it. You can optionally pass an `options` object to the provider, which will be passed to the Directus client as the [`init`](https://docs.directus.io/reference/sdk/#reference) parameter:

```jsx
import { App } from './App';
import { DirectusProvider } from 'react-directus';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));

root.render(
  <DirectusProvider apiUrl="https://api.example.com" options={{}}>
    <App />
  </DirectusProvider>
);
```

With **TypeScript**, you can use the optional generic collection type for Directus, as described in the [Directus TypeScript documentation](https://docs.directus.io/reference/old-sdk.html#typescript):

```jsx
import { App } from './App';
import { DirectusProvider } from 'react-directus';
import { createRoot } from 'react-dom/client';

import MyCollections from './types';

const root = createRoot(document.getElementById('root'));

root.render(
  <DirectusProvider<MyCollections> apiUrl="https://api.example.com" options={{}}>
    <App />
  </DirectusProvider>
);
```

## ⚙️ Hooks

### `useDirectus`

After adding the provider, you can access the configured client anywhere in the app, using the `useDirectus` hook:

```jsx
import { useEffect, useState } from 'react';
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

### `useDirectusAuth`

The `useDirectusAuth` hook provides a few methods for working with the [Directus Authentication API](https://docs.directus.io/reference/old-sdk.html#authentication):

- `login` - a function that accepts an email and password and returns a promise that resolves to the user object if the login is successful or rejects with an error otherwise
- `logout` - a function that logs out the current user
- `user` - the current user object
- `authState` - the current authentication state, one of `loading` (the initial state), `logged-in` or `logged-out`

```jsx
import { useDirectusAuth } from 'react-directus';
import { FormEvent } from 'react';

const Login = () => {
  const { login } = useDirectusAuth();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, password } = e.currentTarget.elements;
    login(email.value, password.value).catch(err => {
      console.error(err);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type='email' name='email' />
      <input type='password' name='password' />
      <button type='submit'>Login</button>
    </form>
  );
};

export default Login;

```

## 🧩 Components (so far...)

This package contains a component for working with Direcuts [files](https://docs.directus.io/reference/files/). It is configured for using the `apiUrl` and `accessToken` specified in the provider. Hopefully, more will come in the future 🤗.

> **Note**: The components can also be used in a "standalone" way, meaning that they are not bound to the `apiUrl` specified in the provider. In that case, they both accept an `apiUrl` and an optional `accessToken` prop.

### `<DirectusFile>`

Computes the URL of the given resource `asset`, rendering it using the `render` prop:

- `apiUrl`: the API URL of the Directus instance(can be omitted if the provider is used)
- `accessToken`: the access token to use for authentication (can be omitted if the provider is used)
- `asset`: the asset representing the resource (`string` or `object` with an `id` property)
- `download`: force browser to download the asset (force the `Content-Disposition` header)
- `directusTransform`: an object with the Directus [transform](https://docs.directus.io/reference/files/#transform) options or a preset key
- `filename`: the filename to use for the asset [SEO](https://docs.directus.io/reference/files/#accessing-a-file)
- `render`: a function (which receives an object with the `url` property) that provides the component to render

#### Example with custom transform

```jsx
import { DirectusFile } from 'react-directus';

export const MyImage = ({ imageId }) => (
  <DirectusFile
    asset={imageId}
    directusTransforms={{ width: 200, height: 200 }}
    render={({ url }) => <img src={url} />}
  />
);
```

#### Example for downloading a file

```jsx
import { DirectusFile } from 'react-directus';

export const MyImage = ({ imageId }) => (
  <DirectusFile
    asset={imageId}
    download
    filename="my-file-name.jpg"
    render={({ url, filename }) => <a href={url} download={filename}>Download</a>}
  />
);
```

## 📱 React Native

To make the project fully compatible with React Native you need to install the [localstorage-polyfill](https://www.npmjs.com/package/localstorage-polyfill) package:

```bash
npm install localstorage-polyfill
```

Then import the module **before any other import** and force the storage mode "LocalStorage" in your Directus instance:

```jsx
import 'localstorage-polyfill';
import { DirectusProvider } from 'react-directus';
import { View } from 'react-native';

export default function App({}) {
    return (
        <DirectusProvider
            apiUrl='https://api.example.com'
            options={{ storage: { mode: 'LocalStorage' } }}
        >
            <View />
        </DirectusProvider>
    )
}
```

In future releases, a solution using `AsyncStorage` or an encrypted secure storage option is planned.

## ❤️ Contributing

All types of contributions are encouraged and valued. See the [Contributing](CONTRIBUTING.md) guidelines, the community looks forward to your contributions!

## 📘 License

This project is released under the under terms of the [ISC License](LICENSE).
