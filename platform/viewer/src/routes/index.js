import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from '@ohif/ui';

// Route Components
import DataSourceWrapper from './DataSourceWrapper';
import WorkList from './WorkList';
import Login from './Login';
import Local from './Local';
import ProjectList from './ProjectList';
import Debug from './Debug';
import NotFound from './NotFound';
import buildModeRoutes from './buildModeRoutes';
import PrivateRoute from './PrivateRoute';

// TODO: Include "routes" debug route if dev build
const bakedInRoutes = [
  // WORK LIST
  {
    path: '/',
    children: DataSourceWrapper,
    private: true,
    props: { children: WorkList },
  },
  {
    path: '/debug',
    children: Debug,
  },
  {
    path: '/local',
    children: Local,
  },
  {
    path: '/project',
    children: ProjectList,
  },
  {
    path: '/login',
    children: Login,
  },

  // NOT FOUND (404)
  { component: NotFound },
];

// NOT FOUND (404)
const notFoundRoute = { component: NotFound };
const WorkListRoute = {
  path: '/',
  children: DataSourceWrapper,
  private: true,
  props: { children: WorkList },
};

const createRoutes = ({
  modes,
  dataSources,
  extensionManager,// v2
  servicesManager, // v2
  commandsManager, // v2
  hotkeysManager,  // v2
  routerBasename,
  showStudyList,
}) => {
  const routes =
    buildModeRoutes({
      modes,
      dataSources,
      extensionManager,
      servicesManager,
      commandsManager,
      hotkeysManager,
    }) || [];

  const { customizationService } = servicesManager.services;

  const customRoutes = customizationService.getGlobalCustomization(
    'customRoutes'
  );
  const allRoutes = [
    ...routes,
    ...(showStudyList ? [WorkListRoute] : []),
    ...servicesManager.services,//(customRoutes?.routes || []),
    ...bakedInRoutes,
    // customRoutes?.notFoundRoute || notFoundRoute,
  ];

  function RouteWithErrorBoundary({ route, ...rest }) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return (
      <ErrorBoundary context={`Route ${route.path}`} fallbackRoute="/">
        <route.children
          {...rest}
          {...route.props}
          route={route}
          servicesManager={servicesManager}
          hotkeysManager={hotkeysManager}
        />
      </ErrorBoundary>
    );
  }

  const { UserAuthenticationService } = servicesManager.services;

  // Note: PrivateRoutes in react-router-dom 6.x should be defined within
  // a Route element
  return (
    <Routes>
      {allRoutes.map((route, i) => {
        return route.private === true ? (
          <Route
            key={i}
            exact
            path={route.path}
            element={
              <PrivateRoute
                handleUnauthenticated={
                  UserAuthenticationService.handleUnauthenticated
                }
              >
                <RouteWithErrorBoundary route={route} />
              </PrivateRoute>
            }
          ></Route>
        ) : (
          <Route
            key={i}
            path={route.path}
            element={<RouteWithErrorBoundary route={route} />}
          />
        );
      })}
    </Routes>
  );
};

export default createRoutes;
