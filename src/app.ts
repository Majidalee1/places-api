import Koa from "koa";
import config from "config";

import middleware from "./middlewares";
import routes from "./routes";
import connectDatabase from "./databases";
import attachSocketIO from "./websocket/socket-io";
import attachWebSocket from "./websocket/websocket";

const app = new Koa();

app.use(middleware());
app.use(routes());

async function main(): Promise<void> {
  const displayColors = config.get<boolean>("displayColors");
  try {
    const dbUrl = config.get<string>("dbUrl");
    await connectDatabase(dbUrl);
    console.info(
      displayColors ? "\x1b[32m%s\x1b[0m" : "%s",
      `Connected to ${dbUrl}`
    );
  } catch (error) {
    console.error(displayColors ? "\x1b[31m%s\x1b[0m" : "%s", error.toString());
  }

  try {
    const port = process.env.PORT || 80;
    const server = app.listen(port);
    console.info(
      displayColors ? "\x1b[32m%s\x1b[0m" : "%s",
      `Listening to http://localhost:${port}`
    );
    // attachSocketIO(server);
    // attachWebSocket(server);
  } catch (err) {
    console.error(displayColors ? "\x1b[31m%s\x1b[0m" : "%s", err);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
