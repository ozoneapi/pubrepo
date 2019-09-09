const JwtAuth = require('../src/jwt-auth.js');

async function go() {
  const httpClientParams = {
    url: 'http://localhost:3050/hello',
    headers: {
      'x-cert-dn': 'CN=HQuZPIt3ipkh33Uxytox1E,OU=0015800001041RHAAY,O=OpenBanking,C=GB'
    }
  };

  const signingParams = {
    alg: 'RS256',
    iss: 'OpenBanking',
    sub: '0015800001041RHAAY',
    validity: 30,
    customClaims: {
      alpha: '10',
      gamma: 20
    },
    privateKey: {
      kty: 'RSA',
      kid: 'W7DIWbfwsfxZIJl_PlaSS8vgQ3-cEtWtiNCAIXmJJMk',
      use: 'sig',
      e: 'AQAB',
      n:
      'vnMc2wW-OdcoPnLpVm8dT54_MuQYDt9kqlSnxN-utrbaRbX2N7T04t0Me9JPMyEE03uYM4kt0t1wyVmEVGu6OQ',
      d:
      'GZ9BBZJrOjrhFi29iLxgNCL1G7KmLfIOCABlpc32ImyR03jRYLqtae6-Lp5J1OrLfl3XOTII5gRVbG_sfq0tkQ',
      p: '5OXSOKbMFpZ2PWP0bOOE4XHkQTBhlHa42WGdzGFhBAU',
      q: '1P_hvc-9SG6Zndb10x6rBWmfxZrap3C4zSfCbXUoB6U',
      dp: 'kTluwxqwabRUmGaOcXd4m0CTPPjhMDyS0vioET_HObE',
      dq: 'nrQ1wBcMYu69mQS0z2R3ayYDPNof90ie-YWZcbMsa10',
      qi: 'p1BMBCPapjC62DOW4C2szIU3N4Ei28_yMGabFI1rYcU'
    }
  };

  return JwtAuth.do(httpClientParams, signingParams);
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
