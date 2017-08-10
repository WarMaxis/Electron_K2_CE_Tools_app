// ScreenShooter Controller module

'use strict';

// App buttons and alerts DOM objects
const appObjects = {

    // Buttons
    chooseURLs: document.getElementById('app-choose-urls-button'),
    chooseDirectory: document.getElementById('app-choose-directory-button'),
    addRemoteDirectory: document.getElementById('app-add-remote-directory-button'),
    startApp: document.getElementById('app-start-button'),

    // Alerts
    chooseURLsAlert: document.getElementsByClassName('alert-warning'),
    chooseDirectoryAlert: document.getElementsByClassName('alert-choose-directory'),
    outputDirectoryAlert: document.getElementsByClassName('alert-info'),
    addRemoteDirectoryAlert: document.getElementsByClassName('alert-remote-directory'),
    outputRemoteDirectoryAlert: document.getElementsByClassName('remote-directory'),
    appSuccessAlert: document.getElementsByClassName('alert-success'),

    screenshotsQuantity: document.getElementById('screenshots-quantity'),
    filesTable: document.getElementById('files-table-list'),

    // Alerts containers
    alertContainerFirst: document.getElementById('alert-container-first'),
    alertContainerDirectory: document.getElementById('alert-container-choose-directory'),
    alertContainerRemoteDirectory: document.getElementById('alert-container-remote-directory'),
    alertContainerSuccess: document.getElementById('alert-container-success'),

    // Output directories
    outputDirectory: document.getElementById('output-directory'),
    outputRemoteDirectory: document.getElementById('output-remote-directory'),

    // Modal
    spinnerModal: document.getElementById('spinner-modal'),
    modalSuccessQuantity: document.getElementById('app-modal-success-quantity'),
    modalFailQuantity: document.getElementById('app-modal-fail-quantity'),
    spinner: document.getElementsByClassName('sk-circle')[0],
    modalTitle: document.getElementsByClassName('modal-title')[0],
    modalAlertIcon: document.getElementsByClassName('glyphicon-warning-sign')[0]
};


// HTML objects markup
const htmlMarkup = {
    chooseURLsAlert: '<div class="alert alert-warning alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><strong>Nie wybrałeś żadnego pliku!</strong></div>',
    chooseDirectoryAlert: '<div class="alert alert-warning alert-dismissible fade in alert-choose-directory" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><strong>Nie wybrałeś żadnego folderu!</strong></div>',
    chooseRemoteDirectoryAlert: '<div class="alert alert-warning alert-dismissible fade in alert-remote-directory" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><strong>Nie wybrałeś żadnego folderu!</strong></div>',
    appSuccessAlert: '<div class="alert alert-success alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><strong>Zapisywanie screenshotów zakończone!</strong></div>'
};


// Get URLs list path
function chooseURLsList() {
    dialog.showOpenDialog({
        title: 'Wybierz plik .txt z listą URL-ów stron internetowych',
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

            return;
        } else {
            appObjects.chooseDirectory.removeAttribute('disabled');

            getURLsList(fileName[0]);

            appObjects.screenshotsQuantity.innerHTML = urlList.length;

            urlList.forEach(function (urlName, urlNumber) {
                urlNumber += 1;
                appObjects.filesTable.innerHTML += '<tr><th scope="row">' + urlNumber + '</th><td>' + urlName + '</td></tr>';
            });

            appObjects.screenshotsQuantity.style.display = 'block';

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
            appObjects.addRemoteDirectory.removeAttribute('disabled');

            appObjects.screenshotsQuantity.style.opacity = '1.0';

            return;
        }
    });
}


// Remote directory
function chooseRemoteDirectory() {
    dialog.showOpenDialog({
        title: 'Wybierz zdalny folder docelowy (AVALON)',
        properties: ['openDirectory']
    }, function (folderPaths) {
        // folderPaths is an array that contains all the selected paths
        if (folderPaths === undefined) {
            appObjects.alertContainerRemoteDirectory.innerHTML += htmlMarkup.chooseRemoteDirectoryAlert;

            appObjects.addRemoteDirectoryAlert[0].style.display = 'block';

            appObjects.startApp.removeAttribute('disabled');

            appObjects.screenshotsQuantity.style.opacity = '1.0';

            return;
        } else {
            remoteDirectory = folderPaths[0] + '/';

            appObjects.outputRemoteDirectoryAlert[0].style.display = 'block';

            appObjects.startApp.removeAttribute('disabled');

            appObjects.screenshotsQuantity.style.opacity = '1.0';

            appObjects.outputRemoteDirectory.innerHTML = folderPaths[0];

            return;
        }
    });
}


