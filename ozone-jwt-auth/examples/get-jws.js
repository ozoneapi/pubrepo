const JwtAuth = require('../src/jwt-auth.js');

async function go() {
  const httpClientParams = {
    url: 'http://localhost:3050/hello-with-jwt',
    headers: {
      // 'x-cert-dn': 'CN=HQuZPIt3ipkh33Uxytox1E,OU=0015800001041RHAAY,O=OpenBanking,C=GB'
      'x-cert-dn': 'CN=HQuZPIt3ipkh33Uxytox1E,OU=b,O=OpenBanking,C=GB'
    }
  };

  const signingParams = {
    alg: 'PS256',
    iss: 'OpenBanking',
//    sub: '0015800001041RHAAY',
    sub: 'b',
    aud: 'aud',
    validity: 30,
    customClaims: {
      alpha: '10',
      gamma: 2
    },
    privateKey: {
      "kty": "RSA",
      "kid": "eUft3a55u8HA8vynHl5eOIjAq4TYE-EzpDt6YlxJmv8",
      "use": "sig",
      "e": "AQAB",
      "n": "0Cw8Ccs0CqxzajMQxOtIKNZovYEexBbrOPXI_PD3J408GRAYyETCVG59-EDqPyeL2dvHxC4P0rre1aC2mcAIg8gnoH4I3r9Sl0sw_ksrSSzv1y_9J2WvoTMDmeaTScjKdOTeLdpgplPTG59vFSn_aNjMYhB-UyfQeFHwMJ9IOmH_4AfHZXrbH_mndspu02P1SSdp2CwTK8mPssr2N2zQjw_01-hWVtUfjgxGqYvN63CGsjAv8_ZJPPDTbb8p5NSQ9yWpSgHe8bzg4Y5KnDHWb_N4nh1uVrlVJF7p4OH0UnLyJIcXYq29KjPQIy1x6XaAf-FpQG_HC5WGNC-3DSedOw",
      "d": "Lg4LPlNxcQcUBaPEivxOm5JL29kMGG_FnHVsAOHCnEJ30EeqY-wqXgmP3vNln5E9NHaWLIXQRFvJXtPOchd1CsqmUbBwf-8t84DUFv5EVk0VxrK8PBIYF_60RkEnxsQgXlof-V790O5snwjXx4PiGK0WEn_5oqYFTgk6rVcf4KJVk1J2KdV6ZP-FzZrgPwUMFD-7kWYCbFUCFhodS_TdV8OP0Z5Xh2e3RMzN6weVLJp_8lDR2sWiiRBxy9ULEzM7qtNtfqKDFmTh7HpJ9IK1Yb8fLmUu3vUMxx_VA_PhhvGz09E-4GpvyXogZOEXP5zEbsd819cD27CyY-IWeXgswQ",
      "p": "6uj3hF43vOd5Uknn6si6gYKsq83qmgQOfq6Bdm0vz3VDVXuNf4qvz_lZfe0C4R2_C-DUUueQeiKtlKiVCuI5z6uWM8LSGhdRJmHPosmgLqQ2OWFiwYajGailJvIjQJcNNVAz6EpWUGD-B26-Nlz-Wl36XdnDZssdOVLfl8ulrls",
      "q": "4tzBPaxbEuB8VAaBaIRlxgf87ReO-GYV4jCncRk_b4NDOlPlA-6AMa3yGtv42GOwqGjs6F-WAWk0apIfbEmzjAZYfTUenKI0EejQbYrWRSQ96RCd-o0rp3v_Uz34kj2uC2inrNmRSAbiqPViQL6zlF6JNR4JluLLAF1gQPO8wqE",
      "dp": "XvjRGTL-VeE_q4U1vjZpMPMj3FHkB2Cce5sRvE9ohPdjwauyCV6ItgyZoc-w2lKsaqD7NoloX_ilNPTzTPMpbExy7XpWdzX2GQ5yY94gZLr_MTOuOY-1YSpNmvFKT1LChEtosQFc5CJSka60OEZgjyhvkIH5_hUgO4zF2Rj8YwE",
      "dq": "o5hF0c-krWwsu_sk_tXa_n9sKR1AAGi9hytG1Aw87pFdvYYaNEedMjYZzLysKn9ZOVjQ3pFvfvz6y48sEc7kJym8Ti4sMQ_XNMMK6rOf6KRF8PgGtFNxE4obiU-7HNpV0-xYXhFW7vXoJacufzoGDgxOLXvHtoM9mLm9W5lomYE",
      "qi": "F8JSIuqqyYGcfVZt00Ww5KotHVTwrkTMq3CDUDH6dKzt4zKQHWsHzK9W_77Eg2n9Z9Xl6eoLJ_TtMtDaq6McK6SVyb2hgPCoK8CPTrt-IJ8TkfbqrFF33kPV9cA8_d77bydiPdUgqKKEv7gH3N34CacPbUo_dVipUw93iSlvVI0"
    }
  };

  return JwtAuth.getJws(signingParams);
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
