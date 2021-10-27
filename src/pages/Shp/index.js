import { useRef, useState } from 'react';
import { history } from 'umi';
import ProForm, { StepsForm, ProFormText, ProFormUploadButton } from '@ant-design/pro-form';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { EllipsisOutlined, QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { message, Layout, Form, Tooltip, Dropdown, Menu, Input, Button } from 'antd';
import styles from './index.less';
import DraggerUpload from '@/components/DraggerUpload';
import SaveFile from '@/components/SaveFile';

const { Content } = Layout;

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default () => {
  const formRef = useRef();
  const [formStore, setFormStore] = useState({}); // 保存每一个stepsForm的值

  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <StepsForm
          formRef={formRef}
          onFinish={async () => {
            await waitTime(100);
            history.push('/success');
          }}
          formProps={{
            validateMessages: {
              required: '此项为必填项',
            },
          }}
        >
          <StepsForm.StepForm
            name="input"
            title="选择文件"
            onFinish={() => {
              const currFormFieldsValue = formRef.current?.getFieldsValue() || {};
              setFormStore({ ...formStore, ...currFormFieldsValue });
              return true;
            }}
          >
            <Form.Item name="inputFileUrl" rules={[{ required: true }]}>
              <DraggerUpload type="shp" />
            </Form.Item>
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="output"
            title="输出文件"
            onFinish={() => {
              const currFormFieldsValue = formRef.current?.getFieldsValue() || {};
              setFormStore({ ...formStore, ...currFormFieldsValue });
              return true;
            }}
          >
            <Form.Item name="outputFileUrl" rules={[{ required: true }]}>
              <SaveFile />
            </Form.Item>
          </StepsForm.StepForm>
          {/* <StepsForm.StepForm name="data" title="配置数据">
            <Form.Item label="Username" name="username">
              <ProTable
                style={{ width: '800px' }}
                columns={columns}
                request={(params, sorter, filter) => {
                  console.log(params, sorter, filter);
                  return Promise.resolve({
                    data: tableListDataSource,
                    success: true,
                  });
                }}
                search={false}
                rowKey="key"
                pagination={{
                  showQuickJumper: true,
                }}
                dateFormatter="string"
                toolbar={{
                  title: '高级表格',
                  tooltip: '这是一个标题提示',
                }}
                toolBarRender={() => [
                  <Button key="danger" danger>
                    危险按钮
                  </Button>,
                  <Button key="show">查看日志</Button>,
                  <Button type="primary" key="primary">
                    创建应用
                  </Button>,
                  <Dropdown key="menu" overlay={menu}>
                    <Button>
                      <EllipsisOutlined />
                    </Button>
                  </Dropdown>,
                ]}
              />
            </Form.Item>
          </StepsForm.StepForm>
          <StepsForm.StepForm name="field" title="配置字段">
            <Form.Item label="Username" name="username">
              <ProTable
                style={{ width: '800px' }}
                columns={columns}
                request={(params, sorter, filter) => {
                  console.log(params, sorter, filter);
                  return Promise.resolve({
                    data: tableListDataSource,
                    success: true,
                  });
                }}
                search={false}
                rowKey="key"
                pagination={{
                  showQuickJumper: true,
                }}
                dateFormatter="string"
                toolbar={{
                  title: '高级表格',
                  tooltip: '这是一个标题提示',
                }}
                toolBarRender={() => [
                  <Button key="danger" danger>
                    危险按钮
                  </Button>,
                  <Button key="show">查看日志</Button>,
                  <Button type="primary" key="primary">
                    创建应用
                  </Button>,
                  <Dropdown key="menu" overlay={menu}>
                    <Button>
                      <EllipsisOutlined />
                    </Button>
                  </Dropdown>,
                ]}
              />
            </Form.Item>
          </StepsForm.StepForm> */}
        </StepsForm>
      </Content>
    </Layout>
  );
};
