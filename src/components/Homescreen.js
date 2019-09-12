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

const Homescreen = () => {
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

export default Homescreen;
