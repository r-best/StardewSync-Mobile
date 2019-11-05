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
 * Displays a semitransparent layer with a randomly selected loading wheel
 * over the component it is placed in as long as its `loading` prop is true.
 * Have a loading attribute in your component's state and pass it to this
 * element as the `loading` prop and the spinner will be displayed whenever
 * you set your loading state to true.
 */
class LoadingOverlay extends Component{
    SPINNERS = [
        "DoubleBounce",
        "Wave",
        "WanderingCubes",
        "ThreeBounce",
        "Circle",
        "9CubeGrid",
        "FoldingCube",
    ];

    /**
     * Randomly selects a spinner from the SPINNERS array
     */
    getSpinner(){
        return this.SPINNERS[Math.floor(Math.random() * this.SPINNERS.length)]
    }

    render(){
        return (
            <View style={[ styles.loading_background, {
                backgroundColor: this.props.loading ? 'rgba(128, 128, 128, 0.75)' : 'rgba(128, 128, 128, 0)',
                zIndex: this.props.loading ? 100 : -1
            }]}>
                <Spinner
                    isVisible={this.props.loading}
                    style={styles.loading_spinner}
                    size={100}
                    type={this.getSpinner()}
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
