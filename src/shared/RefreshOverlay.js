/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { FlatList } from 'react-native';

/**
 * This component uses an empty FlatList positioned over the whole
 * screen to give you a way to get that cute little refresh
 * spinner pull-down without having a list
 * 
 * Just pass in the function you want to call to its `onRefresh`
 * prop and you're good to go
 */
class RefreshOverlay extends Component{
    render(){
        return (
            <FlatList
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "100%",
                }}
                onRefresh={this.props.onRefresh}
                refreshing={false}
            />
        );
    }
};

export default RefreshOverlay;
