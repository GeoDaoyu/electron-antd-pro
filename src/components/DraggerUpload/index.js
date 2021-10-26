import { Form } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useState } from 'react';

export default () => {
  const fileText = useState('aaaaaa');
  const onClick = () => {
    console.log('click');
  };

  return (
    <Form.Item name="fileUrl">
      <div className="ant-upload ant-upload-drag" onClick={onClick}>
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
    </Form.Item>
  );
};
