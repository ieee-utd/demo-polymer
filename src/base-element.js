import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import * as Async from '@polymer/polymer/lib/utils/async.js'
import 'jquery/dist/jquery.min.js';

export class BaseElement extends PolymerElement {
  constructor() {
    super();
  }

  $$(selector) {
    return this.shadowRoot.querySelector(selector)
  }
  $$$(selector) {
    return this.shadowRoot.querySelectorAll(selector)
  }

  _navigateTo(page) {
    this._fire("change-page", { route: page })
  }

  _openNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
  }

  _fire(event, detail) {
    this.dispatchEvent(new CustomEvent(event, {detail: detail, bubbles: true, composed: true}));
  }

  _async(f) {
    Async.idlePeriod.run(f);
  }

  _microTask(f) {
    Async.microTask.run(f);
  }

  _clone(a) {
    return JSON.parse(JSON.stringify(a));
  }

  _deepEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  _get(url, options) {
    return this._method(url, "GET", undefined, options);
  }

  _put(url, data, options) {
    return this._method(url, "PUT", data, options);
  }

  _post(url, data, options) {
    return this._method(url, "POST", data, options);
  }

  _delete(url, data, options) {
    return this._method(url, "DELETE", data, options);
  }

  _method(url, method, data, options) {
    if (!options) options = { };
    var silent = !!options.silent;
    var auth = !!options.auth;
    var debug = !!options.debug;
    var showDetail = typeof options.detail !== 'undefined' ? options.detail : true;
    var contentType = options.contentType || 'application/json; charset=utf-8';
    var responseType = options.responseType || "json";
    var redirectOn401 = typeof options.redirectOn401 !== 'undefined' ? options.redirectOn401 : true;
    var forceRespondWithText = !!options.forceRespondWithText;

    var self = this;
    return new Promise((resolve, reject) => {
      var req = {
        url: API_URL + url,
        contentType: contentType,
        method: method,
        dataType: responseType,
        success: (data) => {
          if (debug) console.log(data);
          resolve(data);
        },
        error: (xhr, textStatus) => {
          var result;

          if (forceRespondWithText) {
            result = xhr.responseText
          } else {
            result = xhr.responseJSON || (xhr.statusText == "OK" ? "An error occured" : "") || (xhr.statusText != "error" ? xhr.statusText : "") || "An error occured";
          }

          if (xhr.status === 502 || xhr.status === 504) {
            reject({ message: "Lost connection - refresh the page and try again", detail: xhr.statusText })
            return;
          } else if (xhr.status === 401 && redirectOn401) {
            window.localStorage.setItem("loggedOut", 1)
            window.location = "/member/login";
            return;
          }

          if (debug) console.log(xhr.responseJSON, xhr.statusText, textStatus);
          var message = result.message || result || "An error occured";
          var detail = (xhr.responseJSON ? (xhr.responseJSON.detail || xhr.statusText || "") : (xhr.responseText || xhr.statusText || ""));
          if (detail.length > 0) detail = `Error at ${method} ${url}}: ` + detail;
          if (!showDetail) detail = "";
          if (!silent) self._showToast(message, "error", detail);
          if (typeof result === "object") {
            result.status = xhr.status;
          }
          reject(result);
        }
      };
      if (data) req.data = JSON.stringify(data);
      if (auth) {
        // req.xhrFields = { withCredentials: true };
        // req.crossDomain = true;
      }
      jQuery.ajax(req);
    });
  }

  _ajaxPlaceholder(success, data, timeout) {
    return new Promise(function(resolve, reject) {
       setTimeout(() => {
         if (success) resolve(data)
         else reject(data)
       }, typeof timeout === 'number' ? timeout : 3000);
    });
  }

  _removeEmptyFields(_d) {
    var d = this._clone(_d);
    for (var key in d) {
      if (d.hasOwnProperty(key)) {
        if (typeof d[key] === 'boolean' || d[key] == null) continue;
        if (!d[key]) delete d[key];
      }
    }
    return d
  }

  _length(arr) {
    return this._defined(arr) && !!arr.length ? arr.length : 0;
  }

  _defined(o) {
    return (typeof o !== 'undefined') && o != null;
  }
  _have(arr) {
    return this._defined(arr) && arr.length > 0
  }
  _one(arr) {
    if (!this._have(arr)) return false;
    return arr.length == 1;
  }
  _moreThanOne(arr) {
    if (!this._have(arr)) return false;
    return arr.length > 1;
  }
  _nonZero(num) {
    return this._defined(num) && typeof num === "number" && num != 0;
  }
  _pick(obj, arr) {
    var picked = { };
    for (var key of arr) {
      picked[key] = obj[key];
    }
    return picked;
  }

  _not(a) {
    return !a;
  }
  _or(a, b) {
    return a || b;
  }
  _orNot(a, b) {
    return a || !b;
  }
  _nor(a, b) {
    return !a && !b;
  }
  _and(a, b) {
    return a && b;
  }
  _andNot(a, b) {
    return a && !b;
  }
}
