import { Auth, API } from 'aws-amplify';

import { toast } from './utils';

async function _getToken(){
    let user = await Auth.currentAuthenticatedUser();
    return user.signInUserSession.idToken.jwtToken;
}

/**
 * Returns basic info on the user's cloud saves, read
 * from each save's `SaveGameInfo` file
 * 
 * @returns {Promise<[]>} An array of length 3 containing
 *  save info objects for slots with saves and
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
            await (await fetch(signedURLs['File'])).text(),
            await (await fetch(signedURLs['File_old'])).text(),
            await (await fetch(signedURLs['SaveGameInfo'])).text(),
            await (await fetch(signedURLs['SaveGameInfo_old'])).text(),
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
        await API.del('api', `/saves/${slotnum}`, {
            headers: { Authorization: await _getToken() }
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
        return await API.get('api', `/saves/${slotnum}/id`, {
            headers: { Authorization: await _getToken() }
        })
    }
    catch(e){
        console.log(e);
        toast(`Error checking ID of cloud save ${slotnum}`);
        return false;
    }
}

export { getSaves, getSave, getSaveId, uploadSave, deleteSave };
