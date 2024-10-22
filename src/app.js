import React, { Suspense } from 'react';
import { Box } from '@chakra-ui/react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Headers from './components/Header';
import Loader from './components/Loader';
import routesConstant from './utils/routes';
import constant from './utils/constant';

const App = () => {
  return (
    <Box>
      <Headers />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path='/' element={<Navigate to={constant.routes.signIn} />} />
          {routesConstant.publicRoutes.map(({ path, element: Element }) => (
            <Route key={path} path={path} element={<Element />} />
          ))}
          {routesConstant.privateRoutes.map(({ path, element: Element, children }) => (
            <Route key={path} path={path} element={<Element />}>
              {children && children.map(({ path: childPath, element: ChildElement }) => (
                <Route key={childPath} path={childPath} element={<ChildElement />} />
              ))}
            </Route>
          ))}
        </Routes>
      </Suspense>
    </Box>
  );
};

export default App;
