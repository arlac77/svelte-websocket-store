const jsonwebtoken = require("jsonwebtoken");

const key = `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDC9fWtOqHewb33WpGNqCkX1mrrZffKeeyz+z+9CMPqewT41Dd4
1tzH2zt0e9j/KQVwPVIvngGp7MDQPzgc7C1CAH143CXXBzQfiD9ZgET6dShGtfSw
y3uBlBl/Mf0XV0nFEfqboRGZOQ3s6bxNuNqjU4xIJ/ghwvSTac28PivXIQIDAQAB
AoGARR0ur++GLNLgBk1MJjzD/JhdpP+r/VKF0DQ0n035LinYVGHfHG6HLC6TADNb
dPFU5TpH5WuNSXEN1YVj3hT34bym7FQ+kHSDGC5853BvxROpFDE7Pp0ZcohW5rw8
sqJ1Ly3/XKwhUaaKv9xb5nlfjihtDxiES2582h1zrHr7dBUCQQDfcV/gX6fb1EYS
SCScGNkU1guZSqWoNjWsm7L3XzFrv23Rmi2x4St+69Oj+kKb6Y7JqOmeRPlnKQyp
0STxMbGjAkEA314tShBgkN+mI8lTOOpuOksokFte9D3iiKL/FxwCgx38YJnJNW8m
bQe57PAgO6xAOnkkaEaGFkNh4K6LqFiIawJAVX93VU6k10v5aANs5sHnRr7Ef2p9
ysi7bwnAyEEHkxgTuHFLbNYhI5avS/51wFz1Qxq8EdCIsj2V1+DsRtJiCwJBAM7e
UeN+N3D1MNGD62eS9nNWmELZ3J8nkV4qV0X30vvMEakFxKuQPW5M8YzW94NMjE+b
UnSgnB6SWVvVS9Kl6/ECQQC+L8MLDYDjeZPBwiDh4Feql71fXLdSrNk1NpVAXSKP
yzvVowoeX6iTae+vbRLmXA6oLyiZ//j20Un2GWdWS+GW
-----END RSA PRIVATE KEY-----`;

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const content = JSON.parse(event.body);

  if (content.username.startsWith("user") && content.password === "secret") {
  
    const scope = ["a", "b", "c"].join(",");
    const access_token = jsonwebtoken.sign(
      { entitlements: scope },
      key,
      {
        algorithm: "RS256",
        expiresIn: "10s"
      }
    );
    const refresh_token = jsonwebtoken.sign(
      { },
      key,
      {
        algorithm: "RS256",
        expiresIn: "5s"
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        token_type: "bearer",
        scope,
        access_token,
        refresh_token
      })
    };
  }
  return { statusCode: 401, body: "Unauthorized" };
};
