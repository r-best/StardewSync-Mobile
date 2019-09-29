/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component, Fragment } from 'react';
import { StyleSheet, FlatList, View, Text, Alert } from 'react-native';
import { Header, Button, Icon } from 'react-native-elements';
import Spinner from 'react-native-spinkit';

import * as local from '../shared/fs_android';
import { TouchableOpacity } from 'react-native-gesture-handler';

/**
 * This screen lists all the save files stored locally on the device.
 * When navigating to this page, two parameters should be specified:
 * @param {(local save) => boolean} callback Called when the user clicks
 *      on a local save item, passed the local save object
 * @param {boolean} addButtonVisible Whether or not to show a plus button
 *      at the end of the list, used to add new saves
 */
class LocalSavesScreen extends Component{
    state = {
        localSaves: [],
        loading: true
    };
  
    async onSelect(item){
        this.setState({ loading: true });

        let res = await this.props.navigation.state.params.callback(item);

        this.setState({ loading: false });

        if(res) this.props.navigation.goBack();
    };

    async componentDidMount(){
        let localSaves = await local.getSaves();

        // If flag is set to show add button, append the add button
        // to the end of the list
        if(this.props.navigation.state.params.addButtonVisible)
            localSaves.push({ id: "add" });

        this.setState({
            localSaves: localSaves,
            loading: false
        });
    }

    render(){
        return (
            <View style={{flex:1}}>
                <FlatList
                    data={this.state.localSaves}
                    keyExtractor={e => e.id}
                    renderItem={({item, i}) => 
                        item.id !== "add" ? (
                            <TouchableOpacity style={styles.saveslot} onPress={() => this.onSelect.bind(this)(item)}>
                                    <View style={styles.saveslot_div}>
                                        <Text>{item['name']}</Text>
                                        <Text>{item['farm']} Farm</Text>
                                    </View>
                                    <View style={styles.saveslot_div}>
                                        <Text>${item['money']}</Text>
                                        <Text>{Math.round(item['playtime']/3600000)} hours</Text>
                                    </View>
                            </TouchableOpacity>
                        ) : (
                            <Button
                                buttonStyle={styles.saveslot}
                                icon={{name: "add-circle-outline", type: "material", size: 15, color: "white"}} 
                                onPress={() => this.onSelect.bind(this)(item)}
                            />
                        )
                    }
                />
                <View style={[ styles.loading_background, {
                    backgroundColor: this.state.loading ? 'rgba(128, 128, 128, 0.75)' : 'rgba(128, 128, 128, 0)',
                    zIndex: this.state.loading ? 10 : -1
                }]}>
                    <Spinner
                        isVisible={this.state.loading}
                        style={styles.loading_spinner}
                        size={100}
                        type="WanderingCubes"
                    />
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    saveslot: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        marginBottom: 25,
        borderStyle: 'solid',
        borderWidth: 2,
        borderRadius: 25
    },
    saveslot_div: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loading_spinner: {
        position: "absolute",
        top: '30%'
    },
    loading_background: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        alignItems: 'center'
    }
});

export default LocalSavesScreen;
