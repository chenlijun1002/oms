import React, { Component, Fragment } from 'react';
import { Link } from 'dva/router';
import { connect } from 'dva';
import { Row, Col, Icon, Card, Button } from 'antd';
import NumberInfo from 'components/NumberInfo';
import { getTimeDistance } from '../../../utils/utils';
import{getCookie, setCookie} from '../../../utils/authority';
//import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './Analysis.less';
@connect(({ user, loading }) => ({
  user,
  loading: loading.effects['user/fetchAnalysis'],
}))
export default class Analysis extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchAnalysis',
    });
    // this.props.dispatch({
    //     type: 'login/logout',
    //   });
  }
  render() {   
    const { user, loading } = this.props;
    return (
      <Fragment>
        <Row gutter={24}>
          <Col md={8} sm={12} xs={24}>
            <Link to="/wxaIndex/versionManage/publish">
              <Button type="primary">
                <Icon type="edit" />发布新版本
              </Button>
            </Link>
          </Col>
        </Row>
        <Row gutter={24}>
          {user.wxaAnalysis&&user.wxaAnalysis.map((item, index) => {
            return (
              <Col xl={12} lg={24} md={24} sm={24} xs={24} key={index}>
                <Card
                  loading={loading}
                  bordered={false}
                  title={item.VersionName + ' V' + item.Version}
                  style={{ marginTop: 24 }}
                >
                  <Row>
                    <Col md={8} sm={12} xs={24}>
                      <NumberInfo subTitle="已更新" total={item.TotalModified} />
                    </Col>
                    <Col md={8} sm={12} xs={24}>
                      <NumberInfo subTitle="审核中" total={item.TotalSubmit} />
                    </Col>
                    <Col md={8} sm={12} xs={24}>
                      <NumberInfo subTitle="提审失败" total={item.TotalFailt} />
                    </Col>
                  </Row>
                </Card>
                <div className={styles.cardBottom}>
                  <p className={styles.pullLeft}>发布时间：{item.ModifiedTime.replace(/[T]+?/g,' ')}</p>
                  <Link to="/wxaIndex/versionManage">
                    <p className={styles.pullRight}>
                      <Icon type="arrow-right" className={styles.anticon} />
                    </p>
                  </Link>
                </div>
              </Col>
            );
          })}
        </Row>
      </Fragment>
    );
  }
}
