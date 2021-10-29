import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { EllipsisOutlined, QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { message, Layout, Form, Tooltip, Table, Space, Input, Button } from 'antd';
import { useEffect, useState, useRef, useCallback } from 'react';
import { getFeatures, getFieldsInfo } from './service';
import { filter, map, pipe, fromPairs, addIndex, tap } from 'ramda';

/**
 * custom form item
 * 配置数据
 * value和onChange是表单必须的参数，由antd传参
 */
export default ({ value, onChange, path }) => {
  const [columns, setColumns] = useState([]);
  const searchInput = useRef(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const rowSelection = {
    onChange: setSelectedRowKeys,
    selectedRowKeys,
    fixed: true,
  };

  const request = async (params, sorter, filter) => {
    if (params.path) {
      return getFeatures(params);
    }
    return Promise.resolve({
      data: [],
      success: true,
    });
  };

  useEffect(() => {
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
        setColumns(genColumns(fgdbfieldDetailInfos));
      });
    }
  }, [path]);

  useEffect(() => {
    if (path) {
      getFeatures({ path }).then(({ data }) => {
        const keys = data.map(({ id }) => id);
        setSelectedRowKeys(keys);
      });
    }
  }, [path]);

  return (
    <ProTable
      style={{ width: 800 }}
      columns={columns}
      params={{ path }}
      request={request}
      search={false}
      rowKey="id"
      pagination={{
        showQuickJumper: true,
        pageSize: 5,
        pageSizeOptions: [5, 10, 20, 50, 100],
      }}
      rowSelection={rowSelection}
      dateFormatter="string"
      toolbar={{
        title: '配置数据',
        tooltip: '在这里配置数据的可见性',
      }}
      columnsState={{
        onChange: (value) => {
          console.log(value);
        },
      }}
      scroll={{ x: 800 }}
    />
  );
};
