'use strict'

import jwt from 'jsonwebtoken'
const secretKey = '@LlaveSuperSecretaDeIN6AM@'

export const generateJwt = async (payload, isAdmin = false) => {
  try {
    const token = jwt.sign(
      { ...payload, admin: isAdmin },
      secretKey,
      { expiresIn: '3h', algorithm: 'HS256' }
    );
    return token;
  } catch (err) {
    console.error(err);
    return err;
  }
};