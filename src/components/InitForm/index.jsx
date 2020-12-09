import {
  Form,
  Input,
  DatePicker,
  Select,
  Row,
  Col,
  InputNumber,
  Upload,
  message,
  Radio,
  TreeSelect,
  Button,
  AutoComplete,
  Drawer
} from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { PlusOutlined } from "@ant-design/icons"
import EditTable from '../EditTable/index.jsx';
import Editor from '../Editor/index.jsx';

const { TreeNode } = TreeSelect;
let { Option } = Select;

let InitForm = ({ fields, onChange, submitting, submitData, actions, col }) => {
  let [Dom, cDom] = useState([]),
    [cururl, setcururl] = useState(""),
    [loading, sload] = useState(false),
    [rerender, srerender] = useState(true);
  const [form] = Form.useForm(), [filelist, cfilelist] = useState({}), [link, clink] = useState({}), [belink, cbelink] = useState({});
  const [visible, setVisible] = useState(false), [optiondom, cdom] = useState({});


  useEffect(() => {
    srerender(false);
    let Doms = [], klink = {}, belinked = {}, defaultfiles = {};
    for (let i in fields) {
      Doms.push(fields[i]);
      //获取linked key
      if (fields[i].linked === true) {
        klink[i] = fields[i].value;
      }
      //获取belinked key
      if (fields[i].belinked) {
        belinked[i] = fields[i].belinked;
      }
      //初始化filelist
      if (fields[i].type === "upload") {
        let item = fields[i],
          curfileList = item.value ? item.value.fileList ? item.value.fileList : item.value : [];
        defaultfiles[i] = curfileList
      }
    }
    clink(klink);
    cbelink(belinked);
    cfilelist(defaultfiles);
    setTimeout(() => {
      srerender(true);
    }, 1);
    cDom(Doms);
  }, [fields]);


  useEffect(() => {
    //联动数据
    for (let i in fields) {
      let extraprops = getSelectLinked(fields[i]);
      let { options } = extraprops;
      getOptions(options, fields[i]);
    }
  }, [link])


  const getCol = (itemcol) => {
    if (itemcol) {
      return itemcol;
    } else {
      return col ? col : { xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 };
    }
  };

  //表格 联动声明
  const getTableLinked = (item) => {
    let extraparams = {}, oldparams = item.extraparams;
    if (oldparams && Object.keys(oldparams).length > 0) {
      for (let i in oldparams) {
        if (oldparams[i] == "linked") {
          extraparams = {
            ...extraparams,
            [i]: link[i] //获取联动数据
          }
        } else {
          extraparams = {
            ...extraparams,
            [i]: oldparams[i] //获取props传入数据
          }
        }
      }
    }
    return extraparams;
  }

  //   [
  //     { //联动隐藏条件 equalvalue 与 unequalvalue 只能存在1个
  //         name:"isOriginal",
  //         unequalvalue:"1,4",
  //         required:true  
  //     },
  //     {
  //         name:"releaseTitle",
  //         equalvalue:"",
  //         required:true
  //     }
  //  ],


  //下拉框联动声明
  const getSelectLinked = (item) => {
    let names = item.belinked && Object.keys(item.belinked),
      linknames = link && Object.keys(link),
      hides = item.hides,
      options = item.options;

    if (names && names.length > 0) {
      if (item.belinked.hides && item.belinked.hides.length > 0) {
        let requiredlist = item.belinked.hides.filter(it => {
          return it.required
        }).map(it => {
          if (it.equalvalue) {
            let equalvalue = it.equalvalue && Array.isArray(it.equalvalue) && it.equalvalue.length > 0 ? it.equalvalue.indexOf(link[it.name]) != -1 : link[it.name] == it.equalvalue;
            return equalvalue
          } else if (it.unequalvalue) {
            let unequalvalue = it.unequalvalue && Array.isArray(it.unequalvalue) && it.unequalvalue.length > 0 ? it.unequalvalue.indexOf(link[it.name]) == -1 : link[it.name] != it.unequalvalue;
            return unequalvalue
          } else {
            return true
          }
        });

        let unrequiredlist = item.belinked.hides.filter(it => {
          return !it.required
        }).map(it => {
          if (it.equalvalue) {
            let equalvalue = it.equalvalue && Array.isArray(it.equalvalue) && it.equalvalue.length > 0 ? it.equalvalue.indexOf(link[it.name]) != -1 : link[it.name] == it.equalvalue;
            return equalvalue
          } else if (it.unequalvalue) {
            let unequalvalue = it.unequalvalue && Array.isArray(it.unequalvalue) && it.unequalvalue.length > 0 ? it.unequalvalue.indexOf(link[it.name]) == -1 : link[it.name] != it.unequalvalue;
            return unequalvalue
          } else {
            return true
          }
        });
        let rq = requiredlist.some(it => it == true);
        let unrq = unrequiredlist.some(it => it == true);
        hides = rq || unrq;
      }

      if (!Array.isArray(item.belinked.options) && item.belinked.options) {
        let { database, params } = item.belinked.options, newparams = {};
        //获取传参联动的值 
        for (let i in params) {
          if (params[i] == "linked") {
            newparams[i] = link[i]
          } else {
            newparams[i] = params[i]
          }
        }
        if (Array.isArray(database)) {
          options = database;
        } else {
          options = {
            database,
            params: newparams
          }
        }
      }
    }
    return {
      hides,
      options,
    }
  }



  let loop = (data) => (data && data.length > 0) && data.map(item => {
    const title = <span>{item.title}</span>;
    if (item.children) {
      return (
        <TreeNode value={item.key} key={item.key} title={title}>
          {loop(item.children)}
        </TreeNode>
      );
    } else {
      return <TreeNode value={item.key} key={item.key} title={title} />;
    }
  });

  function formartSubmit(values) {
    let newvalue = { ...values };
    for (let i in fields) {
      if (fields[i].type == "upload") {
        let stepval = values[i] ? Array.isArray(values[i]) ? values[i] : values[i].fileList : [];
        newvalue[i] = stepval.map((it) => {
          if (it.response) {
            return it.response.data.dataList[0]
          } else {
            return it.url ? it.url : null
          }
        })
        if (fields[i].limit == 1) {
          newvalue[i] = newvalue[i][0] ? newvalue[i][0] : ""
        }
      } else if (fields[i].type == "datepicker") {
        newvalue[i] = values[i] ? values[i].format("YYYY-MM-DD") : null
      }
    }
    submitData(newvalue, () => {
      form.resetFields();
    })

  }

  const submitBtn = (<Button
    style={{ width: '100%' }}
    htmlType="submit"
    type="primary"
    size="large"
    disabled={submitting || loading}
    onClick={() => {
      form
        .validateFields()
        .then(values => {
          sload(true);
          formartSubmit(values)
          setTimeout(() => {
            sload(false);
          }, 1000);
        })
        .catch(error => { });
    }}
  >
    {submitting || loading ? <LoadingOutlined /> : null}

    <span style={{ marginLeft: 12, fontSize: 16 }}>
      {' '}
      {submitting || loading ? '提交中...' : '提交'}
    </span>
  </Button>)


  let getOptions = async (options, item) => {
    let curkey = item.name[0];
    if (Array.isArray(options)) {
      if (JSON.stringify(optiondom[curkey]) !== JSON.stringify(options)) {
        cdom((optiondom) => {
          return {
            ...optiondom,
            [curkey]: options,
          }
        })
      }
    } else if (options?.database) {
      let { database, params } = options ? options : {}, dom = <></>;
      if (Array.isArray(database)) {
        dom = database
      } else {
        let res = await database(params), dataList = [];
        if (res.code == "0000") {
          dataList = res?.data?.dataList;
        }
        dom = dataList;
      }
      if (JSON.stringify(optiondom[curkey]) !== JSON.stringify(dom)) {
        cdom((optiondom) => {
          return {
            ...optiondom,
            [curkey]: dom,
          }
        })
      }
    }
  }



  return (
    <div>
      <Drawer
        title="预览"
        placement="top"
        closable={true}
        onClose={() => { setVisible(false) }}
        visible={visible}
        height="100%"
      >
        <div style={{ width: "100%", height: "100%", backgroundImage: `url(${cururl})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}></div>
      </Drawer>
      <Form
        form={form}
        name="initform"
        layout="vertical"
        fields={Dom}
        onFinish={values => { formartSubmit(values) }}
        onValuesChange={(changedValues, allValues) => {
          onChange(changedValues, allValues);
          //联动逻辑
          let linkkey = Object.keys(changedValues)[0];
          for (let i in link) {
            if (i == linkkey) {
              clink({
                ...link,
                [i]: changedValues[i] //state修改当前value
              })
              //重置
              if (fields[i].linked) {
                let keyarr = [];
                for (let index in belink) {
                  if (belink[index].options && Object.keys(belink[index].options.params).indexOf(i) != -1) {
                    keyarr.push(index)
                  }
                }
                keyarr.map((it) => form.setFieldsValue({ [it]: "" }))
              }
            }
          }
        }}
      >
        <Row gutter={24}>
          {Dom.map(
            (item, i) => {
              let extraprops = getSelectLinked(item);
              let { options } = extraprops;
              if (item.type == 'input' || item.type == 'password') {
                return !extraprops.hides ? (
                  <Col key={i} {...getCol(item.col)}>
                    <Form.Item
                      style={{}}
                      label={item.title}
                      name={item.name[0]}
                      rules={[
                        {
                          required: item.required,
                          message: `请输入${item.title}`,
                        },
                        item.name[0].indexOf('phone') != -1
                          ? {
                            pattern: /^\d{11}$/,
                            message: '手机号格式不正确',
                          }
                          : item.name[0].indexOf('mail') != -1
                            ? {
                              pattern: /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-z]{2,}$/,
                              message: '邮箱格式不正确',
                            }
                            : {},
                      ]}
                    >
                      <Input allowClear type={item.type} maxLength={100} disabled={item.disabled} />
                    </Form.Item>
                  </Col>
                ) : null;
              } else if (item.type == 'editor') {
                return !extraprops.hides ? (
                  <Col key={i} {...getCol(item.col)}>
                    <Form.Item
                      style={{}}
                      label={item.title}
                      name={item.name[0]}
                      rules={[
                        {
                          required: item.required,
                          message: `请输入${item.title}`,
                        },
                      ]}
                    >
                      <Editor
                        value={item.value}
                        height={item.height}
                        rerender={item.rerender}
                        serverURL={item.serverURL? item.serverURL:'/ngy/ngic-auth/common/uploadFile'}
                      ></Editor>
                    </Form.Item>
                  </Col>
                ) : null;
              } else if (item.type == 'autoinput') {
                return !extraprops.hides ? (
                  <Col key={i} {...getCol(item.col)}>
                    <Form.Item
                      style={{}}
                      label={item.title}
                      name={item.name[0]}
                      rules={[
                        {
                          required: item.required,
                          message: `请输入${item.title}`
                        },
                      ]}
                    >
                      <AutoComplete
                        allowClear
                        disabled={item.disabled}
                        options={item.dataSource}
                        filterOption={(inputValue, option) => {
                          return option.value && option.value.toString().indexOf(inputValue) !== -1
                        }}
                      />
                    </Form.Item>
                  </Col>
                ) : null;
              } else if (item.type == 'textarea') {
                return !extraprops.hides ? (
                  <Col key={i} {...getCol(item.col)}>
                    <Form.Item
                      style={{}}
                      label={item.title}
                      name={item.name[0]}
                      rules={[
                        { required: item.required, message: `请输入${item.title}` },
                      ]}
                    >
                      <Input.TextArea
                        maxLength={600}
                        rows={4}
                        allowClear
                        disabled={item.disabled}
                      />
                    </Form.Item>
                  </Col>
                ) : null;
              } else if (item.type == 'select') {
                return !extraprops.hides ? (
                  <Col key={i} {...getCol(item.col)}>
                    <Form.Item
                      style={{}}
                      label={item.title}
                      name={item.name[0]}
                      rules={[
                        { required: item.required, message: `请选择${item.title}` },
                      ]}
                    >
                      <Select
                        allowClear
                        placeholder="请选择"
                        style={{ width: '100%' }}
                        showSearch
                        mode={item.multiple ? 'multiple' : ''}
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        disabled={item.disabled}
                      >
                        {
                          (optiondom[item.name[0]] && optiondom[item.name[0]].length > 0) && optiondom[item.name[0]].filter(it => !it.hides).map((it, n) => {
                            return (
                              <Option disabled={it.disabled} key={n} value={it.dicKey ? it.dicKey : it.value}>
                                {it.dicName ? it.dicName : it.label}
                              </Option>
                            );
                          })
                        }
                      </Select>
                    </Form.Item>
                  </Col>
                ) : null;
              } else if (item.type == 'radio') {
                return !extraprops.hides ? (
                  <Col key={i} {...getCol(item.col)}>
                    <Form.Item
                      style={{}}
                      label={item.title}
                      name={item.name[0]}
                      rules={[
                        { required: item.required, message: `请选择${item.title}` },
                      ]}
                    >
                      <Radio.Group
                        options={
                          (optiondom[item.name[0]] && optiondom[item.name[0]].length > 0)
                          &&
                          optiondom[item.name[0]]
                        }
                      />
                    </Form.Item>
                  </Col>
                ) : null;
              } else if (item.type == 'datepicker') {
                return !extraprops.hides ? (
                  <Col key={i} {...getCol(item.col)}>
                    <Form.Item
                      style={{}}
                      label={item.title}
                      name={item.name[0]}
                      rules={[
                        { required: item.required, message: `请选择${item.title}` },
                      ]}
                    >
                      <DatePicker
                        disabledDate={item.disabledDate ? item.disabledDate : null}
                        disabledTime={
                          item.disabledDateTime ? item.disabledDateTime : null
                        }
                        style={{ width: '100%' }}
                        showTime={item.showTime}
                        format={item.format}
                        disabled={item.disabled}
                      />
                    </Form.Item>
                  </Col>
                ) : null;
              } else if (item.type == 'inputnumber') {
                return !extraprops.hides ? (
                  <Col key={i} {...getCol(item.col)}>
                    <Form.Item
                      style={{}}
                      label={item.title}
                      name={item.name[0]}
                      rules={[
                        { required: item.required, message: `请输入${item.title}` },
                      ]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        disabled={item.disabled}
                        min={item.min ? item.min : 0}
                        max={item.max}
                      />
                    </Form.Item>
                  </Col>
                ) : null;
              } else if (item.type == 'upload') {
                const props = rerender
                  ? {
                    name: "file",
                    action: item.serverURL?item.serverURL:'/ngy/ngic-auth/common/uploadFile',
                    listType: item.listType == "img" ? "picture-card" : 'picture',
                    multiple: item.multiple ? item.multiple : false,
                    defaultFileList: item.value ? item.value.fileList ? item.value.fileList : [] : [],
                    onChange(info) {
                      let {
                        file: { name, status, response },
                        fileList,
                      } = info;
                      cfilelist({
                        ...filelist,
                        [item.name[0]]: fileList
                      })

                      if (status == 'done') {
                      } else if (status == 'error') {
                        message.error(`${info.file.name} 上传失败`);
                      }
                    },
                    onPreview(file) {
                      if (file.url) {
                        setcururl(file.url)
                      } else {
                        setcururl(file.thumbUrl)
                      }
                      setVisible(true);
                    }
                  }
                  : {};
                const uploadBtn = (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>上传</div>
                  </div>
                ),
                  limit = item.limit ? item.limit : 1000;


                return !extraprops.hides && rerender ? (
                  <Col key={i} {...getCol(item.col)}>
                    <Form.Item
                      style={{}}
                      label={item.title}
                      name={item.name[0]}
                      rules={[
                        { required: item.required, message: `请选择${item.title}` },
                      ]}
                    >
                      <Upload {...props} style={{ width: '100%' }}>
                        {
                          (filelist[item.name[0]] && filelist[item.name[0]].length > limit - 1) ? null : uploadBtn
                        }
                      </Upload>
                    </Form.Item>
                  </Col>
                ) : null;
              } else if (item.type == 'treeselect') {
                return !extraprops.hides ? (
                  <Col key={i} {...getCol(item.col)}>
                    <Form.Item
                      style={{}}
                      label={item.title}
                      name={item.name[0]}
                      rules={[
                        { required: item.required, message: `请选择${item.title}` },
                      ]}
                    >
                      <TreeSelect
                        style={{ width: '100%' }}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        disabled={item.disabled}
                        allowClear
                        treeDefaultExpandAll
                        placeholder={`请选择...`}
                      >
                        {options && loop(options)}

                        {
                          (optiondom[item.name[0]] && optiondom[item.name[0]].length > 0) &&
                          loop(optiondom[item.name[0]])
                        }
                      </TreeSelect>
                    </Form.Item>
                  </Col>
                ) : null;
              } else if (item.type == 'table') {
                let extraparams = getTableLinked(item);//声明需要被联动
                return !extraprops.hides ? (
                  <Col key={i} {...getCol(item.col)}>
                    <Form.Item
                      style={{}}
                      label={item.title}
                      name={item.name[0]}
                      rules={[
                        { required: item.required, message: `请输入${item.title}` },
                      ]}
                    >
                      <EditTable
                        columns={item.columns}
                        extraparams={extraparams}
                        path={item.path}
                        editable={item.editable}
                        rowKey={item.rowKey}
                        rowName={item.rowName}
                        pagination={item.pagination}
                      >
                      </EditTable>
                    </Form.Item>
                  </Col>
                ) : null;
              }
            })}
          <Col span={24} style={{ padding: 12 }}>
            {actions ? (
              actions(form, submitBtn)
            ) : (
                submitBtn
              )}
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default InitForm;
