import { Input, Button, Space } from 'antd';
import { useState } from 'react';

/**
 * custom form item
 * 获取本地文件夹绝对路径
 * value和onChange是表单必须的参数，由antd传参
 */
export default ({ value = '', onChange }) => {
  const onClick = () => {
    const { ipcRenderer } = window.electron;
    ipcRenderer.send('saveFile');
    ipcRenderer.once('saveFilePath', (event, folderPath) => {
      if (folderPath) {
        onChange(folderPath);
      }
    });
  };
  const onTextChage = (e) => {
    onChange(e.target.value);
  };

  return (
    <Space>
      <Input type="text" value={value} onChange={onTextChage} style={{ width: 400 }} />
      <Button type="primary" onClick={onClick}>
        打开
      </Button>
    </Space>
  );
};
