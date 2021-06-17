const {isDev, mustacheRender} = require('./snowpack.utils')
const path = require('path')
const {ensureDirSync} = require('fs-extra')

const extDir = path.resolve(__dirname, '../packages/browser-extension')

ensureDirSync(path.resolve(extDir, 'build'))

mustacheRender(
  path.resolve(extDir, 'manifest.json.mustache'),
  isDev()
    ? path.resolve(extDir, 'manifest.json')
    : path.resolve(extDir, 'build/manifest.json'),
  {
    contentSecurityPolicy: isDev()
      ? `
"content_security_policy": "
default-src 'self';
script-src 'self' 'unsafe-eval' http://localhost:18001 http://localhost:18002 http://localhost:18003;
connect-src * data: blob: filesystem:;
style-src 'self' data: chrome-extension-resource: 'unsafe-inline';
img-src 'self' data: chrome-extension-resource:;
frame-src 'self' http://localhost:* data: chrome-extension-resource:;
font-src 'self' data: chrome-extension-resource:;
media-src * data: blob: filesystem:;",`.replaceAll('\n', ' ')
      : '',
    name: isDev() ? 'AHelios' : 'Helios',
    backgroundScripts: isDev()
      ? '"reload.js","background.dev.js"'
      : '"background/dist/index.prod.js"',
    contentScripts: '"content-script.js"',
    webResources: '"content-script.js","inpage.js"',
    popupHTML: isDev() ? 'popup.html' : 'popup/index.html',
    permissions: isDev()
      ? '"http://localhost:18001/",\n "http://localhost:18002/",\n "http://localhost:18003/",\n "tabs",\n'
      : '',
  },
)