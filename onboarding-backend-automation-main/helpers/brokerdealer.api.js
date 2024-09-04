const axios = require("axios");

// const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YjIxNzNhMS0zMDc5LTRhZDUtYmM0NC1lODAyNGYzZTQ1N2UiLCJpYXQiOjE3MjAxODA2MzYsImV4cCI6MTcyMDE4NDIzNn0.f-fcvBKF-mPmEpRLu35nu9Pl3pGtvb5pZVwmAyqV8z8"


async function getAccessToken() {
  const url = 'http://52.90.61.55:4000/graphql';
  const headers = {
    'Accept-Encoding': 'gzip, deflate, br',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Connection': 'keep-alive',
    'DNT': '1',
    'Origin': 'http://52.90.61.55:4000',
  };

  const body = {
    query: `
      mutation {
        login(
          data: {
            email: "irpiusbybvzcxy@exelica.com"
            password: "Password123!"
          }
        ) {
          accessToken
        }
      }
    `
  };

  try {
    const response = await axios.post(url, body, { headers });
    // console.log(response.data);
    return response.data.data.login.accessToken;
  } catch (error) {
    console.error('Error making GraphQL request:', error);
  }
}


async function initiateParallelDisbursements(inputArray) {
  const accessToken = await getAccessToken()

  const url = "http://52.90.61.55:4000/graphql";
  const headers = {
    "Accept-Encoding": "gzip, deflate, br",
    "Content-Type": "application/json",
    Accept: "application/json",
    Connection: "keep-alive",
    DNT: "1",
    Origin: "http://52.90.61.55:4000",
    Authorization: `Bearer ${accessToken}`,
  };

  const mutations = inputArray.map((input) => {
    const query = `
      mutation {
        initiateDisbursement(
          input: {
            userId: "${input.userId}"
            tradeId: "${input.tradeId}"
            issuerSignatureText: "${input.issuerSignatureText}"
          }
          offeringId: ${input.offeringId ? input.offeringId : "NULL"}
        )
      }
    `;

    return axios.post(url, { query }, { headers });
  });

  try {
    const results = await Promise.all(mutations);
    return results.map((result, index) => (result.data.data));
  } catch (error) {
    console.error("Error in parallel disbursement initiation:", error.response.data.errors);
    return inputArray.map((input) => ({
      input,
      success: false,
      error: error.response ? error.response.data : error.message,
    }));
  }
}

async function getParallelUserInfo(inputArray) {
  const accessToken = await getAccessToken()
  const url = 'http://52.90.61.55:4000/graphql';
  const headers = {
    'Accept-Encoding': 'gzip, deflate, br',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Connection': 'keep-alive',
    'DNT': '1',
    'Origin': 'http://52.90.61.55:4000',
    Authorization: `Bearer ${accessToken}`,
  };

  const queries = inputArray.map(input => {
    const query = `
      {
        getUserOnboardProgress(
          offeringId: ${input.offeringId}
          searchParams: "${JSON.stringify({onboardingId: input.onboardingId}).replace(/"/g, '\\"')}"
        ) {
          userId
        }
      }
    `;

    return axios.post(url, { query }, { headers });
  });

  try {
    const results = await Promise.all(queries);
    // console.log('results.data:', results[0].data.errors)
    return results.map((result, index) => ({
      input: inputArray[index],
      success: true,
      data: result.data
    }));
  } catch (error) {
    console.error('Error in parallel user info retrieval:', error);
    return inputArray.map(input => ({
      input,
      success: false,
      error: error.response ? error.response.data : error.message
    }));
  }
}

module.exports = {
  initiateParallelDisbursements,
  getParallelUserInfo
};
