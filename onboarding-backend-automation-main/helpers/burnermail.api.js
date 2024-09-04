const axios = require("axios");
const { faker } = require("@faker-js/faker");

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
      await new Promise((resolve) => setTimeout(resolve, waitTime));
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
const rateLimiter = new RateLimiter(3); // 1 request per second

let invocationCount = 0;
let results = [];

async function generateBurnerMail(retries = 3, delay = 5000) {
  await rateLimiter.waitForToken();

  const url = "https://burnermail.io/api/v1/virtual_emails";
  const headers = {
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    Connection: "keep-alive",
    "Content-Type": "application/json;charset=UTF-8",
    Cookie:
      "CookieConsent={stamp:%27c3ylk/683clnzfj1N0DlZT7kIpY5k7DmQafJvKs5sPEF+nPk3AcWDQ==%27%2Cnecessary:true%2Cpreferences:true%2Cstatistics:true%2Cmarketing:false%2Cmethod:%27implied%27%2Cver:1%2Cutc:1703181663536%2Cregion:%27th%27}; _goninja-app_session=OEdCWU5GOFV5V3RQYXF2cVlZTzhQaHhhSy9EM2pGOU9qcnFNUjBvTk5ER0tiQ1d5YStseG5DSjhFeU82UmZEeXU5MTJzc3pyM2x0b1ZwTDFZcTNhVHU1UUlnQ0lDaElzM1V3R0g2ZTk4VEdXK0J1TnVZazNiY05ySmp2a3ZrRHN3cnFKZXQxaDNVczcxd0dnQnR2dFZKZ3RhckdZOU9QNm1UekhXVUI3QzkraFZxeURWVHU4LzJtMVZuWXhsaVpQYnZOVVlNMUJmdWgvSWRjQWVWTExJazhIUjd1Z3BNQjBPbmlKTW9uSTd6TWpyYVBkNXhHS2FNOFBMbENZcFg2TkwrNTdtTnZIK1hOMzBDb1lac09hSU4rUjFJWTJsMUlTdXNTU0wyTytiQTVROUNmYmlqZTc0R044alF1akRYUGthcmRPMC9IT2Z3VGFzMVNwNWFOYU9POVZiNW9GRmV5YVdCd1ErbngxYUswPS0tSnB0RXlkTmJKODUxRGZqL3lmOStoUT09--8285a179a65e1357a242835ed4ea7c1ca08732b3; _goninja-app_session=bTZrSHFBenNneHBCd3RMQndwaUhETnBpSG9aUldxT0l4dUFmK2ExUHRqVG5zeVhHVGl1TEZZTWo4Q2EwYWlaU1BPbEdwSyt4OWF3d1BsSFlMTXlHalM0TDMrRzFMUVY2a2V3Y01nL1MwQTU4NVRuN3RaYVBkZTl6aGgzYVk3dGNnRUxMU0FzWlF2THAweU1EVjZOTHJtaHpJY0k4K21va2RienNERUtWYnFlOER0eXJpN0tzdjJwVUl3VHJqOHpGQnhNZjdQNEdEazFiNndtRU9Pd2R3dnVKY2FHN0ZPay96dDlsOFE1YWNad2hmc3BFSDVJZ1VDL3NSZjB2RWJGR1JSRGh5ZkUzRjQrYnhWcTBtcFBWMlY0T204VXBXMnRzVXFHcTlPSUx4T1R0VjRIVXQzVWZrY2RwKys2S25LMGZnMExGNCt4S0tvZERmM0xJN0VVSWNOZ3p2VkRKUSsrRmxxNjh2YWVBcktnPS0tU3M5bGlLbmo1VkNmRUsxeTgwSDh4Zz09--3b38047d300394bf78111f5f697434208366bbcb",
    DNT: "1",
    Origin: "https://burnermail.io",
    Referer: "https://burnermail.io/mailbox",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "sec-ch-ua": '"Not/A)Brand";v="8", "Chromium";v="126"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
  };
  const data = {
    virtual_emails: {
      // hash: "fb0e9a",
      // hash: faker.word.word(),
      hash: faker.random.alphaNumeric(6).toLowerCase(),
      address: faker.person.firstName(),
    },
  };

  try {
    const response = await axios.post(url, data, { headers });
    invocationCount++;
    results.push(response.data.email);
    return response.data.email;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.warn("Rate limit exceeded. Retrying after a delay...");
      await new Promise((resolve) => setTimeout(resolve, delay));
      return generateBurnerMail(retries, delay); // Retry the request
    }

    if (retries > 0) {
      console.warn(`API call failed. Retrying... (${retries} attempts left)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return generateBurnerMail(retries - 1, delay);
    } else {
      console.error("Error invoking BurnerMail API after all retries:", error);
      throw error; // Rethrow the error to be handled by the caller
    }
  }
}

async function generateMultipleBurnerMails(count) {
  const emails = [];
  for (let i = 0; i < count; i++) {
    try {
      const email = await generateBurnerMail();
      emails.push(email);
    } catch (error) {
      console.error(`Failed to generate email ${i + 1}:`, error);
    }
  }
  return emails;
}

module.exports = {
  generateBurnerMail,
  generateMultipleBurnerMails,
};
