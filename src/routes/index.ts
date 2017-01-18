import * as compose from 'koa-compose';
import * as Router from 'koa-router';

const routerConfigs = [
  { file: 'base/test', prefix: '' },
  { file: 'api/user', prefix: '/api' }
];

export default function routes() {
  const composed = routerConfigs.reduce((prev, curr) => {
    const routes = require('./' + curr.file);
    const router = new Router({ prefix: curr.prefix });

    Object.keys(routes).map(name => routes[name](router));

    return [router.routes(), router.allowedMethods(), ...prev];
  }, []);

  return compose(composed);
}