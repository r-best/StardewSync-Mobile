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

import LoadingOverlay from '../shared/LoadingOverlay';
import * as local from '../shared/fs_android';
import * as aws from '../shared/aws_services';
import * as utils from '../shared/utils';

/**
 * The main screen of the app, displays the three cloud save slots
 * and their contents
 */
class Homescreen extends Component{
    state = {
        cloudSaves: [false, false, false],
        loading: true
    };

    async componentDidMount(){
        this.update();
    }

    async update(){
        this.setState({ loading: true });
        this.setState({
            cloudSaves: await aws.getSaves(),
            loading: false
        });
    }

    /**
     * Called when the upload button is clicked on a cloud save slot, 
     * opens the localsaves screen to let the user select which save to upload
     * @param {number} index The cloud save slot to upload to
     */
    upload(index){
        // The callback function that will be called when a local save is clicked on the next screen
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
    
            this.update();
            return true;
        }

        // Launch the localsaves screen with the callback
        this.props.navigation.navigate("LocalSaves", {callback: callback.bind(this)});
    }

    /**
     * Called when the download button is clicked on a cloud save slot,
     * checks if another save with the same name exists and offers to 
     * overwrite it, otherwise opens the localsaves screen to let
     * the user choose where to put it
     * @param {number} index The cloud save slot to download from
     */
    async download(index){
        // Get save id from cloud slot number
        let saveid = await aws.getSaveId(index);

        // Helper function that actually performs the download
        let _download = async() => {
            this.setState({ loading: true });
            
            console.log("Downloading file from S3...");
            let [ file, file_old, savegameinfo, savegameinfo_old ] = await aws.getSave(index);
            console.log("Successfully downloaded from S3");

            console.log("Writing to disk...");
            await local.writeSave(saveid, file, file_old, savegameinfo, savegameinfo_old);
            console.log(`Successfully wrote ${saveid} to disk`);

            this.setState({ loading: false });
        }

        // The callback function that will be called when a local save is clicked on the next screen
        let callback = async(item) => {
            if(item.id !== "add")
                if(await utils.confirm('Hey', 
                    `Are you sure you want to overwrite Farmer ${item['name']} with cloud save ${index}?`,
                    {cancelable: false}))
                    local.deleteSave(item['id']);

            await _download();
            this.update();
            return true;
        }

        // Check if a save with this name already exists locally and ask the user
        // if they want to overwrite it
        if(await local.saveExists(saveid)){
            if(await utils.confirm(
                'Overwrite existing save?',
                'A copy of this save already exists on this device, do you want to overwrite it?')){
                _download();
                return true;
            }
            else
                return console.log("Duplicate saves not supported yet!");
        }

        // If save doesn't already exist, launch the localsaves screen with the callback
        this.props.navigation.navigate("LocalSaves", {
            callback: callback.bind(this),
            addButtonVisible: true
        });
    }

    async delete(index){
        if(!await utils.confirm(
            'Confirm delete',
            `Are you sure you want to delete cloud save #${index}?`, {cancelable: false}))
            return false;
        
        await aws.deleteSave(index);
        console.log(`Cloud save ${index} deleted!`);
        this.update();
        return true;
    }

    render(){
        return (
            <View style={{flex:1, alignItems: 'center'}}>
                <View style={styles.saveslot_container}>
                    {this.state.cloudSaves.map((e,i) => (
                        <View key={i} style={styles.saveslot}>
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
                                        onPress={() => this.delete(i)} />
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
                <LoadingOverlay loading={this.state.loading} />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    saveslot_container: {
        width: '90%',
        flex: 1,
        marginTop: 25,
        marginBottom: 25
    },
    saveslot: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        borderStyle: 'solid',
        borderWidth: 2,
        borderRadius: 25,
        marginTop: 25,
        marginBottom: 25,
        paddingLeft: 10,
        paddingRight: 10
    }
});

export default Homescreen;
