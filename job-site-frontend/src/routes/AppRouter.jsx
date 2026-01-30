import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routes } from './routes';

// Helper function để render nested routes
const renderRoutes = (routes) => {
  return routes.map((route, index) => {
    if (route.children) {
      return (
        <Route key={index} path={route.path} element={route.element}>
          {renderRoutes(route.children)}
        </Route>
      );
    }
    
    if (route.index) {
      return <Route key={index} index element={route.element} />;
    }
    
    return (
      <Route key={index} path={route.path} element={route.element} />
    );
  });
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {renderRoutes(routes)}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;