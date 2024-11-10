import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '../store/redux/store';
import React, { Suspense } from 'react';
import Loader from '../components/Loader';
import Header from '../components/Header';
import '../styles/Global.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <Provider store={store}>
            <Suspense fallback={<Loader />}>
                <Header />
                <Component {...pageProps} />
            </Suspense>
        </Provider>
    );
};


export default MyApp;