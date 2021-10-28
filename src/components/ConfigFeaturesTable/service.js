import { request } from 'umi';

export async function getFeatures({ path }) {
  const url = `${API_URL}/shapefile/features`;
  const data = await request(url, {
    method: 'get',
    params: {
      originalShapePath: path,
    },
  });
  return {
    data,
    success: true,
  };
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
