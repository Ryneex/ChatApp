const chalk = require("chalk");
const { execSync } = require("child_process");
const fs = require("fs-extra");

console.log(chalk.greenBright("Building Frontend..."));
execSync("cd ./frontend && npm run build", {
    stdio: "inherit",
});
fs.rmSync("./build/dist", { force: true, recursive: true });
fs.moveSync("./frontend/dist", "./build/dist");
console.log("Compiling TypeScript");
execSync("npx tsc", {
    stdio: "inherit",
});
console.log(chalk.greenBright(`Application has been built for production \nuse ${chalk.yellowBright("npm run start")}`));