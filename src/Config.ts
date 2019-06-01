export interface ActionConfig {
    gitCmd: string;
    when: "changed"|"always";
    run?: string;
}

export interface RepositoryConfig {
    url: string;
    branch: string;
    dir: string;
    actions: ActionConfig[];
}

export interface Config {
    interval?: number;
    repositories: RepositoryConfig[]
}

export function validate(obj: any): void {
    if (!obj) {
        throw new Error("Invalid config object");
    }
    if (obj.interval && (typeof obj.interval !== "number")) {
        throw new Error("interval is not a number");
    }
    if (obj.log && (typeof obj.log !== "string")) {
        throw new Error("log is not a string");
    }
    if (!Array.isArray(obj.repositories)) {
        throw new Error("repositories is not an array");
    }
}
