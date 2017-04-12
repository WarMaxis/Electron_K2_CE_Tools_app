// File-name-changer Model module

'use strict';

// Get list of files, rename and copy them
function renameAndCopyFiles() {
    recursive(filesDirectory, function (error, allFiles) {
        if (error) {
            console.log('\n X Wystąpił błąd, spróbuj jeszcze raz bądź sprawdź poprawność ustawień. \n');
            return;
        } else {
            allFiles.forEach(function (fileName) {
                var fileOutput = fileName.split('\\');
                fileOutput.shift();
                var fileOnlyName = fileOutput.pop().removeDiacritics(),
                    fileOutputPath = fileOutput.join('\\'),
                    fileOutputPathWithoutDiacritics = fileOutputPath.removeDiacritics();

                fse.ensureDir(baseDirectory + currentDateAndTime + '\\' + fileOutputPathWithoutDiacritics);
                fse.copy(fileName, baseDirectory + currentDateAndTime + '\\' + fileOutputPathWithoutDiacritics + '\\' + fileOnlyName, function (err) {
                    if (err) {
                        return console.error(err);
                    } else {
                        console.log('\n ✔ KOPIOWANIE ZAKOŃCZONE \n' + 'Folder docelowy: ' + baseDirectory + currentDateAndTime + '    ' + fileOnlyName + '\n');
                        return successRenameAndCopy();
                    }
                });
            });
        }
    });
}