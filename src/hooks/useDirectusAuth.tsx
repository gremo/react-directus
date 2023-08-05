import { useCallback, useContext, useMemo } from 'react';
import { DirectusContext } from '@/DirectusProvider';
import { UserType } from '@directus/sdk';

/**
 * Possible states of the authentication.
 * @defaultValue AuthStates.UNAUTHENTICATED
 * @defaultValue AuthStates.LOADING - When AutoLogin is enabled.
 */
export enum AuthStates {
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
}

/**
 * A set of functions and data to manage authentication.
 */
export interface DirectusAuthHook {
  /**
   * Login the user. If successful, the user will be stored in the context.
   * Else, an error will be thrown.
   * @param email - The user email.
   * @param password - The user password.
   * @throws {Error} - If the login fails.
   */
  login: (email: string, password: string) => Promise<void>;
  /**
   * Logout the user. If successful, the user will be removed from the context.
   * Else, an error will be thrown.
   * @throws {Error} - If the logout fails.
   */
  logout: () => Promise<void>;
  /**
   * Represents the current authentication state.
   * @defaultValue 'loading'
   */
  authState: AuthStates;
  /**
   * The current authenticated user.
   * @defaultValue null
   */
  user: UserType | null;
}

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
        setAuthState(AuthStates.AUTHENTICATED);
      } else {
        setDirectusUser(null);
        setAuthState(AuthStates.UNAUTHENTICATED);
      }
    },
    [directus]
  );

  const logout = useCallback<DirectusAuthHook['logout']>(async () => {
    try {
      await directus.auth.logout();
    } finally {
      setAuthState(AuthStates.UNAUTHENTICATED);
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
