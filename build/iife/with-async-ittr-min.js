var idb=function(e){"use strict";const t=(e,t)=>t.some(t=>e instanceof t);module.exports=function(){let e,t=null;function n(e){return!!e&&("object"==typeof e||"function"==typeof e)}return(e=function(e,r){if(!n(e)||!n(r))throw new TypeError("Cannot create proxy with a non-object as target or handler");let o=function(){};t=function(){o=function(e){throw new TypeError(`Cannot perform '${e}' on a proxy that has been revoked`)}};const s=r;r={get:null,set:null,apply:null,construct:null};for(let e in s){if(!(e in r))throw new TypeError(`Proxy polyfill does not support trap '${e}'`);r[e]=s[e]}"function"==typeof s&&(r.apply=s.apply.bind(s));let i=this,c=!1,a=!1;"function"==typeof e?(i=function(){const t=this&&this.constructor===i,n=Array.prototype.slice.call(arguments);if(o(t?"construct":"apply"),t&&r.construct)return r.construct.call(this,e,n);if(!t&&r.apply)return r.apply(e,this,n);if(t){return n.unshift(e),new(e.bind.apply(e,n))}return e.apply(this,n)},c=!0):e instanceof Array&&(i=[],a=!0);const u=r.get?function(e){return o("get"),r.get(this,e,i)}:function(e){return o("get"),this[e]},f=r.set?function(e,t){o("set");r.set(this,e,t,i)}:function(e,t){o("set"),this[e]=t},p=Object.getOwnPropertyNames(e),l={};p.forEach(function(t){if((c||a)&&t in i)return;const n={enumerable:!!Object.getOwnPropertyDescriptor(e,t).enumerable,get:u.bind(e,t),set:f.bind(e,t)};Object.defineProperty(i,t,n),l[t]=!0});let d=!0;if(Object.setPrototypeOf?Object.setPrototypeOf(i,Object.getPrototypeOf(e)):i.__proto__?i.__proto__=e.__proto__:d=!1,r.get||!d)for(let t in e)l[t]||Object.defineProperty(i,t,{get:u.bind(e,t)});return Object.seal(e),Object.seal(i),i}).revocable=function(n,r){return{proxy:new e(n,r),revoke:t}},e};var n=Object.freeze({});let r,o;const s=new WeakMap,i=new WeakMap,c=new WeakMap,a=new WeakMap,u=new WeakMap;let f={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return i.get(e);if("objectStoreNames"===t)return e.objectStoreNames||c.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return y(e[t])},has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function p(e){f=e(f)}function l(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(o||(o=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(b(this),t),y(s.get(this))}:function(...t){return y(e.apply(b(this),t))}:function(t,...n){const r=e.call(b(this),t,...n);return c.set(r,t.sort?t.sort():[t]),y(r)}}function d(e){return"function"==typeof e?l(e):(e instanceof IDBTransaction&&function(e){if(i.has(e))return;const t=new Promise((t,n)=>{const r=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",s),e.removeEventListener("abort",s)},o=()=>{t(),r()},s=()=>{n(e.error),r()};e.addEventListener("complete",o),e.addEventListener("error",s),e.addEventListener("abort",s)});i.set(e,t)}(e),t(e,r||(r=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction]))?new n(e,f):e)}function y(e){if(e instanceof IDBRequest)return function(e){const t=new Promise((t,n)=>{const r=()=>{e.removeEventListener("success",o),e.removeEventListener("error",s)},o=()=>{t(y(e.result)),r()},s=()=>{n(e.error),r()};e.addEventListener("success",o),e.addEventListener("error",s)});return t.then(t=>{t instanceof IDBCursor&&s.set(t,e)}).catch(()=>{}),u.set(t,e),t}(e);if(a.has(e))return a.get(e);const t=d(e);return t!==e&&(a.set(e,t),u.set(t,e)),t}const b=e=>u.get(e);const h=["get","getKey","getAll","getAllKeys","count"],g=["put","add","delete","clear"],D=new Map;function w(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(D.get(t))return D.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,o=g.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!o&&!h.includes(n))return;const s=async function(e,...t){const s=this.transaction(e,o?"readwrite":"readonly");let i=s.store;r&&(i=i.index(t.shift()));const c=i[n](...t);return o&&await s.done,c};return D.set(t,s),s}p(e=>({get:(t,n,r)=>w(t,n)||e.get(t,n,r),has:(t,n)=>!!w(t,n)||e.has(t,n)}));const I=["continue","continuePrimaryKey","advance"],v={},B=new WeakMap,m=new WeakMap,j={get(e,t){if(!I.includes(t))return e[t];let n=v[t];return n||(n=v[t]=function(...e){B.set(this,m.get(this)[t](...e))}),n}};async function*O(...e){let t=this;if(t instanceof IDBCursor||(t=await t.openCursor(...e)),!t)return;t=t;const n=new Proxy(t,j);for(m.set(n,t),u.set(n,b(t));t;)yield n,t=await(B.get(n)||t.continue()),B.delete(n)}function E(e,n){return n===Symbol.asyncIterator&&t(e,[IDBIndex,IDBObjectStore,IDBCursor])||"iterate"===n&&t(e,[IDBIndex,IDBObjectStore])}return p(e=>({get:(t,n,r)=>E(t,n)?O:e.get(t,n,r),has:(t,n)=>E(t,n)||e.has(t,n)})),e.deleteDB=function(e,{blocked:t}={}){const n=indexedDB.deleteDatabase(e);return t&&n.addEventListener("blocked",()=>t()),y(n).then(()=>void 0)},e.openDB=function(e,t,{blocked:n,upgrade:r,blocking:o}={}){const s=indexedDB.open(e,t),i=y(s);return r&&s.addEventListener("upgradeneeded",e=>{r(y(s.result),e.oldVersion,e.newVersion,y(s.transaction))}),n&&s.addEventListener("blocked",()=>n()),o&&i.then(e=>e.addEventListener("versionchange",o)),i},e.unwrap=b,e.wrap=y,e}({});
