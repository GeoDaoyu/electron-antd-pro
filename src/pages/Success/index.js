import { Layout, Typography, Card } from 'antd';
import { useModel, Link, history, useLocation } from 'umi';
import * as moment from 'moment';
import styles from './index.less';

const { Content } = Layout;
const { Paragraph } = Typography;
const { ipcRenderer } = window.electron;

export default () => {
  const location = useLocation();
  const { type } = location.query;
  const { dataSource, outputFolderUrl, clear } = useModel(type);
  const openOutputFolder = () => {
    ipcRenderer.send('showItemInFolder', outputFolderUrl);
  };
  const goHome = () => {
    clear();
    history.push('/');
  };
  const getTime = () => {
    const timeEnd = new Date().getTime() - window.time;
    if (timeEnd < 1000 * 60) {
      return moment.duration(timeEnd).asSeconds().toFixed(2) + '秒';
    } else if (timeEnd < 1000 * 60 * 60) {
      return moment.duration(timeEnd).asMinutes().toFixed(2) + '分钟';
    } else if (timeEnd < 1000 * 60 * 60 * 24) {
      return moment.duration(timeEnd).asHours().toFixed(2) + '小时';
    }
    return moment.duration(timeEnd).asDays().toFixed(2) + '天';
  };
  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <Card className={styles.card}>
          <Paragraph className={styles.card_paragraph}>
            本次对 {dataSource.length} 个图层进行了加密，耗时 {getTime()}，成功
            {dataSource.filter((row) => row.progress === 100).length} 个
            <br />
            加密结果存储在<a onClick={openOutputFolder}>这里</a>
          </Paragraph>
          <Link to="/home" onClick={goHome} className={styles.card_link}>
            返回首页
          </Link>
        </Card>
      </Content>
    </Layout>
  );
};
