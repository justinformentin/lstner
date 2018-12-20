import moment from "moment";
import Podcasts from "./podcasts";
import UsersData from "../usersData/usersData";
import fetchPodcast from "../../ui/utils/fetchPodcast";

export default {
  Query: {
    async podcast(_, { podcastId }) {
      console.time("podcast");
      const result = Podcasts.findOne({ podcastId });

      if (!result) {
        const podcast = await fetchPodcast(podcastId);

        if (!podcast) return null;
        Podcasts.update(
          { podcastId },
          { ...podcast, updatedAt: moment().valueOf() },
          { upsert: true }
        );

        console.timeEnd("podcast");
        return Podcasts.findOne({ podcastId });
      }

      if (isUpdateNeeded(result.updatedAt)) {
        updatePodcast(podcastId);

        return Podcasts.findOne({ podcastId });
      }
      console.timeEnd("podcast");
      return result;
    }
  },
  Podcast: {
    subscribed: (data, _, { user }) => {
      if (!user) return false;
      const { _id } = user;
      const userData = UsersData.findOne({ _id });
      if (!userData || !userData.podcasts) return false;
      return !!userData.podcasts.find(el => el === data.podcastId);
    }
  }
};

function isUpdateNeeded(time) {
  return moment(moment().valueOf()).diff(time, "hours") >= 1;
}

async function updatePodcast(podcastId) {
  const podcast = await fetchPodcast(podcastId);

  if (!podcast || !podcast.episodes) return null;
  podcast.episodes.forEach(episode => {
    if (!episode || !episode.mediaUrl) return;
    Podcasts.update(
      { podcastId, "episodes.mediaUrl": { $ne: episode.mediaUrl } },
      {
        $push: {
          episodes: { $each: [episode], $sort: { pubDateUnix: -1 } }
        }
      }
    );
  });
  Podcasts.update(
    { podcastId },
    {
      $set: { updatedAt: moment().valueOf() }
    }
  );
}
