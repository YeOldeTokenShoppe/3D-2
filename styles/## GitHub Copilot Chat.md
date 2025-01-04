## GitHub Copilot Chat

- Extension Version: 0.22.4 (prod)
- VS Code: vscode/1.95.3
- OS: Mac

## Network

User Settings:
```json
  "github.copilot.advanced": {
    "debug.useElectronFetcher": true,
    "debug.useNodeFetcher": false
  }
```

Connecting to https://api.github.com:
- DNS ipv4 Lookup: 140.82.116.5 (105 ms)
- DNS ipv6 Lookup: ::ffff:140.82.116.5 (1 ms)
- Electron Fetcher (configured): HTTP 200 (407 ms)
- Node Fetcher: HTTP 200 (265 ms)
- Helix Fetcher: HTTP 200 (362 ms)

Connecting to https://api.individual.githubcopilot.com/_ping:
- DNS ipv4 Lookup: 140.82.112.22 (103 ms)
- DNS ipv6 Lookup: ::ffff:140.82.112.22 (3 ms)
- Electron Fetcher (configured): timed out after 10 seconds
- Node Fetcher: HTTP 200 (363 ms)
- Helix Fetcher: HTTP 200 (370 ms)

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).