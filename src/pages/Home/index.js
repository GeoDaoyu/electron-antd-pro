import { Link } from 'umi';
import { Layout, Space, Typography } from 'antd';
import { FileProtectOutlined, DatabaseOutlined, CopyOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Content } = Layout;
const { Title } = Typography;
const routes = [
  {
    to: '/shp',
    icon: <FileProtectOutlined className={styles['link-icon']} />,
    label: 'shp数据加密',
  },
  {
    to: '/gdb',
    icon: <DatabaseOutlined className={styles['link-icon']} />,
    label: 'GDB数据加密',
  },
];
export default () => {
  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <Space size={100}>
          {routes.map((route) => (
            <Link key={route.to} to={route.to} className={styles.link}>
              {route.icon}
              <Title level={2} className={styles['link-title']}>
                {route.label}
              </Title>
            </Link>
          ))}
        </Space>
      </Content>
    </Layout>
  );
};
