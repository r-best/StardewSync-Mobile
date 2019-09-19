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

import * as local from '../shared/fs_android';

class LocalSavesScreen extends Component{
    state={localSaves:[]};

    async componentDidMount(){
        let saves = await local.getSaves()
        console.log("SAVES", saves)
        this.setState({
            localSaves: saves
        });
        console.log(this.state.localSaves)
    }

    render(){
        console.log("RENDERING", this.state.localSaves)
        return (
            <View style={{flex:1}}>
                {this.state.localSaves.map((e,i) => (
                    // A Save Slot
                    <View key={i} style={styles.saveslot}>
                        {/* Left half */}
                        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <View style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Text>{e['name']}</Text>
                                    <Text>{e['farm']} Farm</Text>
                                </View>
                                <View style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Text>${e['money']}</Text>
                                    <Text>{Math.round(e['playtime']/3600000)} hours</Text>
                                </View>
                            </View>
                        </View>
                        {/* Right half */}
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        </View>
                    </View>
                ))}
            </View>
        );
    }
};

const styles = StyleSheet.create({
    saveslot: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
    }
});

export default LocalSavesScreen;
