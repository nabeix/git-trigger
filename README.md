# git-trigger

git-trigger monitors a git branch and trigger a command defined in config file when changesare detected.

## Usage

```
npm install -g git-trigger
vi trigger.config.js
git-trigger ./trigger.config.js
```

```
   USAGE

     git-trigger start <config>

   ARGUMENTS

     <config>      Config file      required

   OPTIONS

     --pidfile <pidfile>      PID file      optional

   GLOBAL OPTIONS

     -h, --help         Display help
     -V, --version      Display version
     --no-color         Disable colors
     --quiet            Quiet mode - only displays warn and error messages
     -v, --verbose      Verbose mode - will also output debug messages
```

trigger.config.js
```
module.exports = {
  interval: 2 * 60 * 1000, // 2 min
  repositories: [
    {
      url: "git@github.com:nabeix/git-trigger.git",
      branch: "master",
      dir: "/var/app/git-trigger",
      actions: [
        {
          when: "changed", // trigger `gitCmd` and `run` when branch is changed
          gitCmd: "pull", // run `git pull`
          run: "npm i && npm run build && npm t" // running on /var/app/git-trigger
        }
      ]
    }
  ]
}
```

## Live config update

`git-trigger` supports live config update by `SIGUSR1` signal.

## License

MIT
