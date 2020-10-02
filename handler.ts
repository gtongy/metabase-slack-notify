import { ScheduledHandler } from 'aws-lambda';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { WebClient } from '@slack/web-api';
import 'source-map-support/register';
import log from 'lambda-log';
const chromeLambda = require('chrome-aws-lambda');

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

  for (var i = 0; i < enableEmbedDashboards.length; i++) {
    const dashboard = enableEmbedDashboards[i];
    const payload = {
      resource: { dashboard: dashboard.id },
      params: {},
      exp: Math.round(Date.now() / 1000) + 10 * 60
    };
    const token = jwt.sign(payload, process.env.METABASE_SECRET_KEY);
    const embedUrl = process.env.METABASE_SITE_URL + '/embed/dashboard/' + token + '#bordered=true&titled=true';
    const defaultViewport = {
      width: 1440,
      height: 1080
    };
    const browser = await chromeLambda.puppeteer.launch({
      args: chromeLambda.args,
      executablePath: await chromeLambda.executablePath,
      headless: chromeLambda.headless,
      ignoreHTTPSErrors: true,
      defaultViewport
    });

    const page = await browser.newPage();
    await page.goto(embedUrl);
    await page.waitFor(5000);
    const buffer = await page.screenshot({ fullPage: true });
    await browser.close();
    try {
      const web = new WebClient(process.env.SLACK_TOKEN);
      await web.files.upload({
        filename: `${dashboard.name}.png`,
        file: buffer,
        channels: process.env.SLACK_CHANNELS
      });
    } catch (error) {
      log.error(error.response.data);
    }
  }

  log.info('metabase slack notified!');
};
