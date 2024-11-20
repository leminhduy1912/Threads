// import React from 'react';
// import jwt from 'jsonwebtoken';

// // Function to generate JWT token
// export const generateToken = (userId) => {
//   console.log('userId', userId);

//   const token = jwt.sign({ userId }, process.env.REACT_APP_JWT_SECRET, {
//     expiresIn: '15d',
//   });
//   console.log('token', token);
//   return token;
// };

// // Function to set a JWT token in cookies (this logic should generally be server-side)
// export const setCookie = (token, res) => {
//   res.cookie('jwt', token, {
//     httpOnly: true, // more secure
//     maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
//     sameSite: 'strict', // CSRF protection
//   });
// };

import jwt from "jsonwebtoken";

// Function to generate token
export const generateTokenAndSetCookie = (userId, res) => {
  // Generate JWT token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d", // Token will expire in 15 days
  });

  // Set the token in cookies
  res.cookie("jwt", token, {
    httpOnly: true, // Cookie cannot be accessed via JavaScript
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    sameSite: "strict", // Prevent CSRF
  });
};