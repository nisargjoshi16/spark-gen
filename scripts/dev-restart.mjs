import { readFileSync, existsSync } from "fs";
import { spawn, execSync } from "child_process";
import { join } from "path";

const lockPath = join(process.cwd(), ".next", "dev", "lock");
const nextBin =
  process.platform === "win32"
    ? join(process.cwd(), "node_modules", ".bin", "next.cmd")
    : join(process.cwd(), "node_modules", ".bin", "next");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function stopExisting() {
  if (!existsSync(lockPath)) return;

  try {
    const { pid } = JSON.parse(readFileSync(lockPath, "utf8"));
    if (!pid) return;

    try {
      process.kill(pid);
      console.log(`Stopped existing dev server (PID ${pid})`);
    } catch {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
        console.log(`Stopped existing dev server (PID ${pid})`);
      } catch {
        console.log(`Could not stop PID ${pid}, continuing anyway`);
      }
    }

    await sleep(800);
  } catch {
    // stale lock
  }
}

await stopExisting();

const child = spawn(nextBin, ["dev"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

child.on("exit", (code) => process.exit(code ?? 0));