import { PiiSanitizationService } from "../services/piiSanitization.service";
import { AiPrivacyGuardService } from "../services/aiPrivacyGuard.service";
import { aiDataPolicy } from "../config/aiDataPolicy";

export function runPiiSanitizationTests() {
  console.log("==================================================");
  console.log("  RUNNING AUTOMATED PRIVACY & PII SANITIZATION TESTS");
  console.log("==================================================");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✅ [PASS] ${testName}`);
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      if (detail) console.error(`     Detail: ${detail}`);
    }
  }

  // TEST 1: Email Sanitization
  const emailInput = "Contact me at john.doe@example.com or support@company.org";
  const emailSanitized = PiiSanitizationService.sanitizeString(emailInput, "atsAnalysis");
  assert(
    emailSanitized.includes("[EMAIL]") && !emailSanitized.includes("john.doe@example.com"),
    "Email Detection & Placeholder Replacement",
    `Output: ${emailSanitized}`
  );

  // TEST 2: Phone Number Sanitization
  const phoneInput = "Call my mobile: +977-9812345678 or +1 (555) 234-5678";
  const phoneSanitized = PiiSanitizationService.sanitizeString(phoneInput, "atsAnalysis");
  assert(
    phoneSanitized.includes("[PHONE]") && !phoneSanitized.includes("9812345678"),
    "Phone Number Detection & Placeholder Replacement",
    `Output: ${phoneSanitized}`
  );

  // TEST 3: Date of Birth Sanitization
  const dobInput = "Date of Birth: 15/05/1998 or DOB: Jan 12, 1995";
  const dobSanitized = PiiSanitizationService.sanitizeString(dobInput, "atsAnalysis");
  assert(
    dobSanitized.includes("[DATE_OF_BIRTH]") && !dobSanitized.includes("15/05/1998"),
    "Date of Birth Detection & Placeholder Replacement",
    `Output: ${dobSanitized}`
  );

  // TEST 4: Location / Address Sanitization
  const addressInput = "Residence Address: Kathmandu-10, Baneshwor, Nepal";
  const addressSanitized = PiiSanitizationService.sanitizeString(addressInput, "atsAnalysis");
  assert(
    addressSanitized.includes("[LOCATION]"),
    "Location / Address Detection & Placeholder Replacement",
    `Output: ${addressSanitized}`
  );

  // TEST 5: Government ID / Citizenship Sanitization
  const govtIdInput = "Citizenship No: 12-01-75-09876, Passport: N12345678";
  const govtSanitized = PiiSanitizationService.sanitizeString(govtIdInput, "atsAnalysis");
  assert(
    govtSanitized.includes("[GOVERNMENT_ID]"),
    "Government ID / Passport Detection & Replacement",
    `Output: ${govtSanitized}`
  );

  // TEST 6: Negative Test - Complete CV Processing for ATS Analysis
  const fullFakeCvData = {
    act_name: "Johnathon Smith",
    act_mail: "johnathon.smith.test@gmail.com",
    act_mob: "+1-415-555-0199",
    selectedField: "Software Engineering",
    rawTextToAnalyze: `
      JOHNATHON SMITH
      Email: johnathon.smith.test@gmail.com | Phone: +1-415-555-0199 | Location: San Francisco, CA
      DOB: 12/04/1992 | Gender: Male | Citizenship No: US-987654321

      PROFESSIONAL SUMMARY:
      Senior Software Engineer with 6+ years building distributed React, Node.js, and TypeScript applications.

      EXPERIENCE:
      Tech Lead at Acme Corp (2020 - Present)
      - Architected high-throughput microservices using Node.js and PostgreSQL.
      - Reduced latency by 45% across 12 core API routes.

      SKILLS:
      React, TypeScript, Node.js, Express, PostgreSQL, Cloud Architecture, Docker, Kubernetes.

      EDUCATION:
      B.S. in Computer Science - Stanford University
    `
  };

  const atsResult = PiiSanitizationService.createPayload(fullFakeCvData, "atsAnalysis");
  const guardResult = AiPrivacyGuardService.validateAIPayload(atsResult.sanitizedPayload, "atsAnalysis");

  const finalStringifiedPayload = JSON.stringify(guardResult.sanitizedPayload);

  const containsRawEmail = finalStringifiedPayload.includes("johnathon.smith.test@gmail.com");
  const containsRawPhone = finalStringifiedPayload.includes("+1-415-555-0199");
  const containsRawDob = finalStringifiedPayload.includes("12/04/1992");
  const containsRawGovtId = finalStringifiedPayload.includes("US-987654321");
  const containsSkills = finalStringifiedPayload.includes("React") && finalStringifiedPayload.includes("TypeScript");

  assert(
    !containsRawEmail && !containsRawPhone && !containsRawDob && !containsRawGovtId && containsSkills,
    "Negative Test: Full Fake CV Sanitization (Zero Raw PII in Payload)",
    `Email leak: ${containsRawEmail}, Phone leak: ${containsRawPhone}, DOB leak: ${containsRawDob}, GovtID leak: ${containsRawGovtId}`
  );

  console.log("==================================================");
  console.log(`  RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log("==================================================");

  if (passedTests === totalTests) {
    console.log("  🎉 ALL PII SANITIZATION & PRIVACY TESTS PASSED PERFECTLY!");
    return true;
  } else {
    throw new Error(`${totalTests - passedTests} test(s) failed.`);
  }
}
