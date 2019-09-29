import { exists, readDir, readFile, writeFile, unlink, mkdir, ExternalStorageDirectoryPath } from 'react-native-fs';
import { PermissionsAndroid } from 'react-native';
import { parseStringPromise } from 'xml2js';
import * as path from 'path';

const STARDEW_SAVE_PATH = ExternalStorageDirectoryPath + "/StardewValley/";

async function saveExists(saveid){
    try{
        return await exists(path.join(STARDEW_SAVE_PATH, `${saveid}/SaveGameInfo`));
    }
    catch(e){
        console.log(e);
    }
}

/**
 * Returns basic info on the local Stardew Valley saves on this device
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
    }
    catch(e){
        console.log(e);
    }
}

/**
 * Returns all the data of a particular save file by name, may take time
 * @param {*} name 
 */
async function getSave(name){
    try{
        let file = await _read(`${name}/${name}`);
        let file_old = await _read(`${name}/${name}_old`);
        let savegameinfo = await _read(`${name}/SaveGameInfo`);
        let savegameinfo_old = await _read(`${name}/SaveGameInfo_old`);
        return [file, file_old, savegameinfo, savegameinfo_old];
    }
    catch(e){
        console.log(e);
        return [false, false, false, false];
    }
}

/**
 * 
 * @param {string} file 
 * @param {string} file_old 
 * @param {string} savegameinfo 
 * @param {string} savegameinfo_old 
 */
async function writeSave(name, file, file_old, savegameinfo, savegameinfo_old){
    try{
        let ret = await _write(`${name}/${name}`, file);
        if(!ret) throw Error(`Error writing ${name}`, ret);

        ret = await _write(`${name}/${name}_old`, file_old);
        if(!ret) throw Error(`Error writing ${name}_old`, ret);

        ret = await _write(`${name}/SaveGameInfo`, savegameinfo);
        if(!ret) throw Error(`Error writing SaveGameInfo`, ret);

        ret = await _write(`${name}/SaveGameInfo_old`, savegameinfo_old);
        if(!ret) throw Error(`Error writing SaveGameInfo`, ret);

        return true;
    }
    catch(e){
        console.log(e);
        return false;
    }
}

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
 * 
 * @param {string} filepath 
 * @param {string} file 
 */
async function _write(filepath, file){
    console.log("FILEPATH:", filepath)
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
 * 
 * @param {string} filepath Path to the file to be read from external storage
 */
async function _read(filepath){
    try{
        if (_checkReadPermission())
            return await readFile(path.join(STARDEW_SAVE_PATH, filepath));
        else
            console.log('Storage permission denied :(');
    }
    catch(e){
        console.log(e);
    }
}

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
