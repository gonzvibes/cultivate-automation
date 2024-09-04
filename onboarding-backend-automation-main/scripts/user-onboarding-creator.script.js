const axios = require("axios");
const { faker } = require("@faker-js/faker");

const ONBOARDING_TYPES = ["INDIVIDUAL", "JOINT", "COMPANY", "IRA", "TRUST"];

const {
  testUserOnboardingAPI,
  testUpdateOnboardingProgressAPI,
  getOnboardingProgress,
  parallelFinalizeUserCreation,
  parallelSaveSubscriptionAgreementDate,
} = require("../helpers/user-onboarding.api");

const {
  onboardIndividualsToNorthCapital,
  onboardEntitiesToNorthCapital,
  onboardJointAccountsToNorthCapital,
  createInvestmentTrades,
} = require("../helpers/northcapital.api");

const { updateDocuments } = require("../helpers/investment.mongodb");
const { updateUserPayments } = require('../helpers/userPayment.mongodb')

const {
  initiateParallelDisbursements,
  getParallelUserInfo,
} = require("../helpers/brokerdealer.api");

async function runCompleteTest(count = 5) {
  // Create onboarding entries
  const onboardingIds = await testUserOnboardingAPI(count);
  console.log("Created onboarding IDs:", onboardingIds);

  // Update progress for each entry
  await testUpdateOnboardingProgressAPI(onboardingIds);

  // Get progress and access tokens for each entry
  const progressResults = await getOnboardingProgress(onboardingIds.map((e) => e.onboardingId));
  console.log("Onboarding Progress Results:", progressResults);

  // Filter for individual onboarding types and get their access tokens
  const individualOnboardings = progressResults.filter(
    (result) => result.onboardingType === "INDIVIDUAL"
  );
  const individualIds = individualOnboardings.map(
    (result) => result.onboardingId
  );
  const individualAccessTokens = individualOnboardings.map(
    (result) => result.accessToken
  );

  // Onboard individuals to North Capital
  const individualNorthCapitalResults = await onboardIndividualsToNorthCapital(
    individualIds,
    individualAccessTokens
  );
  console.log(
    "Individual North Capital Onboarding Results:",
    individualNorthCapitalResults
  );

  const companyOnboardings = progressResults.filter(
    (result) => result.onboardingType === "COMPANY"
  );
  const companyIds = companyOnboardings.map((result) => result.onboardingId);
  const companyAccessTokens = companyOnboardings.map(
    (result) => result.accessToken
  );

  // Onboard companies to North Capital
  const companyNorthCapitalResults = await onboardEntitiesToNorthCapital(
    companyIds,
    companyAccessTokens
  );
  console.log(
    "Company North Capital Onboarding Results:",
    companyNorthCapitalResults
  );

  // Onboard IRA accounts to North Capital
  const iraOnboardings = progressResults.filter(
    (result) => result.onboardingType === "IRA"
  );
  const iraIds = iraOnboardings.map((result) => result.onboardingId);
  const iraAccessTokens = iraOnboardings.map((result) => result.accessToken);

  const iraNorthCapitalResults = await onboardEntitiesToNorthCapital(
    iraIds,
    iraAccessTokens
  );

  console.log("IRA North Capital Onboarding Results:", iraNorthCapitalResults);

  // Onboard trust accounts to North Capital
  const trustOnboardings = progressResults.filter(
    (result) => result.onboardingType === "TRUST"
  );
  const trustIds = trustOnboardings.map((result) => result.onboardingId);
  const trustAccessTokens = trustOnboardings.map(
    (result) => result.accessToken
  );

  const trustNorthCapitalResults = await onboardEntitiesToNorthCapital(
    trustIds,
    trustAccessTokens
  );

  console.log(
    "Trust North Capital Onboarding Results:",
    trustNorthCapitalResults
  );

  // Onboard joint accounts to North Capital
  const jointOnboardings = progressResults.filter(
    (result) => result.onboardingType === "JOINT"
  );
  const jointIds = jointOnboardings.map((result) => result.onboardingId);
  const jointAccessTokens = jointOnboardings.map(
    (result) => result.accessToken
  );

  const jointNorthCapitalResults = await onboardJointAccountsToNorthCapital(
    jointIds,
    jointAccessTokens
  );

  console.log(
    "Joint North Capital Onboarding Results:",
    jointNorthCapitalResults
  );

  const allAccessTokens = [
    ...individualAccessTokens,
    ...companyAccessTokens,
    ...iraAccessTokens,
    ...trustAccessTokens,
    ...jointAccessTokens,
  ];

  // Create investment trades for all accounts
  const investmentTradeResults = await createInvestmentTrades(allAccessTokens);

  // console.log("Investment Trade Results:", investmentTradeResults);

  const tradeIds = investmentTradeResults.map((result) => result.tradeId);

  console.log("tradeIds:", tradeIds);

  await updateDocuments(tradeIds);

  const allOnboardingIds = [
    ...individualIds,
    ...companyIds,
    ...iraIds,
    ...trustIds,
    ...jointIds,
  ];

  await parallelSaveSubscriptionAgreementDate(allAccessTokens)

  await parallelFinalizeUserCreation(allOnboardingIds);

  await updateUserPayments()

  const getAllUserIdsRequest = allOnboardingIds.map((onboardingId) => ({
    // offeringId: "1625407",
    offeringId: "Cultivate",
    onboardingId,
  }));

  const allUserIds = await getParallelUserInfo(getAllUserIdsRequest);

  console.log("allUserIds:", allUserIds[0].data);

  const allDisbursementRequests = [];
  for (let i = 0; i < allUserIds.length; i++) {
    const { userId } = allUserIds[i].data.data.getUserOnboardProgress;
    const disbursementRequest = {
      userId,
      tradeId: tradeIds[i],
      issuerSignatureText: "Issuer Signature",
      // offeringId: "Cultivate",
      offeringId: "NULL"
      // offeringId: "ArmedBrewForces",
    };

    allDisbursementRequests.push(disbursementRequest);
  }

  // console.log("allDisbursementRequests:", allDisbursementRequests);

  // const disbursementResults = await initiateParallelDisbursements(allDisbursementRequests);

  // console.log('disbursementResults:', disbursementResults)
}

runCompleteTest(10);
