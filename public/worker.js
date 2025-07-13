importScripts(
  "https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyDkkBylEA-_GbsLuUpNbu1770vCsYlc5Ho",
  authDomain: "gdg-website-314a4.firebaseapp.com",
  projectId: "gdg-website-314a4",
  storageBucket: "gdg-website-314a4.firebasestorage.app",
  messagingSenderId: "765873570971",
  appId: "1:765873570971:web:31d09e516b4dbe9764b23e",
  measurementId: "G-68BM0DGRV6",
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
      (self.location.protocol === "https:" ||
        self.location.hostname === "localhost") &&
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
  event.respondWith(
    getIdTokenPromise().then(requestProcessor, requestProcessor)
  );
});
