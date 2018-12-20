import { createApolloServer } from "meteor/apollo";
import { makeExecutableSchema } from "graphql-tools";
import merge from "lodash/merge";

//da984234
import UsersSchema from "../../api/users/User.graphql";
import UsersResolvers from "../../api/users/resolvers";

import PodcastsPreviewsSchema from "../../api/podcastsPreviews/PodcastPreview.graphql";
import PodcastsPreviewsResolvers from "../../api/podcastsPreviews/resolvers";

import GenresSchema from "../../api/genres/Genre.graphql";
import GenresResolvers from "../../api/genres/resolvers";

import PodcastSchema from "../../api/podcasts/Podcast.graphql";
import PodcastResolvers from "../../api/podcasts/resolvers";

import EpisodeSchema from "../../api/episodes/Episode.graphql";
import EpisodeResolvers from "../../api/episodes/resolvers";

import SearchPreviewsSchema from "../../api/searchPreviews/SearchPreview.graphql";
import SearchPreviewsResolvers from "../../api/searchPreviews/resolvers";

import UserDataSchema from "../../api/usersData/UserData.graphql";
import UsersDataResolvers from "../../api/usersData/resolvers";

const typeDefs = [
  GenresSchema,
  UsersSchema,
  PodcastsPreviewsSchema,
  PodcastSchema,
  EpisodeSchema,
  SearchPreviewsSchema,
  UserDataSchema
];

const resolvers = merge(
  UsersResolvers,
  PodcastsPreviewsResolvers,
  GenresResolvers,
  PodcastResolvers,
  EpisodeResolvers,
  SearchPreviewsResolvers,
  UsersDataResolvers
);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

createApolloServer({
  schema,
  tracing: true,
  cacheControl: true
});
