import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { EllipsisOutlined, QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { message, Layout, Form, Tooltip, Dropdown, Menu, Input, Button } from 'antd';
import { useEffect, useState, useCallback } from 'react';
import { getFeatures, getFieldsInfo } from './service';
import { filter, map, pipe, fromPairs, addIndex, tap } from 'ramda';

const mapIndexed = addIndex(map);
/**
 * 生成列配置
 * @param {Array} fields 属性数组
 * @returns {Array} columns
 */
const genColumns = map(({ fieldName }) => {
  const defaultProps = {
    title: fieldName,
    dataIndex: fieldName,
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

/**
 * 生成可控的列配置
 * @param {Array} fields 属性数组
 * @returns {Object} columnsStateMap
 */
const genColumnsStateMap = pipe(
  mapIndexed(({ fieldName }, index) => {
    if (index <= 4) {
      return [fieldName, { show: true }];
    }
    return [fieldName, { show: false }];
  }),
  fromPairs,
);

/**
 * custom form item
 * 配置数据
 * value和onChange是表单必须的参数，由antd传参
 */
export default ({ value, onChange, path }) => {
  const [columns, setColumns] = useState([]);
  const [columnsStateMap, setColumnsStateMap] = useState({});

  useEffect(() => {
    if (path) {
      getFieldsInfo({ path }).then(({ fgdbfieldDetailInfos }) => {
        setColumns(genColumns(fgdbfieldDetailInfos));
        setColumnsStateMap(genColumnsStateMap(fgdbfieldDetailInfos));
      });
    }
  }, [path]);
  return (
    <ProTable
      style={{ width: '800px' }}
      columns={columns}
      params={{ path }}
      request={async (params, sorter, filter) => {
        if (params.path) {
          return getFeatures(params);
        }
        return Promise.resolve({
          data: [],
          success: true,
        });
      }}
      search={false}
      rowKey="id"
      pagination={{
        showQuickJumper: true,
        pageSize: 5,
        pageSizeOptions: [5, 10, 20, 50, 100],
      }}
      dateFormatter="string"
      toolbar={{
        title: '配置数据',
        tooltip: '在这里配置数据的可见性',
      }}
      columnsState={{
        value: columnsStateMap,
        onChange: setColumnsStateMap,
      }}
    />
  );
};
