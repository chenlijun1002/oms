import React, { Component,Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Card, Badge, Table, Divider, Tabs, Input,List,Button,Icon, Form, Modal, message, Alert} from 'antd';
import DescriptionList from 'components/DescriptionList';
import Ellipsis from 'components/Ellipsis';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './Detail.less';
import { filter } from '../../../utils/utils';


const { Description } = DescriptionList;
const { TabPane } = Tabs;
const { TextArea } = Input;
const FormItem = Form.Item;


const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, _this:{props:{user:{testers}}} } = props; 
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;      
      handleAdd(fieldsValue);
      form.resetFields();
    });
  };
  return (
    <Modal
      title="新增体验者"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="微信号">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请填写微信号' }],
        })(<Input placeholder="请输入绑定的微信号" />)}
        <div>还可以绑定{testers.data?(40-testers.data.length):40}个体验者</div>
      </FormItem>      
    </Modal>
  );
});


@connect(({ user, loading }) => ({
  user,
  loading: loading.effects['user/fetchBasicDetail'],
}))
@Form.create()
export default class BasicProfile extends Component {
	state = {
    modalVisible: false,
    textAreaValue:'' 
  };
  componentDidMount() {
    this.requestData();
  }
  requestData=()=>{
    const { dispatch,appId } = this.props;
    dispatch({
      type: 'user/fetchBasicDetail',
      payload:{
        appId:appId
      } 
    });
  }
  handleTabChange=(key)=>{
    const { dispatch,appId } = this.props;    
  	switch(key){
      case '1':
       dispatch({
        type: 'user/fetchBasicDetail',
        payload:{
          appId:appId
        } 
      });
        break;
      case '2':
        dispatch({
          type: 'user/fetchDomainDetail',
          payload: {
            appId:appId
          },
        });
        break;
      case '3':
        dispatch({
          type: 'user/fetchGetTesters',
          payload: {
            appId:appId
          },
        });
        break;
    }
  }

