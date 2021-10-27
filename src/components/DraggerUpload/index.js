import { InboxOutlined } from '@ant-design/icons';
import { useState } from 'react';

/**
 * custom form item
 * value和onChange是表单必须的参数，由antd传参
 * type是控制文件过滤，有我传参，枚举值['shp', 'gdb']
 */
export default ({ value, onChange, type }) => {
  const [fileText, setFileText] = useState(value);
  const onClick = () => {
    const { ipcRenderer } = window.electron;
    ipcRenderer.send('openFile', type);
    ipcRenderer.once('filePaths', (event, filePaths) => {
      const len = filePaths?.length;
      if (len) {
        setFileText(filePaths[len - 1]);
        onChange(filePaths[len - 1]);
      }
    });
  };
  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const filePaths = [];
    for (const file of e.dataTransfer.files) {
      const { path } = file;
      filePaths.push(path);
    }
    const len = filePaths?.length;
    if (len) {
      setFileText(filePaths[len - 1]);
      onChange(filePaths[len - 1]);
    }
  };

  return (
    <div className="ant-upload">
      <div
        className="ant-upload ant-upload-drag"
        onClick={onClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <span tabIndex="0" className="ant-upload ant-upload-btn" role="button">
          <div className="ant-upload-drag-container">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件</p>
          </div>
        </span>
      </div>
      <div className="ant-upload-list ant-upload-list-text">
        <div className="ant-upload-list-text-container">
          <div className="ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-text">
            <div className="ant-upload-list-item-info">
              <span className="ant-upload-span">
                <span className="ant-upload-list-item-name">{fileText}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
