import { request } from 'umi';

export async function getFeatures({ path, name }) {
  const url = `${API_URL}/filegeodatabase/layer-features`;
  return request(url, {
    method: 'get',
    params: {
      originalFgdbPath: path,
      layerName: name,
    },
  });
}

export async function getFieldsInfo({ path, name }) {
  const url = `${API_URL}/filegeodatabase/layer-fields-info`;
  return request(url, {
    method: 'get',
    params: {
      originalFgdbPath: path,
      layerName: name,
    },
  });
}
