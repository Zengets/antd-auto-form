import React, { useRef, useState, useMemo } from 'react';
import ProTable from '@ant-design/pro-table';
import request from 'umi-request';

let AutoTable = ({
  x, y,
  dataSource,
  defaultPageSize,
  dispatch, //dispatch
  pagination, //分页
  columns, //表头
  rowKey, //行key
  savekey, //保存查询条件key
  actionRef, //操作ref
  formRef, //查询表单ref
  path, //路径
  extraparams = {}, //拓展查询参数
  rowSelection, //行选择
  tableRender, //表格布局自定义
  getDefaultSelected, //获取默认选中的数据
  rowClassNameFn, //选中后行样式
  showQuickJumper //false字符串 不显示
}) => {
  let defaultsize = localStorage.getItem("size");//设置缓存
  let [total, ct] = useState(100), [size, onSizeChange] = useState(defaultsize ? defaultsize : "small");
  const actionRefs = useRef(), formRefs = useRef();


  //父组件传参改变reload
  useMemo(() => {
    actionRefs.current && actionRefs.current.reload();
  }, [extraparams])

  let scroll = {};
  if (y) {
    scroll = {
      ...scroll,
      y
    }
  }
  if (x) {
    scroll = {
      ...scroll,
      x
    }
  }

  let tabledataProps = dataSource && Array.isArray(dataSource) ?
    {
      dataSource,
      pagination: {
        showTotal: (total, range) => <span>共{total}条</span>,
        showQuickJumper: false,
        pageSize: defaultPageSize ? defaultPageSize : 15,
        pageSizeOptions: [10, 15, 30, 50, 100, 200],
        total: dataSource.length
      },
      search: {
        filterType: 'light',//轻量模式
      },
      toolBarRender: false
    }
    :
    {
      request: async (params = {}) => {
        //表格数据获取 只需要传入url自动获得数据
        if (!path) {
          return
        }
        //设置token
        let token = localStorage.getItem("TOKEN") ? localStorage.getItem("TOKEN") : "b60ef0c40b7f1b7e63c2b24b127988d4";
        let headers = {
          'Content-Type': 'application/json',
          'token': token ? token : '',
        };
        //处理传参 extraparams为除列筛选外的自定义传参
        let newparams = {
          ...params,
          ...extraparams,//父组件传参
          pageIndex: params.current,
        }
        delete newparams.current;
        if (pagination == "false") {
          delete newparams.pageIndex;
          delete newparams.pageSize;
        }
        return request(path, {
          body: JSON.stringify(newparams ? newparams : {}),
          headers,
          method: 'POST',
        })
      },
      pagination: {
        showQuickJumper: !showQuickJumper?true:false,
        pageSize: 15,
        pageSizeOptions: [10, 15, 30, 50, 100, 200],
        total
      },
      search: {
        filterType: 'light',//轻量模式
      }
    }




  return (
    <ProTable
      size={size}
      onSizeChange={(size) => {
        localStorage.setItem("size", size);//设置全局表格规格缓存
        onSizeChange(size)
      }}
      columns={columns.map((it) => {
        //表格每行文字超出后...
        if (it.ellipsis) {
        } else {
          it.ellipsis = true;
        }
        return it
      })}
      scroll={scroll}
      actionRef={actionRef ? actionRef : actionRefs}
      formRef={formRef ? formRef : formRefs}
      rowKey={rowKey ? rowKey : "id"} //表格每行数据的key
      dateFormatter="string"
      postData={(data) => {
        if (data.page) {
          ct(data.page.total)
        } else {
          ct(data.dataList.length)
        }
        //分页or不分页获取数据
        getDefaultSelected && getDefaultSelected(data);//存在默认选中向上返回选中值
        let defaultval = pagination == "false" ? data.dataList : data.page ? data.page.list : [];//分页或不分页的接口返回数据
        return defaultval
      }}
      rowSelection={rowSelection ? rowSelection : false}
      tableAlertRender={false} //取消顶部筛选操作
      tableRender={tableRender ? (_, dom) => tableRender(_, dom) : (_, dom) => dom} //自定义表格主体
      rowClassName={rowClassNameFn ? (record, index) => rowClassNameFn(record, index) : ""} //自定义行高亮
      {...tabledataProps}
    />
  );
};


export default AutoTable