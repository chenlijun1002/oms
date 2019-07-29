import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './version.less';
import {
 Card,
 Row,
 Col,
 Button
} from 'antd';
import { routerRedux } from 'dva/router';

@connect(({version, loading}) => ({
  version,
  loading: loading.effects['version/getxcxversion'],
}))
export default class Description extends Component {
  componentDidMount(){
    const { version, wxaSku } = this.props.version.currentXcx;   
    this.props.dispatch({
      type: 'version/getxcxversion',
      payload: { version, wxaSku},
    });
  }
  handleGoBack() {
    this.props.dispatch(routerRedux.push('/wxaIndex/versionManage'))
  }
  render() {
    let {
      TotalModified,
      TotalSubmit,
      TotalFailt,
      TotalNoSubmit,
      UpdateNumber,
      VersionName,
      Version,
      ModifiedTime,
      VersionDesc
    }=this.props.version.versionDetails;
    ModifiedTime = ModifiedTime ? ModifiedTime.replace('T', ' ') : '';
    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );
    return (
      <div>
        <Card loading={this.props.loading} bordered={false}>
            <Row>
              <Col sm={6} xs={24}>
                <Info title="已更新" value={TotalModified} bordered />
              </Col>
              <Col sm={6} xs={24}>
                <Info title="已提审" value={TotalSubmit} bordered />
              </Col>
              <Col sm={6} xs={24}>
                <Info title="提审失败" value={TotalFailt} bordered />
              </Col>
              <Col sm={6} xs={24}>
                <Info title="未提审" value={TotalNoSubmit} />
              </Col>
            </Row>
          </Card>
          <div className={styles.versionDetails}>
            <Row>
              <Col sm={3} xs={24}>
              <p>版本序号：</p>
              </Col>
              <Col sm={21} xs={24}>
              {UpdateNumber}
              </Col>
            </Row>
            <Row>
              <Col sm={3} xs={24}>
              <p>小程序类型：</p>
              </Col>
              <Col sm={21} xs={24}>{VersionName}</Col>
            </Row>
            <Row>
              <Col sm={3} xs={24}>
              <p>业务版本号：</p>
              </Col>
              <Col sm={21} xs={24}>
              {Version}
              </Col>
            </Row>
            <Row>
              <Col sm={3} xs={24}>
              <p>发布时间：</p>
              </Col>
              <Col sm={21} xs={24}>
              {ModifiedTime}
              </Col>
            </Row>
            <Row>
              <Col sm={3} xs={24}>
              <p>版本描述：</p>
              </Col>
              <Col sm={10} xs={24}>
              {VersionDesc}
              </Col>
            </Row>
            <Row>
              <Col sm={3} xs={24}>
              </Col>
              <Col sm={10} xs={24}>
              <Button type="primary" onClick={this.handleGoBack.bind(this)}>返回</Button>
              </Col>
            </Row>
          </div>
      </div>
    );
  }
}