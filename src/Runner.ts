import Timer from "./Timer";
import { Config } from "./Config";
import * as fs from "fs-extra";
import * as git from "./git";
import * as execa from "execa";

export const DEFAULT_INTERVAL = 30 * 1000;

export default class Runner {
    private timer: Timer;
    private config: Config;
    constructor(config: Config) {
        this.config = config;
        this.timer = new Timer(config.interval || DEFAULT_INTERVAL);
    }

    update(config: Config) {
        this.config = config;
        this.timer = new Timer(config.interval || DEFAULT_INTERVAL);
    }

    start(): void {
        this.timer.start(async () => {
            await this.run();
        });
    }

    async stop(): Promise<void> {
        await this.timer.stop();
    }

    private async run(): Promise<void> {
        for (const repo of this.config.repositories) {
            try {
                fs.statSync(repo.dir);
            } catch (e) {
                fs.mkdirpSync(repo.dir);
                git.clone(repo.url, repo.branch, repo.dir);
            }
            try {
                const url = await git.remoteUrl(repo.dir);
                if (url !== repo.url) {
                    console.error("error: " + repo.dir + "(" + url + ") is not " + repo.url + " repository");
                    continue;
                }
                const branch = await git.currentBranch(repo.dir);
                if (branch !== repo.branch) {
                    console.error("error: " + repo.dir + " is not " + repo.branch + " branch");
                    continue;
                }
                const [changed, prevHash] = await git.remoteChanged(repo.branch, repo.dir);
                for (const act of repo.actions) {
                    if (act.when === "changed" && !changed) {
                        continue;
                    }
                    if (act.gitCmd) {
                        await git.exec(act.gitCmd, repo.dir);
                    }
                    if (act.run) {
                        const commitHash = await git.commitHash(repo.dir);
                        await execa.shell(act.run, {cwd: repo.dir, env: {
                            GIT_TRIGGER_COMMIT_HASH: commitHash,
                            GIT_TRIGGER_PREV_COMMIT_HASH: prevHash
                        }});
                    }
                }
                console.log("success: " + JSON.stringify({url: repo.url, branch: repo.branch, dir: repo.dir}));
            } catch (e) {
                console.error("error: caught error, " + (e.message || e));
            }
        }
    };
}
