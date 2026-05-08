import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';

// ─── Types ───────────────────────────────────────────────────────────────────

interface ScaffoldMeta {
  name: string;
  description: string;
  sourceDir: string;
}

interface ScaffoldManifest {
  version: string;
  minCliVersion: string;
}

interface IdpJson {
  scaffold: string;
  scaffoldVersion: string;
  generatedAt: string;
  generatedBy: string;
}

// ─── Scaffold catalog ────────────────────────────────────────────────────────

const SCAFFOLDS: Record<string, ScaffoldMeta> = {
  nodejs: {
    name: 'Node.js / Fastify',
    description:
      'Layered architecture (routes→controllers→services→DAL), global error handling, Pino logging, CORS, sanitization, CI/CD.',
    sourceDir: 'nodejs',
  },
  fastapi: {
    name: 'Python / FastAPI',
    description:
      'Layered architecture (routers→controllers→services→repositories), Pydantic validation, structlog, CORS, CI/CD.',
    sourceDir: 'fastapi',
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getScaffoldsRoot = (): string =>
  path.resolve(__dirname, '../../../scaffolds');

const readScaffoldManifest = async (scaffoldSrcDir: string): Promise<ScaffoldManifest> => {
  const manifestPath = path.join(scaffoldSrcDir, 'scaffold.json');
  if (!(await fs.pathExists(manifestPath))) {
    return { version: 'unknown', minCliVersion: '1.0.0' };
  }
  return fs.readJson(manifestPath) as Promise<ScaffoldManifest>;
};

const replaceTokens = async (dir: string, tokens: Record<string, string>): Promise<void> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await replaceTokens(fullPath, tokens);
    } else {
      const ext = path.extname(entry.name);
      const textExts = ['.js', '.ts', '.json', '.yml', '.yaml', '.md', '.env', '.toml', '.py'];
      if (textExts.includes(ext) || entry.name.startsWith('.env')) {
        let content = await fs.readFile(fullPath, 'utf8');
        for (const [key, value] of Object.entries(tokens)) {
          content = content.replaceAll(`{{${key}}}`, value);
        }
        await fs.writeFile(fullPath, content, 'utf8');
      }
    }
  }
};

// ─── Commands ─────────────────────────────────────────────────────────────────

