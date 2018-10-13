import TOKEN from "./token";
import { BASE_URI, LOCAL_SERVER_IP } from "../constants";
import { isJson } from "../utils";

const promisifiedXHR = (endPoint, type, params = null, customHeaders, useLocalIp = false) => {
  return new Promise((resolve, reject) => {
    let url = BASE_URI + endPoint;

    if (useLocalIp) {
      url = LOCAL_SERVER_IP + endPoint;
    }

    let headers;

    if (customHeaders) {
      headers = customHeaders;
    } else {
      headers = {
        "Content-Type": "application/json",
        "access_token": TOKEN.get()
      };
    }

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
    return promisifiedXHR("", "POST", data);
  }
};

export default API;
