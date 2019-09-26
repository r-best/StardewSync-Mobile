import { exists, readDir, readFile, writeFile, ExternalStorageDirectoryPath } from 'react-native-fs';
import { PermissionsAndroid } from 'react-native';
import { parseStringPromise } from 'xml2js';
import { join } from 'path';

const STARDEW_SAVE_PATH = ExternalStorageDirectoryPath + "/StardewValley/";

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

async function _write(){
    try{
        if (_checkWritePermission()) {
            await writeFile(join(STARDEW_SAVE_PATH,"Bobby_222982957/HELLOWOROWLSD.txt"), "hello!")
        } else {
            console.log('Storage permission denied :(');
        }
    }
    catch(e){
        console.log(e);
    }
}

/**
 * 
 * @param {string} filepath Path to the file to be read from external storage
 */
async function _readExternal(filepath){
    try{
        if (_checkReadPermission())
            return await readFile(join(STARDEW_SAVE_PATH, filepath));
        else
            console.log('Storage permission denied :(');
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
                let save = await parseStringPromise(await _readExternal(saves[i]+"/SaveGameInfo"));
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
        let file = await readFile(`${STARDEW_SAVE_PATH}${name}/${name}`);
        let file_old = await readFile(`${STARDEW_SAVE_PATH}${name}/${name}_old`);
        let savegameinfo = await readFile(`${STARDEW_SAVE_PATH}${name}/SaveGameInfo`);
        let savegameinfo_old = await readFile(`${STARDEW_SAVE_PATH}${name}/SaveGameInfo_old`);
        return [file, file_old, savegameinfo, savegameinfo_old];
    }
    catch(e){
        console.log(e);
        return [false, false, false, false];
    }
}

export { getSaves, getSave };
