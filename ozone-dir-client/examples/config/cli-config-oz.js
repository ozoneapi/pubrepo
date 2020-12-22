function getConfig (args) {
  const {OZONE_HOME} = process.env;

  return {
    baseScimUri: 'https://matls-api.openbankingtest.org.uk/scim/v2',
    baseRestUri: 'https://matls-dirapi.openbankingtest.org.uk',
    oidcClient:{
      tokenUri: 'https://matls-sso.openbankingtest.org.uk/as/token.oauth2',
      issuer: 'https://sso.openbankingtest.org.uk/.well-known/openid-configuration',
      scope: 'AuthoritiesReadAccess ASPSPReadAccess TPPReadAll',    
      logLevels: {
        oidcClient: args.debug,
        http: args.debug,
        jwt: args.debug
      },
      certs: {
        ca: `${OZONE_HOME}/monorepo/crypto/certs/obie/sandbox/ob-sandbox-issuing-chain.pem`,
        cert: `${OZONE_HOME}/monorepo/crypto/certs/aspsp/ob19/transport-HRU0LawPRlbkM97JKUyLmj-2.pem`,
        key: `${OZONE_HOME}/monorepo/crypto/certs/aspsp/ob19/transport-HRU0LawPRlbkM97JKUyLmj-2.key` 
      },
      token_endpoint_auth_method: 'private_key_jwt',
      token_endpoint_auth_signing_alg: 'PS256',
      request_object_signing_alg: 'PS256',
      // backchannel_authentication_request_signing_alg: 'PS256',
      client_id: 'HRU0LawPRlbkM97JKUyLmj',
      signingKeyKid: 'Znp1eY-wHaiFuTfQeA2HkqDGwLk',
      signingKeyFileName: `${OZONE_HOME}/monorepo/crypto/certs/aspsp/ob19/signing-HRU0LawPRlbkM97JKUyLmj-2.key`     
    }
  };
}

module.exports = getConfig;