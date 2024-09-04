const { faker } = require("@faker-js/faker");

function generateRandomPhoneNumber() {
  const countryCode = "+1";
  const areaCode = "202";
  const exchangeCode = "555";
  const lineNumber = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  return `${countryCode}-${areaCode}-${exchangeCode}-${lineNumber}`;
}

function generateRandomSSN() {
  const secondSegment = Math.floor(Math.random() * 90) + 10;
  const thirdSegment = Math.floor(Math.random() * 9000) + 1000;

  return `222-${secondSegment}-${thirdSegment}`;
}

function generateRandomEin() {
  const secondPart = Math.floor(Math.random() * 10000000);

  return `46-${String(secondPart).padStart(7, "0")}`;
}

function generateRandomNaics() {
  const min = 100000;
  const max = 999999;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomRequestBody() {
  const secondaryFirstName = faker.person.firstName();
  return {
    lastCompletedStage: "2a",
    investingProfile: {
      option: "IN_BEHALF_OF_AN_ENTITY",
      totalShares: 10,
      amount: 1000,
      paymentMethod: "CARD",
      itemId: "FIRST_INVESTMENT",
      accountType: "JTWROS",
    },
    basicInfo: {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      middleInitial: faker.person.middleName(),
    },
    personalInfo: {
      birthday: faker.date.past(30),
      phoneNumber: generateRandomPhoneNumber(),
    },
    citizenshipInfo: {
      country: "United States",
      citizenship: "U.S. Citizen",
    },
    financialInfo: {
      ssn: generateRandomSSN(),
    },
    addressInfo: {
      Street1: faker.location.streetAddress(),
      Street2: faker.location.secondaryAddress(),
      city: faker.location.cityName(),
      state: "MI",
      postalCode: faker.location.zipCode(),
      country: "US",
    },
    entityDetails: {
      phoneNumber: generateRandomPhoneNumber(),
      countryOfFormation: "United States",
      email: faker.internet.email(),
      name: "Test Entity",
      legalStructure: "LLC",
      ein: generateRandomEin(),
      companyName: faker.company.name(),
      website: faker.internet.url(),
      description: faker.company.catchPhrase(),
      naics: generateRandomNaics(),
      naicsDescription: faker.company.bs(),
      regionOfFormation: "IN",
      establishedOn: faker.date.past(20),
      addressInfo: {
        Street1: faker.location.streetAddress(),
        Street2: faker.location.secondaryAddress(),
        city: faker.location.cityName(),
        state: "MI",
        postalCode: faker.location.zipCode(),
        country: "US",
      },
    },
    secondary: {
      email: `${secondaryFirstName}@test.com`,
      addressInfo: {
        Street1: faker.location.streetAddress(),
        Street2: faker.location.secondaryAddress(),
        city: faker.location.cityName(),
        state: "MI",
        postalCode: faker.location.zipCode(),
        country: "US",
      },
      basicInfo: {
        firstName: secondaryFirstName,
        lastName: faker.person.lastName(),
        middleInitial: faker.person.middleName(),
      },
      personalInfo: {
        birthday: faker.date.past(30),
        phoneNumber: generateRandomPhoneNumber(),
      },
      financialInfo: {
        ssn: generateRandomSSN(),
      },
      citizenshipInfo: {
        country: "United States",
        citizenship: "U.S. Citizen",
      },
    },
  };
}

function generateRandomIndividualNCData() {
  return {
    partyData: {
      domicile: "U.S. citizen",
      firstName: faker.person.firstName(),
      middleInitial: faker.person.middleName()[0],
      lastName: faker.person.lastName(),
      socialSecurityNumber: faker.phone.number("###-##-####"),
      dob: faker.date
        .past(50, new Date(1990, 0, 1))
        .toLocaleDateString("en-US"),
      primCountry: "USA",
      primAddress1: faker.location.streetAddress(),
      primAddress2: faker.location.secondaryAddress(),
      primCity: faker.location.city(),
      primState: faker.location.stateAbbr(),
      primZip: faker.location.zipCode(),
      emailAddress: faker.internet.email(),
      emailAddress2: faker.internet.email(),
      phone: faker.phone.number("##########"),
      phone2: faker.phone.number("##########"),
      occupation: faker.person.jobTitle(),
      associatedPerson: faker.helpers.arrayElement(["Yes", "No"]),
      invest_to: "0",
      empStatus: faker.helpers.arrayElement([
        "Employed",
        "Self-Employed",
        "Unemployed",
        "Retired",
      ]),
      empCountry: "USA",
      empName: faker.company.name(),
      empAddress1: faker.location.streetAddress(),
      empAddress2: faker.location.secondaryAddress(),
      empCity: faker.location.city(),
      empState: faker.location.stateAbbr(),
      empZip: faker.location.zipCode(),
      currentAnnIncome: faker.datatype
        .number({ min: 30000, max: 500000 })
        .toString(),
      avgAnnIncome: faker.datatype
        .number({ min: 30000, max: 500000 })
        .toString(),
      currentHouseholdIncome: faker.datatype
        .number({ min: 30000, max: 1000000 })
        .toString(),
      avgHouseholdIncome: faker.datatype
        .number({ min: 30000, max: 1000000 })
        .toString(),
      householdNetworth: faker.datatype
        .number({ min: 50000, max: 5000000 })
        .toString(),
      KYCstatus: "pending",
      AMLstatus: "pending",
      AMLdate: faker.date.recent().toLocaleDateString("en-US"),
      tags: faker.lorem.words(),
      field1: faker.lorem.words(),
      field2: faker.lorem.words(),
      field3: faker.lorem.words(),
      createdIpAddress: faker.internet.ip(),
      notes: faker.lorem.sentence(),
    },
    accountData: {
      email: faker.internet.email(),
      accountRegistration: faker.lorem.word(),
      type: "Individual",
      entityType: "Revocable Trust",
      domesticYN: "domestic account",
      streetAddress1: faker.location.streetAddress(),
      streetAddress2: faker.location.secondaryAddress(),
      city: faker.location.city(),
      state: faker.location.stateAbbr(),
      zip: faker.location.zipCode(),
      country: "USA",
      phone: faker.phone.number("##########"),
      taxID: faker.phone.number("############"),
      KYCstatus: "pending",
      AMLstatus: "pending",
      suitabilityScore: faker.datatype.number({ min: 1, max: 10 }).toString(),
      suitabilityDate: faker.date.recent().toLocaleDateString("en-US"),
      suitabilityApprover: faker.person.fullName(),
      AccreditedStatus: "pending",
      AIlow: faker.helpers.arrayElement(["income", "networth", "both"]),
      AIdate: faker.date.recent().toLocaleDateString("en-US"),
      "506cLimit": faker.datatype
        .number({ min: 10000, max: 100000 })
        .toString(),
      accountTotalLimit: faker.datatype
        .number({ min: 50000, max: 1000000 })
        .toString(),
      singleInvestmentLimit: faker.datatype
        .number({ min: 100, max: 10000 })
        .toString(),
      associatedAC: faker.helpers.arrayElement(["yes", "no"]),
      syndicate: faker.helpers.arrayElement(["yes", "no"]),
      tags: faker.lorem.words(),
      notes: faker.lorem.sentence(),
      approvalStatus: "pending",
      approvalPrincipal: faker.person.fullName(),
      approvalLastReview: faker.date.recent().toLocaleDateString("en-US"),
      field1: faker.lorem.words(),
      field2: faker.lorem.words(),
      field3: faker.lorem.words(),
    },
    linkData: {
      firstEntryType: "Account",
      relatedEntryType: "IndivACParty",
      primary_value: "1",
      linkType: "member",
      notes: faker.lorem.sentence(),
    },
  };
}

function generateRandomOnboardEntity() {
  const generateRandomPhoneNumber = () => faker.phone.number("##########");

  const generateRandomSSN = () => faker.phone.number("###-##-####");

  const generateRandomEin = () => faker.phone.number("##-#######");

  const generateRandomNaics = () =>
    faker.datatype.number({ min: 100000, max: 999999 }).toString();

  return {
    entityData: {
      domicile: "U.S. citizen",
      entityName: `${faker.company.name()} ${faker.company.suffixes()}`,
      entityType: "LLC",
      entityDesc: faker.company.catchPhrase(),
      ein: generateRandomEin(),
      primCountry: "USA",
      primAddress1: faker.location.streetAddress(),
      primAddress2: faker.location.secondaryAddress(),
      primCity: faker.location.cityName(),
      primState: faker.location.stateAbbr(),
      primZip: faker.location.zipCode(),
      emailAddress: faker.internet.email(),
      emailAddress2: faker.internet.email(),
      phone: generateRandomPhoneNumber(),
      phone2: generateRandomPhoneNumber(),
      totalAssets: faker.datatype.number({ min: 50000, max: 5000000 }),
      ownersAI: faker.helpers.arrayElement(["Yes", "No"]),
      KYCstatus: "Pending",
      AMLstatus: "Pending",
      AMLdate: faker.date.recent().toLocaleDateString("en-US"),
      tags: faker.lorem.words(),
      createdIpAddress: faker.internet.ip(),
      notes: faker.lorem.sentence(),
      formationDate: faker.date.past().toLocaleDateString("en-US"),
    },
    partyData: {
      domicile: "U.S. citizen",
      firstName: faker.person.firstName(),
      middleInitial: faker.person.middleName()[0],
      lastName: faker.person.lastName(),
      socialSecurityNumber: faker.phone.number("###-##-####"),
      dob: faker.date
        .past(50, new Date(1990, 0, 1))
        .toLocaleDateString("en-US"),
      primCountry: "USA",
      primAddress1: faker.location.streetAddress(),
      primAddress2: faker.location.secondaryAddress(),
      primCity: faker.location.city(),
      primState: faker.location.stateAbbr(),
      primZip: faker.location.zipCode(),
      emailAddress: faker.internet.email(),
      emailAddress2: faker.internet.email(),
      phone: faker.phone.number("##########"),
      phone2: faker.phone.number("##########"),
      occupation: faker.person.jobTitle(),
      associatedPerson: faker.helpers.arrayElement(["Yes", "No"]),
      invest_to: "0",
      empStatus: faker.helpers.arrayElement([
        "Employed",
        "Self-Employed",
        "Unemployed",
        "Retired",
      ]),
      empCountry: "USA",
      empName: `${faker.company.name()} Corp.`,
      empAddress1: faker.location.streetAddress(),
      empAddress2: faker.location.secondaryAddress(),
      empCity: faker.location.city(),
      empState: faker.location.stateAbbr(),
      empZip: faker.location.zipCode(),
      currentAnnIncome: faker.datatype
        .number({ min: 30000, max: 500000 })
        .toString(),
      avgAnnIncome: faker.datatype
        .number({ min: 30000, max: 500000 })
        .toString(),
      currentHouseholdIncome: faker.datatype
        .number({ min: 30000, max: 1000000 })
        .toString(),
      avgHouseholdIncome: faker.datatype
        .number({ min: 30000, max: 1000000 })
        .toString(),
      householdNetworth: faker.datatype
        .number({ min: 50000, max: 5000000 })
        .toString(),
      KYCstatus: "pending",
      AMLstatus: "pending",
      AMLdate: faker.date.recent().toLocaleDateString("en-US"),
      tags: faker.lorem.words(),
      field1: faker.lorem.words(),
      field2: faker.lorem.words(),
      field3: faker.lorem.words(),
      createdIpAddress: faker.internet.ip(),
      notes: faker.lorem.sentence(),
    },
    accountData: {
      email: faker.internet.email(),
      accountRegistration: faker.lorem.word(),
      type: "Company",
      entityType: "Revocable Trust",
      domesticYN: "domestic account",
      streetAddress1: faker.location.streetAddress(),
      streetAddress2: faker.location.secondaryAddress(),
      city: faker.location.cityName(),
      state: faker.location.stateAbbr(),
      zip: faker.location.zipCode(),
      country: "USA",
      phone: generateRandomPhoneNumber(),
      taxID: generateRandomSSN(),
      KYCstatus: "Pending",
      AMLstatus: "Pending",
      suitabilityScore: faker.datatype.number({ min: 1, max: 10 }).toString(),
      suitabilityDate: faker.date.recent().toLocaleDateString("en-US"),
      suitabilityApprover: faker.person.fullName(),
      AccreditedStatus: "Pending",
      AIlow: faker.helpers.arrayElement(["income", "networth", "both"]),
      AIdate: faker.date.recent().toLocaleDateString("en-US"),
      "506cLimit": faker.datatype
        .number({ min: 10000, max: 100000 })
        .toString(),
      accountTotalLimit: faker.datatype
        .number({ min: 50000, max: 1000000 })
        .toString(),
      singleInvestmentLimit: faker.datatype
        .number({ min: 100, max: 10000 })
        .toString(),
      associatedAC: faker.helpers.arrayElement(["yes", "no"]),
      syndicate: faker.helpers.arrayElement(["yes", "no"]),
      tags: faker.lorem.words(),
      notes: faker.lorem.sentence(),
      approvalStatus: "Pending",
      approvalPrincipal: faker.person.fullName(),
      approvalLastReview: faker.date.recent().toLocaleDateString("en-US"),
      field1: faker.lorem.words(),
      field2: faker.lorem.words(),
      field3: faker.lorem.words(),
    },
    linkData: {
      // firstEntryType: 'Account',
      // relatedEntryType: 'IndivACParty',
      // primary_value: '1',
      firstEntryType: "Account",
      relatedEntryType: "EntityACParty",
      primary_value: "0",

      linkType: "member",
      notes: faker.lorem.sentence(),
    },
  };
}

module.exports = {
  generateRandomRequestBody,
  generateRandomIndividualNCData,
  generateRandomOnboardEntity,
};
