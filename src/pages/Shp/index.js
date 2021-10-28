import { useRef, useState } from 'react';
import { history } from 'umi';
import { StepsForm } from '@ant-design/pro-form';
import { Layout, Form } from 'antd';
import styles from './index.less';
import DraggerUpload from '@/components/DraggerUpload';
import SaveFile from '@/components/SaveFile';
import ConfigFeaturesTable from '@/components/ConfigFeaturesTable';

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
          {/* <StepsForm.StepForm
            name="output"
            title="输出文件"
            onFinish={() => {
              const currFormFieldsValue = formRef.current?.getFieldsValue() || {};
              setFormStore({ ...formStore, ...currFormFieldsValue });
              return true;
            }}
          >
            <Form.Item name="outputFileUrl" rules={[{ required: true }]}>
              <SaveFile type="shp" />
            </Form.Item>
          </StepsForm.StepForm> */}
          <StepsForm.StepForm name="data" title="配置数据">
            <Form.Item name="filterFeatures">
              <ConfigFeaturesTable path={formStore.inputFileUrl} />
            </Form.Item>
          </StepsForm.StepForm>
        </StepsForm>
      </Content>
    </Layout>
  );
};
