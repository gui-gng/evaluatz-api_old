module.exports = {
    getUrl: 'https://github.com/login/oauth/authorize?client_id=20d0c2fa297ab2af3515',
    getFromCode: async (code) => await getGoogleAccountFromCode(code)
}