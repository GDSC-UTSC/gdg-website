importScripts("https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.5.0/firebase-auth-compat.js");

const firebaseConfig = {
  apiKey: "{{FIREBASE_API_KEY}}",
  authDomain: "{{FIREBASE_AUTH_DOMAIN}}",
  projectId: "{{FIREBASE_PROJECT_ID}}",
  storageBucket: "{{FIREBASE_STORAGE_BUCKET}}",
  messagingSenderId: "{{FIREBASE_MESSAGING_SENDER_ID}}",
  appId: "{{FIREBASE_APP_ID}}",
  measurementId: "{{FIREBASE_MEASUREMENT_ID}}",
};

firebase.initializeApp(firebaseConfig);

const getIdTokenPromise = () => {
  return new Promise((resolve) => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      unsubscribe();
      if (user) {
        user.getIdToken().then(
          (idToken) => resolve(idToken),
          () => resolve(null)
        );
      } else {
        resolve(null);
      }
    });
  });
};

const getOriginFromUrl = (url) => {
  const pathArray = url.split("/");
  const protocol = pathArray[0];
  const host = pathArray[2];
  return protocol + "//" + host;
};

const getBodyContent = (req) => {
  return Promise.resolve()
    .then(() => {
      if (req.method !== "GET") {
        const contentType = req.headers.get("Content-Type");
        if (contentType && contentType.indexOf("json") !== -1) {
          return req.json().then((json) => {
            return JSON.stringify(json);
          });
        } else {
          return req.text();
        }
      }
    })
    .catch(() => {
      return undefined;
    });
};

self.addEventListener("fetch", (event) => {
  const requestProcessor = (idToken) => {
    let req = event.request;
    let processRequestPromise = Promise.resolve();

    if (
      self.location.origin === getOriginFromUrl(event.request.url) &&
      (self.location.protocol === "https:" || self.location.hostname === "localhost") &&
      idToken
    ) {
      const headers = new Headers();
      req.headers.forEach((val, key) => {
        headers.append(key, val);
      });
      headers.append("Authorization", "Bearer " + idToken);
      processRequestPromise = getBodyContent(req).then((body) => {
        try {
          req = new Request(req.url, {
            method: req.method,
            headers: headers,
            mode: "same-origin",
            credentials: req.credentials,
            cache: req.cache,
            redirect: req.redirect,
            referrer: req.referrer,
            body,
          });
        } catch (e) {
          console.error("Error adding auth token to request:", e);
        }
      });
    }
    return processRequestPromise.then(() => {
      return fetch(req);
    });
  };
  event.respondWith(getIdTokenPromise().then(requestProcessor, requestProcessor));
});
