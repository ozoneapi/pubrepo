const Jwt = require('../src/jwt.js');

async function go() {
  const params = {
    'header': {
      'alg': 'PS256',
      'kid': '3uejpDMbwmdur8uiF54OnrXKYULD8LlRzLTiSegZCTo',
      'typ': 'JWT'
    },
    body: {
      'iss': 'OpenBanking Ltd',
      'iat': 1597142506,
      'jti': '5f82f407a6eb44cf',
      'software_environment': 'sandbox',
      'software_mode': 'Test',
      'software_id': '5aRav7KBdrEqqs1e1fwNgk',
      'software_client_id': '5aRav7KBdrEqqs1e1fwNgk',
      'software_client_name': 'DCR Tests',
      'software_client_description': 'Software statement to be used for testing Dynamic Client Registration with Ozone',
      'software_version': 3.1,
      'software_client_uri': 'https://www.o3bank.com',
      'software_redirect_uris': [
        'https://modelobankauth2018.o3bank.co.uk:4101/redirect-url',
        'https://modelobankauth2018.o3bank.co.uk:4101/simple-redirect-url'
      ],
      'software_roles': [
        'AISP',
        'PISP'
      ],
      'organisation_competent_authority_claims': {
        'authority_id': 'OBGBR',
        'registration_id': 'Unknown0015800001041RHAAY',
        'status': 'Active',
        'authorisations': [
          {
            'member_state': 'GB',
            'roles': [
              'AISP',
              'PISPx'
            ]
          },
          {
            'member_state': 'IE',
            'roles': [
              'AISP',
              'PISP'
            ]
          },
          {
            'member_state': 'NL',
            'roles': [
              'AISP',
              'PISP'
            ]
          }
        ]
      },
      'software_logo_uri': 'https://www.o3bank.com',
      'org_status': 'Active',
      'org_id': '0015800001041RHAAY',
      'org_name': 'Ozone Financial Technology Limited',
      'org_contacts': [
        {
          'name': 'Technical',
          'email': 'contact@o3bank.com',
          'phone': '000',
          'type': 'Technical'
        },
        {
          'name': 'Business',
          'email': 'contact@o3bank.com',
          'phone': '000',
          'type': 'Business'
        }
      ],
      'org_jwks_endpoint': 'https://keystore.openbankingtest.org.uk/0015800001041RHAAY/0015800001041RHAAY.jwks',
      'org_jwks_revoked_endpoint': 'https://keystore.openbankingtest.org.uk/0015800001041RHAAY/revoked/0015800001041RHAAY.jwks',
      'software_jwks_endpoint': 'https://keystore.openbankingtest.org.uk/0015800001041RHAAY/5aRav7KBdrEqqs1e1fwNgk.jwks',
      'software_jwks_revoked_endpoint': 'https://keystore.openbankingtest.org.uk/0015800001041RHAAY/revoked/5aRav7KBdrEqqs1e1fwNgk.jwks',
      'software_policy_uri': 'https://www.o3bank.com',
      'software_tos_uri': 'https://www.o3bank.com',
      'software_on_behalf_of_org': null
    },
    signingKeyJwk:  {
      'kty': 'RSA',
      'kid': '3uejpDMbwmdur8uiF54OnrXKYULD8LlRzLTiSegZCTo',
      'use': 'sig',
      'e': 'AQAB',
      'n': 'mCHFXiDigMcdSC-VnF3_0IWmpQROSuLGDr0pu9xBVcicQ8EIu7lqFLxjnMJslhw4SVEXGDtCh5NRzBr5atqCqyDv3G4Myyz3kpwX9AN4dy2aBZbUmifzGVBM4XL4YRJAMaUFykDW4oBdo_zLowOJirvUlOygJXQZv6iXYwnyuDntjMUquRsko4xPHqgYrUV-acFqnVMWgkmr4VDkZwU_IETsWTbdMUfx_WJ3QDiBEjLbOMGWS2qCJw3Lf4Z60H4fJJgEVZKxd2yQXML4F3ob9_rR6U0ewUv7g6ofXqwminUNecOK15Zxs6tXe0z-2hThwL7YdWXPCbxghRviDxvLfQ',
      'd': 'HQVkNz6ittpFFb4uFjRAVrEIRzZ5EQQNsEYZrgKoXAr29F3gop8OQ4JkpkTYnhIoEqRreW3klSRfWEZVCjNA9hBEcZJ00lVzrP4l-6Cl3GZQmXxadkXktBGDeQaLp0jqAg5u-lRAKdk_A8d3uVM1a8fFF9vD-SEawFsS9guxx77J6FovmUoY0F8k29BJr-uyi4XgNbsR-S_BLk6gH6vUxztwQQ7TGHaYCGerdKCdKv5NU_5ihTt2XLJv2o5dvmUV6iHH0WA_X7T5Gsu8O-72sbNWT41CLtmtCUZa_WTkXWHdyvqgUDvbFIA53lH6Ejzvd80BFrfKxGeNaESCbAY96Q',
      'p': 'ybQWArY5FeknDoMQZs2Lod9IpGHTmZqe-vPljivOrpCdlttm9AhHY6TfAOz7N3psJIXKNEyEshqxdiAP9kHd4FjyZlnFSp6Gud7Qd2OjRRNWeInYVlIXx5gIM1nrP-W_yvfrjYfy66_FbhWquMbs_BFaZVlKjaHVrY-mhJR1mhc',
      'q': 'wRWUfyFG14NlWZxY4eh2MmUyDZ9Q-InEHZ3Zx4sdPwrBWZOeRaXLLvxVWfqyVixytikfdzeo12AtD9rE8ADefPqV-VO6Yk1nO_A7LIzJOuNKNdkYxBdSGeVBmBGyfYKhSplCsA4mlq0Mz1bk0KgqMlW8UUm16AAeW9BGQStZh4s',
      'dp': 'uZauze321pdBrZOgqsajnNyCzWWJugLQFx4E8OyT7oD3z0-vCgj4DtIrsoFaoPBOwsgrhjWFvw7ajFLx_OccDQoqd0xQQNleI3XFoKSYHL2vSZej68D7SlYz7XPmBlQSReIZ5Y7aUEvZv_HFtOCsOz6IS0p-U5U9s8XCNKkZEB8',
      'dq': 'P4INmdMkLfa1-0eFpKiFWAYY9IoWY-lMbEFjRFLph7bN6dy4Dkh-EDJHEJV42wc7o9ba1qekDVNA_xoB9L8Ubx8s_RkhEPxMnFZj4D9eYNQpsJR7pOPWyVWywYXwo3-39YV7fdTptF2u_POjx03Is02n50TLZEfFtIVI1l6f0Ak',
      'qi': 'Yu0t3R0cYxQF_deEhWwjQkduJ2ajgMikm9XrvejnfcgHtwznT6K09Adnp6JRTYHiDluXjkkMSrxuasev_tLLIA06HAAGo0ljsBp6GcHkz3i_tnJ8wwvBC_34FZ4i9bd6YwGn7t7SGQ6wytRYsma_ToRNbyb1DStJDuDu7E1xKQ0'
    }

  };
  return Jwt.sign(params);
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
