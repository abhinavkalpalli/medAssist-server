import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Admins,{Admin} from '../models/adminModel'
import dotenv from 'dotenv'
import { Patient } from "../models/patientModel";
import { Doctor } from "../models/doctorModel";
dotenv.config();
interface DecodedToken {
  userId?: string;
  email?: string;
}


declare global {
  namespace Express {
    interface Request {
      user?: Patient | Doctor | Admin;
    }
  }
}


// @desc    To get user from decoded token
// @route   < Middleware - Helper >
// @access  Private
const verifyUser = (decodedToken: DecodedToken): Promise<Admin | null> => {
  return new Promise((resolve, reject) => {
    Admins.findOne({ _id: decodedToken?.userId })
      .select("-password")
      .then((user) => {
        resolve(user);
      })
      .catch((err) => reject(err));
  });
};

// @desc    To renew the access token
// @route   < Middleware - Helper >
// @access  Private
const renewAccessToken = (userId: string): Promise<string> => {
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

// @desc    User authentication
// @route   < Middleware >
// @access  Private
const protectadmin = async (req: Request, res: Response, next: NextFunction) => {
  // WHEN WE HAVE AN ACCESS TOKEN
  if (req.headers.authorization) {
    try {
      const accessToken = req.headers.authorization;
      const decoded = jwt.verify(accessToken, process.env.JWT_KEY_SECRET as string) as DecodedToken;
      verifyUser(decoded)
        .then((user) => {
          if (user) {
            req.user = user;
           next();
          } else {
            // User not found
            res.status(404).json({
              message: "User not found",
              status: 404,
              error_code: "NOT_FOUND",
            });
          }
        })
        .catch((error) => {
          
          res.status(500).json({
            message: "Internal Server Error",
            status: 500,
            error_code: "INTERNAL_SERVER_ERROR",
            error,
          });
        });
    } catch (e) {
      console.log(e);
      // Token verification failed
      res.status(401).json({
        message: "User not authorized",
        status: 401,
        error_code: "AUTHENTICATION_FAILED",
      });
    }
  // WHEN WE HAVE NO ACCESS BUT REFRESH TOKEN
  } else {
    // No token provided
    res.status(401).json({
      status: 401,
      message: "No token provided",
      error_code: "NO_TOKEN",
      noRefresh: true,
    });
  }
};

export default protectadmin;

// @desc    To refresh access token
// @route   < POST /refresh-token >
// @access  Public
export const refreshAccessTokenadmin = (req: Request, res: Response) => {
  try {
    if (req.headers.authorization) {
      const refreshToken = req.headers.authorization;

      const decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as DecodedToken; // decoding the refresh token

      verifyUser(decodedRefreshToken)
        .then(async (user) => {
          if (user) {
            const newAccessToken = await renewAccessToken(
              decodedRefreshToken?.userId as string
            );
            res.status(200).send({ newToken: newAccessToken });
          } else {
            // User not found or is blocked
            res.status(401).json({
              message: "User not authorized",
              status: 401,
              error_code: "AUTHENTICATION_FAILED",
            });
          }
        })
        .catch((error) => {
          res.status(401).json({
            message: "User not authorized",
            status: 401,
            error_code: "AUTHENTICATION_FAILED",
            error,
          });
        });
    } else {
      // No token provided
      res.status(401).json({
        status: 401,
        message: "No token provided",
        error_code: "NO_TOKEN",
      });
    }
  } catch (error) {
    res.status(401).json({
      message: "User not authorized",
      status: 401,
      error_code: "AUTHENTICATION_FAILED",
      error,
    });
  }
};
