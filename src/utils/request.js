import fetch from 'dva/fetch';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../index';
import {Base64} from './utils.js';
import{getCookie, setCookie,delCookie} from './authority';
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
function checkStatus(response) {  
  const { dispatch } = store;
  var token=getCookie('token');  
  delCookie("token");
  if(response.url !=location.host+'/api/versionmanage/token'){       
    if(token){
       setCookie(token[2]);
    }
  }   
    // if(!token&&response.url !=location.host+'/api/versionmanage/token'){ 
    //   dispatch(routerRedux.push('/user/login'))
    // }
  if (response.status >= 200 && response.status < 300) { 
    return response;
  }
  
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {    
  const defaultOptions = {
    credentials: 'include',
  };  
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT'|| newOptions.method === undefined) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      if(url=='/api/versionmanage/token'){        
        newOptions.headers.Authorization="Basic " + Base64.encode("wxaAdmin" + ":" + "QFw9iokYoqBzT7TF");
      }else{
        var token=getCookie('token');                        
        newOptions.headers.Authorization="Basic " + (token == null ? "" : token);
      }
      //newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',        
        ...newOptions.headers,
      };
      if(url=='/api/versionmanage/token'){        
        newOptions.headers.Authorization="Basic " + Base64.encode("wxaAdmin" + ":" + "QFw9iokYoqBzT7TF");
      }
    }
  }

  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .catch(e => {
      const { dispatch } = store;
      const status = e.name;      
      if (status === 401) {
        dispatch({
          type: 'login/logout',
        });
        return;
      }      
      if (status === 403) {
        dispatch(routerRedux.push('/exception/403'));
        return;
      }
      if (status <= 504 && status >= 500) {
        dispatch(routerRedux.push('/exception/500'));
        return;
      }
      if (status >= 404 && status < 422) {
        dispatch(routerRedux.push('/exception/404'));
      }
    });
}
