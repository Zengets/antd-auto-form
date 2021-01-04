import 'braft-editor/dist/index.css';
import BraftEditor from 'braft-editor';
import React, { useState, useMemo, useEffect } from 'react';
import moment from 'moment';

export default function Editor({ value, onChange, height, rerender,serverURL,style,bordered }) {

  

  let [editorState, ceditor] = useState(
      BraftEditor.createEditorState(
        '<p style="text-align:start;" size="0" _root="undefined" __ownerID="undefined" __hash="undefined" __altered="false"></p>',
      ),
    ),
    [defaultvalue, cd] = useState(true);

  let handleChange = (editorState) => {
    ceditor(editorState);
    onChange(editorState.toHTML());
  };

  let UploadFn = (param) => {
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    const successFn = (response) => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      param.success({
        url: xhr.responseText
          ? JSON.parse(xhr.responseText).data.dataList[0].url
          : null,
        meta: {
          id: moment(),
          title: param.file.name,
          alt: param.file.name,
          loop: true, // 指定音视频是否循环播放
          autoPlay: true, // 指定音视频是否自动播放
          controls: true, // 指定音视频是否显示控制栏
          poster: 'http://xxx/xx.png', // 指定视频播放器的封面
        },
      });
    };
    const progressFn = (event) => {
      // 上传进度发生变化时调用param.progress
      param.progress((event.loaded / event.total) * 100);
    };
    const errorFn = (response) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: '上传失败',
      });
    };
    xhr.upload.addEventListener('progress', progressFn, false);
    xhr.addEventListener('load', successFn, false);
    xhr.addEventListener('error', errorFn, false);
    xhr.addEventListener('abort', errorFn, false);
    fd.append('file', param.file);
    xhr.open('POST', serverURL?serverURL:window?.dataconfig?.serverURL, true);
    xhr.send(fd);
  };

  useEffect(() => {
    if (rerender) {
      cd(rerender);
    }
  }, [rerender]);

  useEffect(() => {
    if (value && defaultvalue) {
      ceditor(BraftEditor.createEditorState(value));
      cd(false);
    }
  }, [value]);

  return (
    <div
      style={{
        ...style,
        border: bordered===false?"#f9f9f9 solid 1px":'#ddd solid 1px',
        border: '#ddd solid 1px',
        height: height ? height : 400,
        overflow: 'hidden',
      }}
    >
      <BraftEditor
        media={{ uploadFn: UploadFn }}
        value={editorState}
        onChange={handleChange}
      />
    </div>
  );
}
