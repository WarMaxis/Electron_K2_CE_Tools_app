// Global functions and utilities

'use strict';

// Get current system date and time
function getDateAndTime() {
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
    currentDateAndTime = getDateAndTime();
    fse.mkdirSync(baseDirectory + currentDateAndTime);
    return callback();
}

// Replace all polish diacritics and spaces
String.prototype.removeDiacritics = function () {
    return this
        .replace(/ą/g, 'a').replace(/Ą/g, 'A')
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

// Create custom success event
const successEvent = new Event('successEvent');