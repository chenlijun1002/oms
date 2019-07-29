import {
  query as queryUsers,
  queryCurrent,
  queryMenus,
  queryAnalysis,
  queryListOne,
  queryRelease,
  queryBatchRelease,
  queryTrial,
  queryWithdraw,
  queryBasicDetail,
  queryDomainDetail,
  querySetDomain,
  queryGetTesters,
  queryBindTester,
  queryUnBindTester,
  queryGetAppTotal,
  queryGetPermissions,
  queryCommitCode,
} from '../services/user';
import { getMenuData } from '../common/menu';
import { filterObj } from '../utils/utils';
export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    menuData: [],
    wxaAnalysis: [],
    listOne: {},
    release:{},
    trial:{},
    withdraw:{},
    basicDetail:{},
    domainDetail:{},   
    setDomain:{},
    testers:[], 
    bindTester:{},
    appTotal:{},
    permissions:{},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *fetchMenus(_, { call, put }) {
      const response = yield call(queryMenus);     
      let list=[];
      response.data.forEach(function(item){          
          list.push(filterObj(item))
      })
      const menus = getMenuData(list);           
      yield put({
        type: 'saveMenus',
        payload: menus,
      });
    },
    *fetchAnalysis(_, { call, put }) {
      const response = yield call(queryAnalysis);
      yield put({
        type: 'saveAnalysis',
        payload: response?response.data:[],
      });
    },
    *fetchListOne({payload}, { call, put }) {
      const response = yield call(queryListOne,payload);     
      // const list={
      //   list:[
      //     {
      //       key:0,
      //       disabled:false,
      //       no:0,
      //       parentStore:"sf",
      //       info:"djkj",
      //       callNo:120,
      //       status:1,
      //       updatedAt:"2018-02-14",
      //       appid:"242121",
      //       name:"我的",
      //       version:50
      //     },
      //     {
      //       key:1,
      //       disabled:true,
      //       no:2,
      //       info:"sf",
      //       parentStore:"djkj",
      //       callNo:121,
      //       status:2,
      //       updatedAt:"2018-02-14",
      //       appid:"545154",
      //       name:"我的",
      //       version:58
      //     },
      //     {
      //       key:2,
      //       disabled:false,
      //       no:2,
      //       info:"s刚刚f",
      //       parentStore:"dj刚刚改好kj",
      //       callNo:121,
      //       status:1,
      //       updatedAt:"2018-02-14",
      //       appid:"748657885",
      //       name:"你的",
      //       version:58
      //     }
      //   ],
      //   pagination:{
      //     current:1,
      //     pageSize:5,
      //     total:2
      //   }
      // };
     if(response.code==0){
         const resList={
          list:response?response.data.Data:[],
          pagination:{
            current:payload.pageIndex,
            pageSize:payload.pageSize,
            total:response?response.data.Total:0
          }
        }
         yield put({
          type: 'saveListOne',
          payload: (!resList)?{}:resList,
        });
     }     
    },
    *fetchRelease({payload,callback},{call,put}){
      const response= yield call(queryRelease,payload);
      yield put({
        type: 'saveRelease',
        payload: response,
      });
      if (callback) {
        if(response.code==0){
          callback.success();
        }else{
          callback.error(response.msg);
        }
      };
    },
    *fetchBatchRelease({payload,callback},{call,put}){
      const response= yield call(queryBatchRelease,payload);
      yield put({
        type: 'saveBatchRelease',
        payload: response,
      });
      if (callback) {
        if(response&&response.code==0){
          callback.success();
        }else{
          callback.error(response?response.msg:'');
        }
      };
    },
    *fetchTrial({payload,callback},{call,put}){
      const response= yield call(queryTrial,payload);
      yield put({
        type: 'saveTrial',
        payload: response,
      });
      if (callback) {
        if(response.code==0){
          callback.success();
        }else{
          callback.error(response.msg);
        }
      };
    }, 
    *fetchWithdraw({payload,callback},{call,put}){
      const response= yield call(queryWithdraw,payload);
      yield put({
        type: 'saveWithdraw',
        payload: response,
      });
      if (callback) {
        if(response.code==0){
          callback.success();
        }else{
          callback.error(response.msg);
        }
      };
    },
    *fetchBasicDetail({payload,callback},{call,put}){
      const response= yield call(queryBasicDetail,payload);
      yield put({
        type: 'saveBasicDetail',
        payload: response,
      });
      if (callback) {
        if(response.code==0){
          callback.success();
        }else{
          callback.error();
        }
      };
    },
    *fetchDomainDetail({payload,callback},{call,put}){
      const response= yield call(queryDomainDetail,payload);
      yield put({
        type: 'saveDomainDetail',
        payload: response,
      });
      if (callback) {
        if(response.code==0){
          callback.success();
        }else{
          callback.error(response.msg);
        }
      };
    },
    *fetchSetDomain({payload,callback},{call,put}){
      const response= yield call(querySetDomain,payload);
      yield put({
        type: 'saveSetDomain',
        payload: response,
      });
      if (callback) {
        if(response.code==0){
          callback.success();
        }else{
          callback.error(response.msg);
        }
      };
    },
    *fetchGetTesters({payload,callback},{call,put}){
      const response= yield call(queryGetTesters,payload);
      yield put({
        type: 'saveGetTesters',
        payload: response,
      });
      if (callback) {
        if(response.code==0){
          callback.success();
        }else{
          callback.error();
        }
      };
    },
    *fetchBindTester({payload,callback},{call,put}){
      const response= yield call(queryBindTester,payload);      
      yield put({
        type: 'saveBindTester',
        payload: response,
      });
      if (callback){
        if(response.code==0){
          callback.success();
        }else{
          callback.error(response.msg);
        }        
      } 
    },
    *fetchUnbindTester({payload,callback},{call,put}){
      const response= yield call(queryUnBindTester,payload);
      yield put({
        type: 'saveUnBindTester',
        payload: response,
      });
      if (callback){
        if(response.code==0){
          callback.success();
        }else{
          callback.error(response.msg);
        }        
      } 
    },
    *fetchGetAppTotal({payload,callback},{call,put}){
      const response= yield call(queryGetAppTotal,payload);
      yield put({
        type: 'saveGetAppTotal',
        payload: response,
      });
      if (callback){
        if(response.code==0){
          callback.success();
        }else{
          callback.error();
        }        
      } 
    },
    *fetchGetPermissions({payload,callback},{call,put}){
      const response= yield call(queryGetPermissions,payload);
      yield put({
        type: 'saveGetPermissions',
        payload: response,
      });
      if (callback){
        if(response.code==0){
          callback.success(response.data);
        }else{
          callback.error(response.msg);
        }        
      } 
    },
    *fetchCommitCode({payload,callback},{call,put}){
      const response= yield call(queryCommitCode,payload);      
      yield put({
        type: 'saveCommitCode',
        payload: response,
      });
      if (callback){
        if(response.code==0){
          callback.success();
        }else{
          callback.error(response.msg);
        }        
      } 
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    saveAnalysis(state, action) {
      return {
        ...state,
        wxaAnalysis: action.payload,
      };
    },
    saveMenus(state, action) {
      return {
        ...state,
        menuData: action.payload,
      };
    },
    saveListOne(state, action) {
      return {
        ...state,
        listOne: action.payload,
      };
    },
    saveRelease(state, action) {
      return {
        ...state,
        release: action.payload,
      };
    },
    saveTrial(state,action){
      return {
        ...state,
        trial: action.payload,
      };
    },
    saveWithdraw(state,action){
      return {
        ...state,
        withdraw: action.payload,
      };
    },
    saveBasicDetail(state,action){
      return {
        ...state,
        basicDetail: action.payload,
      };
    },
    saveDomainDetail(state,action){
      return {
        ...state,
        domainDetail: action.payload,
      };
    },
    saveSetDomain(state,action){
      return {
        ...state,
        setDomain: action.payload,
      };
    },
    saveGetTesters(state,action){
      return {
        ...state,
        testers: action.payload,
      };
    },
    saveBindTester(state,action){
      return {
        ...state,
        bindTester: action.payload,
      };
    },
    saveGetAppTotal(state,action){
      return {
        ...state,
        appTotal: action.payload,
      };
    },
    saveGetPermissions(state,action){
      return {
        ...state,
        permissions: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
  },
};
