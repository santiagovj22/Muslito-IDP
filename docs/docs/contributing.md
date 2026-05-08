---
id: contributing
title: Contributing
sidebar_position: 99
---

# Contributing to Muslito IDP

Thank you for helping improve the platform! Here's how to add new scaffolds, blueprints, or pipeline templates.

## Project structure recap

```
Muslito-IDP/
├── scaffolds/        # Service templates
│   ├── nodejs/
│   └── fastapi/
├── blueprints/       # AWS CDK stacks
├── pipelines/        # CI/CD templates
├── cli/              # idp CLI source
├── portal/           # Developer Portal (Next.js)
└── docs/             # This documentation site (Docusaurus)
```

## Adding a new scaffold

1. Copy an existing scaffold as a starting point:
   ```bash
   cp -r scaffolds/nodejs scaffolds/my-new-type
   ```

2. Implement the scaffold template under `scaffolds/my-new-type/`.

3. Register the scaffold type in the CLI:
   ```typescript
   // cli/src/commands/scaffold/new.ts
   // Add 'my-new-type' to the --type flag choices
   ```

4. Add documentation at `docs/docs/scaffolds/my-new-type.md`.

5. Update `docs/sidebars.ts` to include the new page.

6. Submit a pull request.

## Adding a new blueprint

1. Create a new CDK project under `blueprints/my-blueprint/`:
   ```bash
   mkdir blueprints/my-blueprint
   cd blueprints/my-blueprint
   cdk init app --language typescript
   ```

2. Implement the stack in `lib/stack.ts` following the patterns in existing blueprints.

3. Register the blueprint in the CLI:
   ```typescript
   // cli/src/commands/blueprint/deploy.ts
   // Add 'my-blueprint' to the BLUEPRINT_IDS list
   ```

4. Add documentation at `docs/docs/blueprints/my-blueprint.md`.

5. Update `docs/sidebars.ts`.

6. Submit a pull request.

## Blueprint conventions

- All context parameters must have safe defaults.
- All resources must be prefixed with `${serviceName}-${env}-`.
- Production (`env === 'production'`) must use stricter settings: Multi-AZ, backups, `RETAIN` removal policies.
- Always include relevant CloudWatch Alarms.
- Export key resource identifiers as `CfnOutput`.

## Running the docs locally

```bash
cd docs
npm install
npm start
# Open http://localhost:3000
```

## Code style

- TypeScript: follow ESLint config in `cli/`.
- Python: `ruff` + `mypy` for scaffolds.
- CDK: prefer `L2` constructs; use `L1` (Cfn*) only when an L2 doesn't exist.

## Pull request checklist

- [ ] New scaffold / blueprint has documentation
- [ ] `sidebars.ts` updated if new doc pages added
- [ ] CLI command registered for new catalog item
- [ ] Blueprint passes `cdk synth` without errors
- [ ] All existing tests pass