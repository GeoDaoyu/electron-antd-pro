import { history } from 'umi';
import { Layout, Space, Typography } from 'antd';
import styles from './index.less';

const { Content } = Layout;
const { Title } = Typography;
const routes = [
  {
    to: '/shp',
    icon: '/Shp.svg',
    label: 'Shp数据加密',
  },
  {
    to: '/gdb',
    icon: '/GDB.svg',
    label: 'GDB数据加密',
  },
];
export default () => {
  const onClick = (to) => {
    history.push(to);
  };
  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <Space size={100}>
          {routes.map((route) => (
            <div key={route.to} className={styles['link']} onClick={() => onClick(route.to)}>
              <img src={route.icon} />;
              <Title level={2} className={styles['link-title']}>
                {route.label}
              </Title>
            </div>
          ))}
        </Space>
      </Content>
    </Layout>
  );
};
