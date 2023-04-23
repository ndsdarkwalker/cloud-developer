// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'aqnf40vvl8'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'vladhoang.us.auth0.com',
  clientId: 'vkc1Cbh9lJjzoKsicdizyOpmisS6OZpv',
  callbackUrl: 'http://localhost:3000/callback'
}
