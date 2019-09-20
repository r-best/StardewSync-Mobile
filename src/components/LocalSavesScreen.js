/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component, Fragment } from 'react';
import { StyleSheet, FlatList, View, Text, Alert } from 'react-native';
import { Header, Button } from 'react-native-elements';

import * as local from '../shared/fs_android';
import { TouchableOpacity } from 'react-native-gesture-handler';

class LocalSavesScreen extends Component{
    state = {
        localSaves: []
    };
  
    onSelect(item){
        Alert.alert('Unimplemented', 'Hold up', [
            {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel'
            },
            {
                text: 'Yes',
                onPress: () => console.log("Yes!")
            }
        ],
        {cancelable: false});
    };

    async componentDidMount(){
        this.setState({
            localSaves: await local.getSaves()
        });
    }

    render(){
        return (
            <FlatList
                data={this.state.localSaves}
                keyExtractor={e => e.id}
                renderItem={({item, i}) => (
                    <TouchableOpacity 
                        style={styles.saveslot}
                        onPress={() => this.onSelect.bind(this)(item)}>

                        {/* Left half */}
                        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ display: 'flex', flexDirection: 'row' }}>
                                <View style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Text>{item['name']}</Text>
                                    <Text>{item['farm']} Farm</Text>
                                </View>
                                <View style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <Text>${item['money']}</Text>
                                    <Text>{Math.round(item['playtime']/3600000)} hours</Text>
                                </View>
                            </View>
                        </View>
                        {/* Right half */}
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        </View>
                    </TouchableOpacity>
                )}
            />
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
