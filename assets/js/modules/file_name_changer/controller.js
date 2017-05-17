// File-name-changer Controller module

'use strict';

// App buttons and alerts DOM objects
const appObjects = {
    chooseFiles: document.getElementById('app-choose-files-button'),
    chooseDirectory: document.getElementById('app-choose-directory-button'),
    startApp: document.getElementById('app-start-button'),
    addCustomDiacritic: document.getElementById('app-add-custom-diacritic-button'),
    chooseFilesAlert: document.getElementsByClassName('alert-warning'),
    chooseDirectoryAlert: document.getElementsByClassName('alert-choose-directory'),
    outputDirectoryAlert: document.getElementsByClassName('alert-info'),
    appSuccessAlert: document.getElementsByClassName('alert-success'),
    filesQuantity: document.getElementById('files-quantity'),
    filesTable: document.getElementById('files-table-list'),
    alertContainerFirst: document.getElementById('alert-container-first'),
    alertContainerDirectory: document.getElementById('alert-container-choose-directory'),
    alertContainerSuccess: document.getElementById('alert-container-success'),
    outputDirectory: document.getElementById('output-directory'),
    inputDiacritic: document.getElementById('special-diacritic-input'),
    specialDiacriticContainer: document.getElementById('alert-special-diacritic'),
    specialDiacriticAlert: document.getElementById('special-diacritic'),
    addButtonConfirmDiacritic: document.getElementById('app-confirm-special-diacritic'),
    inputAlert: document.getElementsByClassName('bg-danger')[0],
    exitModal: document.getElementById('app-exit-modal'),
    appModal: document.getElementById('add-special-diacritic-modal'),
    closeButtonModal: document.getElementById('app-close-modal-button'),
    spinnerModal: document.getElementById('spinner-modal')
};


// HTML objects markup
const htmlMarkup = {
    chooseFilesAlert: '<div class="alert alert-warning alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><strong>Nie wybrałeś żadnego folderu!</strong></div>',
    chooseDirectoryAlert: '<div class="alert alert-warning alert-dismissible fade in alert-choose-directory" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><strong>Nie wybrałeś żadnego folderu!</strong></div>',
    appSuccessAlert: '<div class="alert alert-success alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><strong>Zmiana nazw plików zakończona!</strong></div>'
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

            appObjects.chooseDirectory.removeAttribute('disabled');

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
            appObjects.addCustomDiacritic.removeAttribute('disabled');

            appObjects.filesQuantity.style.opacity = '1.0';

            return;
        }
    });
}


// Choose files to rename
appObjects.chooseFiles.onclick = function () {
    appObjects.filesTable.innerHTML = '';
    appObjects.filesQuantity.innerHTML = '';
    appObjects.specialDiacriticAlert.innerHTML = '';

    appObjects.appSuccessAlert[0].style.display = 'none';
    appObjects.chooseDirectoryAlert[0].style.display = 'none';
    appObjects.outputDirectoryAlert[0].style.display = 'none';
    appObjects.chooseFilesAlert[0].style.display = 'none';
    appObjects.specialDiacriticContainer.style.display = 'none';
    appObjects.filesQuantity.style.display = 'none';

    appObjects.chooseDirectory.setAttribute('disabled', 'disabled');
    appObjects.startApp.setAttribute('disabled', 'disabled');
    appObjects.addCustomDiacritic.setAttribute('disabled', 'disabled');

    appObjects.filesQuantity.style.opacity = '0.5';

    customDiacritic = '';

    console.clear();

    return chooseFiles();
};


// Choose output directory
appObjects.chooseDirectory.onclick = function () {
    appObjects.outputDirectoryAlert[0].style.display = 'none';
    appObjects.chooseDirectoryAlert[0].style.display = 'none';
    appObjects.appSuccessAlert[0].style.display = 'none';
    appObjects.chooseFilesAlert[0].style.display = 'none';
    appObjects.specialDiacriticContainer.style.display = 'none';

    appObjects.startApp.setAttribute('disabled', 'disabled');
    appObjects.addCustomDiacritic.setAttribute('disabled', 'disabled');

    appObjects.filesQuantity.style.opacity = '0.5';

    customDiacritic = '';

    return chooseDirectory();
};


// Add custom diacritic to remove from files name
var customDiacritic = '';

appObjects.addButtonConfirmDiacritic.onclick = function () {
    var specialDiacritic = appObjects.inputDiacritic.value;

    if (/[A-Za-z0-9]/i.test(specialDiacritic) || specialDiacritic === '') {
        appObjects.inputAlert.style.display = 'block';
    } else {
        customDiacritic = specialDiacritic;

        appObjects.specialDiacriticAlert.innerHTML = customDiacritic;

        appObjects.specialDiacriticContainer.style.display = 'block';

        appObjects.exitModal.click();
    }
};

appObjects.inputDiacritic.onfocus = function () {
    if (appObjects.inputAlert.style.display === 'block') {
        appObjects.inputAlert.style.display = 'none';
    }
};

appObjects.exitModal.onclick = function () {
    appObjects.inputDiacritic.value = '';

    if (appObjects.inputAlert.style.display === 'block') {
        appObjects.inputAlert.style.display = 'none';
    }
};

appObjects.closeButtonModal.onclick = function () {
    appObjects.inputDiacritic.value = '';

    if (appObjects.inputAlert.style.display === 'block') {
        appObjects.inputAlert.style.display = 'none';
    }
};


// Start files name change
appObjects.startApp.onclick = function () {
    appObjects.alertContainerSuccess.innerHTML += htmlMarkup.appSuccessAlert;

    $('#spinner-modal').modal('show');

    return createDirectory(renameAndCopyFiles(customDiacritic));
};


// Success rename and copy files
document.addEventListener('successEvent', function successRenameAndCopy() {
    appObjects.filesTable.innerHTML = '';
    appObjects.specialDiacriticAlert.innerHTML = '';

    appObjects.appSuccessAlert[0].style.display = 'block';
    appObjects.filesQuantity.style.display = 'none';
    appObjects.outputDirectoryAlert[0].style.display = 'none';
    appObjects.specialDiacriticContainer.style.display = 'none';

    appObjects.startApp.setAttribute('disabled', 'disabled');
    appObjects.chooseDirectory.setAttribute('disabled', 'disabled');

    $('#spinner-modal').modal('hide');

    customDiacritic = '';

    return;
}, false);
