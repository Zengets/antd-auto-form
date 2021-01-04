# antd-auto-form
## ⌨️ 预览
<div style="border:#f0f0f0 solid 4px">
    <img src="http://47.100.234.193:8888/download/pic2.png" title="demo"/> 
    <img src="http://47.100.234.193:8888/download/pic1.png" title="demo"/> 
</div>

## 📦 安装
```bash
$ npm install antd-auto-form 
```


## 🔨 使用

```diff
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { InitForm } from 'antd-auto-form'


// type 类型有 table treeselect upload inputnumber datepicker daterange radio select textarea autoinput editor password input 

let fields = {
    equipmentNo: {
        value: null,
        type: 'select',
        title: '设备编号',
        name: ['equipmentNo'],
        required: true,
        options: [
            {
                label: "隐藏设备名称",
                value: "1"
            },
            {
                label: "正常option",
                value: "2"
            }
        ],
        //下拉框通过接口获取
        // options:{
        //   database:fetchPromise,//fetchPromise fetch(接口地址)
        //   params:{} //参数
        // }
        linked: true,//声明该formitem为联动
    },
    equipmentName: {
        value: null,
        type: 'select',
        title: '设备名称',
        name: ['equipmentName'],
        required: true,
        options: [
            {
                label: "test1",
                value: "1"
            }
        ],
        belinked: {//声明该formitem为被联动
            hides: [ //可以多个条件并存 数组内添加即可
                {
                    name: "equipmentNo", //联动的是哪个formitem
                    equalvalue: "1", //这个formitem值为多少 hide
                    //unequalvalue:"",//这个formitem值不是多少 hide  equalvalue与unequalvalue只存在1个
                    required: true
                }
            ],
            // options:{ //声明联动下拉 使用场景多级联动 ex: 省、市、区
            //   database:fetchPromise,//fetchPromise fetch(被联动时调用的接口地址) 
            //   params:{
            //    equipmentNo:"linked" //key为需要联动的formitem ，value是linked表示根据该key联动 否则使用自己填写的key传入
            //   } //参数
            // }
        }

    },
    positionNo: {
        value: null,
        type: 'input',
        title: '设备位置号',
        name: ['positionNo'],
        required: false,
    },
    date: {
        value: null,
        type: 'datepicker',
        title: '购入日期',
        name: ['date'],
        format:"YYYY-MM-DD",//返回的date格式
        required: false,
    },
    daterange: {
        value: null,
        type: 'daterange',
        title: '预计寿命',
        name: ['daterange'],
        format:"YYYY",//返回的date格式
        required: false,
    },
    remark: {
        value: null,
        type: 'editor',
        title: '备注',
        name: ['remark'],
        required: false,
        //serverURL: "https://www.mocky.io/v2/5cc8019d300000980a055e76"//替换为自己的上传地址 富文本图片/附件
        col: { span: 24 },//栅格布局 默认 12
    },
    pictureUrl: {
        value: null,
        type: 'upload',
        title: '设备图片',
        name: ['pictureUrl'],
        required: false,
        listType: "img",//上传展示类型
        limit: 1, //限制图片上传数量
        col: { span: 24 },
        
    },
}


function App() {
    const [state, setstate] = useState('');

    function saveData(values, fn) {
        console.log(values);
        fn();//提交后重置的回调
    }

    return (
        <div style={{ padding: 24 }}>
            <div style={{ height: 320 }}>
                <InitForm
                    fields={fields}
                    submitData={(values, fn) => {
                        saveData(values, fn)
                    }}
                    onChange={(changedValues, allValues) => {
                        console.log(changedValues, allValues)
                    }}
                    submitting={false} //接口submit状态
                >
                </InitForm>
            </div>

        </div>
    )
}

ReactDOM.render(< App />, document.getElementById('root'));
```

## ☀️ 示例

```diff
git clone https://github.com/wuhao930406/antd-auto-form.git
cd antd-auto-form
npm install
npm start
```
访问 http://localhost:8080


## 后端接口规范
### 1.AutoTable 组件
```diff
表格分页 
传参 ：{ pageIndex:"页码",pageSize:"每页条数"}
返回格式 { code:"状态码",data:{total:"总条数",list:['分页数据放在这']},msg:"操作msg"}
-------------------
表格不分页
返回格式 { code:"状态码",data:{dataList:['分页数据放在这']},msg:"操作msg"}
```
### 2.InitForm 组件
```diff
单选 下拉框 自动补全输入框(options)  radio select autoinput
返回格式 { code:"状态码",data:{dataList:[
    {label:"下拉框文字",value:"下拉框id"}
    ]},msg:"操作msg"}
--------------------
树形下拉框 treeselect
返回格式 { code:"状态码",data:{dataList:[
  {
    title: 'Node1',
    value: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-1',
      },
      {
        title: 'Child Node2',
        value: '0-0-2',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
  },
]},msg:"操作msg"}
--------------------
上传组件 upload 可上传多个
返回格式 { code:"状态码",data:{dataList:[
   "文件上传后服务器地址1",
   "文件上传后服务器地址2" 
]},msg:"操作msg"}
--------------------
表格选择/填空组件 table
返回格式 { code:"状态码",data:{
    page/dataList(分页/不分页),selectedList:['选中的id']
},msg:"操作msg"}

```
