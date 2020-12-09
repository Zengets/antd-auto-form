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
import { InitForm } from '../dist/bundle.js'


// type 类型有 table treeselect upload inputnumber datepicker radio select textarea autoinput editor password input 

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

