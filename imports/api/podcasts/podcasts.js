import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";

const Podcasts = new Mongo.Collection("podcasts");

// In order to access Collection from apollo-link-state(client side)
Meteor.methods({
  getEpisode: (id, podcastId) => {
    const podcast = Podcasts.findOne({ podcastId });
    return podcast.episodes ? podcast.episodes.find(el => el.id === id) : null;
  }
});

export default Podcasts;
