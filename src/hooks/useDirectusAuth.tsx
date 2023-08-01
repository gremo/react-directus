import { useCallback, useContext, useMemo } from 'react';
import { DirectusAuthHook } from '../types';
import { DirectusContext } from '../DirectusProvider';
import { UserType } from '@directus/sdk';

/**
 * A hook to access the Directus authentication state and methods.
 *
 * @example
 * ```tsx
 * import { useDirectusAuth } from 'react-directus';
 * import { FormEvent } from 'react';
 *
 * const Login = () => {
 *   const { login } = useDirectusAuth();
 *
 *   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
 *     e.preventDefault();
 *
 *     const { email, password } = e.currentTarget.elements;
 *     login(email.value, password.value)
 *       .catch((err) => {
 *         console.error(err);
 *       });
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit}>
 *      <input type="email" name="email" />
 *       <input type="password" name="password" />
 *       <button type="submit">Login</button>
 *     </form>
 *   );
 * };
 *
 * export default Login;
 * ```
 */
export const useDirectusAuth = (): DirectusAuthHook => {
  const directusContext = useContext(DirectusContext);

  if (!directusContext) {
    throw new Error('useDirectusAuth has to be used within the DirectusProvider');
  }

  const {
    directus,
    _authState: authState,
    _setAuthState: setAuthState,
    _directusUser: directusUser,
    _setDirectusUser: setDirectusUser,
  } = directusContext;

  const login = useCallback<DirectusAuthHook['login']>(
    async (email: string, password: string) => {
      await directus.auth.login({
        email,
        password,
      });

      const dUser = (await directus.users.me.read({
        fields: ['*'],
      })) as UserType;

      if (dUser) {
        setDirectusUser(dUser);
        setAuthState('authenticated');
      } else {
        setDirectusUser(null);
        setAuthState('unauthenticated');
      }
    },
    [directus]
  );

  const logout = useCallback<DirectusAuthHook['logout']>(async () => {
    try {
      await directus.auth.logout();
    } finally {
      setAuthState('unauthenticated');
      setDirectusUser(null);
    }
  }, [directus]);

  const value = useMemo<DirectusAuthHook>(
    () => ({
      user: directusUser,
      authState,
      login,
      logout,
    }),
    [directus, directusUser, authState]
  );

  return value;
};
