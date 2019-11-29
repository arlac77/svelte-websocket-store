[![Build Status](https://secure.travis-ci.org/arlac77/svelte-websocket-store.png)](http://travis-ci.org/arlac77/svelte-websocket-store)
[![codecov.io](http://codecov.io/github/arlac77/svelte-websocket-store/coverage.svg?branch=master)](http://codecov.io/github/arlac77/svelte-websocket-store?branch=master)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Coverage Status](https://coveralls.io/repos/arlac77/svelte-websocket-store/badge.svg)](https://coveralls.io/r/arlac77/svelte-websocket-store)
[![downloads](http://img.shields.io/npm/dm/svelte-websocket-store.svg?style=flat-square)](https://npmjs.org/package/svelte-websocket-store)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/svelte-websocket-store.svg?style=flat-square)](https://github.com/arlac77/svelte-websocket-store/issues)
[![Greenkeeper](https://badges.greenkeeper.io/arlac77/svelte-websocket-store.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/svelte-websocket-store/badge.svg)](https://snyk.io/test/github/arlac77/svelte-websocket-store)
[![minified size](https://badgen.net/bundlephobia/min/svelte-websocket-store)](https://bundlephobia.com/result?p=svelte-websocket-store)
[![npm](https://img.shields.io/npm/v/svelte-websocket-store.svg)](https://www.npmjs.com/package/svelte-websocket-store)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/arlac77/svelte-websocket-store)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Svelte v3](https://img.shields.io/badge/svelte-v3-orange.svg)](https://svelte.dev)

# svelte-websocket-store

Provides a svelte store backed by web-sockets.


```js
import {websocketStore } from 'svelte-websocket-store';

export const myStore = websocketStore("wss://mydomain.com/ws1");
```
