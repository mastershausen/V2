import { Redirect } from 'expo-router';
import React from "react";

/**
 *
 */
export default function NuggetsCreateIndex() {
  // Redirect to the createNugget if someone tries to access /nuggets/create directly
  return <Redirect href="/nuggets/create/createNugget" />;
} 