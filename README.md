# metabase slack notify

This function is metabase graph to notify slack.

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
   -e METABASE_SESSION_ID="" \
   -e SLACK_TOKEN="" \
   -e SLACK_CHANNELS=""
```

- deploy production (region is ap-northeast-1)

```
$ serverless deploy -v --region ap-northeast-1 --stage production
```
