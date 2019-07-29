import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';

// 是否禁用代理
//const noProxy = process.env.NO_PROXY === 'true';
const noProxy = true;
const apiurl = 'http://wxaomsapi-two.yunmof.com/';
// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: '获取当前用户接口',
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 25,
    },
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': [],
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
    if (password === '888888' && userName === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }
    if (password === '123456' && userName === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/notices': getNotices,
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/versionmanage/getMenus': [
    {
      name: '小程序',
      icon: 'dashboard',
      path: 'wxaIndex',
      children: [
        {
          name: '概况',
          path: 'analysis',          
        },
        {
          name: '小程序管理',
          path: 'wxaManage',          
        },            
        {
          name: '版本管理',
          path: 'versionManage',         
        },
      ],
    },
  ],
  // 'GET /api/versionmanage/getMenus': (req,res)=>{
  //   //console.log(JSON.Stringfy(res))
  // },
  'GET /api/versionmanage/getOverview': [
    {
      name:"代理商OA",
      arraignmentFailedNum:200,
      releaseDate:"2018-01-12",
      underReviewNum:56,
      updatedNum:55,
      version:3.6
    },
    {
      name:"销客多商城",
      arraignmentFailedNum:200,
      releaseDate:"2018-01-12",
      underReviewNum:88,
      updatedNum:550,
      version:3.8
    }
  ],
  'GET /api/wxaAnalysis': [
    {
      name:"代理商OA",
      arraignmentFailedNum:200,
      releaseDate:"2018-01-12",
      underReviewNum:56,
      updatedNum:55,
      version:3.6
    },
    {
      name:"销客多商城",
      arraignmentFailedNum:200,
      releaseDate:"2018-01-12",
      underReviewNum:88,
      updatedNum:550,
      version:3.8
    }
  ],
  'POST /api/versionmanage/getapplist': {
    list:[
      {
        key:0,
        disabled:false,
        no:0,
        parentStore:"sf",
        info:"djkj",
        callNo:120,
        status:1,
        updatedAt:"2018-02-14",
        appid:"242121",
        name:"我的",
        version:50
      },
      {
        key:1,
        disabled:true,
        no:2,
        info:"sf",
        parentStore:"djkj",
        callNo:121,
        status:2,
        updatedAt:"2018-02-14",
        appid:"545154",
        name:"我的",
        version:58
      },
      {
        key:2,
        disabled:false,
        no:2,
        info:"s刚刚f",
        parentStore:"dj刚刚改好kj",
        callNo:121,
        status:1,
        updatedAt:"2018-02-14",
        appid:"748657885",
        name:"你的",
        version:58
      }
    ],
    pagination:{
      current:1,
      pageSize:5,
      total:2
    }
  },
  'POST /api/release':(req,res)=>{     
      res.send({ code: 0, msg: "发布成功" });
  },
  'POST /api/versionmanage/getxcxbyappId': {
    
  },
};

export default (noProxy  
  ? {
    'GET /api/versionmanage/(.*)': 'http://wxaomsapi-two.yunmof.com/api/versionmanage/',
    'POST /api/versionmanage/(.*)': 'http://wxaomsapi-two.yunmof.com/api/versionmanage/'    
    }
  : delay(proxy, 1000));
