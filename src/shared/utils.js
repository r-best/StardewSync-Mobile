import { Auth, API, Storage } from 'aws-amplify';

import { parseStringPromise } from 'xml2js';


const NUM_CLOUD_SAVES = 3;

/**
 * Replacement for Amplify's Storage.get because for some reason it
 * returns a public URL where you can access the object instead of
 * just returning the object
 * @param {} url 
 */
async function StorageGet(url){
    try{
        let S3Url = await Storage.get(url, {expires:60});
        let res = await (await fetch(S3Url)).text();
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

export { NUM_CLOUD_SAVES, StorageGet };