import { Redirect } from 'expo-router';
import React from "react";

/**
 *
 */
export default function CaseStudiesCreateIndex() {
  // Redirect to the createCasestudyList if someone tries to access /casestudies/create directly
  return <Redirect href="/casestudies/create/createCasestudyList" />;
} 