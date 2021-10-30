import { Input, Button, Space } from 'antd';
import { useState } from 'react';

/**
 * custom form item
 * 获取本地文件夹绝对路径
 * value和onChange是表单必须的参数，由antd传参
 */
export default ({ value, onChange }) => {
  const [fileText, setFileText] = useState(value);
  const onClick = () => {
    const { ipcRenderer } = window.electron;
    ipcRenderer.send('saveFile');
    ipcRenderer.once('saveFilePath', (event, folderPath) => {
      if (folderPath) {
        setFileText(folderPath);
        onChange(folderPath);
      }
    });
  };
  const onTextChage = (e) => {
    setFileText(e.target.value);
  };

  return (
    <Space>
      <span>输出文件夹: </span>
      <Input type="text" value={fileText} onChange={onTextChage} style={{ width: 400 }} />
      <Button type="primary" onClick={onClick}>
        打开
      </Button>
    </Space>
  );
};
