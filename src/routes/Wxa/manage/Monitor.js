import React, { Component, Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Form, Card, Select, List, Checkbox, Tag, Icon, Avatar, Row, Col, Button, Input,Divider, Tabs,Spin, Badge, message, Modal } from 'antd';
import { routerRedux, Route, Switch, Link} from 'dva/router';
import TagSelect from 'components/TagSelect';
import StandardFormRow from 'components/StandardFormRow';
import { getRoutes,getQueryString,filter } from '../../../utils/utils';
import styles from './Monitor.less';
import Articles from './Articles.js';
import Detail from './Detail.js';
const { TabPane } = Tabs;
const { Option } = Select;
const FormItem = Form.Item;
const pageSize = 5;
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['已发布', '待发布', '待提审', '审核中','待升级','审核失败'];
const opreationStatus = ['提审', '发布', '提审', '撤回','提审','提审'];
 @Form.create()
@connect(({ user, loading }) => ({
  user,
  loading: loading.effects['user/fetchListOne'],
}))
export default class SearchList extends Component {
  state={
    releaseAppidList:'',
    isDetail:false,
    id:0,
    type:1,
    modalVisible:false,
    isPermission:[11],
    params:{
      appId:'',
      appName:'',
      info:'',
      status:'',
      version:'',
      pageIndex:1,
      pageSize:10, 
      wxaSku:'' 
    }
  }
  componentDidMount() { 
    this.fetchMore(this.state.params);
  }
  fetchMore = (params) => {
    this.props.dispatch({
      type: 'user/fetchGetAppTotal',     
      payload:{
        ...params
      }      
    });    
    this.props.dispatch({
      type: 'user/fetchListOne',     
      payload:{
        ...params
      }      
    });
  };  
  handleTabChange = key => {
     const { dispatch, match,form, user:{listOne:{pagination}}} = this.props;
     let wxaSku='';
     switch(key){      
      case '2':
        wxaSku='xkd';
        break;
      case '3':
        wxaSku='agentoa';
        break;
      default:
        wxaSku='';
        break;
     }
    if(this.state.type === key) return;
    this.setState({ type:key });    
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        pageIndex:pagination.current,
        pageSize:pagination.pageSize,
        wxaSku:wxaSku
      }; 

