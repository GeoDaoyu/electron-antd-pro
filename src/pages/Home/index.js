import { Link } from 'umi';
import styles from './index.less';

export default () => {
  return (
    <div className={styles.container}>
      <Link to="/shp">shp</Link><br />
      <Link to="/gdb">gdb</Link><br />
      <Link to="/mul">mul</Link><br />
    </div>
  );
};
