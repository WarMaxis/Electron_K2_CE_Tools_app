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


//PhantomJS options
var PhantomOptions = {
    onLoadFinished: function () {
        if ('dontShowCookiesBar' == 'dontShowCookiesBar') {
            if (document.getElementsByClassName('cookie-bar')[0]) {
                var cookieBar = document.getElementsByClassName('cookie-bar')[0];

                cookieBar.style.display = 'none';
            }
        } else {
            var footer = document.getElementsByClassName('footer')[0];

            footer.style.bottom = '0';
            footer.style.paddingBottom = '120px';
        }
    },
    userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
    windowSize: {
        width: 1366,
        height: 768
    },
    shotSize: {
        width: 'all',
        height: 'all'
    },
    shotOffset: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    defaultWhiteBackground: true,
    customCSS: '',
    takeShotOnCallback: false,
    streamType: 'png',
    siteType: 'url',
    renderDelay: 10000,
    quality: 100,
    errorIfStatusIsNot200: false,
    errorIfJSException: false,
    cookies: [],
    captureSelector: false,
    zoomFactor: 1
};


// Make screenshots from URLs
var makeScreenshotsInterval = 0;
var makeScreenshotsUserDelay = 2000;
var urlListForEachStep = 0;
var urlListForEachStepAsync = 0;

var controlObject = {
    controlUrls: [],
    isDone: [],
    unsortedPDF: []
}

function makeScreenshots() {
    urlList.forEach(function (string) {
        controlObject.controlUrls[urlListForEachStep] = string;
        controlObject.isDone[urlListForEachStep] = false;

        makeScreenshotsInterval = makeScreenshotsInterval + makeScreenshotsUserDelay;
        urlListForEachStep = urlListForEachStep + 1;

        if (urlList.length == urlListForEachStep) {
            console.log('Szacowany czas robienia screenów: ' + (Math.round(makeScreenshotsInterval / 1000 / 60)) + ' min');
        }

        setTimeout(function () {
            var screenshot = string.replace('http://', '').replace('https://', '').replace(/([/])/gi, '-').replace(/([.])/g, '_'),
                screenshotFileName;

            if (screenshot.substr(-1) === '-') {
                screenshotFileName = screenshot.replace(/.$/, '');
            } else {
                screenshotFileName = screenshot;
            }

            var screenshotDestination = baseDirectory + currentDateAndTime + '/' + screenshotFileName + '.' + PhantomOptions.streamType;

            controlObject.unsortedPDF[urlListForEachStepAsync] = baseDirectory + currentDateAndTime + '\\' + screenshotFileName + '.' + 'pdf';

            urlListForEachStepAsync = urlListForEachStepAsync + 1;

            console.log('\n✔ Rozpoczęcie robienia screenshota ze strony:\n' + string + '\n');

            webshot(string, screenshotDestination, PhantomOptions, function (err) {
                if (err) {
                    console.log(err);
                    console.log(screenshotFileName);

                    return document.dispatchEvent(errorEvent);
                } else {
                    var dimensions = sizeOf(screenshotDestination);

                    var doc = new PDFDocument({
                        size: [dimensions.width + 100, dimensions.height + 200],
                        margins: {
                            top: 50,
                            bottom: 50,
                            left: 50,
                            right: 50
                        }
                    });

                    doc.pipe(fse.createWriteStream(baseDirectory + currentDateAndTime + '/' + screenshotFileName + '.pdf'));

                    doc.image(screenshotDestination, (doc.page.width - dimensions.width) / 2);

                    doc.text(string, (doc.page.width - dimensions.width) / 2, dimensions.height + 100);

                    doc.end();

                    console.log('\n✔ SCREENSHOT WYKONANY\n' + screenshotFileName + '\n');

                    document.dispatchEvent(successEvent);

                    for (var i = 0; i < controlObject.controlUrls.length; i++) {
                        if (controlObject.controlUrls[i] === string) {
                            controlObject.isDone[i] = true;
                        }
                    }
                }
            });
        }, makeScreenshotsInterval);
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


// Merge PDF files into one
var pdfArray = [];
var sortPDF = false;
var pdfArrayNotSort = [];

function mergePDF() {
    if (sortPDF === true) {
        fse.readdirSync(baseDirectory + currentDateAndTime).forEach(file => {
            if (file.includes('.pdf')) {
                var fileWithoutPDF = (baseDirectory + currentDateAndTime + '\\' + file).replace('.pdf', '');

                pdfArray.push(fileWithoutPDF);
            }
        })

        pdfArray.sort();

        for (var i = 0; i < pdfArray.length; i++) {
            pdfArray[i] = pdfArray[i] + '.pdf';
        }
    } else {
        pdfArray = controlObject.unsortedPDF;
    }

    console.log(pdfArray);

    console.log('\nRozpoczynanie mergowania PDFów.')

    var pdfCounter = 0;

    setTimeout(function () {
        pdfArray.forEach(function (pdf) {
            fse.copy(pdf, baseDirectory + currentDateAndTime + '\\' + 'temp' + '\\' + pdfCounter + '.pdf', {
                replace: false
            }, function (err) {
                if (err) {
                    throw err;
                }
            });

            pdfArrayNotSort[pdfCounter] = baseDirectory + currentDateAndTime + '\\' + 'temp' + '\\' + pdfCounter + '.pdf';

            pdfCounter = pdfCounter + 1;
        });

        setTimeout(function () {
            PDFMerge(pdfArrayNotSort, {
                output: baseDirectory + 'Merged.pdf'
            }).then((buffer) => {
                console.log('\nPliki PDF zmergowane!\n\nKONIEC!!!')
            });
        }, 30000);

        setTimeout(function () {
            fse.removeSync(baseDirectory + currentDateAndTime + '\\' + 'temp');

            console.log('\nUsunięto pliki tymczasowe!')
        }, 40000);
    }, 40000);
}
