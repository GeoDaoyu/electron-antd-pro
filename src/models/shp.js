import { useState } from 'react';
import { v4 } from 'uuid';

export default () => {
  const [dataSource, setDataSource] = useState([]);
  const [outputFolderUrl, setOutputFolderUrl] = useState('');

  const addRows = (paths) => {
    const rows = paths.map((path) => ({
      key: v4(),
      path,
      progress: 0,
      setting: {},
    }));
    setDataSource([...dataSource, ...rows]);
  };
  const deleteRow = (key) => {
    const row = dataSource.find((row) => row.key === key);
    if (row) {
      const { key } = row;
      const filtered = dataSource.filter((row) => row.key !== key);
      setDataSource(filtered);
    }
  };
  const updateRow = (key, newRow) => {
    const row = dataSource.find((row) => row.key === key);
    if (row) {
      const { key } = row;
      const filtered = dataSource.map((row) => (row.key === key ? newRow : row));
      setDataSource(filtered);
    }
  };
  /**
   * 避免一个文件被多次添加，增加一个检查函数
   * @param {string} path
   * @returns {boolean}
   */
  const hasRow = (path) => {
    const index = dataSource.findIndex((row) => row.path === path);
    return index > -1;
  };

  const commitSetting = (key, setting) => {
    const row = dataSource.find((row) => row.key === key);
    if (row) {
      const newRow = {
        ...row,
        setting,
      };
      updateRow(key, newRow);
    }
  };
  const clear = () => {
    setDataSource([]);
    setOutputFolderUrl('');
  };
  const getRow = (key) => {
    return dataSource.find((row) => row.key === key);
  };
  const updateProgress = (progressMap) => {
    const paths = Object.keys(progressMap);
    const progresses = Object.values(progressMap);
    const updatedDataSource = dataSource.map((row) => {
      const index = paths.findIndex((path) => row.path === path);
      const progress = progresses[index];
      return { ...row, progress };
    });
    setDataSource(updatedDataSource);
  };

  return {
    dataSource,
    outputFolderUrl,
    setOutputFolderUrl,
    addRows,
    deleteRow,
    updateRow,
    hasRow,
    commitSetting,
    clear,
    getRow,
    updateProgress,
  };
};
