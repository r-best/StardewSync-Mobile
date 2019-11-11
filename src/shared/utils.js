import { Alert, ToastAndroid } from 'react-native';
import { parseStringPromise } from 'xml2js';

/**
 * Displays a toast using `react-native`'s `ToastAndroid` module
 * 
 * @param {string} message The message to display
 * @param {long} boolean Optional, defaults to false if true displays
 *  the toast with duration `ToastAndriod.LONG` instead of `ToastAndroid.SHORT`
 */
function toast(message, long=false){
    ToastAndroid.show(message,
        long ? ToastAndroid.LONG : ToastAndroid.SHORT
    );
}

/**
 * Uses `react-native`'s `Alert` to make a confirmation dialogue
 * similar to the typical javascript `confirm` function
 * 
 * @param {string} title The title of the popup window
 * @param {string} message The message to be displayed to the user
 * @param {{}} options See `react-native.Alert` for options
 * @returns {Promise<boolean>} Whether or not the user clicks 'yes'
 */
async function confirm(title, message, options){
    return new Promise(resolve => {
        Alert.alert(title, message, [
            {
                text: 'No',
                onPress: () => resolve(false),
                style: 'cancel'
            },
            {
                text: 'Yes',
                onPress: () => resolve(true)
            }
        ],
        options);
    });
}

export { toast, confirm };
