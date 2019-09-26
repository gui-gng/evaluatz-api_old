
var google = require("googleapis").google;
/*******************/
/** CONFIGURATION **/
/*******************/

const googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID, // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // e.g. _ASDFA%DFASDFASDFASD#FAD-
    redirect: process.env.GOOGLE_REDIRECT_URL, // this must match your google api settings
};

const defaultScope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/plus.login'
];

/*************/
/** HELPERS **/
/*************/

function createConnection() {
    console.log("Creating connection");
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );
}

function getConnectionUrl(auth) {
    console.log("Getting URL");
    return auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: defaultScope
    });
}

function getGooglePlusApi(auth) {
    return google.plus({ version: 'v1', auth });
}

/**********/
/** MAIN **/
/**********/

/**
 * Part 1: Create a Google URL and send to the client to log in the user.
 */
function urlGoogle() {

    const auth = createConnection();
    const url = getConnectionUrl(auth);
    return url;
}

/**
 * Part 2: Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
 */
async function getGoogleAccountFromCode(code) {

    try {
        const auth = createConnection();
        const data = await auth.getToken(code);
        const tokens = data.tokens;
        auth.setCredentials(tokens);
        const plus = getGooglePlusApi(auth);
        const me = await plus.people.get({ userId: 'me' });
        const userGoogleId = me.data.id;
        const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
        const userGoogleDisplayname = me.data.displayName;

        return {
            id: userGoogleId,
            email: userGoogleEmail,
            displayName: userGoogleDisplayname,
            name: me.data.name,
            image: me.data.image,
            tokens: tokens,
        };
    } catch (e) {
        console.log("-----------------ERROR---------------")
        console.log(e);
    }
}



async function getUserData(token){
    const url = "https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=";

}


module.exports = {
    urlGoogle: urlGoogle,
    getFromCode: async (code) => await getGoogleAccountFromCode(code)
}