import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";

const ALTER = true;
const FORCE = false;
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Models DataBase
import models from "./models/index";

// Types and Resolvers
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolversDef";

// Schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

const middleware = async (req, res, next) => {
  if(req.method === "OPTIONS"){
    res.set("Access-Control-Max-Age", "3600");
    res.status(204).send();
    return;
  }
  next();
};

// Start server express
const app = express();

// Handles hhtpserver
const httpServer = http.createServer(app);

const StartServer = async () => {
  const serverApollo = new ApolloServer({
cors: false,    
schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    introspection: NODE_ENV !== "production",
  });

  await serverApollo.start();
  // Set up our Express middleware to handle CORS, body parsing,
  // and our expressMiddleware function.
  app.use(
    "/",
middleware,
    bodyParser.json({ limit: "50mb" }),
    expressMiddleware(serverApollo, {
      context: async ({ req, res }) => {
        // Get the user token from the headers.

        //const token = req.headers.authorization || "";

        // Try to retrieve a user with the token

        //const user = await getUser(token);

        // optionally block the user

        // we could also check user roles/permissions here

        //if (!user) // para manejar este bloqueo lo mejor es por key, si no tiene la apikey no puede hacer nada, y la autorizacion por sesión se hace dentro del resolver
        // throwing a `GraphQLError` here allows us to specify an HTTP status code,

        // standard `Error`s will have a 500 status code by default

        /*throw new GraphQLError("User is not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",

          http: { status: 401 },
        },
      });*/

        return {
          models: models,
        };
      },
    })
  );

  new Promise((resolve) => httpServer.listen({ port: PORT }, resolve))
    .then(() => {
      models.sequelizeInst
        .sync({ alter: ALTER, force: FORCE })
        .then(() => {
          console.log(
            `Running in express on http://localhost:${PORT} (${NODE_ENV}) with introspection(${
              NODE_ENV !== "production"
            })`
          );
        })
        .catch((e) => {
          console.error(`error sync sequelize ${e}`);
        });
    })
    .catch((e) => {
      console.error(`error startStandaloneServer graphql ${e}`);
    });
};

StartServer();
