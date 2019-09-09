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

import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';


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

function login(){
    console.log("LOGGING IN")
    var authenticationDetails = new AuthenticationDetails({
        Username : 'rbest',
        Password : '',
    });
    var userPool = new CognitoUserPool({
        UserPoolId : 'us-east-1_XF6sCfQ0Z',
        ClientId : '3lv9ik94255h1f0e1s2c0rp8e1'
    });
    var cognitoUser = new CognitoUser({
        Username : 'rbest',
        Pool : userPool
    });
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: async(result) => {
            var accessToken = result.getAccessToken().getJwtToken();
            
            /* Use the idToken for Logins Map when Federating User Pools with identity pools or when passing through an Authorization Header to an API Gateway Authorizer*/
            var idToken = result.idToken.jwtToken;
            console.log(idToken);

            let res = await fetch('https://3pff544onj.execute-api.us-east-1.amazonaws.com/dev/saves', {
                method: 'GET',
                headers: {
                    'Authorization': idToken,
                    'Content-Type': 'application/json'
                }
            });
            console.log(await res.text())
        },

        onFailure: (err) => {
            alert(err);
        },

    });
}

export default App;
