import { Redirect } from 'expo-router';
import React from "react";

/**
 *
 */
export default function GigsCreateIndex() {
  // Redirect to the createGigList if someone tries to access /gigs/create directly
  return <Redirect href="/gigs/create/createGigList" />;
} 