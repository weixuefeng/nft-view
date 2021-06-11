# NFT Viewer

## Live deploy for `main` branch in this repo

*all commits to `main` branch will be deployed to following:*

#### NewChain Mainnet, ChainID: `1012`

[nft.newton.bio/](https://nft.newton.bio/)

#### NewChain Testnet, ChainID: `1007`

[nft.testnet.newton.bio/](https://nft-testnet.newton.bio/)

## Development

### Install dependencies

```bash
yarn
```

### Start Developing Server

```bash
yarn start
```

- runs on http://localhost:3000
- default env is newchain testnet chainid `1007`

### Build

see scripts at [package.json](./package.json)

### Code Formatting

#### Format Check

```bash
yarn fc
```

#### Format Fix

```bash
yarn ff
```