import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'metabase-slack-notify',
  },
  frameworkVersion: '2',
  configValidationMode: 'warn',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    timeout: 30,
    memorySize: 1024,
    environment: {
      METABASE_SITE_URL: '${ssm:/metabase-slack-notify/METABASE_SITE_URL}',
      METABASE_SECRET_KEY: '${ssm:/metabase-slack-notify/METABASE_SECRET_KEY}',
      METABASE_SESSION_ID: '${ssm:/metabase-slack-notify/METABASE_SESSION_ID}',
      SLACK_TOKEN: '${ssm:/metabase-slack-notify/SLACK_TOKEN}',
      SLACK_CHANNELS: '${ssm:/metabase-slack-notify/SLACK_CHANNELS}'
    },
  },
  functions: {
    metabaseSlackNotify: {
      handler: 'handler.metabaseSlackNotify',
      events: [
        {
          schedule: "cron(0 12 * * * *)"
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
