import { readFileSync, existsSync } from "fs";
import { spawn } from "child_process";
import { join } from "path";

const lockPath = join(process.cwd(), ".next", "dev", "lock");

function isProcessRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

if (existsSync(lockPath)) {
  try {
    const lock = JSON.parse(readFileSync(lockPath, "utf8"));
    if (lock.pid && isProcessRunning(lock.pid)) {
      console.log(`Dev server already running at ${lock.appUrl ?? "http://localhost:3000"}`);
      console.log(`PID: ${lock.pid}`);
      console.log("Use npm run dev:restart to stop and start fresh.");
      process.exit(0);
    }
  } catch {
    // stale or invalid lock — start normally
  }
}

const child = spawn("npx", ["next", "dev"], {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));