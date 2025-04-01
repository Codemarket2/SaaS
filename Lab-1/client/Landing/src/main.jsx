import React from "react";
import { createRoot } from "react-dom/client";
import { Amplify } from "aws-amplify";
// import { Auth } from "@aws-amplify/auth";
import { Authenticator } from "@aws-amplify/ui-react";
import { ToastContainer } from "react-toastify";

import "@aws-amplify/ui-react/styles.css";

import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./app/redux/store";
import "react-toastify/dist/ReactToastify.css";

// Amplify.configure({
//   Auth: {
//     region: "us-east-1", // Change to your AWS region
//     userPoolId: "us-east-1_KMm6Bcil3", // Replace with your User Pool ID
//     userPoolWebClientId: "42mt3mrc20dkqni8ttvmbeeadl", // Replace with your App Client ID
//   },
// });
Amplify.configure({
  aws_project_region: "us-east-1",
  aws_cognito_identity_pool_id:
    "us-east-1:86c5cdb9-2600-43dc-8198-925d7b23861c",
  aws_cognito_region: "us-east-1",
  aws_user_pools_id: "us-east-1_xdGs732Ao",
  aws_user_pools_web_client_id: "7p59obqg3h3dajf1nulsirat8s",
  oauth: {
    domain:
      "https://pooledtenant-serverlesssaas-lavpreetsandhu.auth.us-east-1.amazoncognito.com",
    scope: ["email", "openid", "profile"],
    redirectSignIn: "https://staging.d3kshq420k5bo3.amplifyapp.com/",
    redirectSignOut: "https://staging.d3kshq420k5bo3.amplifyapp.com/",
    responseType: "code",
  },
  federationTarget: "COGNITO_USER_POOLS",
  // aws_cognito_signup_attributes: [ "NAME"],
  aws_cognito_mfa_configuration: "OFF",
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [],
  },
  ssr: true,
  aws_cognito_verification_mechanisms: ["EMAIL"],
  // aws_user_files_s3_bucket: "boossti-bucket11510-dev",
  // aws_user_files_s3_bucket_region: "us-east-1",
});
// Auth.configure({
//   Auth: {
//     region: "us-east-1", // Change to your AWS region
//     userPoolId: "us-east-1_KMm6Bcil3", // Replace with your User Pool ID
//     userPoolWebClientId: "42mt3mrc20dkqni8ttvmbeeadl", // Replace with your App Client ID
//   },
// });

createRoot(document.getElementById("root")).render(
  // <Authenticator>
  //   {({ signOut, user }) => (
  <Provider store={store}>
    <App />
    <ToastContainer />
  </Provider>
  //   )}
  // </Authenticator>
);
