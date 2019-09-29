import { Alert } from 'react-native';
import { Auth, API, Storage } from 'aws-amplify';
import { parseStringPromise } from 'xml2js';


const NUM_CLOUD_SAVES = 3;

/**
 * Replacement for Amplify's Storage.get because for some reason it
 * returns a public URL where you can access the object instead of
 * just returning the object
 * @param {} url 
 * @param {boolean} parse If true, returns the pared JSON object
 *      instead of an xml string
 */
async function StorageGet(url, parse=true){
    try{
        let S3Url = await Storage.get(url, {expires:60});
        let res = await (await fetch(S3Url)).text();

        if(!parse) return res;

        let xml = await parseStringPromise(res);

        if("Error" in xml){
            console.log(`Error fetching '${url}': ${xml['Error']['Message']}`);
            return false;
        }

        return xml;
    }
    catch(e){
        console.log(e)
    }
}

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
    })
}

export { NUM_CLOUD_SAVES, StorageGet, confirm };
