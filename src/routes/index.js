import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
import { AuthProvider } from 'src/contexts/JWTContext';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import AuthGuard from '../guards/AuthGuard';
import GuestGuard from '../guards/GuestGuard';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// config
import { PATH_AFTER_LOGIN } from '../config';
// components
import LoadingScreen from '../components/LoadingScreen';


// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

// Dashboard
const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));


// export default function Router() {
//   return useRoutes([
//     {
//       path: '/',
//       element: <DashboardLayout />,
//       children: [
//         { element: <Navigate to="/dashboard/app" replace />, index: true },
//         { path: '/dashboard', element: <Navigate to="/dashboard/app" replace />, index: true },
//         { path: '/dashboard/app', element: <GeneralApp/> },
//       ],
//     },
//     {
//       path: '*',
//       element: <LogoOnlyLayout />,
//       children: [
//         { path: '404', element: <NotFound /> },
//         { path: '*', element: <Navigate to="/404" replace /> },
//       ],
//     },
//     { path: '*', element: <Navigate to="/404" replace /> },
//   ]);
// }


export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },    
        { path: 'login-unprotected', element: <Login /> },
        
      ],
    },

    // Dashboard Routes
    {
      path: '/',
      element: (
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
      ),
      children: [
        { element: <Navigate to={"dashboard/app"} replace />, index: true },
        { path: 'dashboard/app', element:<GeneralApp />  },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}


