import { stringify } from 'qs';
import request from '../utils/request';
import queryString from 'query-string';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {   
 let data = 'username=' + params.username + '&password=' + params.password+'&grant_type='+params.grant_type;
  return request('/api/versionmanage/token', {
    method: 'POST',
    headers:{
      'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept':'application/json'
      // 'Accept-Encoding':'gzip, deflate',
      // 'Accept':'application/json, text/javascript, */*; q=0.01'
    },
    body: data,
  });
}

export async function Logout(params) {   
 let data = 'username=' + params.username + '&password=' + params.password+'&grant_type='+params.grant_type;
  return request('/api/versionmanage/token', {
    method: 'POST',
    body: data,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

//获取小程序版本
export async function queryXcxVersion(params) {
  return request(`/api/versionmanage/getversionlistbypage?${stringify(params)}`);
}
//获取分类统计数
export async function queryVersiontotal() {
  return request('/api/versionmanage/getversiontotal');
}
//获取版本信息
export async function getLastnumber(params) {
  return request(`/api/versionmanage/getlastnumber?${stringify(params)}`);
}
//发布小程序版本
export async function publishXcxVersion(params) {
  return request('/api/versionmanage/saveversioninfo', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
//获取小程序版本
export async function getxcxversion(params) {
  return request(`/api/versionmanage/getxcxversion?${stringify(params)}`);


}
//自动提审发布
export async function autoVersion(params) {
  return request('/api/versionmanage/AutoVersion', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}