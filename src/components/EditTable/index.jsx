import { Table, Input, Divider, Tooltip, InputNumber, Select } from 'antd';
import React, { useState, useMemo, useEffect } from 'react';
import AutoTable from '../AutoTable/index.jsx';
import { Scrollbars } from 'react-custom-scrollbars';
import { CloseOutlined } from '@ant-design/icons'
import styles from './index.less';


function unique(arr, key) {
  var hash = [];
  for (var i = 0; i < arr.length; i++) {
    let hashlist = hash.length > 0 ? hash.map(it => it[key]) : [];
    if (arr[i] && hashlist.indexOf(arr[i][key]) == -1) {
      hash.push(arr[i]);
    }
  }
  return hash;
}


export default function EditTable({ value, onChange, pagination, columns, extraparams, path, editable, rowKey, rowName }) {
  let [first, cf] = useState(true), [currentkey, changecur] = useState(), newcolumns = columns, [expandedRows, cexpand] = useState([]);

  if (editable) {
    function getval(item, record) {
      let { dataIndex } = item,//修改字段的key
        hasval = value && value.length > 0 ? value.filter(it => it[rowKey] == record[rowKey]) : [];//value中是否存在id为当前的值
      if (hasval.length == 0) {//不存在
        return record[dataIndex]
      } else {//存在
        return hasval[0][dataIndex]
      }
    }
    newcolumns = columns.map((item, i) => {
      let idlist = value ? value.map(it => it[rowKey]) : [];
      //编辑逻辑
      if (item.selectedRender == "InputNumber") {
        let render = (_, record) => {
          if (idlist.indexOf(record[rowKey]) == -1) {
            return <span>{getval(item, record)}</span>
          } else {
            return <InputNumber value={getval(item, record)} onChange={(val) => {
              let newvalue = value.map((it) => {
                if (it[rowKey] == record[rowKey]) {
                  it[item.dataIndex] = val
                }
                return it
              })
              onChange(newvalue);
            }}></InputNumber>
          }
        }
        item.render = render;
      } else if (item.selectedRender == "Select") {
        let render = (_, record) => {
          if (idlist.indexOf(record[rowKey]) == -1) {
            return <span>{getval(item, record)}</span>
          } else {
            return <Select value={getval(item, record)} onChange={(val) => {
              let newvalue = value.map((it) => {
                if (it[rowKey] == record[rowKey]) {
                  it[item.dataIndex] = val
                }
                return it
              })
              onChange(newvalue);
            }}>
            </Select>
          }
        }
        item.render = render;
      } else if (item.selectedRender == "Input") {
        let render = (_, record) => {
          if (idlist.indexOf(record[rowKey]) == -1) {
            return <span>{getval(item, record)}</span>
          } else {
            return <Input value={getval(item, record)} onChange={(e) => {
              let val = e.target.value;
              let newvalue = value.map((it) => {
                if (it[rowKey] == record[rowKey]) {
                  it[item.dataIndex] = val
                }
                return it
              })
              onChange(newvalue);
            }}></Input>
          }
        }
        item.render = render;
      }


      return item

    })
  }


  useMemo(() => {

  }, [value])

  return (
    editable ?
      <div style={{ border: '#ddd solid 1px' }} className="fatable">
        <AutoTable
          showQuickJumper="false"
          rowKey={rowKey}
          columns={columns}
          pagination={pagination}
          extraparams={extraparams}
          getDefaultSelected={(data) => {
            //查询时的初始化
            if (data.selectedList && data.selectedList.length > 0 && first) {
              onChange(data.selectedList);//设置value
              cf(false);
            }
          }}
          path={path}
          rowSelection={{
            selectedRowKeys: value ? value.map(it => it[rowKey]) : [],
            preserveSelectedRowKeys: true,
            onChange: (selectedRowKeys, expandedRowes) => {
              let limits = unique([...expandedRows, ...expandedRowes], rowKey), expander = [];
              expander = selectedRowKeys.map((it) => {
                return limits.filter(item => item[rowKey] == it)[0]
              })
              onChange(expander);
            }
          }}
          tableRender={(_, dom) => <div
            style={{
              display: 'flex',
              width: '100%',
              overflow: "hidden"
            }}
          >
            <div
              style={{
                flex: 1,
              }}
            >
              {dom}
            </div>
            {
              value?.length > 0 && <div style={{ width: 120, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "11px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 16 }}>选中：</span>
                  <span style={{ fontSize: 16 }}>{value?.length}个</span>
                </div>
                <div style={{ flex: 1, paddingBottom: 18 }}>
                  <Scrollbars
                    thumbMinSize={10}
                    autoHide
                    style={{ width: '100%', height: '100%' }}
                    hideTracksWhenNotNeeded={true}
                  >
                    {
                      value.map((it) => {
                        return <div className={styles.items} onClick={() => {
                          changecur(it[rowKey])
                        }}>
                          <Tooltip title={it[rowName] ? it[rowName] : ""}>
                            <i>{it[rowName] ? it[rowName] : ""}</i>
                          </Tooltip>

                          <CloseOutlined onClick={(e) => {
                            e.stopPropagation();
                            if (it[rowKey] == currentkey) {
                              changecur(null)
                            }
                            let newexpandedRows = value.filter(its => its[rowKey] != it[rowKey]);
                            onChange(newexpandedRows);
                          }} />
                        </div>
                      })

                    }
                  </Scrollbars>

                </div>
              </div>
            }

          </div>
          }
          rowClassNameFn={(record, index) => {
            if (currentkey === record[rowKey]) {
              return "selectedRow";
            }
            return null;
          }}
        >
        </AutoTable>

      </div>
      :
      <div style={{ border: '#ddd solid 1px' }} className="fatable">
        <AutoTable
          showQuickJumper="false"
          rowKey={rowKey}
          columns={columns}
          pagination={pagination}
          extraparams={extraparams}
          getDefaultSelected={(data) => {
            //查询时的初始化
            if (data.selectedList && data.selectedList.length > 0 && first) {
              onChange(data.selectedList.map((it) => it[rowKey]));
              cexpand([...expandedRows, ...data.selectedList]);
              cf(false);
            }
          }}
          path={path}
          rowSelection={{
            selectedRowKeys: value ? value : [],
            preserveSelectedRowKeys: true,
            onChange: (selectedRowKeys, expandedRowes) => {
              onChange(selectedRowKeys);
              let limits = unique([...expandedRows, ...expandedRowes], rowKey), expander = [];
              expander = selectedRowKeys.map((it) => {
                return limits.filter(item => item[rowKey] == it)[0]
              })
              cexpand(expander);
            }
          }}
          tableRender={(_, dom) => <div
            style={{
              display: 'flex',
              width: '100%',
              overflow: "hidden"
            }}
          >
            <div
              style={{
                flex: 1,
              }}
            >
              {dom}
            </div>
            {
              value?.length > 0 && <div style={{ width: 120, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "11px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 16 }}>选中：</span>
                  <span style={{ fontSize: 16 }}>{value?.length}个</span>
                </div>
                <div style={{ flex: 1, paddingBottom: 18 }}>
                  <Scrollbars
                    thumbMinSize={10}
                    autoHide
                    style={{ width: '100%', height: '100%' }}
                    hideTracksWhenNotNeeded={true}
                  >
                    {
                      expandedRows.map((it) => {
                        return <div className={styles.items} onClick={() => {
                          changecur(it[rowKey])
                        }}>
                          <Tooltip title={it[rowName] ? it[rowName] : ""}>
                            <i>{it[rowName] ? it[rowName] : ""}</i>
                          </Tooltip>

                          <CloseOutlined onClick={(e) => {
                            e.stopPropagation();
                            if (it[rowKey] == currentkey) {
                              changecur(null)
                            }
                            let newvalues = value.filter(item => item != it[rowKey]);
                            onChange(newvalues);
                            let newexpandedRows = expandedRows.filter(its => its[rowKey] != it[rowKey])
                            cexpand(newexpandedRows);
                          }} />
                        </div>
                      })

                    }
                  </Scrollbars>

                </div>
              </div>
            }

          </div>
          }
          rowClassNameFn={(record, index) => {
            if (currentkey === record[rowKey]) {
              return "selectedRow";
            }
            return null;
          }}
        >
        </AutoTable>
      </div>
  );
}
