import type { Serverless } from 'serverless/aws'

const serverlessConfiguration: Serverless = {
  service: {
    name: 'metabase-slack-notify'
  },
  frameworkVersion: '2',
  configValidationMode: 'warn',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
    'serverless-layers': {
      layersDeploymentBucket: 'metabase-slack-notify-layer'
    }
  },
  plugins: ['serverless-webpack', 'serverless-layers'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    timeout: 60,
    memorySize: 1024,
    environment: {
      METABASE_USERNAME: '${ssm:/metabase-slack-notify/METABASE_USERNAME}',
      METABASE_PASSWORD: '${ssm:/metabase-slack-notify/METABASE_PASSWORD}',
      METABASE_SITE_URL: '${ssm:/metabase-slack-notify/METABASE_SITE_URL}',
      METABASE_SECRET_KEY: '${ssm:/metabase-slack-notify/METABASE_SECRET_KEY}',
      SLACK_TOKEN: '${ssm:/metabase-slack-notify/SLACK_TOKEN}',
      SLACK_CHANNELS: '${ssm:/metabase-slack-notify/SLACK_CHANNELS}'
    }
  },
  functions: {
    metabaseSlackNotify: {
      handler: 'handler.metabaseSlackNotify',
      events: [
        {
          schedule: 'cron(0 0 ? * MON-FRI *)'
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration
