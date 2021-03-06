import styles from './index.less';
import ProTable from '@ant-design/pro-table';
import { SearchOutlined } from '@ant-design/icons';
import { Layout, Space, Button, Row, Col, Input } from 'antd';
import { useEffect, useState, useRef } from 'react';
import { getFeatures, getFieldsInfo } from './service';
import { useModel, history, useParams } from 'umi';
import { map } from 'ramda';

const { Content } = Layout;
const difference = (setA, setB) => {
  const _difference = new Set(setA);
  for (const elem of setB) {
    _difference.delete(elem);
  }
  return [..._difference];
};

export default () => {
  const { id } = useParams();
  const { getRow, commitSetting } = useModel('shp');
  const row = getRow(id);
  const { path, setting: defaultSetting } = row;
  const [setting, setSetting] = useState(defaultSetting);
  const [columns, setColumns] = useState([]); // 列配置
  const searchInput = useRef(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]); // 缓存的全量数据
  const [columnsStateMap, setColumnsStateMap] = useState({}); // 受控的表格设置栏

  const rowSelection = {
    onChange: (val) => {
      setSelectedRowKeys(val);
      const allKeys = dataSource.map(({ id }) => id);
      const unSelectedRowKeys = difference(allKeys, val);
      setSetting({
        ...setting,
        hideFeaturesIdArray: unSelectedRowKeys,
      });
    },
    selectedRowKeys,
    fixed: true,
    selections: true,
    alwaysShowAlert: true,
  };

  const commit = () => {
    commitSetting(id, setting);
    history.goBack();
  };

  const cancel = () => {
    history.goBack();
  };

  const request = async (params, sorter, filter) => {
    if (params.path) {
      if (dataSource.length) {
        return {
          data: dataSource,
          success: true,
        };
      }
      const data = await getFeatures(params);
      const keys = data?.map(({ id }) => id) || [];
      // 支持多次编辑，从store中读取setting信息，做merge
      if (setting?.hideFeaturesIdArray?.length) {
        const mergeKeys = keys.filter((key) => !setting.hideFeaturesIdArray.includes(key));
        setSelectedRowKeys(mergeKeys);
      } else {
        setSelectedRowKeys(keys);
      }
      if (setting?.hideFieldsNameArray?.length) {
        const map = {};
        setting.hideFieldsNameArray.forEach((name) => {
          map[name] = {
            show: false,
          };
        });
        setColumnsStateMap(map);
      }
      setDataSource(data);
      return {
        data,
        success: true,
      };
    }
    return {
      data: [],
      success: true,
    };
  };

  useEffect(() => {
    // 支持每个字段都可以查询
    const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={`请输入 ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => {
              confirm();
            }}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => {
                confirm();
              }}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              查询
            </Button>
            <Button
              onClick={() => {
                clearFilters();
              }}
              size="small"
              style={{ width: 90 }}
            >
              重置
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
          : '',
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    });

    /**
     * 生成列配置
     * @param {Array} fields 属性数组
     * @returns {Array} columns
     */
    const genColumns = map(({ fieldName }) => {
      const defaultProps = {
        title: fieldName,
        dataIndex: fieldName,
        ...getColumnSearchProps(fieldName),
      };
      const excludeProps = {};
      if (fieldName === 'the_geom') {
        excludeProps.hideInTable = true;
      }
      return {
        ...defaultProps,
        ...excludeProps,
      };
    });

    if (path) {
      getFieldsInfo({ path }).then(({ fgdbfieldDetailInfos }) => {
        const columns = genColumns(fgdbfieldDetailInfos);
        setColumns(columns);
      });
    }
  }, [path]);

  return (
    <Layout className={styles.layout}>
      <Content className={styles.content}>
        <Row className={styles.row}>
          <Col span={24}>
            <Space className={styles.tool} size={16}>
              <Button onClick={cancel}>取消</Button>
              <Button onClick={commit} type="primary">
                确定
              </Button>
            </Space>
          </Col>
        </Row>
        <ProTable
          className={styles.table}
          columns={columns}
          params={{ path }}
          request={request}
          search={false}
          rowKey="id"
          options={{
            fullScreen: false,
            reload: false,
            setting: true,
            density: false,
          }}
          pagination={{
            pageSize: 10,
          }}
          rowSelection={rowSelection}
          dateFormatter="string"
          toolbar={{
            title: '选择加密数据',
          }}
          columnsState={{
            value: columnsStateMap,
            onChange: (val) => {
              const hideFieldsNameArray = Object.keys(val);
              setSetting({
                ...setting,
                hideFieldsNameArray,
              });
              setColumnsStateMap(val);
            },
          }}
          scroll={{ x: true }}
        />
      </Content>
    </Layout>
  );
};
