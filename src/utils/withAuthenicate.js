import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import constant from './constant';

const withAuthentication = (Component) => {
  return (props) => {
    const token = constant.localStorageUtils.getItem(constant.localStorageKeys.accessToken);
    const refreshtoken = constant.localStorageUtils.getItem(constant.localStorageKeys.refreshToken);
    const navigate = useNavigate();

    useEffect(() => {
      if (!token && !refreshtoken) {
        navigate(constant.routes.signIn);
      }
    }, [token, refreshtoken, navigate]);

    return <Component {...props} />;
  };
};

export default withAuthentication;