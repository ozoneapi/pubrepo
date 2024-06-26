const Dcr = require('../src/dcr/dcr.js');

async function go() {
  const params = {
    // issuer: 'https://auth-ui-obsbox.capitalone.co.uk/',
    issuer: 'http://localhost:3605/',
    emulateSubject: 'C=GB,O=OpenBanking,OU=0015800001041RHAAY,CN=5aRav7KBdrEqqs1e1fwNgk',
    aud: '001580000103UAQAA2',
    scope: 'openid accounts',
    software_statement: 'eyJhbGciOiJQUzI1NiIsImtpZCI6Ikh6YTl2NWJnREpjT25oY1VaN0JNd2JTTF80TlYwZ1NGdklqYVNYZEMtMWM9IiwidHlwIjoiSldUIn0.eyJpc3MiOiJPcGVuQmFua2luZyBMdGQiLCJpYXQiOjE1OTcxNDI1MDYsImp0aSI6IjVmODJmNDA3YTZlYjQ0Y2YiLCJzb2Z0d2FyZV9lbnZpcm9ubWVudCI6InNhbmRib3giLCJzb2Z0d2FyZV9tb2RlIjoiVGVzdCIsInNvZnR3YXJlX2lkIjoiNWFSYXY3S0JkckVxcXMxZTFmd05nayIsInNvZnR3YXJlX2NsaWVudF9pZCI6IjVhUmF2N0tCZHJFcXFzMWUxZndOZ2siLCJzb2Z0d2FyZV9jbGllbnRfbmFtZSI6IkRDUiBUZXN0cyIsInNvZnR3YXJlX2NsaWVudF9kZXNjcmlwdGlvbiI6IlNvZnR3YXJlIHN0YXRlbWVudCB0byBiZSB1c2VkIGZvciB0ZXN0aW5nIER5bmFtaWMgQ2xpZW50IFJlZ2lzdHJhdGlvbiB3aXRoIE96b25lIiwic29mdHdhcmVfdmVyc2lvbiI6My4xLCJzb2Z0d2FyZV9jbGllbnRfdXJpIjoiaHR0cHM6Ly93d3cubzNiYW5rLmNvbSIsInNvZnR3YXJlX3JlZGlyZWN0X3VyaXMiOlsiaHR0cHM6Ly9tb2RlbG9iYW5rYXV0aDIwMTgubzNiYW5rLmNvLnVrOjQxMDEvcmVkaXJlY3QtdXJsIiwiaHR0cHM6Ly9tb2RlbG9iYW5rYXV0aDIwMTgubzNiYW5rLmNvLnVrOjQxMDEvc2ltcGxlLXJlZGlyZWN0LXVybCJdLCJzb2Z0d2FyZV9yb2xlcyI6WyJBSVNQIiwiUElTUCJdLCJvcmdhbmlzYXRpb25fY29tcGV0ZW50X2F1dGhvcml0eV9jbGFpbXMiOnsiYXV0aG9yaXR5X2lkIjoiT0JHQlIiLCJyZWdpc3RyYXRpb25faWQiOiJVbmtub3duMDAxNTgwMDAwMTA0MVJIQUFZIiwic3RhdHVzIjoiQWN0aXZlIiwiYXV0aG9yaXNhdGlvbnMiOlt7Im1lbWJlcl9zdGF0ZSI6IkdCIiwicm9sZXMiOlsiQUlTUCIsIlBJU1AiXX0seyJtZW1iZXJfc3RhdGUiOiJJRSIsInJvbGVzIjpbIkFJU1AiLCJQSVNQIl19LHsibWVtYmVyX3N0YXRlIjoiTkwiLCJyb2xlcyI6WyJBSVNQIiwiUElTUCJdfV19LCJzb2Z0d2FyZV9sb2dvX3VyaSI6Imh0dHBzOi8vd3d3Lm8zYmFuay5jb20iLCJvcmdfc3RhdHVzIjoiQWN0aXZlIiwib3JnX2lkIjoiMDAxNTgwMDAwMTA0MVJIQUFZIiwib3JnX25hbWUiOiJPem9uZSBGaW5hbmNpYWwgVGVjaG5vbG9neSBMaW1pdGVkIiwib3JnX2NvbnRhY3RzIjpbeyJuYW1lIjoiVGVjaG5pY2FsIiwiZW1haWwiOiJjb250YWN0QG8zYmFuay5jb20iLCJwaG9uZSI6IjAwMCIsInR5cGUiOiJUZWNobmljYWwifSx7Im5hbWUiOiJCdXNpbmVzcyIsImVtYWlsIjoiY29udGFjdEBvM2JhbmsuY29tIiwicGhvbmUiOiIwMDAiLCJ0eXBlIjoiQnVzaW5lc3MifV0sIm9yZ19qd2tzX2VuZHBvaW50IjoiaHR0cHM6Ly9rZXlzdG9yZS5vcGVuYmFua2luZ3Rlc3Qub3JnLnVrLzAwMTU4MDAwMDEwNDFSSEFBWS8wMDE1ODAwMDAxMDQxUkhBQVkuandrcyIsIm9yZ19qd2tzX3Jldm9rZWRfZW5kcG9pbnQiOiJodHRwczovL2tleXN0b3JlLm9wZW5iYW5raW5ndGVzdC5vcmcudWsvMDAxNTgwMDAwMTA0MVJIQUFZL3Jldm9rZWQvMDAxNTgwMDAwMTA0MVJIQUFZLmp3a3MiLCJzb2Z0d2FyZV9qd2tzX2VuZHBvaW50IjoiaHR0cHM6Ly9rZXlzdG9yZS5vcGVuYmFua2luZ3Rlc3Qub3JnLnVrLzAwMTU4MDAwMDEwNDFSSEFBWS81YVJhdjdLQmRyRXFxczFlMWZ3TmdrLmp3a3MiLCJzb2Z0d2FyZV9qd2tzX3Jldm9rZWRfZW5kcG9pbnQiOiJodHRwczovL2tleXN0b3JlLm9wZW5iYW5raW5ndGVzdC5vcmcudWsvMDAxNTgwMDAwMTA0MVJIQUFZL3Jldm9rZWQvNWFSYXY3S0JkckVxcXMxZTFmd05nay5qd2tzIiwic29mdHdhcmVfcG9saWN5X3VyaSI6Imh0dHBzOi8vd3d3Lm8zYmFuay5jb20iLCJzb2Z0d2FyZV90b3NfdXJpIjoiaHR0cHM6Ly93d3cubzNiYW5rLmNvbSIsInNvZnR3YXJlX29uX2JlaGFsZl9vZl9vcmciOm51bGx9.XliELv1_SCILZc85BIUX1bjfT2jE6lkCnHuDa4Fhpd_onGHHm4JeSBPNtSLbs4kWyxLaY3QnFPT1JK46bHWL6OcvzJB0HeFGYVAlqpjKXESoSsfJ9p12FIwUHXVoUEnjaCGbhy9uj1fp_PYYDP8WJ5YqMotJ_5C-O6kjHP1JVEAQQ80LVBE2kWRvBSPYRQbfxh83Q4wMgO7BFvTayCVDHuny2HGldZoJXjvCbn2ys_gFI8ykdm8wnECzuOXXoI21zaXX5Ii9tBsJ7m7UPI3r4Z7M2A-bd4qf6wnFhiF58_AAwUJDbIEU6rc27ckE_JKcIgfhim_KnKtvM0BXfqTPZg',
    iss: '5aRav7KBdrEqqs1e1fwNgk',
    redirect_uris: [
      'https://modelobankauth2018.o3bank.co.uk:4101/redirect-url',
      'https://modelobankauth2018.o3bank.co.uk:4101/simple-redirect-url'
    ],
    token_endpoint_auth_method: 'client_secret_basic',
    // token_endpoint_auth_signing_alg: 'none',
    id_token_signed_response_alg: 'PS256',
    request_object_signing_alg: 'PS256',
    grant_types: ['authorization_code', 'client_credentials'],
    registrationJws: {
      alg: 'PS256',
      signingKeyKid: '7bFO-HvVxf9MiODft_jh-i9nu1E',
      signingKeyFileName: '/monorepo/crypto/certs/tpp/dcr-5aRav7KBdrEqqs1e1fwNgk/signing-5aRav7KBdrEqqs1e1fwNgk.key'
    },
    certs: {
      ca: '/monorepo/crypto/certs/obie/sandbox/ob-sandbox-issuing-chain.pem',
      cert: '/monorepo/crypto/certs/tpp/dcr-5aRav7KBdrEqqs1e1fwNgk/transport-5aRav7KBdrEqqs1e1fwNgk.pem',
      key: '/monorepo/crypto/certs/tpp/dcr-5aRav7KBdrEqqs1e1fwNgk/transport-5aRav7KBdrEqqs1e1fwNgk.key'
    }
  };
  const result = await Dcr.registerClient(params, process.env.OZONE_HOME);
  return result;
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
