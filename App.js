/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component, Fragment } from 'react';
import { StyleSheet, ScrollView, View, Text, StatusBar, PermissionsAndroid } from 'react-native';
import Homescreen from './src/components/Homescreen';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const AppContainer = createAppContainer(
    createStackNavigator(
        {
            Home: Homescreen,
        },
        { initialRouteName: 'Home' }
    )
);

export default App = () => {
    return <AppContainer />
};
