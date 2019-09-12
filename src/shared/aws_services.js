import Amplify, { Auth, API, Storage } from 'aws-amplify';

import awsconfig from './../../awsconfig-dev';

function initialize(){
    Amplify.configure(awsconfig);
    Storage.configure({level: 'private', customPrefix:{private:'userdata/'}});
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

async function getUserFiles(){
    try{
        

        let saveDirs = Storage.list('')
        console.log(saveDirs);
    }
    catch(e){
        console.log(e)
    }
}

export { initialize, login, getUserFiles };
