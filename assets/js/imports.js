// Node and Electron modules

'use strict';

const fse = require('fs-extra'),
    recursive = require('recursive-readdir'),
    app = require('electron').remote,
    dialog = app.dialog;