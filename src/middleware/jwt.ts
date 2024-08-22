import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export interface Payload {
  _id?: string;
  email?: string;
  userId?: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const REFRESH_TOKEN_EXPIRATION = '7d'; // Set to 7 days or according to your policy
const ACCESS_TOKEN_EXPIRATION = '1hr'; // Set to 1 hour or according to your policy

const generateRefreshToken = (payload: Payload): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: REFRESH_TOKEN_EXPIRATION },
      (err, refreshToken) => {
        if (err) {
          reject(new Error(`Error generating refresh token: ${err.message}`));
        } else {
          resolve(refreshToken as string);
        }
      }
    );
  });
};

// @desc    Sign JWT token
// @file    < Middleware >
// @access  Private
const generateJwt = (data: Payload): Promise<Tokens> => {
  return new Promise((resolve, reject) => {
    try {
      const tokens: Tokens = { accessToken: '', refreshToken: '' };
      const payload: Payload = {};

      if (data._id) {
        payload.userId = data._id as string;
      } else if (data.email) {
        payload.email = data.email;
      }

      jwt.sign(
        payload,
        process.env.JWT_KEY_SECRET as string,
        { expiresIn: ACCESS_TOKEN_EXPIRATION },
        (err, accessToken) => {
          if (err) {
            reject(new Error(`Error generating access token: ${err.message}`));
          } else {
            tokens.accessToken = accessToken as string;

            generateRefreshToken(payload)
              .then((refreshToken) => {
                tokens.refreshToken = refreshToken;
                resolve(tokens);
              })
              .catch((err) => {
                reject(new Error(`Error generating refresh token: ${err.message}`));
              });
          }
        }
      );
    } catch (error) {
      console.error('Error generating JWT:', error);
      reject(new Error('Error generating JWT'));
    }
  });
};

export default generateJwt;
