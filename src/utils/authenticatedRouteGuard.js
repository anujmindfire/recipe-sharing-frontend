import React, { useEffect } from 'react';
import constant from './constant';
import { useRouter } from 'next/router.js';

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