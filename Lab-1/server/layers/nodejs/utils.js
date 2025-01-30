import AWS from "aws-sdk";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

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
    body: JSON.stringify(data),
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
export const getAuth = async (hos, region) => {
  const credentials = await defaultProvider()();

  const signer = new SignatureV4({
    credentials,
    region,
    service: "execute-api",
    sha256: AWS.util.crypto.sha256,
  });

  return async (request) => {
    return signer.sign(request);
  };
};

export const getHeaders = (event) => {
  return event.headers;
};
