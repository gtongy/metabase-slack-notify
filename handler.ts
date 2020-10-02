import { ScheduledHandler } from 'aws-lambda';
import axios from 'axios';
import * as fs from 'fs';
import jwt from 'jsonwebtoken';
import Pageres from 'pageres';
import { WebClient } from '@slack/web-api';
import 'source-map-support/register';
import log from 'lambda-log';

export const metabaseSlackNotify: ScheduledHandler = async () => {
  const headers = {
    'X-Metabase-Session': process.env.METABASE_SESSION_ID,
    'Content-Type': 'application/json'
  };
  let response;
  try {
    response = await axios.get(`${process.env.METABASE_SITE_URL}/api/dashboard`, { headers });
  } catch (error) {
    log.error(error.response.data);
  }
  const enableEmbedDashboards = response.data
    .filter(item => item.enable_embedding === true)
    .map(dashboard => ({ id: dashboard.id, name: dashboard.name }));

  if (enableEmbedDashboards.length <= 0) log.Info('dashboard is not exist');

  enableEmbedDashboards.forEach(async dashboard => {
    const payload = {
      resource: { dashboard: dashboard.id },
      params: {},
      exp: Math.round(Date.now() / 1000) + 10 * 60
    };
    const token = jwt.sign(payload, process.env.METABASE_SECRET_KEY);
    const embedUrl = process.env.METABASE_SITE_URL + '/embed/dashboard/' + token + '#bordered=true&titled=true';
    const sizes = '2000x100';
    await new Pageres({ delay: 2 })
      .src(embedUrl, [sizes], { filename: dashboard.name.replace('/', '') })
      .dest('/tmp')
      .run();

    try {
      const web = new WebClient(process.env.SLACK_TOKEN);
      await web.files.upload({
        filename: `${dashboard.name}.png`,
        file: fs.createReadStream(`/tmp/${dashboard.name.replace('/', '')}.png`),
        channels: process.env.SLACK_CHANNELS
      });
    } catch (error) {
      log.error(error.response.data);
    }
    // TODO: remove files
  });

  log.info('metabase slack notified!');
};
