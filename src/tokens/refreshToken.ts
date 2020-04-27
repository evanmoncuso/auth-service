import * as jwt from 'jsonwebtoken';

// one day
const REFRESH_TOKEN_LIFESPAN = "1 day"

export interface RefreshTokenPayload {
  id: string;
  username: string;
  permissions: string[];
}

export function createRefreshToken(payload: RefreshTokenPayload): string {
  const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || '';
  if (REFRESH_SECRET === '') {
    throw new Error('No refresh token secret provided');
  }

  const token = jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_LIFESPAN,
    issuer: 'evanmoncuso.com',
  });

  return token;
}
