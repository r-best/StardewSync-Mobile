/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component, Fragment } from 'react';
import { StyleSheet, ScrollView, View, Text, StatusBar, PermissionsAndroid } from 'react-native';
import { Header, Button } from 'react-native-elements';

import Amplify, { Auth, API, Storage } from 'aws-amplify';

import { readDir, readFile, writeFile, ExternalStorageDirectoryPath } from 'react-native-fs';

Amplify.configure({
    Auth: {
        identityPoolId: 'us-east-1:64d632ee-d1f1-4a72-9665-615c65fa0827',
        region: 'us-east-1',
        userPoolId: 'us-east-1_XF6sCfQ0Z',
        userPoolWebClientId: '3lv9ik94255h1f0e1s2c0rp8e1',
    },
    API: {
        endpoints: [{
            name: "notifs",
            endpoint: "https://3pff544onj.execute-api.us-east-1.amazonaws.com/dev"
        }]
    },
    Storage: {
        AWSS3: {
            bucket: 'stardewsync-dev',
            region: 'us-east-1',
        }
    }
})

const App = () => {
    return (
        <View style={{flex:1}}>
            <Header 
                leftComponent={{ icon: 'message', color: '#fff' }}
                centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
                rightComponent={{ icon: 'menu', color: '#fff' }}
            />
            <Button onPress={() => testFS()}></Button>

            {saveslot(0)}
            {saveslot(1)}
            {saveslot(2)}
        </View>
    );
};

const saveslot = (number) => (
    <View style={styles.saveslot}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Save Slot {number}</Text>
        </View>
        <View style={{ justifyContent: 'center' }}>
            <View style={{ display: 'flex', flexDirection: 'row'}}>
                <Button style={{flex:1}} icon={{name: "cloud-upload", size: 15, color: "white"}} onPress={() => test(number)}></Button>
                <Button style={{flex:1}} icon={{name: "cloud-download", size: 15, color: "white"}} onPress={() => test(number)}></Button>
                <Button style={{flex:1}} icon={{name: "delete", size: 15, color: "white"}} onPress={() => test(number)}></Button>
            </View>
        </View>
    </View>
);

const styles = StyleSheet.create({
    saveslot: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
    }
});

function test(number){
    console.log(number);
}

async function testFS(){
    try{
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
                title: 'Stardew Sync',
                message: 'May I wead youwre extewnal stowage pwease? I need it to get to youwr existing save fiwes! :3c',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'No.',
                buttonPositive: 'Yeah!',
            },
        );
        const granted2 = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                title: 'Stardew Sync',
                message: 'May I write to youwre extewnal stowage pwease? I need it to save youwr new save fiwes! :3c',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'No.',
                buttonPositive: 'Yeah!',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED && granted2 == PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the storage!');

            await writeFile(ExternalStorageDirectoryPath+"/StardewValley/Bobby_222982957/HELLOWOROWLSD.txt", "hello!")
            let x = await readFile(ExternalStorageDirectoryPath+"/StardewValley/Bobby_222982957/HELLOWOROWLSD.txt")
            console.log(x)
        } else {
            console.log('Storage permission denied :(');
        }


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

        // console.log(await API.get('notifs', '/saves', {headers: {'Authorization': user.signInUserSession.idToken.jwtToken}}))

        Storage.configure({level: 'private', customPrefix:{private:'userdata/'}});
        Storage.list('')
        .then(result => console.log(result))
        .catch(err => console.log(err));
        // Storage.put(`test.txt`, 'Hooray!')
        // .then (result => console.log(result)) // {key: "test.txt"}
        // .catch(err => console.log(err));
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
    }
}

export default App;
