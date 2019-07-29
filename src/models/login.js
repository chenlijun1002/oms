import { routerRedux } from 'dva/router';
import { fakeAccountLogin } from '../services/api';
import { setAuthority, setCookie, delCookie } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload,callback }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully       
      if (response&&response.access_token) {
        reloadAuthorized();
        setCookie(response.access_token);              
        yield put(routerRedux.push('/'));
        if (callback) callback.success();
      }else{
        if (callback) callback.error('账号或密码错误');
      }      
    },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
        delCookie("token");
      } finally {
        const response = yield call(Login, payload);
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
        delCookie("token");
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      //setAuthority(payload.currentAuthority);
      //setAuthority('user');      
      return {
        ...state,
        status: payload?payload.status:false,
      };
    },
  },
};
