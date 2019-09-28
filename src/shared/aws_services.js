import { Auth, API, Storage } from 'aws-amplify';

import { NUM_CLOUD_SAVES, StorageGet } from './utils';

/**
 * 
 * @param {number} index 
 * @param {string} file 
 * @param {string} file_old 
 * @param {string} savegameinfo 
 * @param {string} savegameinfo_old 
 */
async function uploadSave(index, name, file, file_old, savegameinfo, savegameinfo_old){
    try{
        let existing = await Storage.list(`saveslot${index}`);
        existing.forEach(async(file) => await Storage.remove(file.key));

        let ret = await Storage.put(`saveslot${index}/${name}`, file);
        if(!('key' in ret)) throw Error(`Error uploading ${name}`, ret);

        ret = await Storage.put(`saveslot${index}/${name}_old`, file_old);
        if(!('key' in ret)) throw Error(`Error uploading ${name}_old`, ret);

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
 * Gets which save slots are in use
 */
async function getActiveSlots(){
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

/**
 * Retrieves the basic info on the user's saves
 */
async function getSaves(){
    try{
        let activeSlots = await getActiveSlots();

        let ret = [];
        for(let i = 1; i <= NUM_CLOUD_SAVES; i++){
            if(activeSlots.includes(i))
                ret[i] = await StorageGet(`saveslot${i}/SaveGameInfo`);
            else
                ret[i] = false;
            // ret[slot] = {
            //     name: save['name'],
            //     farm: save['farmName'],
            //     money: save['money'],
            //     playtime: save['millisecondsPlayed']
            // };
        }
        return ret;
    }
    catch(e){
        console.log(e)
        return [];
    }
}

/**
 * Returns all the data of a particular save slot, may take time
 * @param {*} slotnum
 */
async function getSave(slotnum){
    try{
        let file = await StorageGet(`saveslot${slotnum}/${id}`);
        let file_old = await readFile(`saveslot${slotnum}/${id}_old`);
        let savegameinfo = await readFile(`saveslot${slotnum}/SaveGameInfo`);
        let savegameinfo_old = await readFile(`saveslot${slotnum}/SaveGameInfo_old`);
        return [file, file_old, savegameinfo, savegameinfo_old];
    }
    catch(e){
        console.log(e);
        return [false, false, false, false];
    }
}

async function getSaveId(slotnum){
    try{
        let list = await Storage.list(`saveslot${slotnum}/`);
        console.log(list)
        let item = list.filter(e => e.key.match(/(.+_old$)|(\/$)|(.*SaveGameInfo$)/) === null)[0].key;
        return item.split('/')[1];
    }
    catch(e){
        console.log(e);
    }
}

/**
 * Only used for debugging
 */
async function login(){
    try{
        console.log("Logging in!");

        // const user = await Auth.signIn('dev1', '123456');
        const user = await Auth.signIn('dev2', '123456');

        if(user.challengeName){
            console.log(`User must complete a login challenge of type ${user.challengeName}, this should have been impossible`);
            return false;
        }

        console.log("Logged in!");
        console.log(user);
        return true;
    } catch (err) {
        console.log(err.code);
        return false;
    }
}

export { login, getActiveSlots, getSaves, getSave, getSaveId, uploadSave };
