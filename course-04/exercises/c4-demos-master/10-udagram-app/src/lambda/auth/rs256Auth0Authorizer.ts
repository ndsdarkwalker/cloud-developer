
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJWNebaeD3RK0TMA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFnZsYWRob2FuZy51cy5hdXRoMC5jb20wHhcNMjMwNDIxMTU1ODU4WhcNMzYx
MjI4MTU1ODU4WjAhMR8wHQYDVQQDExZ2bGFkaG9hbmcudXMuYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuYM5vkhKCjyG1NIXhZDvGtfc
IjkJYiTBEYaLORCNtjdrc2SumfLkWPeTClXZSESS7xmw66bK50HJHQO74ZdkHuPW
h6J1ist7KtMGWHDeJF0Oi0T8wFYuzJVMB8uXvc0r/CmVM+5jepC8u/3WSMvWaszk
zFSd+RxixP7nJbUO5ZxYC0ZpSwOXqX66enDJdaGlMWOn+XytXk63YGkZH4oY6ZfQ
onIZirnZ+slZSb0mF11TOpGsXNEhDKXHUQKc7XPsa3gEzYZ61I1cwc1qVc0LH5gN
pZSQFLvKUIk6Qv11ZXiIIkDgPquOcKhOatuJpwwYElCa45MpJGcfQ55abqGY8QID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQijqthfDWMJ8oh109k
BhvYNTPzEDAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAEA+KQbl
CBYu9rgPft8GgtXjb5bGYUA0sTpdyd85/SV7BQoNkcxmZAqpz0FFF5jSdGbDCHHw
mvUmlsLL3FlNg8Yh6oMobFSfpxmSOGCyMuULfzSmr3GpcagCllVA+FiuTOQ3WDOO
9h4WJJkwLS61WnOvMcv0Q4h7zRXSb8NWyx2gyysO1nd1ezEMdbBONSkbWW+SJxvD
BXcdFt3cUfUlAAdVeMxIhPJNhIoNAG69RSYWvVr/sZ5fl/4wFGyZzy2xrgXwJ5Dx
zB8MeXLie9OpiJvmfUQx2RMTai4Sflwa+wkAvZILMYxnCDYX2zETe2Vnc/OOeOTA
nQb5jiRq4L9lm6I=
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtToken {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}
