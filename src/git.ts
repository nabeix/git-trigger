import * as execa from "execa";

export async function clone(url: string, branch: string, dir: string): Promise<void> {
    await execa("git", ["clone", "-b", branch, url, dir]);
}

export async function currentBranch(cwd: string): Promise<string> {
    const {stdout: branch} = await execa("git", ["symbolic-ref", "--short", "HEAD"], {cwd});
    return branch;
}

export async function remoteUrl(cwd: string): Promise<string> {
    const {stdout: url} = await execa("git", ["remote", "get-url", "origin"], {cwd});
    return url;
}

export async function remoteChanged(branch: string, cwd: string): Promise<boolean> {
    const {stdout: remote} = await execa("git", ["ls-remote", "origin", "refs/heads/" + branch], {cwd});
    const {stdout: local} = await execa("git", ["rev-parse", "HEAD"], {cwd});
    return remote.indexOf(local) !== 0;
}

export async function exec(cmd: string, cwd: string): Promise<void> {
    await execa("git", cmd.split(" "), {cwd});
}
