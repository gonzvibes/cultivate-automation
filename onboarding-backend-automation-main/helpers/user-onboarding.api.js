const axios = require("axios");
const { faker } = require("@faker-js/faker");

// const ONBOARDING_TYPES = ["INDIVIDUAL", "JOINT", "COMPANY", "IRA", "TRUST"];
const ONBOARDING_TYPES = ["INDIVIDUAL", "INDIVIDUAL", "INDIVIDUAL", "INDIVIDUAL", "INDIVIDUAL"];
const CROWDFUNDING_TYPES = ["REG_A"]; // Add more if needed

const { generateRandomRequestBody } = require("../utils/random-useronboarding");
const { generateBurnerMail, generateMultipleBurnerMails } = require('../helpers/burnermail.api');

class RateLimiter {
  constructor(tokensPerSecond) {
    this.tokensPerSecond = tokensPerSecond;
    this.tokenBucket = tokensPerSecond;
    this.lastRefilled = Date.now();
  }

  async waitForToken() {
    this.refillTokens();
    if (this.tokenBucket < 1) {
      const waitTime = (1 - this.tokenBucket) * (1000 / this.tokensPerSecond);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.refillTokens();
    }
    this.tokenBucket -= 1;
  }

  refillTokens() {
    const now = Date.now();
    const timePassed = now - this.lastRefilled;
    this.tokenBucket = Math.min(
      this.tokensPerSecond,
      this.tokenBucket + (timePassed / 1000) * this.tokensPerSecond
    );
    this.lastRefilled = now;
  }
}

// Adjust this value based on the API's rate limit
const rateLimiter = new RateLimiter(5); // 5 requests per second

async function makeRateLimitedRequest(config) {
  await rateLimiter.waitForToken();
  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.warn("Rate limit exceeded. Retrying after a delay...");
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
      return makeRateLimitedRequest(config); // Retry the request
    }
    throw error;
  }
}

async function testUserOnboardingAPI(numTests = 5) {
  const baseUrl = "http://52.90.61.55:3000/api/v1/user-onboarding/onboard/";
  const createdOnboardingIds = [];

  const emails = await generateMultipleBurnerMails(numTests);

  for (let i = 0; i < numTests; i++) {
    const email = emails[i].toLowerCase();
    const onboardingType = ONBOARDING_TYPES[i % ONBOARDING_TYPES.length];
    const crowdfundingType = faker.helpers.arrayElement(CROWDFUNDING_TYPES);

    const requestBody = {
      onboardingType: onboardingType,
      crowdfundingType: crowdfundingType,
    };

    if (faker.datatype.boolean() === true) {
      requestBody.appliedOnboardingGroupLink = "ncprod-TEST1";
    }

    try {
      const response = await makeRateLimitedRequest({
        method: "post",
        url: `${baseUrl}${encodeURIComponent(email)}`,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        data: requestBody,
      });

      console.log(`Test ${i + 1}:`);
      console.log(`Email: ${email}`);
      console.log(`Onboarding Type: ${onboardingType}`);
      console.log(`Response Status: ${response.status}`);
      console.log(`Response Data:`, response.data);
      console.log("---");

      if (response.data && response.data.onboardingId) {
        createdOnboardingIds.push({
          onboardingId: response.data.onboardingId,
          email,
        });
      }
    } catch (error) {
      console.error(`Error in test ${i + 1}:`);
      console.error(`Email: ${email}`);
      console.error(`Onboarding Type: ${onboardingType}`);
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      console.log("---");
    }
  }

  return createdOnboardingIds;
}

