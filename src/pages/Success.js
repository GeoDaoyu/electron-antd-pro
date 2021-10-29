import { Button, Result } from 'antd';
import { history } from 'umi';

export default () => (
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
);
