// ScreenShooter Model module

'use strict';

// Create new directory base on current system date and time
function createDirectoryForScreenshots(callback) {
    currentDateAndTime = getDateAndTime();
    fse.mkdirSync(baseDirectory + currentDateAndTime);
    return callback();
}


// Get URLs list from .txt file
var urlList = [];

function getURLsList(listPath) {
    urlList = fse.readFileSync(listPath).toString().split("\r\n");
}


// Remote directory path
var remoteDirectory = '';


// Make screenshots from URLs
function makeScreenshots() {
    urlList.forEach(function (string) {
        var screenshot = string.replace('http://', '').replace('https://', '').replace(/([/])/gi, '-').replace(/([.])/g, '_'),
            screenshotFileName;

        if (screenshot.substr(-1) === '-') {
            screenshotFileName = screenshot.replace(/.$/, '');
        } else {
            screenshotFileName = screenshot;
        }

        var screenshotDestination = baseDirectory + currentDateAndTime + '/' + screenshotFileName + '.png';

        console.log('\n✔ Rozpoczęcie robienia screenshota ze strony:\n' + string + '\n');

        webshot(string, screenshotDestination, function (err) {
            if (err) {
                console.log(err);
                console.log(screenshotFileName);

                return document.dispatchEvent(errorEvent);
            } else {
                console.log('\n✔ SCREENSHOT WYKONANY\n' + screenshotFileName + '\n');

                document.dispatchEvent(successEvent);
            }
        });
    });
}


// Create .zip archive with all screenshots
function makeArchive(callback) {
    zipFolder(baseDirectory + currentDateAndTime, baseDirectory + currentDateAndTime + '.zip', function (err) {
        if (err) {
            console.log('\nX BŁĄD TWORZENIA ARCHIWUM .ZIP\n' + baseDirectory + currentDateAndTime + '.zip' + '\n');
        } else {
            console.log('\n✔ ARCHIWUM .ZIP WYKONANE POPRAWNIE\n' + baseDirectory + currentDateAndTime + '.zip' + '\n');

            callback();
        }
    });
}


// Copy done .zip archive to remote directory
const zipDoneEvent = new Event('zipDone');

function copyToRemoteDirectory() {
    fse.createReadStream(baseDirectory + currentDateAndTime + '.zip').pipe(fse.createWriteStream(remoteDirectory + currentDateAndTime + '.zip'));

    console.log('\n✔ ARCHIWUM .ZIP WYSŁANO NA ADRES ZDALNY:\n' + remoteDirectory + currentDateAndTime + '.zip' + '\n');

    document.dispatchEvent(zipDoneEvent);
}
