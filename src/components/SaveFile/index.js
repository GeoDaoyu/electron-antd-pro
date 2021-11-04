import { Button } from 'antd';

/**
 * 获取本地文件夹绝对路径
 */
export default ({ onChange }) => {
  const onClick = () => {
    const { ipcRenderer } = window.electron;
    ipcRenderer.send('saveFile');
    ipcRenderer.once('saveFilePath', (_, folderPath) => {
      if (folderPath) {
        onChange(folderPath);
      }
    });
  };

  return <Button onClick={onClick}>输出目录</Button>;
};
