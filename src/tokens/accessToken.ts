import * as jwt from 'jsonwebtoken';

// 10 minutes
const ACCESS_TOKEN_LIFESPAN = "10m"

export interface AccessTokenPayload {
  id: string;
  username: string;
  permissions: string[]
}
/**
 * Create a new access token based on a payload
 * @param payload - information to be stored on the access token
 */
export function createAccessToken(payload: AccessTokenPayload) {
  const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || '';
  if (ACCESS_SECRET === '') {
    throw new Error('No access token secret provided');
  }

  const token = jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_LIFESPAN,
    issuer: 'evanmoncuso.com'
  });

  return token;
}
