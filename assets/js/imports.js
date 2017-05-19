// Node and Electron modules

'use strict';

const fse = require('fs-extra'),
    recursive = require('recursive-readdir'),
    app = require('electron').remote,
    dialog = app.dialog,

    request = require('request'),
    progress = require('request-progress'),
    imagemin = require('imagemin'),
    imageminMozjpeg = require('imagemin-mozjpeg'),
    imageminPngquant = require('imagemin-pngquant');