export const scaffoldCommand = (): Command => {
  const scaffold = new Command('scaffold').description('Manage service scaffolds');

  // idp scaffold list
  scaffold
    .command('list')
    .description('List all available scaffolds')
    .action(async () => {
      console.log('\n' + chalk.bold('Available scaffolds:\n'));
      const scaffoldsRoot = getScaffoldsRoot();
      for (const [key, s] of Object.entries(SCAFFOLDS)) {
        const srcDir = path.join(scaffoldsRoot, s.sourceDir);
        const manifest = await readScaffoldManifest(srcDir);
        console.log(
          `  ${chalk.cyan(key.padEnd(12))} ${chalk.bold(s.name)} ${chalk.gray(`v${manifest.version}`)}`
        );
        console.log(`  ${' '.repeat(12)} ${chalk.gray(s.description)}\n`);
      }
    });

  // idp scaffold new
  scaffold
    .command('new')
    .description('Generate a new service from a scaffold')
    .requiredOption('-t, --type <type>', `Scaffold type (${Object.keys(SCAFFOLDS).join('|')})`)
    .requiredOption('-n, --name <name>', 'Service name (e.g. user-service)')
    .option('-o, --output <path>', 'Output directory', '.')
    .option('-d, --description <desc>', 'Service description', 'My service')
    .action(async (opts) => {
      const { type, name, output, description } = opts;

      if (!SCAFFOLDS[type]) {
        console.error(
          chalk.red(
            `\n✗ Unknown scaffold type "${type}". Available: ${Object.keys(SCAFFOLDS).join(', ')}`
          )
        );
        process.exit(1);
      }

      const destDir = path.resolve(output, name);

      if (await fs.pathExists(destDir)) {
        console.error(chalk.red(`\n✗ Directory "${destDir}" already exists.`));
        process.exit(1);
      }

      const spinner = ora(
        `Creating ${chalk.cyan(name)} from ${chalk.bold(SCAFFOLDS[type].name)} scaffold...`
      ).start();

      try {
        const srcDir = path.join(getScaffoldsRoot(), SCAFFOLDS[type].sourceDir);

        if (!(await fs.pathExists(srcDir))) {
          spinner.fail(chalk.red(`Scaffold source not found at: ${srcDir}`));
          process.exit(1);
        }

        const manifest = await readScaffoldManifest(srcDir);

        // Copy scaffold files (excludes scaffold.json — internal metadata)
        await fs.copy(srcDir, destDir, {
          filter: (src) => path.basename(src) !== 'scaffold.json',
        });

        // Replace template tokens
        await replaceTokens(destDir, {
          SERVICE_NAME: name,
          SERVICE_DESCRIPTION: description,
        });

        // Write .idp.json manifest into the generated service
        const idpJson: IdpJson = {
          scaffold: type,
          scaffoldVersion: manifest.version,
          generatedAt: new Date().toISOString().split('T')[0],
          generatedBy: 'idp-cli',
        };
        await fs.writeJson(path.join(destDir, '.idp.json'), idpJson, { spaces: 2 });

        spinner.succeed(chalk.green(`Service "${name}" created at ${destDir}`));

        console.log(
          `\n  ${chalk.gray('Scaffold:')} ${chalk.cyan(SCAFFOLDS[type].name)} ${chalk.gray(`v${manifest.version}`)}`
        );
        console.log(`  ${chalk.gray('Manifest:')} .idp.json\n`);

        console.log(chalk.bold('Next steps:'));
        console.log(`  ${chalk.gray('1.')} cd ${name}`);
        if (type === 'nodejs') {
          console.log(`  ${chalk.gray('2.')} npm install`);
          console.log(`  ${chalk.gray('3.')} cp .env.example .env`);
          console.log(`  ${chalk.gray('4.')} npm run dev`);
        } else if (type === 'fastapi') {
          console.log(`  ${chalk.gray('2.')} poetry install`);
          console.log(`  ${chalk.gray('3.')} cp .env.example .env`);
          console.log(`  ${chalk.gray('4.')} uvicorn app.main:app --reload`);
        }
        console.log(
          `\n  ${chalk.cyan('Health check:')} http://localhost:${type === 'nodejs' ? '3000' : '8000'}/api/v1/health\n`
        );
      } catch (err) {
        spinner.fail(chalk.red('Failed to create scaffold'));
        console.error(err);
        process.exit(1);
      }
    });

  // idp scaffold check
  scaffold
    .command('check')
    .description('Check if the current service is up to date with its scaffold version')
    .option('-p, --path <path>', 'Path to the service directory', '.')
    .action(async (opts) => {
      const servicePath = path.resolve(opts.path);
      const idpJsonPath = path.join(servicePath, '.idp.json');

      if (!(await fs.pathExists(idpJsonPath))) {
        console.error(
          chalk.red(
            `\n✗ No .idp.json found in "${servicePath}".\n  This service was not generated by the IDP CLI, or the manifest was deleted.\n`
          )
        );
        process.exit(1);
      }

      const idpJson: IdpJson = await fs.readJson(idpJsonPath);
      const scaffoldMeta = SCAFFOLDS[idpJson.scaffold];

      if (!scaffoldMeta) {
        console.error(chalk.red(`\n✗ Unknown scaffold type "${idpJson.scaffold}" in .idp.json.\n`));
        process.exit(1);
      }

      const srcDir = path.join(getScaffoldsRoot(), scaffoldMeta.sourceDir);
      const latestManifest = await readScaffoldManifest(srcDir);

      console.log('\n' + chalk.bold('Scaffold version check:\n'));
      console.log(`  Service path   ${chalk.gray(servicePath)}`);
      console.log(`  Scaffold type  ${chalk.cyan(idpJson.scaffold)}`);
      console.log(`  Used version   ${chalk.yellow(`v${idpJson.scaffoldVersion}`)}`);
      console.log(`  Latest version ${chalk.green(`v${latestManifest.version}`)}`);
      console.log(`  Generated at   ${chalk.gray(idpJson.generatedAt)}`);

      if (idpJson.scaffoldVersion === latestManifest.version) {
        console.log(`\n  ${chalk.green('✓')} Up to date.\n`);
      } else {
        console.log(
          `\n  ${chalk.yellow('!')} A newer scaffold version is available (v${latestManifest.version}).`
        );
        console.log(
          `  ${chalk.gray('Review the scaffold changelog and apply relevant changes manually.')}\n`
        );
      }
    });

  return scaffold;
};
