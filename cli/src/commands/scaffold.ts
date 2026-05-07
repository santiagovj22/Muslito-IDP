import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';

// ─── Scaffold catalog ────────────────────────────────────────────────────────
const SCAFFOLDS: Record<string, { name: string; description: string; sourceDir: string }> = {
  nodejs: {
    name: 'Node.js / Fastify',
    description: 'Layered architecture (routes→controllers→services→DAL), global error handling, Pino logging, CORS, sanitization, CI/CD.',
    sourceDir: 'nodejs',
  },
  fastapi: {
    name: 'Python / FastAPI',
    description: 'Layered architecture (routers→controllers→services→repositories), Pydantic validation, structlog, CORS, CI/CD.',
    sourceDir: 'fastapi',
  },
};

// ─── Helpers ────────────────────────────────────────────────────────────────
const getScaffoldsRoot = (): string => {
  // In a real distribution, this resolves to the scaffolds bundled with the CLI package.
  // Adjust this path based on your actual monorepo / npm package layout.
  return path.resolve(__dirname, '../../../scaffolds');
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

// ─── Commands ────────────────────────────────────────────────────────────────
export const scaffoldCommand = (): Command => {
  const scaffold = new Command('scaffold').description('Manage service scaffolds');

  // idp scaffold list
  scaffold
    .command('list')
    .description('List all available scaffolds')
    .action(() => {
      console.log('\n' + chalk.bold('Available scaffolds:\n'));
      for (const [key, s] of Object.entries(SCAFFOLDS)) {
        console.log(`  ${chalk.cyan(key.padEnd(12))} ${chalk.bold(s.name)}`);
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
        console.error(chalk.red(`\n✗ Unknown scaffold type "${type}". Available: ${Object.keys(SCAFFOLDS).join(', ')}`));
        process.exit(1);
      }

      const destDir = path.resolve(output, name);

      if (await fs.pathExists(destDir)) {
        console.error(chalk.red(`\n✗ Directory "${destDir}" already exists.`));
        process.exit(1);
      }

      const spinner = ora(`Creating ${chalk.cyan(name)} from ${chalk.bold(SCAFFOLDS[type].name)} scaffold...`).start();

      try {
        const srcDir = path.join(getScaffoldsRoot(), SCAFFOLDS[type].sourceDir);

        if (!(await fs.pathExists(srcDir))) {
          spinner.fail(chalk.red(`Scaffold source not found at: ${srcDir}`));
          process.exit(1);
        }

        // Copy scaffold files
        await fs.copy(srcDir, destDir);

        // Replace template tokens
        await replaceTokens(destDir, {
          SERVICE_NAME: name,
          SERVICE_DESCRIPTION: description,
        });

        spinner.succeed(chalk.green(`Service "${name}" created successfully!`));

        console.log('\n' + chalk.bold('Next steps:'));
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
        console.log(`\n  ${chalk.cyan('Health check:')} http://localhost:${type === 'nodejs' ? '3000' : '8000'}/api/v1/health\n`);

      } catch (err) {
        spinner.fail(chalk.red('Failed to create scaffold'));
        console.error(err);
        process.exit(1);
      }
    });

  return scaffold;
};
