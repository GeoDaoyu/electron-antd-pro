import { useEffect } from 'react';
import { Layout, Button, Result } from 'antd';
import { history } from 'umi';
import styles from './Success.less';

const { Content } = Layout;

export default () => {
  useEffect(() => {
    setTimeout(() => {
      history.push('/');
    }, 10000);
  });
  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <Result
          status="success"
          title="提交成功，开始执行加密!"
          subTitle="加密时间依赖于数据量, 请等待."
          extra={
            <Button type="primary" onClick={() => history.push('/')}>
              返回主页
            </Button>
          }
        />
      </Content>
    </Layout>
  );
};
