import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  Table,
  InputNumber,
  Modal,
  message, 
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

import styles from './Articles.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const CreateForm = (props => {
  const { modalVisible, selectedRows,dispatch, handleAdd, handleModalVisible,_this } = props;
  const okHandle = () => {    
    let xkdAppId='',agentoaAppId='';
    selectedRows.forEach(function(item){
      if(item.WxaSku=='xkd'){
         xkdAppId+=item.AppId+",";
      }else{
        agentoaAppId+=item.AppId+",";
      }    
    })
    if(xkdAppId) xkdAppId=xkdAppId.substr(0,xkdAppId.lastIndexOf(","));
    if(agentoaAppId) agentoaAppId=agentoaAppId.substr(0,agentoaAppId.lastIndexOf(","));     
     dispatch({
      type: 'user/fetchBatchRelease',
      payload: {
        xkdAppIds: xkdAppId,
        agentAppIds:agentoaAppId
      },
      callback:{
        success:()=>{
           _this.setState({
              modalVisible: false,
            });
          message.success('发布成功');
        },
        error:(error)=>message.error(error||'发布失败')
      }      
    });
  };
  return (
    <Modal
      title="批量发布"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      确认是否批量发布？
    </Modal>
  );
});

@connect(({ user, loading }) => ({
  user, 
  loading: loading.effects['user/fetchListOne'],
}))

export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    selectedRowKeys: [],   
  };
  componentDidMount() {
    
    
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {    
     const { dispatch, params,form} = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);     
      return newObj;
    }, {});
    const searchParam=form.getFieldsValue(); 
    for(var key in searchParam){
        if(searchParam[key]===undefined){
          searchParam[key]='';
        }
      }   
    const param = {
      ...searchParam,
      wxaSku:params.wxaSku
    }; 
    param.pageIndex=pagination.current,
    param.pageSize=pagination.pageSize,    
    this.props.dispatch({
      type: 'user/fetchListOne',
      payload:{
        ...param
      }      
    });
  };    
  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {    
    this.setState({
      selectedRows: rows,     
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    if(this.state.selectedRows.length<=0){
      message.warning('请选择小程序');      
      return;
    }
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  };

  render() {    
    const { user:{listOne}, loading,columns,dispatch } = this.props;    
    const { selectedRows, modalVisible } = this.state;   
    if(listOne.list){      
       for(let i=0;i<listOne.list.length;i++){
       listOne.list[i].key=i;
       if(listOne.list[i].StatusName=='已发布'){
          listOne.list[i].disabled=true;
       }else{
          listOne.list[i].disabled=false;
       }
     }
    }

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <div id='wxaList'>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button  type="primary" onClick={() => this.handleModalVisible(true)}>
                批量发布
              </Button>             
            </div>                          
            <StandardTable 
                selectedRows={selectedRows}               
                loading={loading}
                data={listOne}
                columns={columns}  
                onSelectRow={this.handleSelectRows}              
                onChange={this.handleStandardTableChange}
              />                      
          </div>
        </Card>
        <CreateForm {...parentMethods} _this={this} dispatch={dispatch} modalVisible={modalVisible} selectedRows={selectedRows}/>
      </div>
    );
  }
}
