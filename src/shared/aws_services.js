import Amplify, { Auth, API, Storage } from 'aws-amplify';

import { parseStringPromise } from 'xml2js';

/**
 * Replacement for Amplify's Storage.get because for some reason it
 * returns a public URL where you can access the object instead of
 * just returning the object
 * @param {} url 
 */
async function StorageGet(url){
    try{
        let S3Url = await Storage.get(url, {expires:60});
        let res = await (await fetch(S3Url)).text();
        let xml = await parseStringPromise(res);

        if("Error" in xml){
            console.log(`Error fetching '${url}': ${xml['Error']['Message']}`);
            return false;
        }

        return xml;
    }
    catch(e){
        console.log(e)
    }
}

/**
 * Gets which save slots are in use
 */
async function getActiveUserFiles(){
    try{
        let saveDirs = await Storage.list('');

        let slots = [];
        saveDirs.forEach(e => {
            let matches = e.key.match(/^saveslot(\d)\/SaveGameInfo/);
            if(matches !== null) slots.push(matches[1]);
        });
        return slots.filter((e, index) => slots.indexOf(e) === index);
    }
    catch(e){
        console.log(e)
    }
}

/**
 * Retrieves the basic info on the save file in the given slot
 * @param {*} slotNum 
 */
async function getSaveDataBasic(slotNum){
    try{
        let save = await StorageGet(`saveslot${slotNum}/SaveGameInfo`);
        console.log(save)
        return save
    }
    catch(e){
        console.log(e)
    }
}

async function login(){
    try{
        console.log("Logging in!");

        // const user = await Auth.signIn('dev1', '123456');
        const user = await Auth.signIn('dev2', '123456');

        if(user.challengeName){
            console.log(`User must complete a login challenge of type ${user.challengeName}, this should have been impossible`);
            return;
        }

        console.log("Logged in!");
        console.log(user);
        return true;
    } catch (err) {
        console.log(err.code);
        if (err.code === 'UserNotConfirmedException') {
            // The error happens if the user didn't finish the confirmation step when signing up
            // In this case you need to resend the code and confirm the user
            // About how to resend the code and confirm the user, please check the signUp part
        } else if (err.code === 'PasswordResetRequiredException') {
            // The error happens when the password is reset in the Cognito console
            // In this case you need to call forgotPassword to reset the password
            // Please check the Forgot Password part.
        } else if (err.code === 'NotAuthorizedException') {
            // The error happens when the incorrect password is provided
        } else if (err.code === 'UserNotFoundException') {
            // The error happens when the supplied username/email does not exist in the Cognito user pool
        } else {
            console.log(err);
        }
        return false;
    }
}

export { login, getActiveUserFiles, getSaveDataBasic };
