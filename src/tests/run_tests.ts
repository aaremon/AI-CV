import { runPiiSanitizationTests } from "./piiSanitization.test";

try {
  runPiiSanitizationTests();
  process.exit(0);
} catch (e: any) {
  console.error("Test execution failed:", e);
  process.exit(1);
}
