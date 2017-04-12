// File-name-changer module

'use strict';

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
            document.getElementById('alert-container-first').innerHTML += '<div id="choose-files-alert" class="alert alert-warning alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><strong>Nie wybrałeś żadnego folderu!</strong></div>';
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