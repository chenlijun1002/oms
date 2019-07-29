// use localStorage to store the authority info, which might be sent from server in actual project.
import {cookies} from '../assets/jquery.cookie.js';
export function getAuthority() {
  return localStorage.getItem('token');
}

export function setAuthority(authority) {
  return localStorage.setItem('token', authority);
}

// export function setCookie(token,time) {	
//  	 cookies.set('token',token, { expires: time  }); 	
// }
export function setCookie(value,time){
	var strsec = time?getsec(time):600000;
	var exp = new Date();
	exp.setTime(exp.getTime() + strsec*1);	
	document.cookie ="token="+ escape (value) + ";expires=" + exp.toGMTString();
}
function getsec(str){	
	if(typeof str =='string'){
		var str1=str.substring(1,str.length)*1;
		var str2=str.substring(0,1);
	}else{
		return str1=str*1000;
	}
	if (str2=="s")
	{
		return str1*1000;
	}
	else if (str2=="h")
	{
		return str1*60*60*1000;
	}
	else if (str2=="d")
	{
		return str1*24*60*60*1000;
	}else{
		return str1*1000;
	}
}
export function getCookie(Name) {
	var cookie=document.cookie;
	var reg4 = /(^| )token=([^;]*)(;|$)/;//匹配某个cookie的正则
	var arr = cookie.match(reg4);//match方法发挥数组	 
	return arr;
}

export function delCookie(name)
{
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval=getCookie(name);
	if(cval!=null)
	document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}
