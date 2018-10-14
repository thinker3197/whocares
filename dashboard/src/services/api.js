import store from "local-storage";

import { LOCAL_SERVER_IP, WHOCARES_TOKEN_KEY } from "../constants";
import { isJson } from "../utils";

const promisifiedXHR = (endPoint, type, params = null, useLocalIp = false) => {
  return new Promise((resolve, reject) => {
    const access_token = store(WHOCARES_TOKEN_KEY);
    let url = LOCAL_SERVER_IP + endPoint;

    if(access_token) {
      url += `?token=${access_token}`;
    }

    if (useLocalIp) {
      url = LOCAL_SERVER_IP + endPoint;
    }


    const headers = {
      "Content-Type": "application/json",
      "access_token": access_token ? access_token : null
    };

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && (this.status >= 200 && this.status < 205)) {
        const { responseText } = xhr;

        if (isJson(responseText)) {
          resolve(JSON.parse(responseText));
        } else {
          resolve(responseText ? responseText : null);
        }
      }
    };

    xhr.onerror = () => reject(xhr.statusText);

    xhr.open(type, url);

    for (let header in headers) {
      xhr.setRequestHeader(header, headers[header]);
    }

    if (params) {
      xhr.send(JSON.stringify(params));
    } else {
      xhr.send();
    }
  });
};

const API = {
  login: (data) => {
    return promisifiedXHR("/auth", "POST", data);
  },
  getAllCampaigns: () => {
    return promisifiedXHR("/campaign/all", "GET");
  },
  getCurrentCampaigns: () => {
    return promisifiedXHR("/campaign/current", "GET");
  },
  joinCampaign: (data) => {
    return promisifiedXHR("/user/join_campaign/<name>")
  },
  createCampaign: (data) => {
    return promisifiedXHR("/campaign/create", "POST", data);
  },
  getRankings: (name) => {
    return promisifiedXHR(`/campaign/stats/${name}`, "GET");
  },
  getCampaignDetails: (name) => {
    return promisifiedXHR(`/campaign/name/${name}`, "GET");
  }
};

export default API;
