import * as program from "caporal";
import * as path from "path";
import * as fs from "fs-extra";
import { validate } from "./Config";
import Runner from "./Runner";
const pkg = require("../package.json");

let runner: Runner;

let configPath: string;

program
    .version(pkg.version)
    .command("start", 'Start git-trigger')
    .argument("<config>", "Config file")
    .option("--pidfile <pidfile>", "PID file")
    .action((args, opts) => {
        if (opts.pidfile) {
            fs.writeFileSync(path.resolve(process.cwd(), opts.pidfile), "" + process.pid);
        }
        configPath = path.resolve(process.cwd(), args.config);
        const config = require(configPath);
        validate(config);
        runner = new Runner(config);
        runner.start();
  });

program.parse(process.argv);

let stopping = false;
process.on("SIGINT", async () => {
    if (!runner) {
        return;
    }
    if (stopping) {
        return;
    }
    stopping = true;
    await runner.stop();
    process.exit(1);
});

let updating = false;
process.on("SIGUSR1", async () => {
    if (updating) {
        return;
    }
    console.log("updating config...");
    updating = true;
    const config = require(configPath);
    validate(config);
    await runner.stop();
    runner.update(config);
    runner.start();
    updating = false;
    console.log("config updated");
});
