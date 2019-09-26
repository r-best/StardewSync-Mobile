import { Auth, API, Storage } from 'aws-amplify';

import { NUM_CLOUD_SAVES, StorageGet } from './utils';

/**
 * Updated on every call to getSaves(), stores the
 * `SaveGameInfo` xml file of every save in order to build
 * menu items for them on the homescreen, as well as save
 * a few kB on download costs when the user downloads a save
 */
let saves_cache = [];

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
        saves_cache = ret;
        return saves_cache;
    }
    catch(e){
        console.log(e)
        return saves_cache;
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

export { login, saves_cache, getActiveSlots, getSaves, uploadSave };
