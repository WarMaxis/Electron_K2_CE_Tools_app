// File-name-changer Controller module

'use strict';

// App buttons and alerts DOM objects
const appObjects = {
    chooseFiles: document.getElementById('app-choose-files-button'),
    startApp: document.getElementById('app-start-button'),
    chooseFilesAlert: document.getElementsByClassName('alert-warning'),
    appSuccessAlert: document.getElementsByClassName('alert-success'),
    filesQuantity: document.getElementById('files-quantity'),
    filesTable: document.getElementById('files-table-list'),
    alertContainerFirst: document.getElementById('alert-container-first'),
    alertContainerSuccess: document.getElementById('alert-container-success')
};

// HTML objects markup
const htmlMarkup = {
    chooseFilesAlert: '<div id="choose-files-alert" class="alert alert-warning alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><strong>Nie wybrałeś żadnego folderu!</strong></div>',
    appSuccessAlert: '<div id="app-success-alert" class="alert alert-success alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><strong>Zmiana nazw plików zakończona!</strong></div>'
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
            appObjects.alertContainerFirst.innerHTML += htmlMarkup.chooseFilesAlert;

            appObjects.chooseFilesAlert[0].style.display = 'block';
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

// Success rename and copy files
function successRenameAndCopy() {
    appObjects.filesTable.innerHTML = '';

    appObjects.appSuccessAlert[0].style.display = 'block';
    appObjects.filesQuantity.style.display = 'none';

    appObjects.startApp.setAttribute('disabled', 'disabled');

    return;
}

// Choose files to rename
appObjects.chooseFiles.onclick = function () {
    appObjects.filesTable.innerHTML = '';

    appObjects.appSuccessAlert[0].style.display = 'none';
    appObjects.chooseFilesAlert[0].style.display = 'none';
    appObjects.filesQuantity.style.display = 'none';

    appObjects.startApp.setAttribute('disabled', 'disabled');

    console.clear();

    return chooseFiles();
};

// Start files name change
appObjects.startApp.onclick = function () {
    appObjects.alertContainerSuccess.innerHTML += htmlMarkup.appSuccessAlert;

    return createDirectory(renameAndCopyFiles);
};