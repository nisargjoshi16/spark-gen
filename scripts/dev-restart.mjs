import { readFileSync, existsSync } from "fs";
import { spawn, execSync } from "child_process";
import { join } from "path";

const lockPath = join(process.cwd(), ".next", "dev", "lock");

if (existsSync(lockPath)) {
  try {
    const { pid } = JSON.parse(readFileSync(lockPath, "utf8"));
    if (pid) {
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
    }
  } catch {
    // lock file missing or invalid
  }
}

const child = spawn("npm", ["run", "dev"], {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));