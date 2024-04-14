// jwtUtils.js

import { useEffect, useState } from 'react';


// Function to extract userid from JWT token
export const getUserIdFromToken = (token) => {
  if (!token) return null;
  try {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    return payload.id;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Function to extract userid from JWT token
export const getUsernameFromToken = (token) => {
  if (!token) return null;
  try {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    return payload.fullname;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};


// Function to extract userid from JWT token

export const getUserFromToken = () => {
  const [userfullname, setUsername] = useState(null);

  useEffect(() => {
    // Retrieve token from sessionStorage
    const token = sessionStorage.getItem('nuroapp');

    // Extract userid from token using utility function
    const userfullname = getUsernameFromToken(token);

    // Set the extracted userid to state
    setUsername(userfullname);
  }, []);

  return userfullname;
};


// Custom hook to get user ID from token
export const useUserIdFromToken = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Retrieve token from sessionStorage
    const token = sessionStorage.getItem('nuroapp');

    // Extract userid from token using utility function
    const userIdFromToken = getUserIdFromToken(token);

    // Set the extracted userid to state
    setUserId(userIdFromToken);
  }, []);

  return userId;
};


