import { remove } from "lodash";

export const removeFromCache = (proxy, client, query, field, returnedObj) => {
  try {
    const data = proxy.readQuery({ query });
    remove(data[field], n => n.id === returnedObj.id);
    proxy.writeQuery({ query, data });
  } catch (e) {
    client.query({ query });
    console.log("query haven't been called before", query);
  }
};

export const addToCache = (proxy, client, query, field, returnedObj) => {
  try {
    const data = proxy.readQuery({ query });
    remove(data.upnext, n => n.id === returnedObj.id);
    data[field] ? data[field].push(returnedObj) : (data[field] = [returnedObj]);
    proxy.writeQuery({ query, data });
  } catch (e) {
    client.query({ query });
    console.log("query haven't been called before", query);
  }
};