 handleModalVisible = flag => { 
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch,appId } = this.props;    
    dispatch({
      type: 'user/fetchBindTester',
      payload: {
        wxId: fields.desc,
        appId:appId
      },
      callback:{
          success:()=>{
            message.success('添加成功');
            dispatch({
               type: 'user/fetchGetTesters',
               payload: {
                 appId:appId
               },
             });
           },
           error:(error)=>{
              message.error(error||'添加失败');
           }
      }      
    });    
    this.setState({
      modalVisible: false,
    });
  };
  handleImageErrored= (e)=>{       
    e.target.src="https://file.xiaokeduo.com/system/StoreAdmin/images/notbindtwo.png";
  }
  handleResetAndAddRequest=(type)=>{
    const { dispatch,appId } = this.props;   
    if(type==1){
      dispatch({
        type: 'user/fetchSetDomain',
        payload: {
          appId: appId,
          action:'set',
          doaminUrl:this.state.textAreaValue
        },
        callback:{
          success:()=>{
            message.success('操作成功');            
           },
          error:(error)=>{
            message.error(error||'操作失败');
          }
        } 
      });
    }else{
      dispatch({
        type: 'user/fetchSetDomain',
        payload: {
          appId: appId,
          action:'add',
          doaminUrl:this.state.textAreaValue
        },
        callback:{
          success:()=>{
            message.success('操作成功');            
           },
          error:(error)=>{
            message.error(error||'操作失败');
          }
        }
      });
    }
    
  }  

  onChange = (e) => {    
    let value=this.refs.textArea.textAreaRef.value;
    this.setState({
      textAreaValue:value
    })
  }  
  handleWxa=()=>{
    const {user:{basicDetail:{data}},_this}=this.props;    
    if(data.StatusName=='待发布'){       
        this.props.dispatch({
          type: 'user/fetchRelease',
          payload: {
            appId: data.AppId,        
          },
          callback:{
            success:()=>{
              message.success('发布成功');
              this.requestData();         
             },
            error:(error)=>{
              message.error(error||'发布失败');
            }
          }
        });       
    }else if(data.StatusName=='待提审'||data.StatusName=='待升级'||data.StatusName=='发布'||data.StatusName=='已发布'||data.StatusName=='审核失败'){        
         this.props.dispatch({
          type: 'user/fetchTrial',
          payload: {
            appId: data.AppId, 
            wxasku:data.WxaSku        
          },
          callback:{
            success:()=>{
              message.success('提审成功'); 
              this.requestData();             
             },
            error:(error)=>{
              message.error(error||'提审失败');
            }
          }
        });       
    }else if(data.StatusName=='审核中'){
         this.props.dispatch({
          type: 'user/fetchWithdraw',
          payload: {
            appId: data.AppId                
          },
          callback:{
            success:()=>{
              message.success('撤回成功');
              this.requestData();              
             },
            error:(error)=>{
              message.error(error||'撤回失败');
            }
          }
        });
    } 
  }
  removeTester=(AppId,wxId)=>{ 
    const { dispatch, appId } = this.props;    
    this.props.dispatch({
      type: 'user/fetchUnbindTester',
      payload: {
        appId: AppId,
        wxId:wxId                
      },
      callback:{
        success:()=>{
          message.success('删除成功');
          dispatch({
            type: 'user/fetchGetTesters',
            payload: {
              appId:appId
            },
          });            
        },
        error:(error)=>{
          message.error(error||'删除失败');
        }
      }
    });
  }
  handleOpreation=(type)=>{
    const { appId, wxaSku, openId } = this.props;
    if(type==1){
      this.props.dispatch({
        type: 'user/fetchCommitCode',
        payload: {
          appId: appId,
          wxId:wxaSku,
          openAppId:openId               
        },
        callback:{
          success:()=>{
            message.success('上传成功');            
          },
          error:(error)=>{
            message.error(error||'上传失败');
          }
        }
      });
    }else if(type==2){
      this.props.dispatch({
          type: 'user/fetchTrial',
          payload: {
            appId: appId, 
            wxasku:wxaSku,
            openAppId:openId          
          },
          callback:{
            success:()=>{
              message.success('提审成功');            
             },
            error:(error)=>{
              message.error(error||'提审失败');
            }
          }
        });
      }else if(type==3){
        this.props.dispatch({
          type: 'user/fetchRelease',
          payload: {
            appId: appId,        
          },
          callback:{
            success:()=>{
              message.success('发布成功');            
             },
            error:(error)=>{
              message.error(error||'发布失败');
            }
          }
        });
      }else if(type==4){
        // this.props.dispatch({
        //   type: 'user/fetchRelease',
        //   payload: {
        //     appId: data.AppId,        
        //   },
        //   callback:{
        //     success:()=>{
        //       message.success('发布成功');            
        //      },
        //     error:(error)=>{
        //       message.error(error||'发布失败');
        //     }
        //   }
        // });
      }else if(type==5){
        // this.props.dispatch({
        //   type: 'user/fetchRelease',
        //   payload: {
        //     appId: data.AppId,        
        //   },
        //   callback:{
        //     success:()=>{
        //       message.success('发布成功');            
        //      },
        //     error:(error)=>{
        //       message.error(error||'发布失败');
        //     }
        //   }
        // });
      }else {
        this.props.dispatch(routerRedux.push('/wxaIndex/wxaManage'))
      }
  }
  render() {
    const {  loading,id,user:{basicDetail:{data},domainDetail,testers}, status, opreationStatus} = this.props;     
    const {  modalVisible } = this.state;     
    const list=[
    	{
    		id:1,
        AppId:'wwwwweeedf4',
    		avatar:"https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",    		
        AppName:'hhhh',
        WxId:'yhgg',
        UpdateDataTime:'2018'   		
    	}
    ];   
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };    
    return (
      <PageHeaderLayout title="小程序详情页">        
        <Card bodyStyle={{ padding: 0 }}>
           <Tabs
            size="large"
            tabBarStyle={{ marginBottom: 0,paddingLeft: 16 }}
            onChange={this.handleTabChange.bind(this)}
          >
            <TabPane tab={'基本信息'} key="1">
              <Card bordered={false}>
              <div className={styles.line}>小程序基本信息</div>
		          <DescriptionList size="large" title="" style={{ marginBottom: 32,paddingLeft:12 }}>
		            <Description term="所属公司" md={24} sm={24}>{data?data.PrincipalName:''}</Description>
		            <Description term="所属店铺" md={24} sm={24}>{data?data.StoreName:''}</Description>
		            <Description term="小程序名称" md={24} sm={24}>{data?data.NickName:''}</Description>
		            <Description term="服务范围" md={24} sm={24}>{data?data.CatesDesc:''}</Description>
		            <Description term="小程序简介" md={24} sm={24}>{data?data.CatesDesc:''}</Description>
		            <Description term="认证信息" md={24} sm={24}>{data&&data.VerifyType==0?"已认证":"未认证"}</Description>
		            <Description term="授权信息" md={24} sm={24}>{data&&data.AuthState==0?"未授权":"已授权"}</Description>		            	          
		            <Description term="温馨提示" md={24} sm={24}>
                  {
                    data&&data.VerifyType !=0?<div style={{width:250}}>{data.NickName}该小程序没有进行认证，授权信息已过期，代码提审失败</div>
                    :''
                  }
                   {
                    data&&data.StatusName =='提审失败'?<div>{data.NickName}小程序提审失败，失败原因：{data.errorMsg?data.errorMsg:''}</div>
                    :''
                  }
                </Description>
                <Description term="" md={24} sm={24} style={{position:'relative'}}>
                  <div style={{position:'absolute',left:'35%',bottom:70,width:200}}>
                    <img style={{width:'100%'}} src={data?data.QrCodeUrl:''} onError={this.handleImageErrored.bind(this)}/> 
                    <div style={{textAlign:'center'}}>
                      小程序正式版二维码
                    </div>                   
                  </div>
                  {
                    data&&data.StatusName !='已发布'?
                  (<div style={{position:'absolute',left:'65%',bottom:70,width:200}}>
                    <img style={{width:'100%'}} src={data?'https://pan.baidu.com/share/qrcode?w=300&h=300&url=https%3A%2F%2Fopen.weixin.qq.com%2Fsns%2Fgetexpappinfo%3Fappid%3D'+data.AppId+'%26iswxtpa%3D1%23wechat-redirect':''} onError={this.handleImageErrored.bind(this)}/>
                    <div style={{textAlign:'center'}}>
                      小程序体验版二维码
                    </div>
                  </div>):null
                  }                  
                </Description>
		          </DescriptionList>
		          <Divider style={{ marginBottom: 32 }} />
              <div className={styles.line}>版权信息</div>
		          <DescriptionList size="large" title="" style={{ marginBottom: 32,paddingLeft:12 }}>
		            <Description term="小程序APPID" md={24} sm={24}>{data?data.AppId:''}</Description>
		            <Description term="小程序版本号" md={24} sm={24}>{data?data.DebugVersion||data.ReleaseVersion:''}</Description>
		            <Description term="小程序状态" md={24} sm={24}>{data?data.StatusName:''}</Description>
		            <Description term="更新时间" md={24} sm={24}>{data?data.RequestTime.replace(/[T]+?/g," "):''}</Description>
		            <Description term="小程序关键词" md={24} sm={24}>{data?data.KeyTags:''}</Description>
		          </DescriptionList>
		          <Divider style={{ marginBottom: 32 }} />                
        	  </Card>
             <div className={styles.fixedBottom}>
              <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleWxa}>
                  {data?filter(data.StatusName):''}
              </Button>              
            </div>
            </TabPane>
            <TabPane tab={'服务器配置'} key="2">
              <Alert
                  message={
                    <Fragment>
                      服务器配置（一个月可以申请修改<a style={{ fontWeight: 600 }}>三</a> 次，请谨慎操作，尽量一次性修改）
                    </Fragment>
                  }
                  type="info"
                  showIcon
                  style={{margin:'0 20px',marginTop:20}}
                />              
              <Card bordered={false}>                
              <div className={styles.line}>当前小程序已配置的域名</div>
		          <DescriptionList size="large" title="" style={{ marginBottom: 32,paddingLeft:12 }}>
              {
                domainDetail.data&&domainDetail.data.requestdomain&&domainDetail.data.requestdomain.map((item,index)=>{
                  return (
                  <div key={index} md={24} sm={24} style={{marginBottom:15}}>
                  {index==0?<span md={2} sm={2}>request合法域名：</span>:<span md={2} sm={2} style={{width:117,height:20,display:'inline-block'}}></span>}
                  {item}
                  </div>);
                })	
              }	            	               
		          </DescriptionList>
		          <Divider style={{ marginBottom: 32 }} />
              <div className={styles.line}>小程序运行需要配置的域名</div>
		          <DescriptionList size="large" title="" style={{ marginBottom: 32,paddingLeft:12 }}>
		            <Description term="销客多小程序API" md={24} sm={24}>{domainDetail.data?domainDetail.data.xkdapi:''}</Description>
		            <Description term="云魔方拼团API" md={24} sm={24}>{domainDetail.data?domainDetail.data.pingtuanapi:''}</Description>
		            <Description term="云魔方秒杀API" md={24} sm={24}>{domainDetail.data?domainDetail.data.miaoshaapi:''}</Description>
		            <Description term="云魔方秒杀令牌" md={24} sm={24}>{domainDetail.data?domainDetail.data.tokenapi:''}</Description>		            
		          </DescriptionList>
		          <Divider style={{ marginBottom: 32 }} /> 
		          <div>
                <div style={{display:'inline-block',width:'80%'}}>
                  <span style={{float:"left",marginRight:20}}>新增域名组，每行一个域名:</span>
                  <TextArea
                      style={{ minHeight: 32,maxWidth:400 }}
                      placeholder="请输入域名"
                      rows={4} 
                      onChange={this.onChange} 
                      ref='textArea'                                          
                    />
                </div>
                <div style={{float:'right',width:'20%'}}>
                  <div>
                    <Button type="primary" style={{ marginLeft: 8 ,marginBottom:20}} onClick={this.handleResetAndAddRequest.bind(this,1)}>
                      覆盖服务器
                    </Button>
                  </div>
                  <div>
                    <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleResetAndAddRequest.bind(this,2)}>
                      新增服务器
                    </Button>
                  </div>
                </div>
              </div> 
        	  </Card> 
            <div className={styles.fixedBottom}>
              <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleOpreation.bind(this,1)}>
                  代码上传
              </Button>
              <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleOpreation.bind(this,2)}>
                  提交审核
              </Button>
              <Button type="primary" style={{ marginLeft: 8 }} onClick={this.handleOpreation.bind(this,3)}>
                  发布小程序
              </Button>              
              <Button type="default" style={{ marginLeft: 8 }} onClick={this.handleOpreation.bind(this,6)}>
                  返回
              </Button>
            </div>       	  
            </TabPane>
            <TabPane tab={'体验者管理'} key="3">
              	<div className={styles.cardList}>
                 <Alert
                  message={
                    <Fragment>
                      添加微信号直接绑定体验，最多可绑定40个体验者（包含管理员），还能绑定
                      <a style={{ fontWeight: 600 }}>{testers.data?(40-testers.data.length):40}</a> 个                                            
                    </Fragment>
                  }
                  type="info"
                  showIcon
                   style={{margin:'0 20px',marginTop:20}}
                />
                <div className={styles.line} style={{marginLeft:30,marginTop:10}}>体验者</div>
                {
		            testers.data&&testers.data.map((item,index)=>{
                  return(
                    <Card hoverable className={styles.card} key={index}>
                        <Card.Meta
                          avatar={''}
                          title={<a href="#">{item.AppName}</a>}
                          description={
                            <Ellipsis className={styles.item} lines={3}>
                              <div>{item.WxId}</div>
                              绑定时间：
                              {item.UpdateDataTime.replace(/[T]+?/g,' ')}                              
                            </Ellipsis>
                          }
                        />
                        <Icon type="close-circle" style={{position:'absolute',right:0,top:0,fontSize:24}} onClick={this.removeTester.bind(this,item.AppId,item.WxId)}/>
                    </Card>
                  )
                })
              }              
                <Button type="dashed" className={styles.newButton} onClick={() => this.handleModalVisible(true)}>
                  <Icon type="plus" /> 新增体验者
                </Button>              
		        </div> 
            </TabPane>
          </Tabs>
        </Card>
        <CreateForm {...parentMethods} _this={this}  modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}
