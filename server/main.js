import "../imports/startup/server";
import "../imports/api/podcasts/podcasts";
import { ApolloEngine } from "apollo-engine";
import { WebApp } from "meteor/webapp";
import "../imports/api/users/users";
import "../imports/startup/simple-schema-configuration";

if (process.env.ENGINE_API_KEY) {
  const engine = new ApolloEngine({
    apiKey: process.env.ENGINE_API_KEY
  });

  engine.meteorListen(WebApp);
}
