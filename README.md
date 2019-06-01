# git-pull-trigger

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
      url: "git@github.com:nabeix/git-pull-trigger.git",
      branch: "master",
      dir: "/var/app/git-pull-trigger",
      actions: [
        {
          when: "changed",
          run: "npm i && npm run build && npm t"
        }
      ]
    }
  ]
}
```

## License

MIT
