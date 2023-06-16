import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
// import { createInstance } from 'i18next';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;
    // console.log(user);
    // const user = {name: "TEST USER"};

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken !== null) {
          console.log(accessToken)
          setSession(accessToken);

          const user = (await axios.get('https://ideav.online/api/magnet/report/64031?JSON_KV'),
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Authorization': localStorage.getItem('accessToken'),
            }
          }).data;

          //          const user = {...user, accessToken};
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user,
            },
          });

        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (login, password) => {
    console.log(login, password)
    const response = await axios.post("https://ideav.online/api/magnet/auth", {
      'login': login,
      'pwd': password
    },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      })

    const accessToken = response.data.token;
    const user = response.data.id;

    if (response.data.length===1) {
      setSession(null);
      throw new Error(response.data[0].error);
    } else {
      setSession(accessToken);
      dispatch({
        type: 'LOGIN',
        payload: {
          user,
        },
      });
    }


  };

  const register = async (firstName, phone, apiKeyWB, email, login, password) => {
    const response = await axios.post('/api/users/register', {
      firstName,
      phone,
      apiKeyWB,
      email,
      login,
      password,
    });
    //    const { accessToken, user } = response.data;
    const accessToken = response.data.token;
    const user = response.data.user;

    setSession(accessToken);
    //    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
