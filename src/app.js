import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'antd'
import { Editor, InitForm } from '../dist/bundle.js'

let fields = {
    equipmentNo: {
        value: null,
        type: 'input',
        title: '设备编号',
        name: ['equipmentNo'],
        required: true,
    },
    equipmentName: {
        value: null,
        type: 'input',
        title: '设备名称',
        name: ['equipmentName'],
        required: true,
    },
    positionNo: {
        value: null,
        type: 'input',
        title: '设备位置号',
        name: ['positionNo'],
        required: false,
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
        //serverURL: "https://www.mocky.io/v2/5cc8019d300000980a055e76"//替换为自己的上传地址
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