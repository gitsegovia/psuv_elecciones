import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { startStandaloneServer } from "@apollo/server/standalone";

const ALTER = true;
const FORCE = false;

// Models DataBase
import models from "./models/index";

// Types and Resolvers
import { typeDefs } from "./graphql/typeDefs";
import { resolvers } from "./graphql/resolversDef";

// Schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

const serverApollo = new ApolloServer({
  schema,
  introspection: process.env.NODE_ENV !== "production",
});

startStandaloneServer(serverApollo, {
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
  listen: { port: process.env.PORT || 4000 },
})
  .then(({ url }) => {
    models.sequelizeInst
      .sync({ alter: ALTER, force: FORCE })
      .then(() => {
        console.log(
          `Running on ${url} (${process.env.NODE_ENV}) with introspection(${
            process.env.NODE_ENV !== "production"
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

/*startStandaloneServer(serverApollo, {
  context: async ({ req, res }) => ({
    models: models,
  }),
})
  .then(({ url }) => {
    sequelize
      .sync({ force: true, alter: true })
      .then(() => {
        console.log(`Sincronización completa de la base de datos`);
      })
      .catch((e) => {
        console.error(`error sync sequelize ${e}`);
      });
  })
  .catch((e) => {
    console.error(`error startStandaloneServer graphql ${e}`);
  });
*/
