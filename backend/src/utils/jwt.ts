import jwt, { SignOptions } from "jsonwebtoken";

// In a real production app, you should use separate secrets for access and refresh tokens.
const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'your-default-secret';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'your-default-refresh-secret';

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("JWT secrets are not set in environment variables");
}

/**
 * Signs a payload to create a new JWT.
 * @param payload The data to include in the token.
 * @param secret The secret key to sign with.
 * @param options JWT options, like expiresIn.
 * @returns The signed JWT string.
 */
const signToken = (payload: object, secret: string, options: SignOptions): string => {
  return jwt.sign(payload, secret, options);
};

/**
 * Creates a short-lived access token.
 * @param payload The data to include in the token.
 * @returns The signed access token.
 */
export const signAccessToken = (payload: object): string => {
  return signToken(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

/**
 * Creates a long-lived refresh token.
 * @param payload The data to include in the token.
 * @returns The signed refresh token.
 */
export const signRefreshToken = (payload: object): string => {
  return signToken(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

/**
 * Verifies an access token.
 * @param token The access token to verify.
 * @returns The decoded payload.
 */
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

/**
 * Verifies a refresh token.
 * @param token The refresh token to verify.
 * @returns The decoded payload.
 */
export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};