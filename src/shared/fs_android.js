import { exists, readDir, readFile, writeFile, unlink, mkdir, ExternalStorageDirectoryPath } from 'react-native-fs';
import { PermissionsAndroid } from 'react-native';
import { parseStringPromise } from 'xml2js';
import * as path from 'path';

const STARDEW_SAVE_PATH = ExternalStorageDirectoryPath + "/StardewValley/";

/**
 * Returns basic info on the local Stardew Valley saves on this device,
 * read from each save's `SaveGameInfo` file
 * 
 * @returns An array containing a save info object for each local save
 */
async function getSaves(){
    try{
        if(_checkReadPermission()){
            if(!exists(STARDEW_SAVE_PATH)){
                console.log("No Stardew Valley saves folder");
                return false;
            }
            let saves = await (await readDir(STARDEW_SAVE_PATH))
                .filter(e => e.isDirectory())
                .map(e => e.name);
            
            for(let i = 0; i < saves.length; i++){
                let save = await parseStringPromise(await _read(saves[i]+"/SaveGameInfo"));
                saves[i] = {
                    id: saves[i],
                    name: save['Farmer']['name'][0],
                    farm: save['Farmer']['farmName'][0],
                    money: save['Farmer']['money'][0],
                    playtime: save['Farmer']['millisecondsPlayed'][0]
                };
            }
            return saves;
        }
        else
            console.log('Storage permission denied :(');
            return [];
    }
    catch(e){
        console.log(e);
        return [];
    }
}

/**
 * Returns the string contents of all of a save's files by ID,
 * may take time to read from disk
 * TO DO: Should check to make sure the slot isn't empty
 * 
 * @param {*} id The ID of the save to retrieve
 * @returns {string[4]|boolean} An array of the string contents of each file
 *  comprising the save, or false on failure
 */
async function getSave(id){
    try{
        let file = await _read(`${id}/${id}`);
        let file_old = await _read(`${id}/${id}_old`);
        let savegameinfo = await _read(`${id}/SaveGameInfo`);
        let savegameinfo_old = await _read(`${id}/SaveGameInfo_old`);
        return [file, file_old, savegameinfo, savegameinfo_old];
    }
    catch(e){
        console.log(e);
        return false;
    }
}

/**
 * Writes a save to the local Stardew Valley saves folder
 * 
 * @param {string} id The ID of the save
 * @returns {boolean} True if successful, false otherwise
 */
async function writeSave(id, file, file_old, savegameinfo, savegameinfo_old){
    try{
        let ret = await _write(`${id}/${id}`, file);
        if(!ret) throw Error(`Error writing ${id}`, ret);

        ret = await _write(`${id}/${id}_old`, file_old);
        if(!ret) throw Error(`Error writing ${id}_old`, ret);

        ret = await _write(`${id}/SaveGameInfo`, savegameinfo);
        if(!ret) throw Error(`Error writing SaveGameInfo`, ret);

        ret = await _write(`${id}/SaveGameInfo_old`, savegameinfo_old);
        if(!ret) throw Error(`Error writing SaveGameInfo`, ret);

        return true;
    }
    catch(e){
        console.log(e);
        return false;
    }
}

/**
 * Deletes a local save by ID
 * 
 * @param {string} id The ID of the save to delete
 * @returns {boolean} True if successful, false otherwise
 */
async function deleteSave(id){
    try{
        if (_checkWritePermission()) {
            await unlink(path.join(STARDEW_SAVE_PATH, id));
            return true;
        } else {
            console.log('Storage permission denied :(');
            return false;
        }
    }
    catch(e){
        console.log(e);
        return false;
    }
}

/**
 * Checks if a save file with the given ID exists on the device
 * 
 * @param {string} saveid The ID to search for
 * @returns {boolean} Whether or not the save file exists
 */
async function saveExists(saveid){
    try{
        return await exists(path.join(STARDEW_SAVE_PATH, `${saveid}/SaveGameInfo`));
    }
    catch(e){
        console.log(e);
        return false;
    }
}

/**
 * Checks that the user has given write permissions and writes
 * the input string `file` to the path `filepath` within
 * the Stardew Valley saves folder
 * 
 * @param {string} filepath Destination path within the Stardew
 *  Valley saves folder
 * @param {string} file Contents to write to file 
 * @returns {boolean} True if successful, false otherwise
 */
async function _write(filepath, file){
    console.log("WRITING TO", filepath);
    filepath = path.join(STARDEW_SAVE_PATH, filepath);
    try{
        if (_checkWritePermission()) {
            await mkdir(path.parse(filepath).dir);
            await writeFile(filepath, file);
            return true;
        } else {
            console.log('Storage permission denied :(');
            return false;
        }
    }
    catch(e){
        console.log(e);
        return false;
    }
}

/**
 * Checks that the user has given read permissions and returns
 * the contents of the file at the path `filepath` within
 * the Stardew Valley saves folder
 * 
 * @param {string} filepath Path to the file to be read from
 *  the Stardew Valley saves folder
 * @returns {string|boolean} File contents if successful, false otherwise
 */
async function _read(filepath){
    try{
        if (_checkReadPermission())
            return await readFile(path.join(STARDEW_SAVE_PATH, filepath));
        else{
            console.log('Storage permission denied :(');
            return false;
        }
    }
    catch(e){
        console.log(e);
        return false;
    }
}

/**
 * Asks the user for write permissions, returning true once
 * they have been given
 * Permissions are retained, so subsequent calls will simply
 * return true if the user has already said yes in the past
 * 
 * @returns {boolean} Whether or not the user has allowed write permissions
 */
async function _checkWritePermission(){
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
            title: 'Stardew Sync',
            message: 'May I write to youwre extewnal stowage pwease? I need it to save youwr new save fiwes! :3c',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'No.',
            buttonPositive: 'Yeah!',
        },
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
}

/**
 * Asks the user for read permissions, returning true once
 * they have been given
 * Permissions are retained, so subsequent calls will simply
 * return true if the user has already said yes in the past
 * 
 * @returns {boolean} Whether or not the user has allowed read permissions
 */
async function _checkReadPermission(){
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
            title: 'Stardew Sync',
            message: 'May I wead youwre extewnal stowage pwease? I need it to get to youwr existing save fiwes! :3c',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Die.',
            buttonPositive: 'Yeah!',
        },
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export { saveExists, getSaves, getSave, writeSave, deleteSave };
