/*!
 * Minimal Cookies helper compatible with js-cookie API (get/set/remove).
 * Enough for this lab client (token persistence).
 */
(function (global) {
  "use strict";

  function encode(s) {
    return encodeURIComponent(s);
  }

  function decode(s) {
    return decodeURIComponent(s);
  }

  function get(name) {
    if (!name) return null;
    const cookies = document.cookie ? document.cookie.split("; ") : [];
    for (let i = 0; i < cookies.length; i++) {
      const parts = cookies[i].split("=");
      const key = parts.shift();
      const value = parts.join("=");
      if (key === name) return decode(value);
    }
    return null;
  }

  function set(name, value, options) {
    options = options || {};
    let cookie = name + "=" + encode(String(value));

    if (options.expires) {
      let expires = options.expires;
      if (typeof expires === "number") {
        const d = new Date();
        d.setTime(d.getTime() + expires * 864e5);
        expires = d;
      }
      cookie += "; Expires=" + expires.toUTCString();
    }

    cookie += "; Path=" + (options.path || "/");
    if (options.sameSite) cookie += "; SameSite=" + options.sameSite;
    if (options.secure) cookie += "; Secure";

    document.cookie = cookie;
  }

  function remove(name, options) {
    options = options || {};
    options.expires = -1;
    set(name, "", options);
  }

  global.Cookies = { get: get, set: set, remove: remove };
})(window);

