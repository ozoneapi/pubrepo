const Dcr = require('../src/dcr/dcr.js');

async function go() {
  const params = {
    //issuer: 'https://auth-ui-obsbox.capitalone.co.uk/',
    issuer: 'http://localhost:3605/',
    aud: '001580000103UAQAA2',
    emulateSubject: 'foobar',
    scope: 'openid accounts fundsconfirmations',
    software_statement: 'eyJhbGciOiJQUzI1NiIsImtpZCI6ImRTM0hFenN5VkpPTHpRVkhJVWtPSkUySXFrbTN5SGI0QllfUGJCRVRXalk9IiwidHlwIjoiSldUIn0.eyJpc3MiOiJPcGVuQmFua2luZyBMdGQiLCJpYXQiOjE1NjIxOTUwMDcsImp0aSI6ImYyZDdmNWM5NGNkOTQxNTQiLCJzb2Z0d2FyZV9lbnZpcm9ubWVudCI6InNhbmRib3giLCJzb2Z0d2FyZV9tb2RlIjoiVGVzdCIsInNvZnR3YXJlX2lkIjoiNWFSYXY3S0JkckVxcXMxZTFmd05nayIsInNvZnR3YXJlX2NsaWVudF9pZCI6IjVhUmF2N0tCZHJFcXFzMWUxZndOZ2siLCJzb2Z0d2FyZV9jbGllbnRfbmFtZSI6IkRDUiBUZXN0cyIsInNvZnR3YXJlX2NsaWVudF9kZXNjcmlwdGlvbiI6IlNvZnR3YXJlIHN0YXRlbWVudCB0byBiZSB1c2VkIGZvciB0ZXN0aW5nIER5bmFtaWMgQ2xpZW50IFJlZ2lzdHJhdGlvbiB3aXRoIE96b25lIiwic29mdHdhcmVfdmVyc2lvbiI6My4xLCJzb2Z0d2FyZV9jbGllbnRfdXJpIjoiaHR0cHM6Ly93d3cubzNiYW5rLmNvbSIsInNvZnR3YXJlX3JlZGlyZWN0X3VyaXMiOlsiaHR0cHM6Ly9tb2RlbG9iYW5rYXV0aDIwMTgubzNiYW5rLmNvLnVrOjQxMDEvcmVkaXJlY3QtdXJsIiwiaHR0cHM6Ly9tb2RlbG9iYW5rYXV0aDIwMTgubzNiYW5rLmNvLnVrOjQxMDEvc2ltcGxlLXJlZGlyZWN0LXVybCJdLCJzb2Z0d2FyZV9yb2xlcyI6WyJBSVNQIiwiUElTUCJdLCJvcmdhbmlzYXRpb25fY29tcGV0ZW50X2F1dGhvcml0eV9jbGFpbXMiOnsiYXV0aG9yaXR5X2lkIjoiRkNBR0JSIiwicmVnaXN0cmF0aW9uX2lkIjoiVW5rbm93bjAwMTU4MDAwMDEwNDFSSEFBWSIsInN0YXR1cyI6IkFjdGl2ZSIsImF1dGhvcmlzYXRpb25zIjpbeyJtZW1iZXJfc3RhdGUiOiJHQiIsInJvbGVzIjpbIkFJU1AiLCJQSVNQIl19LHsibWVtYmVyX3N0YXRlIjoiSUUiLCJyb2xlcyI6WyJBSVNQIiwiUElTUCJdfSx7Im1lbWJlcl9zdGF0ZSI6Ik5MIiwicm9sZXMiOlsiQUlTUCIsIlBJU1AiXX1dfSwic29mdHdhcmVfbG9nb191cmkiOiJodHRwczovL3d3dy5vM2JhbmsuY29tIiwib3JnX3N0YXR1cyI6IkFjdGl2ZSIsIm9yZ19pZCI6IjAwMTU4MDAwMDEwNDFSSEFBWSIsIm9yZ19uYW1lIjoiT3pvbmUgRmluYW5jaWFsIFRlY2hub2xvZ3kgTGltaXRlZCIsIm9yZ19jb250YWN0cyI6W3sibmFtZSI6IkJ1c2luZXNzIiwiZW1haWwiOiJjb250YWN0QG8zYmFuay5jb20iLCJwaG9uZSI6IjAwMCIsInR5cGUiOiJCdXNpbmVzcyJ9LHsibmFtZSI6IlRlY2huaWNhbCIsImVtYWlsIjoiY29udGFjdEBvM2JhbmsuY29tIiwicGhvbmUiOiIwMDAiLCJ0eXBlIjoiVGVjaG5pY2FsIn1dLCJvcmdfandrc19lbmRwb2ludCI6Imh0dHBzOi8va2V5c3RvcmUub3BlbmJhbmtpbmd0ZXN0Lm9yZy51ay8wMDE1ODAwMDAxMDQxUkhBQVkvMDAxNTgwMDAwMTA0MVJIQUFZLmp3a3MiLCJvcmdfandrc19yZXZva2VkX2VuZHBvaW50IjoiaHR0cHM6Ly9rZXlzdG9yZS5vcGVuYmFua2luZ3Rlc3Qub3JnLnVrLzAwMTU4MDAwMDEwNDFSSEFBWS9yZXZva2VkLzAwMTU4MDAwMDEwNDFSSEFBWS5qd2tzIiwic29mdHdhcmVfandrc19lbmRwb2ludCI6Imh0dHBzOi8va2V5c3RvcmUub3BlbmJhbmtpbmd0ZXN0Lm9yZy51ay8wMDE1ODAwMDAxMDQxUkhBQVkvNWFSYXY3S0JkckVxcXMxZTFmd05nay5qd2tzIiwic29mdHdhcmVfandrc19yZXZva2VkX2VuZHBvaW50IjoiaHR0cHM6Ly9rZXlzdG9yZS5vcGVuYmFua2luZ3Rlc3Qub3JnLnVrLzAwMTU4MDAwMDEwNDFSSEFBWS9yZXZva2VkLzVhUmF2N0tCZHJFcXFzMWUxZndOZ2suandrcyIsInNvZnR3YXJlX3BvbGljeV91cmkiOiJodHRwczovL3d3dy5vM2JhbmsuY29tIiwic29mdHdhcmVfdG9zX3VyaSI6Imh0dHBzOi8vd3d3Lm8zYmFuay5jb20iLCJzb2Z0d2FyZV9vbl9iZWhhbGZfb2Zfb3JnIjpudWxsfQ.BZodXkvrFF1Bir2WUPOFhchcGJSS9NgPgQQ3KCuRKN8qBVe3382wAg-UkJ1Vx2f8YNOnUF4oy6nC0qz3wCvrq3BsY0_n6wLZzhsvmn8QbMVawc0rhK2WhZ_TmCJSeXusyA574rUAtuqAzqvs2fwDgX5p1S4apxw2pfwWRUJa2tiaTqYBCZl6bRaRzZl-n0KOMuJUGtBUsmyfzNXIM4kMxw_9OlsUJtNtu7Hs82sr8aUmFSDrrEDuLkJbVgvSBMsAcRdwdWwLdyTzYuwpYEEiOQos4pjX96hUdWde6QQzeZXsOz88tKoWb1DvTzGE79ZmkXSXAXNRowJbI_qv5egQ3A',
    iss: '5aRav7KBdrEqqs1e1fwNgk',
    redirect_uris: [
      'https://modelobankauth2018.o3bank.co.uk:4101/redirect-url',
      'https://modelobankauth2018.o3bank.co.uk:4101/simple-redirect-url'
    ],
    token_endpoint_auth_method: 'client_secret_basic',
    token_endpoint_auth_signing_alg: 'none',
    id_token_signed_response_alg: 'PS256',
    request_object_signing_alg: 'PS256',
    grant_types: ['authorization_code', 'client_credentials'],
    registrationJws: {
      alg: 'PS256',
      signingKeyKid: 'oLyjFIQzA-RfmoAqd7jn5T9_kK8',
      signingKeyFileName: 'C:\\usr\\freddi\\projects\\ozone\\tech\\repos\\monorepo\\crypto\\certs\\tpp\\dcr-5aRav7KBdrEqqs1e1fwNgk\\signing-5aRav7KBdrEqqs1e1fwNgk.key'
    },
    certs: {
      ca: 'C:\\usr\\freddi\\projects\\ozone\\tech\\repos\\monorepo\\crypto\\certs\\obie\\sandbox\\ob-sandbox-issuing-chain.pem',
      cert: 'C:\\usr\\freddi\\projects\\ozone\\tech\\repos\\monorepo\\crypto\\certs\\tpp\\dcr-5aRav7KBdrEqqs1e1fwNgk\\transport-5aRav7KBdrEqqs1e1fwNgk.pem',
      key: 'C:\\usr\\freddi\\projects\\ozone\\tech\\repos\\monorepo\\crypto\\certs\\tpp\\dcr-5aRav7KBdrEqqs1e1fwNgk\\transport-5aRav7KBdrEqqs1e1fwNgk.key'
    }
  };
  const result = await Dcr.registerClient(params);
  return result;
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
