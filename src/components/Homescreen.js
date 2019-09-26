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
import * as aws from '../shared/aws_services';

function upload(index){ 
    return async(savename) => {
        console.log("Reading save file from disk...");
        let [ file, file_old, savegameinfo, savegameinfo_old ] = await local.getSave(savename);
        console.log("Successfully read save file", savename);

        console.log("Uploading to S3...");
        let ret = await aws.uploadSave(index, savename, file, file_old, savegameinfo, savegameinfo_old);
        if(ret) console.log(`Successfully uploaded save file ${savename} to slot ${index}`);
        else console.log(`Error uploading save file ${savename} to slot ${index}`)
    }
}

class Homescreen extends Component{
    async componentDidMount(){
        await aws.getSaves();
        this.setState({}); // Trigger UI render
    }

    render(){
        return (
            <View style={{flex:1}}>
                {aws.saves_cache.map((e,i) => (
                    <View key={i} style={styles.saveslot}>
                        {e ? 
                            <View style={styles.saveslot}>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>{e['Farmer']['name']}</Text>
                                </View>
                                <View style={{ justifyContent: 'center' }}>
                                    <View style={{ display: 'flex', flexDirection: 'row'}}>
                                        <Button style={{flex:1}} 
                                            icon={{name: "cloud-upload", size: 15, color: "white"}} 
                                            onPress={() => 
                                                this.props.navigation.navigate("LocalSaves", {callback:upload(i).bind(this)})
                                        } />
                                        <Button style={{flex:1}} 
                                            icon={{name: "cloud-download", size: 15, color: "white"}} 
                                            onPress={() => 
                                                test(number)
                                        } />
                                        <Button style={{flex:1}} 
                                            icon={{name: "delete", size: 15, color: "white"}} 
                                            onPress={() => 
                                                test(number)
                                        } />
                                    </View>
                                </View>
                            </View>
                        : 
                            <View style={styles.saveslot}>
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>Empty</Text>
                                </View>
                                <View style={{ display: 'flex', justifyContent: 'center', alignContent: 'flex-end' }}>
                                        <Button icon={{name: "cloud-upload", size: 15, color: "white"}} onPress={() => this.props.navigation.navigate("LocalSaves", {callback:upload(i).bind(this)})}></Button>
                                </View>
                            </View>
                        }
                    </View>
                ))
                }

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

function test(number){
    console.log(number);
}

export default Homescreen;
