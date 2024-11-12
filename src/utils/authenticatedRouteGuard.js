import React, { useEffect } from 'react';
import constant from './constant';
import { useRouter } from 'next/router.js';

/**
 * Higher-order component that wraps a given component and adds authentication logic.
 * It checks if the user has a valid access token or refresh token in local storage.
 * If the tokens are missing, it redirects the user to the sign-in page.
 * 
 * @param {React.ComponentType} Component - The component to be wrapped and protected by authentication.
 * @returns {React.FC} A new component that checks for authentication before rendering the wrapped component.
 */

const withAuthentication = (Component) => { 
  return (props) => {
    const token = constant.localStorageUtils.getItem(constant.localStorageKeys.accessToken);
    const refreshtoken = constant.localStorageUtils.getItem(constant.localStorageKeys.refreshToken);
    const router = useRouter();

    useEffect(() => {
      if (!token && !refreshtoken) {
        router.push(constant.routes.signIn);
      }
    }, [token, refreshtoken, router]);

    return <Component {...props} />;
  };
};

export default withAuthentication;