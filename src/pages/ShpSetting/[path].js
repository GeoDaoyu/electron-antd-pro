import { useRef, useState } from 'react';
import { useParams } from 'umi';
import { StepsForm } from '@ant-design/pro-form';
import { Layout, Form } from 'antd';
import styles from './index.less';
import { encrypt } from './service';
import DraggerUpload from '@/components/DraggerUpload';
import SaveFile from '@/components/SaveFile';
import ConfigFeaturesTable from '@/components/ConfigFeaturesTable';

const { Content } = Layout;

export default () => {
  const params = useParams();
  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <div>
          <ul>
            <li>params: {JSON.stringify(params)}</li>
          </ul>
        </div>
      </Content>
    </Layout>
  );
};
