import React, { Component } from 'react';
import { routerRedux } from 'dva/router';
import styles from './version.less';
import { Form, Input, Row, Col, Button, message } from 'antd';
import { connect } from 'dva';
import { autoVersion } from '../../../services/api';
const FormItem = Form.Item;

@connect(({ version, loading }) => ({
  version,
  submitting: loading.effects['version/publishVersion']
}))
@Form.create()
export default class PublishVersion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'xkd',
    }
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'version/queryLastumber',
      payload: {wxaSku: this.state.type}
    })
  }
  handleSelectType(type) {
    if(this.state.type === type) return;
    this.setState({ type });
    this.props.dispatch({
      type: 'version/queryLastumber',
      payload: {wxaSku: type}
    })
  }
  handleGoBack() {
    this.props.dispatch(routerRedux.push('/wxaIndex/versionManage'))
  }
  handleSubmit(e) {
    const { publishVersionInfo: {versionSerialNo} } = this.props.version;
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(versionSerialNo === undefined || versionSerialNo === null) return message.error('小程序版本序列号不能为空！');
        const queryData = {
          ...values,
          versionSerialNo,
          wxaSku: this.state.type
        }
        this.props.dispatch({
          type: 'version/publishVersion',
          payload: queryData,
          callback:{
            success:()=>{
              message.success('发布成功');
                this.props.dispatch(routerRedux.push('/wxaIndex/versionManage'))
            },
            error:(error)=>{
              message.error(error||'发布失败')
            }
          }
        });
      }
    });
  }
  handleAutoVersion() {
    autoVersion({wxaSku: this.state.type}).then(res => {
      if(res.code === 0) {
        message.success('提审发布成功！');
      }else {
        message.error('提审发布失败！');
      }
    })
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { type } = this.state;
    const { publishVersionInfo } = this.props.version;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 17 },
    };
    return (
      <div className={styles['version-content']}>
        <div className={styles.header}>
          <span style={{fontSize:16,color:'#262626'}}>发布新版本</span>
          <span style={{cursor: 'pointer',color:'#595959',fontSize:16}} onClick={this.handleGoBack.bind(this)}>历史版本>></span>
        </div>
        <Form onSubmit={this.handleSubmit.bind(this)} style={{ marginTop: 30,marginBottom:30 }}>
          <FormItem {...formItemLayout} label="版本序列号:">
            <span className="ant-form-text">{publishVersionInfo.versionSerialNo}</span>
          </FormItem>
          <FormItem {...formItemLayout} label="小程序类型">
            <span className={type === 'xkd' ? `${styles['xcx-type']} ${styles['xcx-type-active']}` : styles['xcx-type']} onClick={() => this.handleSelectType('xkd')}>销客多</span>
            <span className={type === 'agentoa' ? `${styles['xcx-type']} ${styles['xcx-type-active']}` : styles['xcx-type']} onClick={() => this.handleSelectType('agentoa')}>代理商OA</span>
          </FormItem>
          <FormItem {...formItemLayout} label="版本号:">
            {
              getFieldDecorator('versionNumber', {
                rules: [
                  {
                    required: true,
                    message: '请输入版本号',
                  },
                ],
              })(<Input style={{ width: 300 }} placeholder="版本号" />)
            }
            <span className="ant-form-text" style={{ marginLeft: 10 }}>
            {
              publishVersionInfo.versionNumber ?
              `上个版本号：${publishVersionInfo.versionNumber}`
              :
              ''
            }
            </span>
          </FormItem>
          <FormItem {...formItemLayout} label="开放平台模板ID:">
            {
              getFieldDecorator('tempId', {
                rules: [
                  {
                    required: true,
                    message: '请输入开放平台模板ID',
                  },
                ],
              })(<Input style={{ width: 300 }} placeholder="开放平台模板ID" />)
            }
          </FormItem>
          <FormItem {...formItemLayout} label="版本描述:">
            {
              getFieldDecorator('versionDesc')(<Input.TextArea style={{ width: 500, height: 300 }} />)
            }
          </FormItem>
          <Row>
            <Col span={3} />
            <Col span={17}>
              <Button type="primary" htmlType="submit" loading={this.props.submitting}>发布版本</Button>
              <Button style={{marginLeft: 8}}  onClick={this.handleAutoVersion.bind(this)}>提审发布</Button>
            </Col>
          </Row>
          <Row>
            <Col span={3} />
            <Col span={17} style={{fontSize:12,marginTop:8,color:'#bfbfbf',lineHeight:'20px'}}>发布版本后，授权有效的小程序将同步更新</Col>
          </Row>
        </Form>
      </div>
    );
  }
}
