import { Auth, API, Storage } from 'aws-amplify';

import { NUM_CLOUD_SAVES, StorageGet, toast } from './utils';

async function _getToken(){
    let user = await Auth.currentAuthenticatedUser();
    return user.signInUserSession.idToken.jwtToken;
}

/**
 * Returns basic info on the user's cloud saves, read
 * from each save's `SaveGameInfo` file
 * 
 * @returns {Promise<[]>} An array of length NUM_CLOUD_SAVES
 *  containing save info objects for slots with saves and
 *  false for slots that are empty
 */
async function getSaves(){
    try{
        return await API.get('api', '/saves', {
            headers: { Authorization: await _getToken() }
        });
    }
    catch(e){
        console.log(e)
        toast(`Error reading cloud saves`);
        return [];
    }
}

/**
 * Returns the string contents of all the files in a save slot by index,
 * may take time to download
 * TO DO: Should check to make sure the slot isn't empty
 * 
 * @param {number} slotnum The index of the slot to download
 * @returns {Promise<string[4]|boolean>} An array of the string contents
 *  of each file comprising the save, or false on failure
 */
async function getSave(slotnum){
    try{
        let signedURLs = await API.get('api', `/saves/${slotnum}`, {
            headers: { Authorization: await _getToken() }
        });

        return [
            await fetch(signedURLs['File']),
            await fetch(signedURLs['File_old']),
            await fetch(signedURLs['SaveGameInfo']),
            await fetch(signedURLs['SaveGameInfo_old']),
        ];
    }
    catch(e){
        console.log(e);
        toast(`Error retrieving cloud save ${slotnum}`);
        return false;
    }
}

/**
 * Uploads a local save file to a cloud save by index
 * 
 * @param {number} index The destination cloud save slot
 * @param {string} id The ID of the save file
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
async function uploadSave(index, id, file, file_old, savegameinfo, savegameinfo_old){
    try{
        let signedURLs = await API.put('api', `/saves/${index}`, {
            headers: { Authorization: await _getToken() },
            queryStringParameters: { id: id }
        });

        await fetch(signedURLs['File'], { method: 'PUT', body: file });
        await fetch(signedURLs['File_old'], { method: 'PUT', body: file_old });
        await fetch(signedURLs['SaveGameInfo'], { method: 'PUT', body: savegameinfo });
        await fetch(signedURLs['SaveGameInfo_old'], { method: 'PUT', body: savegameinfo_old });

        return true;
    }
    catch(e){
        console.log(e);
        toast(`Error uploading save ${id} to cloud save slot ${index}`);
        return false;
    }
}

/**
 * Deletes a cloud save by index
 * 
 * @param {number} slotnum The index of the cloud save to delete
 * @returns {Promise<boolean>} True if successful, false otherwise
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
        toast(`Error deleting cloud save ${slotnum}`);
        return false;
    }
}

/**
 * Takes in a cloud save slot index and returns the ID of the save stored in it
 * TO DO: Should check to make sure the slot isn't empty
 * 
 * @param {number} slotnum The slot index to get the ID of
 * @returns {Promise<string|boolean>} The ID of the save, or false on failure
 */
async function getSaveId(slotnum){
    try{
        let list = await Storage.list(`saveslot${slotnum}/`);
        let item = list.filter(e => e.key.match(/(.+_old$)|(\/$)|(.*SaveGameInfo$)/) === null)[0].key;
        return item.split('/')[1];
    }
    catch(e){
        console.log(e);
        toast(`Error checking ID of cloud save ${slotnum}`);
        return false;
    }
}

/**
 * Helper method to return the currently in-use cloud save slots
 * 
 * @returns {Promise<number[]>} An array containing the indices
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
        toast(`Error retrieving active cloud saves`);
        return [];
    }
}

export { getSaves, getSave, getSaveId, uploadSave, deleteSave };
