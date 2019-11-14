module.exports = {
    app:{
        port: process.env.PORT
    },
    db: {
        url: process.env.DEV_URL,
        host: process.env.DEV_DB_HOST,
        port: parseInt(process.env.DEV_DB_PORT) || 27017,
        name: process.env.DEV_DB_DATABASE || ''
    },
    data: {
        limit: '50mb',
        extended: false
    },
    mail: {
        auth: {
            api_user: process.env.SENDGRID_USERNAME,
            api_key: process.env.SENDGRID_PASSWORD
        },    
    },
    sms: {
        africastalking: {
            apiKey: '', //         // use your sandbox app API key for development in the test environment
            username: '',      // use 'sandbox' for development in the test environment
        },
        twilio:{
            apiKey: '',
            username: ''
        }
    },
    video:{
        vimeo:{
            clientId: "",
            clientSecret: "",
            accessToken: ""
        },
    }
}