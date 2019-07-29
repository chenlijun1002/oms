import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './version.less';
import { Button, Tabs, Table, Card, Icon } from 'antd';
const TabPane = Tabs.TabPane;

@connect(({ version, loading }) => ({
  version,
  loading: loading.effects['version/fetch'],
}))
export default class VersionManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTabKey: '0',
      type:0
    }
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'version/fetch',
      payload: { wxaSku: null, pageSize: 10, pageIndex: 1 },
    });
    this.props.dispatch({
      type: 'version/queryVersiontotal'
    });
  }
  handleReleaseNew() {
    this.props.dispatch(routerRedux.push('/wxaIndex/versionManage/publish'));
  }
  handleGoDetail(record) {
    const { version, wxaType } = record;
    this.props.dispatch({
      type: 'version/saveCurrentXcx',
      payload: {version, wxaSku: wxaType}
    })
    this.props.dispatch(routerRedux.push('/wxaIndex/versionManage/Description'));
  }
  handleTabChange(key) {
    if(key === this.state.currentTabKey) return;
    this.setState({ currentTabKey: key });
    key = +key;
    const list = [null, 'xkd', 'agentoa'];
    this.props.dispatch({
      type: 'version/fetch',
      payload: { wxaSku: list[key], pageSize: 10, pageIndex: 1 },
    });
  }
  render() {
    const { xcxVersion, xcxTotals } = this.props.version;
    const dataSource = xcxVersion.map((item, index) => {
      return {
        wxaType: item.WxaSku,
        key: `${index}`,
        type: item.VersionName,
        version: item.Version,
        description: item.VersionDesc,
        updated: `${item.TotalModified}/${item.TotalSubmit}`,
        failed: item.TotalFailt,
        unsubmit: item.TotalNoSubmit,
        time: item.ModifiedTime.replace('T', ' '),
      }
    })
    const columns = [
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
      },
      {
        title: '版本号',
        dataIndex: 'version',
        key: 'version',
      },
      {
        title: '更新描述',
        dataIndex: 'description',
        key: 'description',
        render: text => <div className={styles.description}>{text||'--'}</div>,
      },
      {
        title: '已更新/提审',
        dataIndex: 'updated',
        key: 'updated',
        align: 'right',
        render: text => <span>{text}</span>,
      },
      {
        title: '提审失败',
        dataIndex: 'failed',
        key: 'failed',
        align: 'right',
      },
      {
        title: '未提审',
        dataIndex: 'unsubmit',
        key: 'unsubmit',
        align: 'right',
      },
      {
        title: '更新时间',
        dataIndex: 'time',
        key: 'time',
      },
      {
        title: '',
        key: 'action',
        render: (text, record) => (
          <span>
            <a href="javascript:;" onClick={() => this.handleGoDetail(record)}>详情</a>
          </span>
        ),
      },
    ];
    return (
      <div className={styles.versionManage}>
        <div style={{marginBottom: 20}}>
          <Button type='primary' onClick={this.handleReleaseNew.bind(this)}><Icon type="edit" />发布新版本</Button>
        </div>
        <Card bodyStyle={{ padding: 0 }}>
          <Tabs tabBarStyle={{ marginBottom: 0,paddingLeft: 16 }} defaultActiveKey={this.state.currentTabKey} onChange={key => this.handleTabChange(key)}>
            <TabPane tab={<span>所有版本{<span className={this.state.type==0?'':`${styles['unActive']}`} style={{fontSize:14}}>（{xcxTotals.total || 0}）</span>}</span>} key="0">
              <Card bordered={false}>
                <Table loading={this.props.loading} columns={columns} dataSource={dataSource} />
              </Card>
            </TabPane>
            <TabPane tab={<span>销客多商城{<span className={this.state.type==1?'':`${styles['unActive']}`} style={{fontSize:14}}>（{xcxTotals.xkd || 0}）</span>}</span>} key="1">
              <Card bordered={false}>
                <Table loading={this.props.loading} columns={columns} dataSource={dataSource} />
              </Card>              
            </TabPane>
            <TabPane tab={<span>代理商OA{<span className={this.state.type==2?'':`${styles['unActive']}`} style={{fontSize:14}}>（{xcxTotals.agentoa || 0}）</span>}</span>} key="2">
              <Card bordered={false}>
                <Table loading={this.props.loading} columns={columns} dataSource={dataSource} />
              </Card>              
            </TabPane>
          </Tabs>
        </Card>
      </div>
    );
  }
}
