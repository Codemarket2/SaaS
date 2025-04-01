import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";

export const getToken = async () => {
  var cognitoTokens = (await fetchAuthSession())?.tokens;
  let rawToken = cognitoTokens?.accessToken?.toString();
  return rawToken;
};

export const getUSerAttributes = async () => {
  const attributes = await fetchUserAttributes();
  return attributes;
};
