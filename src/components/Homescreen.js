/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component, Fragment } from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { Button } from 'react-native-elements';

import * as local from '../shared/fs_android';
import * as aws from '../shared/aws_services';
import * as utils from '../shared/utils';



class Homescreen extends Component{
    state = { cloudSaves: [] };

    async componentDidMount(){
        this.setState({
            cloudSaves: await aws.getSaves()
        });
    }

    upload(index){
        let callback = async(item) => {
            if(!await utils.confirm('Hey', 
                `Are you sure you want to overwrite cloud save ${index} with Farmer ${item['name']}?`,
                {cancelable: false}))
                return false;
    
            console.log("Reading save file from disk...");
            let [ file, file_old, savegameinfo, savegameinfo_old ] = await local.getSave(item['id']);
            console.log("Successfully read save file", item['id']);
    
            console.log("Uploading to S3...");
            let ret = await aws.uploadSave(index, item['id'], file, file_old, savegameinfo, savegameinfo_old);
            if(ret) console.log(`Successfully uploaded save file ${item['id']} to slot ${index}`);
            else console.log(`Error uploading save file ${item['id']} to slot ${index}`);
    
            return true;
        }

        this.props.navigation.navigate("LocalSaves", {callback: callback.bind(this)});
    }

    async download(index){
        let callback = async(item) => {
            if(!await utils.confirm('Hey', 
                `Are you sure you want to overwrite Farmer ${item['name']} with cloud save ${index}?`,
                {cancelable: false}))
                return false;
            
            console.log("Downloading file from S3...");
            let [ file, file_old, savegameinfo, savegameinfo_old ] = await aws.getSave(index)
            console.log("Successfully downloaded from S3");
    
            console.log("Writing to disk...");
            console.log(`Successfully wrote ${item[id]} to disk`);
            
            return true;
        }
        let saveid = await aws.getSaveId(index);
        console.log(await local.saveExists(saveid), saveid)
        if(await local.saveExists(saveid)){
            console.log(saveid)
            if(!await utils.confirm(
                'Overwrite existing save?',
                'A copy of this save already exists on this device, do you want to overwrite it?'))
                return console.log("Duplicate saves not supported yet!");
        }
        this.props.navigation.navigate("LocalSaves", {callback: callback.bind(this)});
    }

    render(){
        return (
            <View style={{flex:1}}>
                {this.state.cloudSaves.map((e,i) => (
                    <View key={i} style={styles.saveslot}>
                        <View style={styles.saveslot}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text>{ e ? e['Farmer']['name'] : "Empty" }</Text>
                            </View>
                            <View style={{ justifyContent: 'center' }}>
                                <View style={{ display: 'flex', flexDirection: 'row' }}>
                                    <Button style={{flex:1}} 
                                        icon={{name: "cloud-upload", size: 15, color: "white"}} 
                                        onPress={() => this.upload(i)} />
                                    <Button style={{flex:1}} 
                                        icon={{name: "cloud-download", size: 15, color: "white"}} 
                                        disabled={!e}
                                        onPress={() => this.download(i)} />
                                    <Button style={{flex:1}} 
                                        icon={{name: "delete", size: 15, color: "white"}} 
                                        disabled={!e}
                                        onPress={() => console.log(i)} />
                                </View>
                            </View>
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

export default Homescreen;
