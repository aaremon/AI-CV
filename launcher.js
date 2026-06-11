import { spawn, execSync } from "child_process";
import fs from "fs";
import path from "path";

const PYTHON_BIN_DIR = path.join(process.cwd(), "python-bin");
const PORTABLE_PYTHON_PATH = path.join(PYTHON_BIN_DIR, "python", "bin", "python3");
const VENV_DIR = path.join(process.cwd(), ".venv");
const VENV_PYTHON = path.join(VENV_DIR, "bin", "python");

function checkImports(pythonBin) {
  try {
    execSync(`"${pythonBin}" -c "import flask, flask_cors, google.genai, dotenv"`, { stdio: "ignore" });
    return true;
  } catch (e) {
    return false;
  }
}

function ensurePython() {
  console.log("[Launcher] Checking Python runtimes...");

  // 1. Check if virtual environment already exists and is working
  if (fs.existsSync(VENV_PYTHON)) {
    console.log("[Launcher] Found existing virtual environment at .venv");
    if (checkImports(VENV_PYTHON)) {
      console.log("[Launcher] Virtual environment has all dependencies installed.");
      return VENV_PYTHON;
    }
    console.log("[Launcher] Virtual environment exists but is missing dependencies. Re-installing...");
    try {
      execSync(`"${VENV_DIR}/bin/pip" install -r requirements.txt`, { stdio: "inherit" });
      if (checkImports(VENV_PYTHON)) {
        return VENV_PYTHON;
      }
    } catch (e) {
      console.warn("[Launcher] Failed to update virtual environment pip packages:", e.message);
    }
  }

  // 2. Check if system python3 works and already has all packages installed
  try {
    execSync("python3 --version", { stdio: "ignore" });
    console.log("[Launcher] System python3 is available.");
    if (checkImports("python3")) {
      console.log("[Launcher] System python3 already has all required dependencies.");
      return "python3";
    }
  } catch (e) {
    console.log("[Launcher] System python3 not available or not usable.");
  }

  // 3. Try to create a new virtual environment
  try {
    execSync("python3 --version", { stdio: "ignore" });
    console.log("[Launcher] Attempting to create a new virtual environment...");
    execSync(`python3 -m venv "${VENV_DIR}"`, { stdio: "inherit" });
    if (fs.existsSync(VENV_PYTHON)) {
      console.log("[Launcher] Virtual environment created. Installing requirements...");
      execSync(`"${VENV_DIR}/bin/pip" install -r requirements.txt`, { stdio: "inherit" });
      if (checkImports(VENV_PYTHON)) {
        console.log("[Launcher] Virtual environment is fully ready.");
        return VENV_PYTHON;
      }
    }
  } catch (e) {
    console.log("[Launcher] Failed to create virtual environment:", e.message);
  }

  // 4. Try installing system-wide using --break-system-packages as fallback
  try {
    execSync("python3 --version", { stdio: "ignore" });
    console.log("[Launcher] Attempting to install requirements to system python with --break-system-packages...");
    try {
      execSync("python3 -m pip install -r requirements.txt --break-system-packages", { stdio: "inherit" });
    } catch (err) {
      try {
        execSync("pip install -r requirements.txt --break-system-packages", { stdio: "inherit" });
      } catch (err2) {
        // Try without --break-system-packages in case it's an older python
        execSync("python3 -m pip install -r requirements.txt", { stdio: "inherit" });
      }
    }
    if (checkImports("python3")) {
      console.log("[Launcher] System python3 dependencies installed successfully!");
      return "python3";
    }
  } catch (e) {
    console.log("[Launcher] Failed to install requirements to system python:", e.message);
  }

  // 5. Fallback to Portable Python (downloading) if none of the above worked
  if (fs.existsSync(PORTABLE_PYTHON_PATH)) {
    console.log("[Launcher] Found existing portable python at " + PORTABLE_PYTHON_PATH);
    if (checkImports(PORTABLE_PYTHON_PATH)) {
      return PORTABLE_PYTHON_PATH;
    }
    try {
      execSync(`"${PORTABLE_PYTHON_PATH}" -m pip install -r requirements.txt`, { stdio: "inherit" });
      if (checkImports(PORTABLE_PYTHON_PATH)) {
        return PORTABLE_PYTHON_PATH;
      }
    } catch (e) {
      console.warn("[Launcher] Failed to install packages in portable python:", e.message);
    }
  }

  console.log("[Launcher] None of standard system runtimes worked. Downloading standalone portable python...");
  try {
    if (!fs.existsSync(PYTHON_BIN_DIR)) {
      fs.mkdirSync(PYTHON_BIN_DIR, { recursive: true });
    }
    const downloadUrl = "https://github.com/indygreg/python-build-standalone/releases/download/20240107/cpython-3.10.13+20240107-x86_64-unknown-linux-gnu-install_only.tar.gz";
    console.log(`[Launcher] Downloading: ${downloadUrl}`);
    execSync(`curl -L "${downloadUrl}" | tar -xz -C "${PYTHON_BIN_DIR}"`, { stdio: "inherit" });
    console.log("[Launcher] Portable python extracted!");
    
    // Install pip requirements
    try {
      execSync(`"${PORTABLE_PYTHON_PATH}" -m pip install -U pip`, { stdio: "inherit" });
    } catch (e) {
      console.warn("[Launcher] Pip upgrade warning:", e.message);
    }
    execSync(`"${PORTABLE_PYTHON_PATH}" -m pip install -r requirements.txt`, { stdio: "inherit" });
    
    if (checkImports(PORTABLE_PYTHON_PATH)) {
      return PORTABLE_PYTHON_PATH;
    }
  } catch (err) {
    console.error("[Launcher] Failed standalone python setup:", err.message);
  }

  // Final absolute backup: if nothing else succeeded, return whatever python we can find
  try {
    execSync("python3 --version", { stdio: "ignore" });
    return "python3";
  } catch (e) {
    if (fs.existsSync(PORTABLE_PYTHON_PATH)) {
      return PORTABLE_PYTHON_PATH;
    }
    throw new Error("No usable Python runtime found.");
  }
}

const isPrepareOnly = process.argv.includes("--prepare");

if (isPrepareOnly) {
  console.log("[Launcher] Prepare triggered during build...");
  ensurePython();
  process.exit(0);
}

const pythonBin = ensurePython();

const isProd = process.argv.includes("--prod") || process.env.NODE_ENV === "production";

if (isProd) {
  console.log(`[Launcher] Starting backend server using ${pythonBin} on port 3000...`);
  const backend = spawn(pythonBin, ["server.py", "--port", "3000"], { stdio: "inherit", shell: true });
  
  process.on("exit", () => backend.kill());
  process.on("SIGINT", () => {
    backend.kill();
    process.exit();
  });
} else {
  console.log(`[Launcher] Starting backend server using ${pythonBin} on port 5001...`);
  const backend = spawn(pythonBin, ["server.py", "--port", "5001"], { stdio: "inherit", shell: true });
  
  console.log("[Launcher] Starting Vite server on port 3000...");
  const vite = spawn("npx", ["vite"], { stdio: "inherit", shell: true });
  
  process.on("exit", () => {
    backend.kill();
    vite.kill();
  });
  
  process.on("SIGINT", () => {
    backend.kill();
    vite.kill();
    process.exit();
  });
}
