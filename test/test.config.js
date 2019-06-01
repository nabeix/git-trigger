module.exports = {
    interval: 10 * 1000,
    repositories: [
        {
            url: "git@github.com:nabeix/git-trigger.git",
            branch: "master",
            dir: "/Users/nabeix/git-trigger",
            actions: [
                {
                    when: "changed",
                    gitCmd: "pull",
                    run: "echo \"foo\" >> foo.txt"
                }
            ]
        }
    ]
};
