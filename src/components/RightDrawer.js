import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { StyleSheet, Button, Text, View } from 'react-native';

import RNRestart from 'react-native-restart';

import { Auth } from 'aws-amplify';

class LeftDrawer extends Component {
    navigateToScreen = (route) => () => {
        this.props.navigation.dispatch(NavigationActions.navigate({
            routeName: route
        }));
    }

    async logOut(){
        await Auth.signOut();

        // I don't have time for this, if you won't recognize that the user
        // is logged out and send them back to the login screen I'll just
        // reload the entire damn app so you HAVE to.
        RNRestart.Restart();
    }

    render () {
        return (
            <View style={styles.container}>
                <Button
                    title="I WANT TO GET OFF MR BONES WILD RIDE"
                    onPress={() => this.logOut()}
                />
            </View>
        );
    }
}

LeftDrawer.propTypes = {
  navigation: PropTypes.object
};

styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    navSectionStyle: {
        backgroundColor: 'lightgrey'
    },
    sectionHeadingStyle: {
        paddingVertical: 10,
        paddingHorizontal: 5
    },
    footerContainer: {
        padding: 20,
        backgroundColor: 'lightgrey'
    }
});

export default LeftDrawer;