// Choose URLs list
appObjects.chooseURLs.onclick = function () {
    appObjects.filesTable.innerHTML = '';
    appObjects.screenshotsQuantity.innerHTML = '';

    appObjects.appSuccessAlert[0].style.display = 'none';
    appObjects.chooseDirectoryAlert[0].style.display = 'none';
    appObjects.addRemoteDirectoryAlert[0].style.display = 'none';
    appObjects.outputDirectoryAlert[0].style.display = 'none';
    appObjects.outputRemoteDirectoryAlert[0].style.display = 'none';
    appObjects.chooseURLsAlert[0].style.display = 'none';
    appObjects.screenshotsQuantity.style.display = 'none';

    appObjects.chooseDirectory.setAttribute('disabled', 'disabled');
    appObjects.startApp.setAttribute('disabled', 'disabled');
    appObjects.addRemoteDirectory.setAttribute('disabled', 'disabled');

    appObjects.screenshotsQuantity.style.opacity = '0.5';

    console.clear();

    return chooseURLsList();
};


// Choose output directory
appObjects.chooseDirectory.onclick = function () {
    appObjects.outputDirectoryAlert[0].style.display = 'none';
    appObjects.chooseDirectoryAlert[0].style.display = 'none';
    appObjects.appSuccessAlert[0].style.display = 'none';
    appObjects.addRemoteDirectoryAlert[0].style.display = 'none';
    appObjects.outputRemoteDirectoryAlert[0].style.display = 'none';

    appObjects.startApp.setAttribute('disabled', 'disabled');
    appObjects.addRemoteDirectory.setAttribute('disabled', 'disabled');

    appObjects.screenshotsQuantity.style.opacity = '0.5';

    return chooseDirectory();
};


// Choose remote directory
appObjects.addRemoteDirectory.onclick = function () {
    appObjects.outputRemoteDirectoryAlert[0].style.display = 'none';
    appObjects.addRemoteDirectoryAlert[0].style.display = 'none';
    appObjects.appSuccessAlert[0].style.display = 'none';

    appObjects.startApp.setAttribute('disabled', 'disabled');

    appObjects.screenshotsQuantity.style.opacity = '0.5';

    return chooseRemoteDirectory();
};


// Start making screenshots
appObjects.startApp.onclick = function () {
    appObjects.alertContainerSuccess.innerHTML += htmlMarkup.appSuccessAlert;

    $('#spinner-modal').modal('show');

    return;
};


// Success make screenshots and save files on local directory
var successQuantity = 0;

document.addEventListener('successEvent', function successScreenshotsAndSaveFiles() {
    successQuantity = successQuantity + 1;

    if (successQuantity === urlList.length) {
        appObjects.modalSuccessQuantity.textContent = 'Zrobione i zapisane screenshoty: ' + successQuantity + ' / ' + urlList.length;

        appObjects.filesTable.innerHTML = '';

        appObjects.appSuccessAlert[0].style.display = 'block';
        appObjects.screenshotsQuantity.style.display = 'none';
        appObjects.outputDirectoryAlert[0].style.display = 'none';

        appObjects.startApp.setAttribute('disabled', 'disabled');
        appObjects.chooseDirectory.setAttribute('disabled', 'disabled');

        $('#spinner-modal').modal('hide');

        successQuantity = 0;
        errorQuantity = 0;

        appObjects.modalSuccessQuantity.textContent = '';

        appObjects.modalSuccessQuantity.style.display = 'none';
    } else if ((successQuantity + errorQuantity) === urlList.length) {
        appObjects.modalSuccessQuantity.textContent = 'Zrobione i zapisane screenshoty: ' + successQuantity + ' / ' + urlList.length;

        appObjects.spinner.style.display = 'none';
        appObjects.modalAlertIcon.style.display = 'block';

        appObjects.modalTitle.textContent = 'Wystąpiły błędy zrobienia screenshotów';

        errorQuantity = 0;
        successQuantity = 0;
    } else {
        appObjects.modalSuccessQuantity.style.display = 'block';

        appObjects.modalSuccessQuantity.textContent = 'Zrobione i zapisane screenshoty: ' + successQuantity + ' / ' + urlList.length;
    }

    return;
}, false);


// Fail make screenshots
var errorQuantity = 0;

document.addEventListener('errorEvent', function () {
    errorQuantity = errorQuantity + 1;

    if ((successQuantity + errorQuantity) === urlList.length) {
        appObjects.modalFailQuantity.textContent = 'Błędy zrobienia screenshotów: ' + errorQuantity + ' / ' + urlList.length;

        appObjects.spinner.style.display = 'none';
        appObjects.modalAlertIcon.style.display = 'block';

        appObjects.modalTitle.textContent = 'Wystąpiły błędy zrobienia screenshotów';

        errorQuantity = 0;
        successQuantity = 0;
    } else {
        appObjects.modalFailQuantity.style.display = 'block';

        appObjects.modalFailQuantity.textContent = 'Błędy zrobienia screenshotów: ' + errorQuantity + ' / ' + urlList.length;
    }

    return;
}, false);
