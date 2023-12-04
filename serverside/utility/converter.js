const fs = require('fs');
const path = require('path');
const AdmZip = require("adm-zip");

let fileList;
let folderList;
const template = require('../templates');

/**
 * This method takes the necessary actions to convert the template to files and add to zip file 
 * 
 * @param {*} replaceJson : User inputs in the defined JSON format
 */
async function converter(replaceJson) {
    let file;
    try {

        //Initializing the global variables
        fileList = [];
        folderList = [];
        //Defining the base folder
        const baseTemplateFolder = './templates';
        //Fetching the list of file and folder
        getListOfFilesAndFolders(baseTemplateFolder);

        //Removing Index.js from the list of file is already present
        if (fileList.includes('./templates/index.js')) {
            fileList.splice(fileList.indexOf('./templates/index.js'), 1);
        }

        //Adding/Updating list of files to Index.js
        addFilesToIndex(fileList);

        //Creating the folders according to the template folder structure
        folderList.splice(0, 0, './templates');
        create_folder_if_not_exists(folderList);

        const data = replaceJson["replaceJson"];
        let counter = 1;
        //Convert each template file, present in templates folder, to corresponding JS file
        fileList.forEach((file) => {
            let path = file;
            //Making sure the JS files gets created in the 'Converted' folder
            path = path.replaceAll(/\.\/templates/g, './converted/templates')
            //Dynamically converting the files
            let fileContent = `template.file${counter}(data)`;
            writeToFile(`${path}`, eval(fileContent).replaceAll(/\\`/g, '`').replaceAll(/\\\$/g, '$'));
            counter++;
        });

        //Adding all the files and folder created to a zip file
        file = await zipFolderContent(replaceJson['outputFileName']);
    } catch (e) {
        console.log("Error:- ", e);
    }

    return file;
}

/**
 * This method creates all the folders in templates to converted folder 
 * to retain the same folder structure as templates for every execution
 * 
 * @param {*} folders : List of folders to be created
 */
function create_folder_if_not_exists(folders) {

    folders.forEach((folder) => {
        //Making sure all the folders are getting created in converted folder only
        folder = folder.replaceAll(/\.\/templates/g, '/converted/templates');
        //Creating folders
        folder.split("/").reduce((parentDir, childDir) => {
            const curDir = path.resolve(parentDir, childDir);
            try {
                fs.mkdirSync(curDir);
            } catch (err) {
                if (err.code !== 'EEXIST') {
                    throw err;
                }
            }
            return curDir;
        }, "./");
        console.log(`Folder Created: "${folder}"`);
    });
}

/**
 * Writes texts to the file present in the defined path, and creates the file is not present
 * 
 * @param {*} outputFilePath : Path of the file to which the text is to be added
 * @param {*} template : Text to be added
 */
function writeToFile(outputFilePath, template) {
    fs.writeFileSync(outputFilePath, template,
        { flag: 'w' }, function (err) {
            if (err) {
                return console.log(err);
            }
            return console.log(`File saved: "${outputFilePath}"`);
        });
}

/**
 * Listes all the files and folders present in a folder definded as base folder
 * 
 * @param {*} baseFolder : Name of the folder for which the list of files and folders are to be listed
 */
function getListOfFilesAndFolders(baseFolder) {

    //Fetching the list of all the files and folders in the base folder
    const baseFolderContents = fs.readdirSync(baseFolder);
    baseFolderContents.forEach((element) => {
        statsObj = fs.statSync(baseFolder + `/${element}`);
        //If the base folder contains another folder, then getting list of files and folders for that
        if (statsObj.isDirectory()) {
            folderList.push(`${baseFolder}/${element}`);
            getListOfFilesAndFolders(`${baseFolder}/${element}`);
        }
        //If its a file then add it to the list
        else {
            fileList.push(`${baseFolder}/${element}`);
        }
    });
}

/**
 * Adds all the files under templates folder to templates/index.js for easy imports
 * 
 * @param {*} requiredFiles : list of files to be added to Index.js
 */
function addFilesToIndex(requiredFiles) {

    let counter = 1;
    let indexContent = '';
    requiredFiles.forEach((file) => {
        indexContent = indexContent + `exports.file${counter} = require("${file}");\n`;
        counter++;
    });
    writeToFile('./templates/index.js', indexContent.replaceAll(/\.\/templates/g, '../templates'));
}

/**
 * Adding the converted templates folder to a zip file
 * 
 * @param {*} outFileName : name of the output/zipped file
 */
async function zipFolderContent(outFileName) {
    let in_path = `./converted/templates`,
        out_path = `./converted/${outFileName}.zip`;

    const zip = new AdmZip();
    zip.addLocalFolder(in_path);
    zip.writeZip(out_path);
    console.log(`Created ${out_path} successfully`);
    return zip.toBuffer();
}


module.exports = { converter };