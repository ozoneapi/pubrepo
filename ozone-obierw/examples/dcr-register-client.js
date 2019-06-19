const Dcr = require('../src/dcr/dcr.js');

async function go() {
  const params = {
    issuer: 'http://localhost:3605/',
    software_statement:  'eyJhbGciOiJSUzI1NiIsImtpZCI6ImRTM0hFenN5VkpPTHpRVkhJVWtPSkUySXFrbTN5SGI0QllfUGJCRVRXalk9IiwidHlwIjoiSldUIn0.eyJpYXQiOjE1NDUzNDcwOTAsImlzcyI6Ik9wZW5CYW5raW5nIEx0ZCIsImp0aSI6IjNyZmtoSEFsSU55bFFmOUpuWnN0TSIsIm9yZ19jb250YWN0cyI6W3siZW1haWwiOiJjb250YWN0QG8zYmFuay5jb20iLCJuYW1lIjoiQnVzaW5lc3MiLCJwaG9uZSI6IjAwMCIsInR5cGUiOiJCdXNpbmVzcyJ9LHsiZW1haWwiOiJjb250YWN0QG8zYmFuay5jb20iLCJuYW1lIjoiVGVjaG5pY2FsIiwicGhvbmUiOiIwMDAiLCJ0eXBlIjoiVGVjaG5pY2FsIn1dLCJvcmdfaWQiOiIwMDE1ODAwMDAxMDQxUkhBQVkiLCJvcmdfandrc19lbmRwb2ludCI6Imh0dHBzOi8va2V5c3RvcmUub3BlbmJhbmtpbmd0ZXN0Lm9yZy51ay8wMDE1ODAwMDAxMDQxUkhBQVkvMDAxNTgwMDAwMTA0MVJIQUFZLmp3a3MiLCJvcmdfandrc19yZXZva2VkX2VuZHBvaW50IjoiaHR0cHM6Ly9rZXlzdG9yZS5vcGVuYmFua2luZ3Rlc3Qub3JnLnVrLzAwMTU4MDAwMDEwNDFSSEFBWS9yZXZva2VkLzAwMTU4MDAwMDEwNDFSSEFBWS5qd2tzIiwib3JnX25hbWUiOiJPem9uZSBGaW5hbmNpYWwgVGVjaG5vbG9neSBMaW1pdGVkIiwib3JnX3N0YXR1cyI6IkFjdGl2ZSIsIm9yZ2FuaXNhdGlvbl9jb21wZXRlbnRfYXV0aG9yaXR5X2NsYWltcyI6eyJhdXRob3Jpc2F0aW9ucyI6W3sibWVtYmVyX3N0YXRlIjoiR0IiLCJyb2xlcyI6WyJBSVNQIiwiUElTUCJdfSx7Im1lbWJlcl9zdGF0ZSI6IklFIiwicm9sZXMiOlsiQUlTUCIsIlBJU1AiXX0seyJtZW1iZXJfc3RhdGUiOiJOTCIsInJvbGVzIjpbIkFJU1AiLCJQSVNQIl19XSwiYXV0aG9yaXR5X2lkIjoiRkNBR0JSIiwicmVnaXN0cmF0aW9uX2lkIjoiVW5rbm93bjAwMTU4MDAwMDEwNDFSSEFBWSIsInN0YXR1cyI6IkFjdGl2ZSJ9LCJzb2Z0d2FyZV9jbGllbnRfZGVzY3JpcHRpb24iOiJUZXN0IFRQUCBOdW1iZXIgMSIsInNvZnR3YXJlX2NsaWVudF9pZCI6IjdJYTRWZkN0eVhsYW9nVDdna0REOEEiLCJzb2Z0d2FyZV9jbGllbnRfbmFtZSI6Ik96b25lIFRlc3QgVFBQIDEiLCJzb2Z0d2FyZV9jbGllbnRfdXJpIjoiaHR0cHM6Ly9vM2JhbmsuY29tIiwic29mdHdhcmVfZW52aXJvbm1lbnQiOiJzYW5kYm94Iiwic29mdHdhcmVfaWQiOiI3SWE0VmZDdHlYbGFvZ1Q3Z2tERDhBIiwic29mdHdhcmVfandrc19lbmRwb2ludCI6Imh0dHBzOi8va2V5c3RvcmUub3BlbmJhbmtpbmd0ZXN0Lm9yZy51ay8wMDE1ODAwMDAxMDQxUkhBQVkvN0lhNFZmQ3R5WGxhb2dUN2drREQ4QS5qd2tzIiwic29mdHdhcmVfandrc19yZXZva2VkX2VuZHBvaW50IjoiaHR0cHM6Ly9rZXlzdG9yZS5vcGVuYmFua2luZ3Rlc3Qub3JnLnVrLzAwMTU4MDAwMDEwNDFSSEFBWS9yZXZva2VkLzdJYTRWZkN0eVhsYW9nVDdna0REOEEuandrcyIsInNvZnR3YXJlX2xvZ29fdXJpIjoiaHR0cHM6Ly9vM2JhbmsuZmlsZXMud29yZHByZXNzLmNvbS8yMDE3LzEwL28zbG9nby5wbmciLCJzb2Z0d2FyZV9tb2RlIjoiTGl2ZSIsInNvZnR3YXJlX29uX2JlaGFsZl9vZl9vcmciOiIiLCJzb2Z0d2FyZV9wb2xpY3lfdXJpIjoiaHR0cHM6Ly9vM2JhbmsuY29tIiwic29mdHdhcmVfcmVkaXJlY3RfdXJpcyI6WyJodHRwczovL21vZGVsb2JhbmthdXRoMjAxOC5vM2JhbmsuY28udWs6NDEwMS9yZWRpcmVjdC11cmwiLCJodHRwczovL21vZGVsb2JhbmthdXRoMjAxOC5vM2JhbmsuY28udWs6NDEwMS9zaW1wbGUtcmVkaXJlY3QtdXJsIl0sInNvZnR3YXJlX3JvbGVzIjpbIkFJU1AiLCJQSVNQIl0sInNvZnR3YXJlX3Rvc191cmkiOiJodHRwczovL28zYmFuay5jb20iLCJzb2Z0d2FyZV92ZXJzaW9uIjoxfQ.b9MA-n7aNd84E3gkVG5lvpzc_2rM7n3JRinTNShgZuwKFV1gtcrpqkaZgUoZIGwph9TxGdkJCh_w5Zknsek4eaJq_KecpPwi1Bao9o3IEZ1-So3Gx4Locp1F0z2oxuJw8BoAH30Nb1yfyMh4X2o5q5L8pIIu7uIi12rimJgk0mT3FnwJesgnOgw5brjh_NIQNFtSocMMbzAhPLcEBkU3YtaMg0vo-LgjtQEtchld3fota-Z3Q64O6XpFi_wwASMK8N6FZ_KAaBov2i_oKGTFzM9ZpZWmK2dzdoqaiMRFXp7HM461dGncRrZC7nrhrHFIB6zLrutqBiRPKZTGzcwQ6w',
    iss: '7Ia4VfCtyXlaogT7gkDD8A',
    redirect_uris: [
      'https://modelobankauth2018.o3bank.co.uk:4101/redirect-url',
      'https://modelobankauth2018.o3bank.co.uk:4101/simple-redirect-url'
    ],
    token_endpoint_auth_method: 'client_secret_basic',
    token_endpoint_auth_signing_alg: 'PS256',
    id_token_signed_response_alg: 'PS256',
    request_object_signing_alg: 'PS256',
    grant_types: ['authorization_code', 'client_credentials', 'urn:openid:params:grant-type:ciba'],
    registrationJws: {
      alg: 'PS256',
      signingKeyKid: 'dISF5OP0NEnErg-TfWVc4eFjiZg',
      signingKeyFileName: 'c:\\usr\\freddi\\projects\\ozone\\tech\\repos\\monorepo\\crypto\\certs\\o3-internal\\dISF5OP0NEnErg-TfWVc4eFjiZg.key'
    },
    certs: {
      ca: 'c:\\usr\\freddi\\projects\\ozone\\ca\\certs\\ob-sandbox-issuing-chain.pem',
      cert: 'c:\\usr\\freddi\\projects\\ozone\\ca\\certs\\ozone-sandbox-transport.pem',
      key: 'c:\\usr\\freddi\\projects\\ozone\\ca\\keys\\ozone-sandbox-transport.key'
    },
    emulateSubject: 'foobar',
    backchannel_token_delivery_mode: 'ping',
    backchannel_authentication_request_signing_alg: 'PS256',
    backchannel_user_code_parameter: false,
    backchannel_client_notification_endpoint: 'http://callback.me'
  };

  const result = await Dcr.registerClient(params);
  return result;
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
