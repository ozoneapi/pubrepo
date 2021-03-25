const Jwt = require('../src/jwt.js');

async function go() {
  const params = {
    logLevel: 'debug',
    'header': {
      'alg': 'RS256'
    },
    body: {
      lorem: 'ipsum',
      sit: 'dolor',
      boo: true,
      in: 10
    },
    signingKeyPEM: '-----BEGIN PRIVATE KEY-----' +
      'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCtX4OCnzLk07BP' +
      'fNgP7PYVuGNbDF7gCRG/Fxe2t1VgDJ3o4IQyW3XV/MzZCzcfVGjUZ1wsk05iRIHe' +
      'EskUnO1dIHKuGPL6RIhs6tGXndQacMmfFjC4qEdJl9rULJxBSzhFJpp2UwK2noj7' +
      'Srn3PmV3/TlCpLbmHTHToYXzmhi215uBLkpEvrOoJUjQ6Hn+qGQhC92uu0UgHDin' +
      'TJXs3jlAwa0oWtnOGABbeE1WOZp0pHkQiSD5JbTpV8SozlqM5tr46U0QNmCU1JjK' +
      'UqTcZO06qAHoKVEUqbUjmJGLrgDAJMJIHhHYJPhDzeAETn5a+ikvgcpTvjhiunQN' +
      '5fSdHthVAgMBAAECggEAHW188Qr8pIKaBqP2OJ3MF1u44Zdz8ysW7AyLZeQwhaEe' +
      'nIyfY7zKf4vtaVnR/Wtib8srhhVq1Js0P/GIWAta7te3H330oC5JydMByG5tth82' +
      '2d32XyGRGBjCeAkqbJrL7lDjHvpwF3dJYP4KGsFoj7lXosw6j0ydTIK6LeMWFtKy' +
      'bmJEYYOT6Ano5D/+dlI9ioJM3H5FGXDkhbpSleUk9vfMyJE2JA6VkwOQ1b7NS8Os' +
      '6G82wxHTSVQN0aapuDLp8QsVzqQ3GWXx9CVl03BamfHb390bhpGVXiY/R5XWh4w9' +
      'OygeXwWkb0lPZmJ3drMAq/6BO7NiAEkc+OBhyePHcQKBgQDaLAhsnz52Kv0aTX4i' +
      'VCVQ5l7oDbWRO/oiobaDkyVsdgYx5cer2NcbIDtwzlLBP/y2NjVMC+eE7Wzzghin' +
      'vvvdmm7jEsDTRizQVXu7lNHW/Wd2ht4KLSUcmjYeaDBo6n41QtlNOwbZuj1L+WWL' +
      'PBkdJHarFIoxf+W3o/kp9d+GxwKBgQDLbv+xMJgkLt6zqiZAsQgYXe+HSPKE281x' +
      'pYJddf0JovKgiH1M82VPm67rOq1t55WcdtCspZyr/8x1hN5+FYVQT1uaRz1EdL3M' +
      'dWggN1Kx2S3/+MqCMa/0UeKlojjfa4qkDDvNvy1SENfEAmXqWUawMnYPRVtLYZvR' +
      'crsdFKmcAwKBgQCtIXpB8JDZpz2ZLNumlE3UiCvSTGbEbOsPpnK2sQNmsbYyzJyK' +
      'E5aHsSlaWHC1aHi7hAMBaQT9qIfoKVo1a8plTdMnIU+hmTOg0+VPs0ZeLFN5bIcx' +
      'XifwLbQ6pwWbjFJBI95bejbyeud/rdbWCggH51LAaplLtKnv9BCbKsGKKwKBgFHq' +
      '0n9xR/JaBUdnnpuyLcZSHR/m2fFx6Rp4QTSNTGVS/kxyabJQ2FzkHd2O9UMqW+5z' +
      'UbgTwDDqglRYOpee5t3d9s77HMqyD7ODG3jNjjkbcRCACFvA0k+ZoaB84FXnIh7I' +
      '5lQFRaSkL544MP3bEUHmL/AaR5blKS9/+aTOKzYtAoGBANjKuz3SlXPct4SKrFLK' +
      'p8C/U7KHalHlnnVQX8AQAxdInz+97A4RZtrfL/S9cs5G5rWdaLgpdYeD+iOb9t+/' +
      'ooQX1xP6CUdg8eNwz38xapVCSwiMtmzyPG65xMHVPUBH8aOKqMEib/HH1p6ELf+s' +
      'N/gL4zsnlWBn8AsqEzZmClSj' +
      '-----END PRIVATE KEY-----'

  };
  return Jwt.sign(params);
}

go()
  .then(out => console.log(out))
  .catch(err => console.log(err));
