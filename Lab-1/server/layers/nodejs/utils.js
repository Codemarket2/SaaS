import AWS from "aws-sdk";
import crypto from "crypto";

import { SignatureV4 } from "@aws-sdk/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";
import { defaultProvider } from "@aws-sdk/credential-provider-node";

// Helper function to create HMAC
const sign = (key, msg) =>
  crypto.createHmac("sha256", key).update(msg).digest();

// Helper function to create Hex signature
const signature = (key, msg) =>
  crypto.createHmac("sha256", key).update(msg).digest("hex");

// import { defaultProvider } from "@aws-sdk/credential-provider-node";
// import { SignatureV4 } from "@aws-sdk/signature-v4";
// import { HttpRequest } from "@aws-sdk/protocol-http";
// import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const ServiceIdentifier = Object.freeze({
  SHARED_SERVICES: "SharedServices",
  BUSINESS_SERVICES: "BusinessServices",
});
const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Headers":
    "Content-Type, Origin, X-Requested-With, Accept, Authorization, Access-Control-Allow-Methods, Access-Control-Allow-Headers, Access-Control-Allow-Origin",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
};
export const generateResponse = (data, statusCode = 200) => {
  return {
    statusCode,
    body: typeof data == "string" ? data : JSON.stringify(data),
    headers: corsHeaders,
  };
};

export const createSuccessResponse = (message) => {
  return generateResponse({ success: true, message }, 200);
};

export const createErrorResponse = (message, statusCode = 400) => {
  return generateResponse({ success: false, error: message }, statusCode);
};

export const encodeToJsonObject = (inputObject) => {
  return JSON.stringify(inputObject, (_, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
};

// Function to get AWS authorization headers
export const getAuth = async (url, region) => {
  const signer = new SignatureV4({
    credentials: defaultProvider(),
    service: "execute-api",
    region: region,
    sha256: Sha256,
  });

  const request = {
    method: "POST", // Use POST if you're making a POST request
    protocol: "https",
    hostname: new URL(url).hostname,
    path: new URL(url).pathname,
    headers: {
      host: new URL(url).hostname,
    },
  };

  const signedRequest = await signer.sign(request);

  // Return headers with Authorization
  return {
    Authorization: signedRequest.headers["authorization"],
    host: signedRequest.headers["host"],
    "X-Amz-Date": signedRequest.headers["X-Amz-Date"],
  };
  // const credentials = await new AWS.CredentialProviderChain().resolvePromise();
  // return async (request) => {
  //   const method = request.method || "GET";
  //   const service = "execute-api";
  //   const canonicalUri = request.path || "/";
  //   const canonicalQueryString = "";
  //   const contentType = request.headers["Content-Type"] || "application/json";
  //   const currentDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, "");
  //   const dateStamp = currentDate.substring(0, 8);
  //   // Step 1: Create canonical headers and signed headers
  //   const canonicalHeaders = `content-type:${contentType}\nhost:${host}\nx-amz-date:${currentDate}\n`;
  //   const signedHeaders = "content-type;host;x-amz-date";
  //   // Step 2: Create payload hash
  //   const payloadHash = crypto
  //     .createHash("sha256")
  //     .update(request.body || "")
  //     .digest("hex");
  //   // Step 3: Create canonical request
  //   const canonicalRequest = [
  //     method,
  //     canonicalUri,
  //     canonicalQueryString,
  //     canonicalHeaders,
  //     signedHeaders,
  //     payloadHash,
  //   ].join("\n");
  //   // Step 4: Create string to sign
  //   const algorithm = "AWS4-HMAC-SHA256";
  //   const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  //   const stringToSign = [
  //     algorithm,
  //     currentDate,
  //     credentialScope,
  //     crypto.createHash("sha256").update(canonicalRequest).digest("hex"),
  //   ].join("\n");
  //   // Step 5: Calculate the signature
  //   const kDate = sign(`AWS4${credentials.secretAccessKey}`, dateStamp);
  //   const kRegion = sign(kDate, region);
  //   const kService = sign(kRegion, service);
  //   const kSigning = sign(kService, "aws4_request");
  //   const finalSignature = signature(kSigning, stringToSign);
  //   // Step 6: Create authorization header
  //   const authorizationHeader = `${algorithm} Credential=${credentials.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${finalSignature}`;
  //   return authorizationHeader;
  // Return signed request
  // return {
  //   ...request,
  //   headers: {
  //     ...request.headers,
  //     "x-amz-date": currentDate,
  //     Authorization: authorizationHeader,
  //     "Content-Type": contentType,
  //     Host: host,
  //   },
  // };
  // };
};

export const getHeaders = (event) => {
  return event.headers;
};
