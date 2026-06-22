import { spawnSync } from "node:child_process";

const env = {
  ...process.env,
  PWA_BUILD: "1",
  NEXT_PUBLIC_STATIC_EXPORT: "1",
  NEXT_PUBLIC_BASE_PATH: "/spark-gen",
};

const result = spawnSync("npx", ["next", "build"], {
  stdio: "inherit",
  env,
  shell: true,
});

process.exit(result.status ?? 1);