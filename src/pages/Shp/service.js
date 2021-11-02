import { request } from 'umi';

export async function encrypt(data) {
  const url = `${API_URL}/shapefile/encrypt-data`;
  return request(url, {
    method: 'post',
    data,
  });
}

/**
 * 通过jobId获取执行加密的日志和进度情况
 * jobId是提交加密之后的后台返回值
 * 日志是一个数组，进度是一个对象，对象中包含的是[path]: progress.可能包含多个
 * @param {*} jobId
 * @returns
 */
export async function queryLogs(jobId) {
  const url = `${API_URL}/shapefile/logs`;
  return request(url, {
    method: 'get',
    params: {
      jobId,
    },
  });
}
