import { useState } from 'react';
import { Layout, Table, Progress, Space, Button, Empty, message, Row, Col } from 'antd';
import SaveFile from '@/components/SaveFile';
import styles from './index.less';
import { useModel, Link, history } from 'umi';
import { from, interval, tap } from 'rxjs';
import { exhaustMap, takeWhile } from 'rxjs/operators';
import { encrypt, queryLogs, getLayerName } from './service';
import { DoubleLeftOutlined } from '@ant-design/icons';
import { isEmpty, groupBy, pipe, toPairs, map } from 'ramda';
const { Content } = Layout;

const locale = {
  emptyText: (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="点击添加数据按钮，添加数据" />
  ),
};
const pagination = {
  showTotal: (total) => `共 ${total} 条数据`,
};
const { ipcRenderer } = window.electron;
const type = 'gdb';

export default () => {
  const {
    dataSource,
    outputFolderUrl,
    setOutputFolderUrl,
    setInputFolderUrl,
    addRows,
    deleteRow,
    updateProgress: updateProgressByModel,
    clear,
  } = useModel(type);
  const showItemInFolder = (path) => {
    ipcRenderer.send('showItemInFolder', path);
  };
  const columns = [
    {
      title: '图层名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'GDB',
      dataIndex: 'path',
      key: 'path',
      render: (text) => (
        <a
          onClick={() => {
            showItemInFolder(text);
          }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '加密进度',
      dataIndex: 'progress',
      key: 'progress',
      render: (text, record) => {
        return <Progress percent={text} size="small" />;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a
            key="editable"
            style={{ color: isEmpty(record.setting) ? undefined : '#52c41a' }}
            onClick={() => {
              history.push(`./${type}-setting/${record.key}`);
            }}
          >
            配置
          </a>
          <a
            key="delete"
            onClick={() => {
              deleteRow(record.path);
            }}
          >
            删除
          </a>
        </Space>
      ),
    },
  ];
  const [loading, setLoading] = useState(false);
  const addItem = () => {
    ipcRenderer.send('openFile', type);
    ipcRenderer.once('openFilePaths', (event, filePath) => {
      if (filePath) {
        setInputFolderUrl(filePath);
        getLayerName(filePath).then((names) => {
          addRows(names, filePath);
        });
      }
    });
  };
  const formValidate = () => {
    const inputValidate = dataSource.length > 0;
    const outputValidate = outputFolderUrl !== '';
    if (!outputValidate) {
      message.error('请选择输出目录');
    }
    if (!inputValidate) {
      message.error('请添加数据');
    }
    return inputValidate && outputValidate;
  };
  const generateParam = pipe(
    groupBy(({ path }) => path), // 按gdb分组
    toPairs, // 对象转数组
    map(([path, rows]) => {
      const lastIndex = path.lastIndexOf('\\');
      const fileName = path.slice(lastIndex + 1);
      return rows.reduce(
        (acc, curr) => {
          const { name, setting } = curr;
          acc.hideFeaturesIdMap = {
            ...acc.hideFeaturesIdMap,
            [name]: setting.hideFeaturesIdArray,
          };
          acc.hideFieldsNameMap = {
            ...acc.hideFieldsNameMap,
            [name]: setting.hideFieldsNameArray,
          };
          return acc;
        },
        {
          encryptFgdbPath: `${outputFolderUrl}\\${fileName}`,
          originalFgdbPath: path,
          hideFeaturesIdMap: {},
          hideFieldsNameMap: {},
        },
      );
    }),
  );
  const onFinish = () => {
    const validate = formValidate();
    if (!validate || loading) {
      return;
    }
    setLoading(true);
    window.time = new Date().getTime();
    const params = generateParam(dataSource);

    encrypt(params).then(({ jobId }) => {
      updateProgress(jobId);
    });
  };
  const updateProgress = (jobId) => {
    const handle = ({ progressMap }) => {
      const progresses = Object.values(progressMap);
      const finished = progresses.reduce((acc, curr) => acc && curr === 100, true);
      updateProgressByModel(progressMap);
      if (finished) {
        setTimeout(() => {
          history.push(`/success?type=${type}`);
        }, 3000);
      }
    };
    interval(1000)
      .pipe(
        exhaustMap(() => from(queryLogs(jobId))),
        tap(handle),
        takeWhile(({ progressMap }) => {
          const progresses = Object.values(progressMap);
          const finished = progresses.reduce((acc, curr) => acc && curr === 100, true);
          return !finished;
        }),
      )
      .subscribe();
  };
  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <Row className={styles.row}>
          <Col span={24}>
            <Link to="./home" onClick={() => clear()} className={styles.link}>
              <DoubleLeftOutlined /> GDB数据加密
            </Link>
            <Space className={styles.tool} size={16}>
              <SaveFile onChange={setOutputFolderUrl} />
              <Button onClick={addItem}>添加数据</Button>
              <Button onClick={onFinish} type="primary" loading={loading}>
                开始转换
              </Button>
            </Space>
          </Col>
        </Row>
        <Table
          className={styles.table}
          columns={columns}
          dataSource={dataSource}
          locale={locale}
          pagination={pagination}
        />
      </Content>
    </Layout>
  );
};
