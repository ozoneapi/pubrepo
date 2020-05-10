const Dcr = require('../src/dcr/dcr.js');

async function go() {
  const params = {
    issuer: 'https://ob19-auth1-ui.o3bank.co.uk/',
    aud: '0015800001041RHAAY',
    software_statement:  'eyJhbGciOiJQUzI1NiIsImtpZCI6Ikh6YTl2NWJnREpjT25oY1VaN0JNd2JTTF80TlYwZ1NGdklqYVNYZEMtMWM9IiwidHlwIjoiSldUIn0.eyJpc3MiOiJPcGVuQmFua2luZyBMdGQiLCJpYXQiOjE1NzkxMDQ3NjksImp0aSI6IjM4NGU2NjFiYzM4ODQzODkiLCJzb2Z0d2FyZV9lbnZpcm9ubWVudCI6InNhbmRib3giLCJzb2Z0d2FyZV9tb2RlIjoiVGVzdCIsInNvZnR3YXJlX2lkIjoieUppS3ZHcTA0R1pvaHZSeDBOckpJZiIsInNvZnR3YXJlX2NsaWVudF9pZCI6InlKaUt2R3EwNEdab2h2UngwTnJKSWYiLCJzb2Z0d2FyZV9jbGllbnRfbmFtZSI6IkFQSVNvZnR3YXJlU3RhdGVtZW50VGVzdC0xNTU1MzIxMzM1Iiwic29mdHdhcmVfY2xpZW50X2Rlc2NyaXB0aW9uIjoiQVBJIEZpcnN0IGNyZWF0ZSBzb2Z0d2FyZSBTdGF0ZW1lbnQgMTU1NTMyMTMzNSB1c2luZyBQb3N0bWFuIiwic29mdHdhcmVfdmVyc2lvbiI6MS4xLCJzb2Z0d2FyZV9jbGllbnRfdXJpIjoiaHR0cHM6Ly9jbGllbnQub3BlbmJhbmtpbmcub3JnLnVrIiwic29mdHdhcmVfcmVkaXJlY3RfdXJpcyI6WyJodHRwczovL3JlZGlyZWN0Lm9wZW5iYW5raW5nLm9yZy51ayIsImh0dHBzOi8vcmVkaXJlY3QtbmV3Lm9wZW5iYW5raW5nLm9yZy51ayJdLCJzb2Z0d2FyZV9yb2xlcyI6WyJBSVNQIl0sIm9yZ2FuaXNhdGlvbl9jb21wZXRlbnRfYXV0aG9yaXR5X2NsYWltcyI6eyJhdXRob3JpdHlfaWQiOiJPQkdCUiIsInJlZ2lzdHJhdGlvbl9pZCI6IlVua25vd24wMDE1ODAwMDAxMDQxUmJBQUkiLCJzdGF0dXMiOiJBY3RpdmUiLCJhdXRob3Jpc2F0aW9ucyI6W3sibWVtYmVyX3N0YXRlIjoiR0IiLCJyb2xlcyI6WyJBSVNQIiwiUElTUCIsIkNCUElJIl19LHsibWVtYmVyX3N0YXRlIjoiSUUiLCJyb2xlcyI6WyJBSVNQIiwiUElTUCIsIkNCUElJIl19LHsibWVtYmVyX3N0YXRlIjoiTkwiLCJyb2xlcyI6WyJBSVNQIiwiUElTUCIsIkNCUElJIl19XX0sInNvZnR3YXJlX2xvZ29fdXJpIjoiaHR0cHM6Ly9sb2dvLm9wZW5iYW5raW5nLm9yZy51ayIsIm9yZ19zdGF0dXMiOiJBY3RpdmUiLCJvcmdfaWQiOiIwMDE1ODAwMDAxMDQxUmJBQUkiLCJvcmdfbmFtZSI6Ik9wZW4gQmFua2luZyBMaW1pdGVkIChBKSIsIm9yZ19jb250YWN0cyI6W3sibmFtZSI6IlRlY2huaWNhbCIsImVtYWlsIjoidGVjaGluY2FsMTU3ODMxNDg0OUB0ZXN0LmNvbSIsInBob25lIjoiMTU3ODMxNDg0OSIsInR5cGUiOiJUZWNobmljYWwifSx7Im5hbWUiOiJCdXNpbmVzcyIsImVtYWlsIjoiYnVzaW5lc3Nsb3oxNTc4MzE0ODQ4QHRlc3QuY29tIiwicGhvbmUiOiIxNTc4MzE0ODQ4IiwidHlwZSI6IkJ1c2luZXNzIn1dLCJvcmdfandrc19lbmRwb2ludCI6Imh0dHBzOi8va2V5c3RvcmUub3BlbmJhbmtpbmd0ZXN0Lm9yZy51ay8wMDE1ODAwMDAxMDQxUmJBQUkvMDAxNTgwMDAwMTA0MVJiQUFJLmp3a3MiLCJvcmdfandrc19yZXZva2VkX2VuZHBvaW50IjoiaHR0cHM6Ly9rZXlzdG9yZS5vcGVuYmFua2luZ3Rlc3Qub3JnLnVrLzAwMTU4MDAwMDEwNDFSYkFBSS9yZXZva2VkLzAwMTU4MDAwMDEwNDFSYkFBSS5qd2tzIiwic29mdHdhcmVfandrc19lbmRwb2ludCI6Imh0dHBzOi8va2V5c3RvcmUub3BlbmJhbmtpbmd0ZXN0Lm9yZy51ay8wMDE1ODAwMDAxMDQxUmJBQUkveUppS3ZHcTA0R1pvaHZSeDBOckpJZi5qd2tzIiwic29mdHdhcmVfandrc19yZXZva2VkX2VuZHBvaW50IjoiaHR0cHM6Ly9rZXlzdG9yZS5vcGVuYmFua2luZ3Rlc3Qub3JnLnVrLzAwMTU4MDAwMDEwNDFSYkFBSS9yZXZva2VkL3lKaUt2R3EwNEdab2h2UngwTnJKSWYuandrcyIsInNvZnR3YXJlX3BvbGljeV91cmkiOiJodHRwczovL3BvbGljeS5vcGVuYmFua2luZy5vcmcudWsiLCJzb2Z0d2FyZV90b3NfdXJpIjoiaHR0cHM6Ly90ZXJtcy5vcGVuYmFua2luZy5vcmcudWsiLCJzb2Z0d2FyZV9vbl9iZWhhbGZfb2Zfb3JnIjoiU3VyaW5kZXJUZWFtIn0.oVAf6uK1EewD7z_4aKIXxYxloFDZHwD4ekyE9rNrRltzhuibqAJImU42DywWVAGMPxS2mJGvKJpz1Q_OLuLE-NSwL8yVgADfPR5B4CBbKOOaOo5c7cmh5hdMt8uKaKkLPWVYBX3fJuGk2aRdoK4V7Qx-VJl8GsBJsbBzIm0eQ0RDG5KnghxZh2nfruwZBbVW8OIu0av5_7g79LTS1Myx8RVqwDGH7T4zETGNzvZHkgrB5-hWDcshlBtGTLpCvOZQi88_c82lytfydpHQ4TGZ86LOHn3F7i7kutP1_29Cwd1cj_LWckn_1Oqt-fH78vHbZhklIQGcQkSvOwkzIEU5sg',
    iss: 'yJiKvGq04GZohvRx0NrJIf',
    redirect_uris: [
      'https://redirect.openbanking.org.uk'
    ],
    token_endpoint_auth_method: 'client_secret_basic',
    token_endpoint_auth_signing_alg: 'PS256',
    id_token_signed_response_alg: 'PS256',
    request_object_signing_alg: 'PS256',
    grant_types: ['authorization_code', 'client_credentials', 'urn:openid:params:grant-type:ciba'],
    registrationJws: {
      alg: 'PS256',
      signingKeyKid: '0CGse7zsaMzjuB9siheDGF_jHYY',
      signingKeyFileName: 'C:\\usr\\freddi\\projects\\ozone\\tech\\repos\\monorepo\\crypto\\certs\\tpp\\dcr-dir\\sig.key'
    },
    certs: {
      ca: 'C:\\usr\\freddi\\projects\\ozone\\tech\\repos\\monorepo\\crypto\\certs\\obie\\sandbox\\ob-sandbox-issuing-chain.pem',
      cert: 'C:\\usr\\freddi\\projects\\ozone\\tech\\repos\\monorepo\\crypto\\certs\\tpp\\dcr-dir\\transport.pem',
      key: 'C:\\usr\\freddi\\projects\\ozone\\tech\\repos\\monorepo\\crypto\\certs\\tpp\\dcr-dir\\transport.key'
    },
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
