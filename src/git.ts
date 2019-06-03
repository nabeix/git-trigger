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

export async function remoteChanged(branch: string, cwd: string): Promise<[boolean, string, string]> {
    const remote = await (async () => {
        const {stdout} = await execa("git", ["ls-remote", "origin", "refs/heads/" + branch], {cwd});
        return stdout.split("\t")[0].split(" ")[0];
    })();
    const local = await commitHash(cwd);
    return [remote === local, local, remote];
}

export async function exec(cmd: string, cwd: string): Promise<void> {
    await execa("git", cmd.split(" "), {cwd});
}

export async function commitHash(cwd: string): Promise<string> {
    const { stdout } = await execa("git", ["rev-parse", "HEAD"], {cwd});
    return stdout;
}
