import { Elysia } from "elysia";
import { jwtAccessSetup, jwtRefreshSetup } from "@auth/guards/setup.jwt";
import cookie from "@elysiajs/cookie";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { helmet } from "elysia-helmet";
import { apiRoutes } from "@api/index";
import { auth } from "@auth/auth.controller";
import "@config/database/mongodb.config";

const app = new Elysia()
  .use(swagger())
  .use(jwtAccessSetup)
  .use(jwtRefreshSetup)
  .use(cookie())
  .use(
    helmet({
      contentSecurityPolicy: false, // 🧯 Evita quebra com Swagger
    }),
  )
  .use(auth)
  .use(apiRoutes)
  .get("/", () => "Welcome to Elysia!")
  .listen(process.env.PORT || 8080)
  .use(
    cors({
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true,
      exposeHeaders: process.env.CORS_EXPOSED_HEADERS || "*",
      allowedHeaders: process.env.CORS_ALLOWED_HEADER || "*",
      // @ts-ignore
      methods: (process.env.CORS_ALLOWED_METHODS! as HTTPMethod) || "*",
    }),
  );

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${process.env.PORT || 8080}`,
);
