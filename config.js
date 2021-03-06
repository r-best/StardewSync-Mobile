let awsconfig = {
    Auth: {
        identityPoolId: 'us-east-1:64d632ee-d1f1-4a72-9665-615c65fa0827',
        region: 'us-east-1',
        userPoolId: 'us-east-1_XF6sCfQ0Z',
        userPoolWebClientId: '3lv9ik94255h1f0e1s2c0rp8e1',
    },
    API: {
        endpoints: [{
            name: "notifs",
            endpoint: "https://3pff544onj.execute-api.us-east-1.amazonaws.com/dev"
        }]
    },
    Storage: {
        AWSS3: {
            bucket: 'stardewsync-dev',
            region: 'us-east-1',
        }
    }
}

export { awsconfig };
