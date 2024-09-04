const axios = require("axios");
const { faker } = require("@faker-js/faker");

const {
  generateRandomIndividualNCData,
  generateRandomOnboardEntity,
} = require("../utils/random-useronboarding");

async function onboardIndividualsToNorthCapital(onboardingIds, accessTokens) {
  const baseUrl =
    "http://52.90.61.55:3000/api/v1/north-capital/onboard-individual";
  const results = [];

  for (let i = 0; i < onboardingIds.length; i++) {
    const onboardingId = onboardingIds[i];
    const accessToken = accessTokens[i];

    // Check if the onboarding type is individual (this check should be done before calling this function)
    if (!accessToken) {
      console.error(
        `Error for onboarding ID ${onboardingId}: No access token provided`
      );
      results.push({
        onboardingId,
        success: false,
        error: "No access token provided",
      });
      continue;
    }

    const requestBody = generateRandomIndividualNCData();
    requestBody.accountData.notes = onboardingId;
    requestBody.linkData.notes = onboardingId;
    requestBody.partyData.notes = onboardingId;

    try {
      const response = await axios({
        method: "post",
        url: baseUrl,
        headers: {
          accept: "application/json",
          "x-custom-lang": "en",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        data: requestBody,
      });

      console.log(`Onboarding successful for ID ${onboardingId}`);
      console.log(`Response Status: ${response.status}`);
      results.push({ onboardingId, success: true, data: response.data });
    } catch (error) {
      console.error(`Error in onboarding for ID ${onboardingId}:`);
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      results.push({
        onboardingId,
        success: false,
        error: error.response ? error.response.data : error.message,
      });
    }
  }

  return results;
}

async function onboardEntitiesToNorthCapital(onboardingIds, accessTokens) {
  const baseUrl =
    "http://52.90.61.55:3000/api/v1/north-capital/onboard-entity";
  const results = [];

  for (let i = 0; i < onboardingIds.length; i++) {
    const onboardingId = onboardingIds[i];
    const accessToken = accessTokens[i];

    // Check if the onboarding type is individual (this check should be done before calling this function)
    if (!accessToken) {
      console.error(
        `Error for onboarding ID ${onboardingId}: No access token provided`
      );
      results.push({
        onboardingId,
        success: false,
        error: "No access token provided",
      });
      continue;
    }

    const requestBody = generateRandomOnboardEntity();
    requestBody.accountData.notes = onboardingId;
    requestBody.partyData.notes = onboardingId;
    requestBody.linkData.notes = onboardingId;
    requestBody.entityData.notes = onboardingId;

    try {
      const response = await axios({
        method: "post",
        url: baseUrl,
        headers: {
          accept: "application/json",
          "x-custom-lang": "en",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        data: requestBody,
      });

      console.log(`Onboarding successful for ID ${onboardingId}`);
      console.log(`Response Status: ${response.status}`);
      results.push({ onboardingId, success: true, data: response.data });
    } catch (error) {
      console.error(`Error in onboarding for ID ${onboardingId}:`);
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      results.push({
        onboardingId,
        success: false,
        error: error.response ? error.response.data : error.message,
      });
    }
  }

  return results;
}

async function onboardJointAccountsToNorthCapital(onboardingIds, accessTokens) {
  const baseUrl =
    "http://52.90.61.55:3000/api/v1/north-capital/onboard-joint";
  const results = [];

  for (let i = 0; i < onboardingIds.length; i++) {
    const onboardingId = onboardingIds[i];
    const accessToken = accessTokens[i];

    // Check if the onboarding type is individual (this check should be done before calling this function)
    if (!accessToken) {
      console.error(
        `Error for onboarding ID ${onboardingId}: No access token provided`
      );
      results.push({
        onboardingId,
        success: false,
        error: "No access token provided",
      });
      continue;
    }

    const primaryBody = generateRandomIndividualNCData()
    primaryBody.accountData.notes = onboardingId;
    primaryBody.linkData.notes = onboardingId;
    primaryBody.partyData.notes = onboardingId;

    // TODO: Add handling for setting account type based on onboarding type
    primaryBody.accountData.type = "JTWROS";

    const secondaryBody = generateRandomIndividualNCData()
    secondaryBody.accountData.notes = `${onboardingId}-secondary`;
    secondaryBody.linkData.notes = `${onboardingId}-secondary`;
    secondaryBody.partyData.notes = `${onboardingId}-secondary`;

    const requestBody = {
      primary: primaryBody,
      secondary: secondaryBody,
    };

    requestBody.primary.linkData.primary_value = "0";

    try {
      const response = await axios({
        method: "post",
        url: baseUrl,
        headers: {
          accept: "application/json",
          "x-custom-lang": "en",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        data: requestBody,
      });

      console.log(`Onboarding successful for ID ${onboardingId}`);
      console.log(`Response Status: ${response.status}`);
      results.push({ onboardingId, success: true, data: response.data });
    } catch (error) {
      console.error(`Error in onboarding for ID ${onboardingId}:`);
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      results.push({
        onboardingId,
        success: false,
        error: error.response ? error.response.data : error.message,
      });
    }
  }

  return results;
}

async function createInvestmentTrades(accessTokens) {
  const baseUrl =
    "http://52.90.61.55:3000/api/v1/north-capital/create-investment-trade";
  const results = [];

  for (let i = 0; i < accessTokens.length; i++) {
    // Generate a random transaction amount between 100 and 200 with up to 2 decimal places
    const transactionUnits = Math.floor(Math.random() * (200 - 100 + 1) + 100);

    const requestBody = {
      // offeringId: offeringId,
      offeringId: "1625407",
      // accountId: accountId,
      accountId: null,
      transactionType: "WIRE",
      transactionUnits: transactionUnits,
      createdIpAddress: "10.0.0.9",
    };

    try {
      const response = await axios({
        method: "post",
        url: baseUrl,
        headers: {
          accept: "application/json",
          "x-custom-lang": "en",
          "user-agent":
            "Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion",
          "x-timestamp": Date.now().toString(),
          Authorization: `Bearer ${accessTokens[i]}`,
          "Content-Type": "application/json",
        },
        data: requestBody,
      });

      // console.log(`Investment Trade Creation Successful`);
      // console.log(`Response Status: ${response.status}`);
      // console.log(`Transaction Units: ${transactionUnits}`);
      results.push({
        success: true,
        data: response.data,
        tradeId: response.data.purchaseDetails[1][0].tradeId,
        transactionUnits: transactionUnits,
      });
    } catch (error) {
      console.error(`Error in creating investment trade:`);
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      // results.push({
      //   success: false,
      //   error: error.response ? error.response.data : error.message,
      //   transactionUnits: transactionUnits,
      // });
    }
  }

  return results;
}

module.exports = {
  onboardIndividualsToNorthCapital,
  onboardEntitiesToNorthCapital,
  onboardJointAccountsToNorthCapital,
  createInvestmentTrades,
};
