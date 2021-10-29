import { request } from 'umi';

export async function encrypt(data) {
  const url = `${API_URL}/shapefile/encrypt-data`;
  return request(url, {
    method: 'post',
    data,
  });
}
