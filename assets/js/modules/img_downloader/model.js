// Img-downloader Model module

'use strict';

// Create new directory base on current system date and time
function createDirectoryImgDownloader(callback) {
    currentDateAndTime = getDateAndTime();
    fse.mkdirSync(baseDirectory + currentDateAndTime);
    return callback();
}


// Get URLs list from .txt file
var urlList = [];

function getURLsList(listPath) {
    urlList = fse.readFileSync(listPath).toString().split("\r\n");
}


// Download images from URLs
function downloadImages() {
    var download = function (url, destination, callback) {
        progress(request.get(url), {
                throttle: 10000,
            })
            .on('error', function (error) {
                console.log(error);
            })
            .on('progress', function (state) {
                console.log('progress', state);
            })
            .pipe(fse.createWriteStream(destination))
            .on('close', callback);
    };

    urlList.forEach(function (string) {
        var filenameFromUrl = string.split('/').pop();
        var filename = baseDirectory + currentDateAndTime + '/' + string.split('/').pop();
        console.log('\n✔ Rozpoczęcie pobierania pliku\n' + filenameFromUrl + '\n');
        download(string, filename, function () {
            console.log('\n✔ POBIERANIE ZAKOŃCZONE\n' + filename + '\n');
            compressImages(filenameFromUrl);
        });
    });
}


// Compress images function doing after download files
function compressImages(file) {
    imagemin([baseDirectory + currentDateAndTime + '/' + file], baseDirectory + currentDateAndTime + '_compressed', {
        plugins: [
        imageminMozjpeg({
                targa: false
            }),
        imageminPngquant({
                quality: '80'
            })
    ]
    }).then(files => {
        console.log('\n✔ KOMPRESJA ZAKOŃCZONA\n' + baseDirectory + currentDateAndTime + '/' + file + '\n');
    });
}
