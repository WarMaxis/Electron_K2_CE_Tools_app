// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

'use strict';

// Node and Electron modules
const fs = require('fs'),
    recursive = require('recursive-readdir'),
    fse = require('fs-extra'),
    path = require('path'),
    app = require('electron').remote,
    dialog = app.dialog;

// App buttons and alerts DOM objects
const appObjects = {
    chooseFiles: document.getElementById('app-choose-files-button'),
    startApp: document.getElementById('app-start-button'),
    chooseFilesAlert: document.getElementsByClassName('alert-warning'),
    appSuccessAlert: document.getElementsByClassName('alert-success'),
    filesQuantity: document.getElementById('files-quantity'),
    filesTable: document.getElementById('files-table-list')
};

// Work files directory
var filesDirectory;

function chooseFiles() {
    dialog.showOpenDialog({
        title: 'Wybierz folder',
        properties: ['openDirectory']
    }, function (folderPaths) {
        // folderPaths is an array that contains all the selected paths
        if (folderPaths === undefined) {
            appObjects.chooseFilesAlert[0].style.display = 'block';
            document.getElementById('alert-container-firtst').innerHTML += '<div id="choose-files-alert" class="alert alert-warning alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><strong>Nie wybrałeś żadnego folderu!</strong></div>';
            appObjects.filesQuantity.style.display = 'none';
            appObjects.startApp.setAttribute('disabled', 'disabled');
            return;
        } else {
            filesDirectory = folderPaths[0];
            appObjects.startApp.removeAttribute('disabled');
            recursive(filesDirectory, function (error, allFiles) {
                appObjects.filesQuantity.innerHTML = allFiles.length;
                allFiles.forEach(function (fileName, fileNumber) {
                    fileNumber += 1;
                    appObjects.filesTable.innerHTML += '<tr><th scope="row">' + fileNumber + '</th><td>' + fileName + '</td></tr>';
                });
            });
            appObjects.filesQuantity.style.display = 'block';
            return;
        }
    });
}

// Get current system date and time
function getDateTime() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? '0' : '') + hour;

    var min = date.getMinutes();
    min = (min < 10 ? '0' : '') + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? '0' : '') + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? '0' : '') + month;

    var day = date.getDate();
    day = (day < 10 ? '0' : '') + day;

    return year + '-' + month + '-' + day + '-' + hour + '-' + min + '-' + sec;
}

// Create new directory base on current system date and time
const baseDirectory = '../';
var currentDateAndTime;

function createDirectory(callback) {
    currentDateAndTime = getDateTime();
    fs.mkdirSync(baseDirectory + currentDateAndTime);
    callback();
}

// Replace all polish diacritics and spaces
String.prototype.escapeDiacritics = function () {
    return this.replace(/ą/g, 'a').replace(/Ą/g, 'A')
        .replace(/ć/g, 'c').replace(/Ć/g, 'C')
        .replace(/ę/g, 'e').replace(/Ę/g, 'E')
        .replace(/ł/g, 'l').replace(/Ł/g, 'L')
        .replace(/ń/g, 'n').replace(/Ń/g, 'N')
        .replace(/ó/g, 'o').replace(/Ó/g, 'O')
        .replace(/ś/g, 's').replace(/Ś/g, 'S')
        .replace(/ż/g, 'z').replace(/Ż/g, 'Z')
        .replace(/ź/g, 'z').replace(/Ź/g, 'Z')
        .replace(/ /g, '_');
};

// Get list of files, copy and rename them
function copyAndRenameFiles() {
    recursive(filesDirectory, function (error, allFiles) {
        if (error) {
            console.log('\n X Wystąpił błąd, spróbuj jeszcze raz bądź sprawdź poprawność ustawień. \n');
            return;
        }

        allFiles.forEach(function (fileName) {
            var fileOutput = fileName.split('\\');
            fileOutput.shift();
            var fileOnlyName = fileOutput.pop().escapeDiacritics();
            var fileOutputPath = fileOutput.join('\\');
            var fileOutputPathWithout = fileOutputPath.escapeDiacritics();
            fse.ensureDir(baseDirectory + currentDateAndTime + '\\' + fileOutputPathWithout);
            fse.copy(fileName, baseDirectory + currentDateAndTime + '\\' + fileOutputPathWithout + '\\' + fileOnlyName, err => {
                if (err) {
                    return console.error(err);
                }
                console.log('\n✔ KOPIOWANIE ZAKOŃCZONE \n' + 'Folder docelowy: ' + baseDirectory + currentDateAndTime + '    ' + fileOnlyName + '\n');
                appObjects.appSuccessAlert[0].style.display = 'block';
                appObjects.filesTable.innerHTML = "";
                appObjects.filesQuantity.style.display = 'none';
                appObjects.startApp.setAttribute('disabled', 'disabled');
            });
        });
    });
}

appObjects.chooseFiles.onclick = function () {
    document.getElementById('alert-container-second').innerHTML += '<div id="app-success-alert" class="alert alert-success alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><strong>Zmiana nazw plików zakończona!</strong></div>';
    appObjects.appSuccessAlert[0].style.display = 'none';
    appObjects.chooseFilesAlert[0].style.display = 'none';
    appObjects.startApp.setAttribute('disabled', 'disabled');
    appObjects.filesQuantity.style.display = 'none';
    appObjects.filesTable.innerHTML = "";
    console.clear();
    chooseFiles();
};

appObjects.startApp.onclick = function () {
    createDirectory(copyAndRenameFiles);
};