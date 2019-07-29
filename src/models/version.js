import { queryXcxVersion, queryVersiontotal, getLastnumber, publishXcxVersion, getxcxversion} from '../services/api';
import { message } from 'antd';

export default {
  namespace: 'version',

  state: {
    xcxVersion: [],
    xcxTotals: {},
    publishVersionInfo: {},
    currentXcx: {},
    versionDetails:{},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryXcxVersion, payload);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *queryVersiontotal(_, { call, put }) {
      const response = yield call(queryVersiontotal);
      yield put({
        type: 'saveXcxTotals',
        payload: response,
      });
    },
    *publishVersion({ payload,callback }, { call, put }) {
      const response = yield call(publishXcxVersion, payload);
      if(response.data) {
        if(callback&&callback.success) callback.success();        
      }else {
        if(callback&&callback.error) callback.error('发布失败！');
      }
    },
    *queryLastumber({ payload }, { call, put }) {
      const response = yield call(getLastnumber, payload);
      yield put({
        type: 'savePublishInfo',
        payload: response,
      });
    },
    *getxcxversion({ payload }, { call, put }) {
      const response = yield call(getxcxversion, payload);      
      yield put({
        type: 'getVersion',
        payload: response.data,
      });
    },
  },

  reducers: {
    //保存小程序版本列表
    save(state, action) {
      return {
        ...state,
        xcxVersion: action.payload.Data,
        total: action.payload.Total
      };
    },
    //保存小程序版本tab栏数量
    saveXcxTotals(state, action) {
      return {
        ...state,
        xcxTotals: action.payload.data,
      };
    },
    //保存小程序发布信息
    savePublishInfo(state, action) {
      return {
        ...state,
        publishVersionInfo: action.payload.data,
      };
    },
    //保存当前小程序信息
    saveCurrentXcx(state, action) {
      return {
        ...state,
        currentXcx: action.payload,
      };
    },
    getVersion(state, action) {
      return {
        ...state,
        versionDetails: action.payload,
      };
    },
  },
};
