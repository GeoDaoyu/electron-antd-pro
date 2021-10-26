import { Upload, message, Form } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

export default () => {
  const { Dragger } = Upload;

  const props = {
    name: 'file',
    multiple: false,
    action: '',
    maxCount: 1,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        console.log(info.file, info.fileList);
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <Form.Item name="fileUrl">
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件</p>
      </Dragger>
    </Form.Item>
  );
};
