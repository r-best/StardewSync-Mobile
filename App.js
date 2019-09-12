/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react'; // Unused here but needed for withAuthenticator or it crashes on login
import { withAuthenticator } from 'aws-amplify-react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { initialize, login } from './src/shared/aws_services';
import Homescreen from './src/components/Homescreen';

initialize();
login();

const AppContainer = createAppContainer(
    createStackNavigator(
        {
            Home: Homescreen,
        },
        { initialRouteName: 'Home', headerMode: 'none' }
    )
);

export default App = withAuthenticator(() => {
    return <AppContainer />
});
