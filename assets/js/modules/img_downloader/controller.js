// Img-downloader Controller module

'use strict';

// App buttons and alerts DOM objects
const appObjects = {
    chooseURLs: document.getElementById('app-choose-urls-button'),
    chooseDirectory: document.getElementById('app-choose-directory-button'),
    startApp: document.getElementById('app-start-button'),
    chooseURLsAlert: document.getElementsByClassName('alert-warning'),
    chooseDirectoryAlert: document.getElementsByClassName('alert-choose-directory'),
    outputDirectoryAlert: document.getElementsByClassName('alert-info'),
    appSuccessAlert: document.getElementsByClassName('alert-success'),
    filesQuantity: document.getElementById('files-quantity'),
    filesTable: document.getElementById('files-table-list'),
    alertContainerFirst: document.getElementById('alert-container-first'),
    alertContainerDirectory: document.getElementById('alert-container-choose-directory'),
    alertContainerSuccess: document.getElementById('alert-container-success'),
    outputDirectory: document.getElementById('output-directory'),
    spinnerModal: document.getElementById('spinner-modal')
};


// HTML objects markup
const htmlMarkup = {
    chooseURLsAlert: '<div class="alert alert-warning alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><strong>Nie wybrałeś żadnego pliku!</strong></div>',
    chooseDirectoryAlert: '<div class="alert alert-warning alert-dismissible fade in alert-choose-directory" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><strong>Nie wybrałeś żadnego folderu!</strong></div>',
    appSuccessAlert: '<div class="alert alert-success alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><strong>Pobieranie plików i kompresja zakończona!</strong></div>'
};


// Get URLs list path
function chooseURLsList() {
    dialog.showOpenDialog({
        title: 'Wybierz plik .txt z listą URL-ów plików do pobrania',
        properties: ['openFile'],
        filters: [
            {
                name: 'Pliki .txt',
                extensions: ['txt']
            }
        ]
    }, function (fileName) {
        if (fileName === undefined) {
            appObjects.alertContainerFirst.innerHTML += htmlMarkup.chooseURLsAlert;

            appObjects.chooseURLsAlert[0].style.display = 'block';
            appObjects.filesQuantity.style.display = 'none';

            appObjects.startApp.setAttribute('disabled', 'disabled');

            return;
        } else {
            appObjects.chooseDirectory.removeAttribute('disabled');

            getURLsList(fileName[0]);

            appObjects.filesQuantity.innerHTML = urlList.length;

            urlList.forEach(function (fileName, fileNumber) {
                fileNumber += 1;
                appObjects.filesTable.innerHTML += '<tr><th scope="row">' + fileNumber + '</th><td>' + fileName + '</td></tr>';
            });

            appObjects.filesQuantity.style.display = 'block';

            return;
        }
    });
}


// Output directory
function chooseDirectory() {
    dialog.showOpenDialog({
        title: 'Wybierz folder docelowy',
        properties: ['openDirectory']
    }, function (folderPaths) {
        // folderPaths is an array that contains all the selected paths
        if (folderPaths === undefined) {
            appObjects.alertContainerDirectory.innerHTML += htmlMarkup.chooseDirectoryAlert;

            appObjects.chooseDirectoryAlert[0].style.display = 'block';

            return;
        } else {
            baseDirectory = folderPaths[0] + '/';

            appObjects.outputDirectoryAlert[0].style.display = 'block';

            appObjects.outputDirectory.innerHTML = folderPaths[0];

            appObjects.startApp.removeAttribute('disabled');

            appObjects.filesQuantity.style.opacity = '1.0';

            return;
        }
    });
}


// Choose URLs list
appObjects.chooseURLs.onclick = function () {
    appObjects.filesTable.innerHTML = '';
    appObjects.filesQuantity.innerHTML = '';

    appObjects.appSuccessAlert[0].style.display = 'none';
    appObjects.chooseDirectoryAlert[0].style.display = 'none';
    appObjects.outputDirectoryAlert[0].style.display = 'none';
    appObjects.chooseURLsAlert[0].style.display = 'none';
    appObjects.filesQuantity.style.display = 'none';

    appObjects.chooseDirectory.setAttribute('disabled', 'disabled');
    appObjects.startApp.setAttribute('disabled', 'disabled');

    appObjects.filesQuantity.style.opacity = '0.5';

    console.clear();

    return chooseURLsList();
};


// Choose output directory
appObjects.chooseDirectory.onclick = function () {
    appObjects.outputDirectoryAlert[0].style.display = 'none';
    appObjects.chooseDirectoryAlert[0].style.display = 'none';
    appObjects.appSuccessAlert[0].style.display = 'none';
    appObjects.chooseURLsAlert[0].style.display = 'none';

    appObjects.startApp.setAttribute('disabled', 'disabled');

    appObjects.filesQuantity.style.opacity = '0.5';

    return chooseDirectory();
};


// Start download and compress files
appObjects.startApp.onclick = function () {
    appObjects.alertContainerSuccess.innerHTML += htmlMarkup.appSuccessAlert;

    $('#spinner-modal').modal('show');

    return createDirectoryImgDownloader(downloadImages);
};


// Success download and compress files
document.addEventListener('successEvent', function successDownloadAndCompress() {
    appObjects.filesTable.innerHTML = '';

    appObjects.appSuccessAlert[0].style.display = 'block';
    appObjects.filesQuantity.style.display = 'none';
    appObjects.outputDirectoryAlert[0].style.display = 'none';

    appObjects.startApp.setAttribute('disabled', 'disabled');
    appObjects.chooseDirectory.setAttribute('disabled', 'disabled');

    $('#spinner-modal').modal('hide');

    return;
}, false);