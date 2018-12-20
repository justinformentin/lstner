import axios from "axios";
import { values, pick } from "lodash";

export default {
  Query: {
    genres() {
      return axios
        .get(
          "https://itunes.apple.com/WebObjects/MZStoreServices.woa/ws/genres?id=26"
        )
        .then(res => res.data[26]["subgenres"])
        .then(res => prettifyData(res))
        .then(res => {
          return res.map(el => {
            el.subgenres = prettifyData(el.subgenres, ["name", "id"]);
            return el;
          });
        });
    }
  }
};

function prettifyData(arr, properties = ["name", "id", "subgenres"]) {
  return values(arr).map(el => pick(el, properties));
}