      for(var key in values){
        if(values[key]===undefined){
          values[key]='';
        }
      }
      this.setState({
        params:{...values}
      })            
      this.fetchMore(values);      
    });
  };
  release=(val,index,record,type)=>{        
    let str='';      
    str+=val.AppId;    
    if(val.StatusName=='待发布'){
       this.setState({releaseAppidList:str})
        this.props.dispatch({
          type: 'user/fetchRelease',
          payload: {
            appId: str,        
          },
          callback:{
              success:()=>{
                message.success('发布成功');
                this.fetchMore(this.state.params);
              },
              error:(error)=>message.error(error||'发布失败')
          }
        });
        //queryRelease({appId:"wx8e369233bcca6aad"}) 
    }else if(val.StatusName=='待提审'||val.StatusName=='待升级'||val.StatusName=='发布'||val.StatusName=='已发布'||val.StatusName=='审核失败'){            
    this.props.dispatch({
      type: 'user/fetchTrial',
      payload: {
        appId: str, 
        wxasku:val.WxaSku,
        openAppId:val.OpenAppId             
      },
      callback:{
        success:()=>{
          message.success('提审成功');
            this.fetchMore(this.state.params);
        },
        error:(error)=>message.error(error||'提审失败')
      }
    });
    }else if(val.StatusName=='审核中'){
         this.props.dispatch({
          type: 'user/fetchWithdraw',
          payload: {
            appId: str,
            wxasku:val.WxaSku,
            version:val.DebugVersion,
            openAppId:val.OpenAppId                 
          },
          callback:{
              success:()=>{
                message.success('撤回成功');
                this.fetchMore(this.state.params);
              },
              error:(error)=>message.error(error||'撤回失败')
          }
        });
    } 
  };
  

   submit = e => {
    e.preventDefault();
    const { dispatch, form, user:{listOne:{pagination}}} = this.props;    
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        pageIndex:pagination.current,
        pageSize:pagination.pageSize,
        wxaSku:this.state.params.wxaSku
      };
      for(var key in values){
        if(values[key]===undefined){
          values[key]='';
        }
      }           
      this.fetchMore(values);           
    });
  };
  handleFormReset=()=>{
    this.props.form.resetFields()
    this.setState({
      params:{
        appId:'',
        appName:'',
        info:'',
        status:'',
        version:'',
        pageIndex:1,
        pageSize:10, 
        wxaSku:'' 
      }
    })
    this.fetchMore(this.state.params);
  }
  loolDetail=(val,record)=>{
     const { dispatch, match } = this.props;
     this.setState({
      id:val.AppId
     })
     dispatch(routerRedux.push(`${match.url}?id=`+val.AppId+'&wxaSku='+val.WxaSku+'&openId='+val.OpenAppId));    
  }
  handleModalVisible = flag => { 
    this.setState({
      modalVisible: !!flag,
    });
  }; 
  render() {    
    const { form, loading, user:{listOne,appTotal, } } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 12 },
      },
    };
    const { match, routerData, location } = this.props;
    const {  modalVisible } = this.state;    
    const columns = [     
      {
        title: '小程序',
        dataIndex: 'NickName',
        align:'left',
        width:'35%',
        render:(val,record)=>{          
          return (
          <div className={styles.wxImgBox}>
            <div className={styles.imgBox}>
              <img src={record.HeadImg}/>
            </div>
            <div className={styles.textBox}>
              <div style={{fontSize:16,color:'#595959'}}>{val}</div>              
              <div style={{color:'#8c8c8c'}}><span>服务范围：</span>{record.CatesDesc}</div>              
            </div>
          </div>
          )
        },
      },     
      {
        title: '所属店铺',
        dataIndex: 'StoreName',
        //sorter: true,
        align: 'left',
        width:'10%',
        render: val => `${val}`,        
      },
      {
        title: '认证信息',
        dataIndex: 'PrincipalName',
        align: 'left',
        width:'12%',        
      },
      {
        title: '更新时间',
        dataIndex: 'AuditTime',
        //sorter: true,
        align: 'left',
        width:'17%',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '状态',
        dataIndex: 'StatusName',
        align: 'left',
        width:'9%',           
      },
      {
        title: '操作',      
        align: 'left',
        width:'15%',       
        render: (val,record,index) => (
          <Fragment>
            <a href="javascript:void(0);" onClick={this.release.bind(val,record,index,1)}>{filter(val.StatusName)}</a>
            <Divider type="vertical" />
            <a href="javascript:void(0);" onClick={this.loolDetail.bind(val,record)}>详情</a>
          </Fragment>
        ),
      },
    ];
    var isDetail=false;    
    if (getQueryString("id")) {
      isDetail=true;           
    } 
    const parentMethods = {
      trial: this.trial,
      handleModalVisible: this.handleModalVisible,
    };   
    return (
      <div className={styles.wxaManage}>
      {
        isDetail?<Detail id={getQueryString("id")} _this={this} appId={getQueryString("id")||0} status={status} wxaSku={getQueryString("wxasku")} openId={getQueryString("openId")} />:
      <Fragment>
        <Card bordered={false}>
          <div className={styles.tableListForm}>
            <Form layout="inline" onSubmit={this.submit}>
            <StandardFormRow title="" grid last>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col md={8} sm={24}>
                  <FormItem label="小程序名称" className={styles.mb10}>
                    {getFieldDecorator('appName')(<Input placeholder="请输入"/>)}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="APPID ">
                    {getFieldDecorator('appId')(<Input placeholder="请输入"/>)}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="商家信息">
                    {getFieldDecorator('info')(<Input placeholder="请输入"/>)}
                  </FormItem>
                </Col>
                <Col md={8} sm={24} xs={24}>
                  <FormItem {...formItemLayout} label="发布的状态">
                    {getFieldDecorator('status', {})(
                      <Select                        
                        placeholder="不限"
                        style={{  width: '100%' }}
                      >
                        <Option value="">全部</Option>
                        <Option value="已发布">已发布</Option>
                        <Option value="待发布">待发布</Option>
                        <Option value="待提审">待提审</Option>
                        <Option value="待升级">待升级</Option>
                        <Option value="审核失败">审核失败</Option>
                        <Option value="审核中">审核中</Option>                        
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="版本号">
                    {getFieldDecorator('version')(<Input placeholder="请输入"/>)}
                  </FormItem>
                </Col>
                <Col md={8} sm={24} style={{textAlign:'right'}}>
                  <span >
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                      重置
                    </Button>
                  </span>
                </Col>
              </Row>
            </StandardFormRow>
          </Form>
          </div>          
        </Card>
        <Card
          style={{ marginTop: 24 }}
          bordered={false}
          bodyStyle={{ padding: 0 }}
        >
          <Tabs
            size="large"
            tabBarStyle={{ marginBottom: 0,paddingLeft: 16 }}
            onChange={this.handleTabChange.bind(this)}
          >
            <TabPane tab={ <span>所有小程序{appTotal&&appTotal.data?<span className={this.state.type==1?'':`${styles['unActive']}`} style={{fontSize:14}}>（{appTotal.data.total}）</span>:<span style={{fontSize:14}}>（0）</span>}</span>} key="1">
              <Articles columns={columns} params={this.state.params} form={this.props.form}/>
            </TabPane>
            <TabPane tab={<span>销客多商城{appTotal&&appTotal.data?<span className={this.state.type==2?'':`${styles['unActive']}`} style={{fontSize:14}}>（{appTotal.data.xkd}）</span>:<span style={{fontSize:14}}>（0）</span>}</span>} key="2">
              <Articles columns={columns} params={this.state.params} form={this.props.form}/>
            </TabPane>
            <TabPane tab={<span>代理商OA{appTotal&&appTotal.data?<span className={this.state.type==3?'':`${styles['unActive']}`} style={{fontSize:14}}>（{appTotal.data.agentoa}）</span>:<span style={{fontSize:14}}>（0）</span>}</span>} key="3">
              <Articles columns={columns} params={this.state.params} form={this.props.form}/>
            </TabPane>
          </Tabs>
        </Card>
      </Fragment>
      }
      </div>
    );
  }
}
