/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react'; // Unused here but needed for withAuthenticator or it crashes on login
import { Dimensions, TouchableOpacity, Text, Button } from 'react-native';
import { Icon } from 'react-native-elements';
import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerActions } from 'react-navigation-drawer';

import Homescreen from './src/components/Homescreen';
import LocalSavesScreen from './src/components/LocalSavesScreen';
import LeftDrawer from './src/components/LeftDrawer';
import RightDrawer from './src/components/RightDrawer';

import { awsconfig } from './config';

Amplify.configure(awsconfig);

const stackNav = createStackNavigator({
    Home: {
        screen: Homescreen,
        navigationOptions: ({ navigation }) => ({
            title: "StardewSync",
            headerLeft: (
                <Icon 
                    name="message" 
                    style={{ marginRight: 10, paddingLeft: 15 }}
                    onPress={navigation.toggleLeftDrawer}
                />
            ),
            headerRight: (
                <Icon 
                    name="menu" 
                    style={{ marginRight: 10, paddingLeft: 15 }}
                    onPress={navigation.toggleRightDrawer}
                />
            )
        })
    },
    LocalSaves: {
        screen: LocalSavesScreen,
        navigationOptions: ({navigation}) => ({
            title: "Local Save Files"
        })
    }
});

const rightDrawerNav = createDrawerNavigator(
    {
        stackNav: stackNav
    },
    {
        drawerPosition: 'right',
        contentComponent: RightDrawer,
        getCustomActionCreators: (route, stateKey) => {
            return {
                toggleRightDrawer: () => {
                    console.log("Opening Right Drawer");
                    return DrawerActions.toggleDrawer({ key: stateKey })
                }
            };
        },
    }
);

const leftDrawerNav = createDrawerNavigator(
    {
        rightDrawer: rightDrawerNav
    },
    {
        drawerPosition: 'left',
        contentComponent: LeftDrawer,
        getCustomActionCreators: (route, stateKey) => {
            return {
                toggleLeftDrawer: () => {
                    console.log("Opening Left Drawer");
                    return DrawerActions.toggleDrawer({ key: stateKey })
                },
            };
        },
    }
);

const AppContainer = createAppContainer(
    leftDrawerNav
);

export default App = withAuthenticator(() => {
    return <AppContainer />
});