async function testUpdateOnboardingProgressAPI(onboardingIds) {
  const baseUrl = "http://52.90.61.55:3000/api/v1/user-onboarding/onboard-progress/";

  for (let i = 0; i < onboardingIds.length; i++) {
    const onboardingId = onboardingIds[i].onboardingId;
    const requestBody = generateRandomRequestBody();

    // TODO: Make smallcase the first name
    requestBody.basicInfo.firstName = onboardingIds[i].email.split('.')[0].toLowerCase();


    try {
      const response = await makeRateLimitedRequest({
        method: "patch",
        url: `${baseUrl}${onboardingId}`,
        headers: {
          accept: "application/json",
          "x-custom-lang": "en",
          "Content-Type": "application/json",
        },
        data: requestBody,
      });

      console.log(`Test ${i + 1}:`);
      console.log(`Onboarding ID: ${onboardingId}`);
      console.log(`Response Status: ${response.status}`);
      console.log(`Response Data:`, response.data);
      console.log("---");
    } catch (error) {
      console.error(`Error in test ${i + 1}:`);
      console.error(`Onboarding ID: ${onboardingId}`);
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      console.log("---");
    }
  }
}

async function getOnboardingProgress(onboardingIds) {
  const baseUrl = "http://52.90.61.55:3000/api/v1/user-onboarding/onboard-progress/";
  const results = [];

  for (const onboardingId of onboardingIds) {
    try {
      const response = await makeRateLimitedRequest({
        method: "get",
        url: `${baseUrl}${onboardingId}`,
        headers: {
          accept: "application/json",
        },
      });

      console.log(`Onboarding ID: ${onboardingId}`);
      console.log(`Response Status: ${response.status}`);
      console.log("---");

      const accessToken = response.data && response.data.accessToken;
      const onboardingType = response.data && response.data.userOnboarding.onboardingType;
      results.push({ onboardingId, accessToken, onboardingType });
    } catch (error) {
      console.error(`Error for Onboarding ID: ${onboardingId}`);
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      console.log("---");

      results.push({ onboardingId, accessToken: null });
    }
  }

  return results;
}

async function parallelFinalizeUserCreation(onboardingIds) {
  const baseUrl = "http://52.90.61.55:3000/api/v1/user/finalize-user-creation";

  const requests = onboardingIds.map((onboardingId) => 
    makeRateLimitedRequest({
      method: "post",
      url: `${baseUrl}/${onboardingId}`,
      headers: {
        accept: "application/json",
      },
      data: "",
    })
  );

  try {
    const results = await Promise.all(requests);
    return results.map((result, index) => ({
      onboardingId: onboardingIds[index],
      success: true,
      data: result.data,
      status: result.status,
    }));
  } catch (error) {
    console.error("Error in parallel user creation finalization:", error);

    return onboardingIds.map((onboardingId) => {
      const failedRequest = error.response && error.response.config.url.endsWith(onboardingId);
      return {
        onboardingId,
        success: !failedRequest,
        error: failedRequest ? (error.response ? error.response.data : error.message) : undefined,
        status: failedRequest ? (error.response ? error.response.status : undefined) : undefined,
      };
    });
  }
}

async function parallelSaveSubscriptionAgreementDate(accessTokens) {
  const url = 'http://52.90.61.55:3000/api/v1/user-onboarding/save-investor-signed-subscription-agreement-date';
  
  const requests = accessTokens.map(token => 
    makeRateLimitedRequest({
      method: 'post',
      url: url,
      headers: {
        'accept': 'application/json',
        'x-custom-lang': 'en',
        'Authorization': `Bearer ${token}`
      },
      data: ''
    })
  );

  try {
    const results = await Promise.all(requests);
    return results.map((result, index) => ({
      accessToken: accessTokens[index],
      success: true,
      data: result.data,
      status: result.status
    }));
  } catch (error) {
    console.error('Error in parallel save subscription agreement date:', error);
    
    return accessTokens.map(token => {
      const failedRequest = error.response && error.response.config.headers['Authorization'] === `Bearer ${token}`;
      return {
        accessToken: token,
        success: !failedRequest,
        error: failedRequest ? (error.response ? error.response.data : error.message) : undefined,
        status: failedRequest ? (error.response ? error.response.status : undefined) : undefined
      };
    });
  }
}

module.exports = {
  testUserOnboardingAPI,
  testUpdateOnboardingProgressAPI,
  getOnboardingProgress,
  parallelFinalizeUserCreation,
  parallelSaveSubscriptionAgreementDate,
};