import { readDir, readFile, writeFile, ExternalStorageDirectoryPath } from 'react-native-fs';

async function testFS(){
    try{
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
                title: 'Stardew Sync',
                message: 'May I wead youwre extewnal stowage pwease? I need it to get to youwr existing save fiwes! :3c',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'No.',
                buttonPositive: 'Yeah!',
            },
        );
        const granted2 = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                title: 'Stardew Sync',
                message: 'May I write to youwre extewnal stowage pwease? I need it to save youwr new save fiwes! :3c',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'No.',
                buttonPositive: 'Yeah!',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED && granted2 == PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the storage!');

            await writeFile(ExternalStorageDirectoryPath+"/StardewValley/Bobby_222982957/HELLOWOROWLSD.txt", "hello!")
            let x = await readFile(ExternalStorageDirectoryPath+"/StardewValley/Bobby_222982957/HELLOWOROWLSD.txt")
            console.log(x)
        } else {
            console.log('Storage permission denied :(');
        }


    }
    catch(e){
        console.log(e)
    }
}

export default { testFS };
