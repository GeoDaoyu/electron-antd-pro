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
