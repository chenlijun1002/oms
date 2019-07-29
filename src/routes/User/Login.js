import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon, message } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';
import request from '../../utils/request';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    values.grant_type='password'; 
    var s = [];
 for(var key in values){
    s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( values[key] );  
 }
 s=s.join( "&" ).replace( /%20/g, "+" );  
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: values,
        callback:{
          success:()=>{
            //dispatch(routerRedux.push('/wxaIndex/analysis'));
          },
          error:(error)=>{
            message.error(error);
          }
        }
      });       
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          {login.status === 'error' &&
              login.type === 'account' &&
              !login.submitting &&
              this.renderMessage('账户或密码错误')}
            <UserName name="username" placeholder="请输入账号" />
            <Password name="password" placeholder="请输入密码" />          
            <Submit loading={submitting}>登录</Submit>          
        </Login>
      </div>
    );
  }
}
