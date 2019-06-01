# git-pull-trigger

## Usage

```
npm install -g git-pull-trigger
vi trigger.config.js
git-pull-trigger ./trigger.config.js
```

trigger.config.js
```
module.exports = {
  interval: 2 * 60 * 1000, // 2 min
  log: "/var/log/git-pull-trigger.log",
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

### Run as daemon using pm2

```
npm install -g pm2
```

## License

MIT
