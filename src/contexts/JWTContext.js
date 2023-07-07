import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
import axios from '../utils/axios';
import { setSession } from '../utils/jwt';
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
      isInitialized: true,
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
  initialize: () => Promise.resolve(),

});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = async () => {
    try {
      const accessToken = window.localStorage.getItem('accessToken');


      if (accessToken !== null) {
        setSession(accessToken);

        const response = await axios.get('https://ideav.online/api/magnet/report/66177?JSON_KV',
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem('accessToken'),
          }
        });

        const user = response.data[0];
        console.log("User", user.error)
        if (user.error){
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }else{
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user
            },
          });
        }
        

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

  useEffect(() => {
    
    initialize();
    syncWB(localStorage.getItem('login'), localStorage.getItem('accessToken'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const syncWB = async (login, accessToken) => {
    const res = await axios.post("https://magnetx.ideav.online/wb.php",
      {'user':login,
      'token':accessToken});
    console.log(res.data);
  }
  const login = async (login, password) => {
    const response = await axios.post("https://ideav.online/api/magnet/auth", {
      'login': login,
      'pwd': password
    },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
      })


    localStorage.setItem("login", login)
    const xsrfToken = response.data._xsrf;
    const accessToken = response.data.token;
    const user = response.data.id;

    syncWB(login, accessToken);

    if (response.data.length===1) {
      setSession(null);
      throw new Error(response.data[0].error);
    } else {
      setSession(accessToken);
      // localStorage.setItem("xsrf",xsrfToken);
      dispatch({
        type: 'LOGIN',
        payload: {
          user,
        },
      });
    }


  };

  const register = async (t33, t66078, t66076, t18, t20, t40, t125) => {
    const accessToken = 'reFTGAW83EW2RDu2S0';
    const _xsrf = 'reFTGAW83EW2RDu2S0';
    const t156 = new Date().getDate();
    const t115=164;
    const response = await axios.post('https://ideav.online/api/magnet/_m_new/18?up=1', {
      t33,
      t66078,
      t66076,
      t18,
      t20,
      t40,
      t125,
      t115,
      t156,
      _xsrf
    },{headers:{'X-Authorization':accessToken}});


    if(response.data.warning){
      throw  new Error("Имя пользователя уже занято");
    }
    //    const { accessToken, user } = response.data;
    localStorage.setItem("login", t18)
    const user = t18;
    console.log(user)
    setSession(t40);
    //    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
    syncWB(user, t125);
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
        initialize,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
