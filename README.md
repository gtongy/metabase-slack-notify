# metabase slack notify

This function is metabase graph to notify slack.

## Flow 

![Design](https://github.com/gtongy/metabase-slack-notify/blob/master/images/metabase-slack-notify.png)

 - AWS Lambda configuration management with Serverless Framework
 - Launch Puppeteer on AWS Lambda and take a screenshot against the Metabase dashboard
 - Post the photos to slack.
 - Scheduled execution of Lambda functions with CloudWatch Events

## Post

[Metabaseのグラフをslackへ通知するbotをServerless Framework + Puppeteerで作ってみた](https://kaminashi-developer.hatenablog.jp/entry/2020/10/12/metabase-slack-notify)

## Requirement

- serverless framework
  - 2.4.0

## Usage

### Development

development use serverless framework. Please install serverless framework.

```
$ npm install -g serverless
```

- exec lambda local

```
$ serverless invoke local -f metabaseSlackNotify \
   -e METABASE_SITE_URL="" \
   -e METABASE_SECRET_KEY="" \
   -e METABASE_USERNAME="" \
   -e METABASE_PASSWORD="" \
   -e SLACK_TOKEN="" \
   -e SLACK_CHANNELS=""
```

- deploy production (region is ap-northeast-1)

```
$ serverless deploy -v --region ap-northeast-1 --stage production
```

