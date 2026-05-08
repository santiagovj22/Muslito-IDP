---
id: installation
title: Installation
sidebar_position: 1
---

# Installation

## Prerequisites

| Tool | Minimum version | Notes |
|---|---|---|
| **Node.js** | 18.x | 20.x or 22.x recommended |
| **npm** | 9.x | Comes with Node.js |
| **AWS CLI** | 2.x | Required for blueprint deployment |
| **AWS CDK** | 2.x | Installed automatically with blueprints |
| **Git** | 2.x | For cloning generated scaffolds |

## Install the IDP CLI

```bash
npm install -g @muslito/idp-cli
```

Verify the installation:

```bash
idp --version
idp --help
```

## AWS Credentials

Blueprint deployment requires AWS credentials. Configure them via the AWS CLI:

```bash
aws configure
```

Or export environment variables:

```bash
export AWS_ACCESS_KEY_ID=your-key-id
export AWS_SECRET_ACCESS_KEY=your-secret
export AWS_DEFAULT_REGION=us-east-1
```

## Local development (from source)

If you are working on the platform itself, clone the repo and link the CLI locally:

```bash
git clone https://github.com/santiagovj22/Muslito-IDP.git
cd Muslito-IDP/cli
npm install
npm run build
npm link
```

Verify:

```bash
idp --help
```

:::note
The CLI resolves scaffold templates from the `scaffolds/` folder in the monorepo root. Do not move the `cli/` folder outside the monorepo when running from source.
:::