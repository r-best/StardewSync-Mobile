import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { StyleSheet, Text, View } from 'react-native';

class LeftDrawer extends Component {
    navigateToScreen = (route) => () => {
        this.props.navigation.dispatch(NavigationActions.navigate({
            routeName: route
        }));
    }

    render () {
        return (
            <View style={styles.container}>
                <Text>LEFT DRAWER</Text>
            </View>
        );
    }
}

LeftDrawer.propTypes = {
  navigation: PropTypes.object
};

styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flex: 1
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