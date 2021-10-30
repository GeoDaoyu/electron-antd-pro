import { useRef, useState } from 'react';
import { history } from 'umi';
import { StepsForm } from '@ant-design/pro-form';
import { Layout, Form } from 'antd';
import styles from './index.less';
import { encrypt } from './service';
import DraggerUpload from '@/components/DraggerUpload';
import SaveFile from '@/components/SaveFile';
import ConfigFeaturesTable from '@/components/ConfigFeaturesTable';

const { Content } = Layout;

export default () => {
  const formRef = useRef();
  const [formStore, setFormStore] = useState({}); // 保存每一个stepsForm的值

  const onFinish = async (values) => {
    const { inputFileUrl, outputFolderUrl, configuration } = values;
    const params = {
      encryptShapePath: outputFolderUrl,
      originalShapePaths: [inputFileUrl],
      hideFeaturesIdMap: null,
      hideFieldsNameMap: null,
    };
    if (configuration) {
      params.hideFeaturesIdMap = {
        [inputFileUrl]: configuration.hideFieldsNameArray,
      };
      params.hideFieldsNameMap = {
        [inputFileUrl]: configuration.hideFeaturesIdArray,
      };
    }
    encrypt(params).then(() => {
      history.push('/success');
    });
  };

  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <StepsForm
          formRef={formRef}
          onFinish={onFinish}
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
          <StepsForm.StepForm name="output" title="输出文件" onFinish={() => true}>
            <Form.Item name="outputFolderUrl" rules={[{ required: true }]}>
              <SaveFile />
            </Form.Item>
          </StepsForm.StepForm>
          <StepsForm.StepForm name="data" title="加密配置" onFinish={() => true}>
            <Form.Item name="configuration">
              <ConfigFeaturesTable path={formStore.inputFileUrl} />
            </Form.Item>
          </StepsForm.StepForm>
        </StepsForm>
      </Content>
    </Layout>
  );
};
