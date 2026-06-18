import { readFileSync, existsSync } from "fs";
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

if (!existsSync(lockPath)) {
  console.log("Dev server: not running");
  process.exit(1);
}

try {
  const lock = JSON.parse(readFileSync(lockPath, "utf8"));
  if (lock.pid && isProcessRunning(lock.pid)) {
    console.log(`Dev server: running at ${lock.appUrl ?? "http://localhost:3000"}`);
    console.log(`PID: ${lock.pid}`);
    process.exit(0);
  }
} catch {
  // fall through
}

console.log("Dev server: not running (stale lock file)");
process.exit(1);