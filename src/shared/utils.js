import { Alert, ToastAndroid } from 'react-native';
import { Storage } from 'aws-amplify';
import { parseStringPromise } from 'xml2js';


/** The number of cloud save slots this user has */
const NUM_CLOUD_SAVES = 3;

/**
 * Replacement for Amplify's Storage.get because for some reason it
 * returns a public URL where you can access the object instead of
 * just returning the object
 * 
 * @param {string} url The path to the object to fetch
 * @param {boolean} parse If true, returns the pared JSON object
 *  instead of an xml string
 */
async function StorageGet(url, parse=true){
    try{
        let S3Url = await Storage.get(url, {expires:60});
        let xml = await (await fetch(S3Url)).text();

        if(!parse) return xml;

        let json = await parseStringPromise(xml);

        if("Error" in json){
            console.log(`Error fetching '${url}': ${json['Error']['Message']}`);
            return false;
        }

        return json;
    }
    catch(e){
        console.log(e)
        return parse ? {} : "";
    }
}

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

export { NUM_CLOUD_SAVES, StorageGet, toast, confirm };
