import { getEnableEmbedDashboards } from '../handler';
import axios from 'axios';

jest.mock('axios');

test('has enable_embedding false', async () => {
  const response = {
    data: [
      {
        id: 1,
        name: 'dashboard1',
        enable_embedding: true
      },
      {
        id: 2,
        name: 'dashboard2',
        enable_embedding: false
      },
      {
        id: 3,
        name: 'dashboard3',
        enable_embedding: true
      }
    ]
  };
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.get.mockResolvedValue(response);
  const embedDashboards = await getEnableEmbedDashboards();
  expect(embedDashboards).toEqual([
    { id: 1, name: 'dashboard1' },
    { id: 3, name: 'dashboard3' }
  ]);
});

test('has enable_embedding false', async () => {
  const error = {
    response: {
      status: 401,
      data: {
        error: 'Unauthorized!'
      }
    }
  };
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  mockedAxios.get.mockRejectedValueOnce(error);
  process.on('unhandledRejection', console.dir);
  const dashboards = await getEnableEmbedDashboards();
  expect(dashboards).toEqual([]);
});
