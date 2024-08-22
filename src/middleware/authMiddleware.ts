import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Patients, { Patient } from "../models/patientModel";
import dotenv from 'dotenv';
import { Doctor } from "../models/doctorModel";
import { Admin } from "../models/adminModel";

dotenv.config();

interface DecodedToken {
  userId?: string;
  email?: string;
}

type User = Doctor | Admin | Patient;

declare global {
  namespace Express {
    interface Request {
      user?: Patient;
    }
  }
}

const verifyUser = (decodedToken: DecodedToken): Promise<Patient | null> => {
  console.log('Entering verifyUser:', decodedToken);
  return new Promise((resolve, reject) => {
    Patients.findOne({ _id: decodedToken?.userId })
      .select("-password")
      .then((user) => {
        console.log('User found:', user);
        resolve(user);
      })
      .catch((err) => reject(err));
  });
};

const renewAccessToken = (userId: string): Promise<string> => {
  console.log('Entering renewAccessToken');
  return new Promise((resolve, reject) => {
    jwt.sign(
      { userId: userId },
      process.env.JWT_KEY_SECRET as string,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token as string);
        }
      }
    );
  });
};

const protect = async (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    try {
      const accessToken = req.headers.authorization;
      const decoded = jwt.verify(accessToken, process.env.JWT_KEY_SECRET as string) as DecodedToken;
      console.log('Decoded token:', decoded);

      verifyUser(decoded)
        .then((user) => {
          if (user) {
            if (!user.is_Blocked) {
              req.user = user;
              next();
            } else {
              res.status(403).json({
                message: "User has been blocked",
                status: 403,
                error_code: "FORBIDDEN",
              });
            }
          } else {
            res.status(404).json({
              message: "User not found",
              status: 404,
              error_code: "NOT_FOUND",
            });
          }
        })
        .catch((error) => {
          console.log('Database error:', error);
          res.status(500).json({
            message: "Internal Server Error",
            status: 500,
            error_code: "INTERNAL_SERVER_ERROR",
            error,
          });
        });
    } catch (e) {
      console.log('Token verification error:', e);
      res.status(401).json({
        message: "User not authorized",
        status: 401,
        error_code: "AUTHENTICATION_FAILED",
      });
    }
  } else {
    res.status(401).json({
      status: 401,
      message: "No token provided",
      error_code: "NO_TOKEN",
      noRefresh: true,
    });
  }
};

export default protect;

export const refreshAccessToken = (req: Request, res: Response) => {
  console.log('Entering refreshAccessToken', req.headers.authorization);

  if (req.headers.authorization) {
    const refreshToken = req.headers.authorization;

    try {
      const decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as DecodedToken;

      console.log('Decoded refresh token:', decodedRefreshToken);

      verifyUser(decodedRefreshToken)
        .then(async (user) => {
          if (user && !user?.is_Blocked) {
            const newAccessToken = await renewAccessToken(
              decodedRefreshToken?.userId as string
            );
            res.status(200).send({ newToken: newAccessToken });
          } else {
            res.status(401).json({
              message: "User not authorized",
              status: 401,
              error_code: "AUTHENTICATION_FAILED",
            });
          }
        })
        .catch((error) => {
          console.error('Error finding user:', error);
          res.status(401).json({
            message: "User not authorized",
            status: 401,
            error_code: "AUTHENTICATION_FAILED",
            error,
          });
        });

    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        console.error('Refresh token expired:', error.expiredAt);
        res.status(401).json({
          message: "Refresh token expired",
          status: 401,
          error_code: "TOKEN_EXPIRED",
          expiredAt: error.expiredAt,
        });
      } else if (error instanceof jwt.JsonWebTokenError) {
        console.error('Invalid token:', error.message);
        res.status(401).json({
          message: "Invalid token",
          status: 401,
          error_code: "INVALID_TOKEN",
          error: error.message,
        });
      } else {
        console.error('Error decoding refresh token:', error);
        res.status(401).json({
          message: "Invalid or expired refresh token",
          status: 401,
          error_code: "INVALID_TOKEN",
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  } else {
    res.status(401).json({
      status: 401,
      message: "No token provided",
      error_code: "NO_TOKEN",
    });
  }
};
