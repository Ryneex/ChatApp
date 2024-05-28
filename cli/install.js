const chalk = require("chalk");
const { execSync } = require("child_process");

console.log(chalk.greenBright("Installing frontend packages..."));
execSync("cd ./frontend && npm i", {
    stdio: "inherit",
});
