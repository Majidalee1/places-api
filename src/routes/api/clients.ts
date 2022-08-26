// import router
import Router from "koa-router";
import {
  Client,
  Places,
  Routes,
  Driver as User,
  Vehicle,
} from "../../models/clients";
import config from "config";
import jwt from "jsonwebtoken";

export default (router: Router) => {
  router.get("/ping", async (ctx) => {
    ctx.body = "pong";
  });

  router.post("/createUser", async (ctx) => {
    ctx.body = await User.create({
      userName: "test user",
      password: "test password",
      DNI: "test DNI",
    });
  });

  router.post("/login", async (ctx) => {
    const payload = {
      DNI: ctx.request.body.DNI,
      password: ctx.request.body.password,
      clientId: ctx.request.body.clientId,
      vehicle: ctx.request.body.vehicle,
    };
    const user = await User.findOne({ DNI: payload.DNI });

    // check if user exists
    if (!user) {
      ctx.status = 401;
      ctx.body = {
        status: {
          code: 1001,
          message: "User not found",
        },
      };
      return;
    }
    // check if password is correct

    if (user.password !== payload.password) {
      ctx.status = 401;
      ctx.body = {
        status: {
          code: 1002,
          message: "Password is incorrect",
        },
      };
      return;
    }

    const vehicle = await Vehicle.create({
      name: payload.vehicle,
      userId: user!._id,
    });

    // update user with client and vehicleId
    await User.findByIdAndUpdate(user!._id, {
      clientId: payload.clientId,
      vehicleId: vehicle._id,
    });

    const key = process.env.jwtSecret ?? config.get<string>("jwtSecret");
    ctx.body = {
      user: {
        id: user!._id,
        username: user!.userName,
        token: jwt.sign({ username: user!.userName, id: user!._id }, key),
        DNI: user!.DNI,
      },
    };
  });

  router.post("/client", async (ctx) => {
    ctx.body = await Client.create({
      name: ctx.request.body.name,
      description: ctx.request.body.description,
    });
  });

  router.get("/clients", async (ctx) => {
    ctx.body = await Client.find({});
  });

  // places
  router.post("/route", async (ctx) => {
    ctx.body = await Routes.create({
      name: ctx.request.body.name,
      description: ctx.request.body.description,
    });
  });

  router.get("/routes", async (ctx) => {
    ctx.body = await Routes.find({});
  });

  router.post("/place", async (ctx) => {
    ctx.body = await Places.create({
      name: ctx.request.body.name,
      time: ctx.request.body.time,
      route: ctx.request.body.routeId,
      longitude: ctx.request.body.longitude,
      latitude: ctx.request.body.latitude,
      imageUrl: ctx.request.body.imageUrl,
    });
  });

  router.get("/places", async (ctx) => {
    ctx.body = await Places.find({}).populate("route");
  });

  // get place by id
  router.get("/place/:id", async (ctx) => {
    const id = Number.parseInt(ctx.params.id);
    const place = await Places.findOne({})
      .skip(id - 1)
      .limit(1);
    if (!place) {
      ctx.status = 404;
      return;
    }
    ctx.body = {
      ...place,
    };
  });
};
