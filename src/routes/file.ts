import Router from "koa-router";
import config from "config";
import multer from "koa-multer";
import http from "http";
import fs from "fs";

const dest = config.get<string>("uploadDir");

const upload = multer({ dest });

interface IncomingMessage extends http.IncomingMessage {
  file: { originalname: string; path: string; mimetype: string };
  files: any[];
}

interface IMulterContext extends Router.IRouterContext {
  req: IncomingMessage;
}

export default (router: Router) => {
  router
    .post(
      "/image/upload",
      upload.single("photo"),
      async (ctx: IMulterContext) => {
        // 'avatar' is the 'name' value of form field
        const { originalname, path } = ctx.req.file;
        fs.rename(path, dest + originalname, () => {});
        // const serveUrl =
        const currentUrl = `http://${ctx.req.headers.host}/${originalname}`;
        ctx.body = { imgUrl: currentUrl };
      }
    )
    .post("/photos/upload", upload.array("photos", 12));
};
