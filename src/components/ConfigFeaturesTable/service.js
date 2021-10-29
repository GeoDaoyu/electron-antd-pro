import { request } from 'umi';

export async function getFeatures({ path }) {
  const url = `${API_URL}/shapefile/features`;
  return request(url, {
    method: 'get',
    params: {
      originalShapePath: path,
    },
  });
}

export async function getFieldsInfo({ path }) {
  const url = `${API_URL}/shapefile/fields-info`;
  return request(url, {
    method: 'get',
    params: {
      originalShapePath: path,
    },
  });
}
