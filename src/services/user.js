import request from '../utils/request';
import {objTransformString} from '../utils/utils.js';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/versionmanage/GetCurrentUser');
}
export async function queryMenus() {
  return request('/api/versionmanage/getMenus');
}
export async function queryAnalysis() {
  return request('/api/versionmanage/getxcxversionlist');
}
export async function queryListOne(params) {  
  let param=objTransformString(params);  
  return request('/api/versionmanage/getapplist'+param);
}
export async function queryRelease(params) {
  return request('/api/versionmanage/coderelease', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
export async function queryBatchRelease(params) {
  return request('/api/versionmanage/BatchCommit', {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
export async function queryTrial(params) {
  return request('/api/versionmanage/commitaudit', {
    method: 'POST',
    body:JSON.stringify(params)
  });
}
export async function queryWithdraw(params) {
  return request('/api/versionmanage/undocodeaudit', {
    method: 'POST',
    body:JSON.stringify(params)
  });
}
export async function queryBasicDetail(params) {
  let param=objTransformString(params); 
  return request('/api/versionmanage/getxcxbyappId'+param);
}

export async function queryDomainDetail(params) {
  let param=objTransformString(params); 
  return request('/api/versionmanage/getwxaapidomain'+param);
}
export async function querySetDomain(params) {
  return request('/api/versionmanage/updatewxaapidomain',{
    method: 'POST',
    body:JSON.stringify(params)
  });
}

export async function queryGetTesters(params) {
  let param=objTransformString(params);
  return request('/api/versionmanage/gettesters'+param);
}
export async function queryBindTester(params) {   
  return request('/api/versionmanage/bindtester',{
    method: 'POST',
    body:JSON.stringify(params)
  });
}

export async function queryUnBindTester(params) {   
  return request('/api/versionmanage/UnBindTester',{
    method: 'POST',
    body:JSON.stringify(params)
  });
}

export async function queryGetAppTotal(params) {  
  let param=objTransformString(params);
  return request('/api/versionmanage/GetAppTotal'+param);
}

export async function queryGetPermissions(params) {  
  let param=objTransformString(params);
  return request('/api/versionmanage/GetPermissionsByAppId'+param);
}
export async function queryCommitCode(params) {  
  return request('/api/versionmanage/CommitCodeByModuleIds',{
    method: 'POST',
    body:JSON.stringify(params)
  });
}

