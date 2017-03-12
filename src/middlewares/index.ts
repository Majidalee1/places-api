import * as compose from 'koa-compose';  // Compose the given middleware and return middleware.
import * as convert from 'koa-convert';  // convert koa legacy generator middleware to promise middleware ( v2.x )
import * as logger from 'koa-logger';
import * as cors from 'koa-cors';
import * as bodyParser from 'koa-bodyparser';
import * as server from 'koa-static';

import handleErrors from './error';
import auth from './auth';
import delay from './delay';

export default function middleware() {
  return compose([
    logger(),
    handleErrors(),
    convert(cors()),
    auth(),
    bodyParser(),
    server('./src/views', {defer: true}),
    delay({ms: 500}),
  ]);
}
