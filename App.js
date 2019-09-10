/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component, Fragment } from 'react';
import { StyleSheet, ScrollView, View, Text, StatusBar } from 'react-native';
import { Header, Button } from 'react-native-elements';

import Amplify, { Auth } from 'aws-amplify';

Amplify.configure({
    Auth: {
        identityPoolId: 'us-east-1:64d632ee-d1f1-4a72-9665-615c65fa0827',
        region: 'us-east-1',
        userPoolId: 'us-east-1_XF6sCfQ0Z',
        userPoolWebClientId: '3lv9ik94255h1f0e1s2c0rp8e1',
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
            <Button onPress={() => login()}></Button>

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

async function login(){
    try{
        console.log("Logging in!")

        const user = await Auth.signIn('rbest', '***REMOVED***');

        if(user.challengeName){
            console.log(`User must complete a login challenge of type ${user.challengeName}, this should have been impossible`);
            return;
        }

        console.log("Logged in!");
        console.log(user);

        let res = await fetch('https://3pff544onj.execute-api.us-east-1.amazonaws.com/dev/saves', {
            method: 'GET',
            headers: {
                'Authorization': user.signInUserSession.idToken.jwtToken,
                'Content-Type': 'application/json'
            }
        });
        console.log(await res.text());
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
