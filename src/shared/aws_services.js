import { Auth, API, Storage } from 'aws-amplify';

import { NUM_CLOUD_SAVES, StorageGet } from './utils';

/**
 * Returns basic info on the user's cloud saves, read
 * from each save's `SaveGameInfo` file
 * 
 * @returns An array of length NUM_CLOUD_SAVES containing 
 *  save info objects for slots with saves and false for
 *  slots that are empty
 */
async function getSaves(){
    try{
        let activeSlots = await _getActiveSlots();

        let ret = [];
        for(let i = 1; i <= NUM_CLOUD_SAVES; i++){
            if(activeSlots.includes(i)){
                let save = await StorageGet(`saveslot${i}/SaveGameInfo`);
                ret[i] = {
                    name: save['Farmer']['name'],
                    farm: save['Farmer']['farmName'],
                    money: save['Farmer']['money'],
                    playtime: save['Farmer']['millisecondsPlayed']
                };
            }
            else
                ret[i] = false;
        }
        return ret;
    }
    catch(e){
        console.log(e)
        return [];
    }
}

/**
 * Returns the string contents of all the files in a save slot by index,
 * may take time to download
 * TO DO: Should check to make sure the slot isn't empty
 * 
 * @param {number} slotnum The index of the slot to download
 * @returns {string[4]|boolean} An array of the string contents of each file
 *  comprising the save, or false on failure
 */
async function getSave(slotnum){
    try{
        let id = await getSaveId(slotnum);

        let file = await StorageGet(`saveslot${slotnum}/${id}`, parse=false);
        let file_old = await StorageGet(`saveslot${slotnum}/${id}_old`, parse=false);
        let savegameinfo = await StorageGet(`saveslot${slotnum}/SaveGameInfo`, parse=false);
        let savegameinfo_old = await StorageGet(`saveslot${slotnum}/SaveGameInfo_old`, parse=false);
        return [file, file_old, savegameinfo, savegameinfo_old];
    }
    catch(e){
        console.log(e);
        return false;
    }
}

/**
 * Uploads a local save file to a cloud save by index
 * 
 * @param {number} index The destination cloud save slot
 * @param {string} id The ID of the save file
 * @returns {boolean} True if successful, false otherwise
 */
async function uploadSave(index, id, file, file_old, savegameinfo, savegameinfo_old){
    try{
        let existing = await Storage.list(`saveslot${index}`);
        existing.forEach(async(file) => await Storage.remove(file.key));

        let ret = await Storage.put(`saveslot${index}/${id}`, file);
        if(!('key' in ret)) throw Error(`Error uploading ${id}`, ret);

        ret = await Storage.put(`saveslot${index}/${id}_old`, file_old);
        if(!('key' in ret)) throw Error(`Error uploading ${id}_old`, ret);

        ret = await Storage.put(`saveslot${index}/SaveGameInfo`, savegameinfo);
        if(!('key' in ret)) throw Error(`Error uploading SaveGameInfo`, ret);

        ret = await Storage.put(`saveslot${index}/SaveGameInfo_old`, savegameinfo_old);
        if(!('key' in ret)) throw Error(`Error uploading SaveGameInfo`, ret);

        return true;
    }
    catch(e){
        console.log(e);
        return false;
    }
}

/**
 * Deletes a cloud save by index
 * 
 * @param {number} slotnum The index of the cloud save to delete
 * @returns {boolean} True if successful, false otherwise
 */
async function deleteSave(slotnum){
    try{
        let list = await Storage.list(`saveslot${slotnum}/`);
        list.forEach(async(e) => {
            let matches = e.key.match(new RegExp(`saveslot${slotnum}\/.+`));
            if(matches !== null)
                await Storage.remove(matches[0]);
        });
        return true;
    }
    catch(e){
        console.log(e);
        return false;
    }
}

/**
 * Takes in a cloud save slot index and returns the ID of the save stored in it
 * TO DO: Should check to make sure the slot isn't empty
 * 
 * @param {number} slotnum The slot index to get the ID of
 * @returns {string|boolean} The ID of the save, or false on failure
 */
async function getSaveId(slotnum){
    try{
        let list = await Storage.list(`saveslot${slotnum}/`);
        let item = list.filter(e => e.key.match(/(.+_old$)|(\/$)|(.*SaveGameInfo$)/) === null)[0].key;
        return item.split('/')[1];
    }
    catch(e){
        console.log(e);
        return false;
    }
}

/**
 * Helper method to return the currently in-use cloud save slots
 * 
 * @returns {number[]} An array containing the indices
 *  of the cloud saves that are not currently empty
 */
async function _getActiveSlots(){
    try{
        let saveDirs = await Storage.list('');

        let slots = [];
        saveDirs.forEach(e => {
            let matches = e.key.match(/^saveslot(\d)\/SaveGameInfo/);
            if(matches !== null) slots.push(parseInt(matches[1]));
        });
        return slots.filter((e, index) => slots.indexOf(e) === index);
    }
    catch(e){
        console.log(e)
    }
}

export { getSaves, getSave, getSaveId, uploadSave, deleteSave };
