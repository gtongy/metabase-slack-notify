# metabase slack notify

This function is metabase graph to notify slack.

## Requirement

 - serverless framework
   - 2.4.0
 - 

## Usage

### Development

development use serverless framework. Please install serverless framework.

```
$ npm install -g serverless
```

 - exec lambda local

```
$ cd /path/to/metabase-slack-notify
$ serverless invoke local -f metabaseSlackNotify \
   -e METABASE_SITE_URL="" \
   -e METABASE_SECRET_KEY="" \
   -e METABASE_SESSION_ID="" \
   -e SLACK_TOKEN="" \
   -e SLACK_CHANNELS=""
```