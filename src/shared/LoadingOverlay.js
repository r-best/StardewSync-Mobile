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

/**
 * 
 */
class LoadingOverlay extends Component{
    render(){
        return (
            <View style={[ styles.loading_background, {
                backgroundColor: this.props.loading ? 'rgba(128, 128, 128, 0.75)' : 'rgba(128, 128, 128, 0)',
                zIndex: this.props.loading ? 10 : -1
            }]}>
                <Spinner
                    isVisible={this.props.loading}
                    style={styles.loading_spinner}
                    size={100}
                    type="WanderingCubes"
                />
            </View>
        );
    }
};

const styles = StyleSheet.create({
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

export default LoadingOverlay;
