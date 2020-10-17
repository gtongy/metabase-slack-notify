import { getEnableEmbedDashboards, slackFileNotify, screenshotMetabaseGraph } from '../handler'
import axios from 'axios'

const chromeLambda = require('chrome-aws-lambda')

jest.mock('axios')
jest.mock('@slack/web-api', () => {
  return {
    WebClient: jest.fn().mockImplementation(() => {
      return {
        files: {
          upload: () => {}
        }
      }
    })
  }
})

describe('getEnableEmbedDashboards', () => {
  beforeEach(() => {
    console.error = jest.fn()
  })
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
    }
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.get.mockResolvedValue(response)
    const embedDashboards = await getEnableEmbedDashboards('session')
    expect(embedDashboards).toEqual([
      { id: 1, name: 'dashboard1' },
      { id: 3, name: 'dashboard3' }
    ])
  })

  test('has enable_embedding false', async () => {
    const error = {
      response: {
        status: 500,
        data: {
          error: 'server error'
        }
      }
    }
    const mockedAxios = axios as jest.Mocked<typeof axios>
    mockedAxios.get.mockRejectedValueOnce(error)
    process.on('unhandledRejection', console.dir)
    const dashboards = await getEnableEmbedDashboards('session')
    expect(dashboards).toEqual([])
  })
})

describe('screenshotMetabaseGraph', () => {
  const screenshot = Buffer.alloc(20, 'Test')
  const mockedPage = {
    goto: jest.fn(),
    waitFor: jest.fn(),
    screenshot: jest.fn().mockResolvedValue(screenshot)
  }
  const mockedBrowser = { newPage: jest.fn().mockResolvedValue(mockedPage), close: jest.fn() }
  jest.spyOn(chromeLambda.puppeteer, 'launch').mockResolvedValue(mockedBrowser)
  test('success screenshot', async () => {
    const result = await screenshotMetabaseGraph('http://test.com')
    expect(result).toEqual(screenshot)
  })
})

describe('slackFileNotify', () => {
  test('success slack notify', async () => {
    await slackFileNotify(
      {
        id: 1,
        name: 'dashboard1'
      },
      Buffer.alloc(20, 'Test')
    )
  })
})
