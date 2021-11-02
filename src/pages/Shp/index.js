import { useState } from 'react';
import { history } from 'umi';
import { Layout, Table, Progress, Space, Button, Empty, Input, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SaveFile from '@/components/SaveFile';
import styles from './index.less';
import { useModel } from 'umi';
import { encrypt, queryLogs } from './service';
const { Content } = Layout;

const locale = {
  emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="点击底部按钮，添加数据" />,
};
const { ipcRenderer } = window.electron;

export default () => {
  const { dataSource, addRows, deleteRow, clearDataSource } = useModel('shp');
  const showItemInFolder = (path) => {
    ipcRenderer.send('showItemInFolder', path);
  };
  const columns = [
    {
      title: '图层名称',
      dataIndex: 'path',
      key: 'path',
      render: (text) => (
        <a
          onClick={() => {
            showItemInFolder(text);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '加密进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (text, record) => {
        return <Progress percent={text} size="small" />;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a
            key="editable"
            onClick={() => {
              history.push(`./shp-setting/${record.key}`);
            }}
          >
            配置
          </a>
          <a
            key="delete"
            onClick={() => {
              deleteRow(record.key);
            }}
          >
            删除
          </a>
        </Space>
      ),
    },
  ];
  const [loading, setLoading] = useState(false);
  const addItem = () => {
    ipcRenderer.send('openFile', 'shp');
    ipcRenderer.once('openFilePaths', (event, filePaths) => {
      addRows(filePaths);
    });
  };
  const onFinish = (values) => {
    setLoading(true);
    const { outputFolderUrl } = values;
    const params = {
      encryptShapePath: outputFolderUrl,
      originalShapePaths: [],
      hideFeaturesIdMap: null,
      hideFieldsNameMap: null,
    };
    dataSource.forEach(({ path, setting }) => {
      params.originalShapePaths.push(path);
      if (setting) {
        params.hideFeaturesIdMap = {
          ...params.hideFeaturesIdMap,
          [path]: setting.hideFieldsNameArray,
        };
        params.hideFieldsNameMap = {
          ...params.hideFieldsNameMap,
          [path]: setting.hideFeaturesIdArray,
        };
      }
    });
    encrypt(params).then(({ jobId }) => {
      updateProgress(jobId);
    });
  };
  const updateProgress = (jobId) => {
    queryLogs(jobId).then(({ progressMap }) => {
      console.log(progressMap);
      clearDataSource();
      history.push('/success');
    });
  };
  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <div>
          <Table
            className={styles.content_table}
            columns={columns}
            dataSource={dataSource}
            locale={locale}
          />
          <Button
            className={styles.content_button}
            onClick={addItem}
            type="dashed"
            icon={<PlusOutlined />}
          >
            添加一行数据
          </Button>
          <Form
            name="basic"
            onFinish={onFinish}
            autoComplete="off"
            validateMessages={{
              required: '此项为必填项',
            }}
          >
            <Form.Item name="outputFolderUrl" label="输出文件夹" rules={[{ required: true }]}>
              <SaveFile />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" loading={loading} htmlType="submit">
                开始转换
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};
