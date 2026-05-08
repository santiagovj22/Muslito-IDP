"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scaffoldCommand = void 0;
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
// ─── Scaffold catalog ────────────────────────────────────────────────────────
const SCAFFOLDS = {
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
// ─── Helpers ─────────────────────────────────────────────────────────────────
const getScaffoldsRoot = () => path_1.default.resolve(__dirname, '../../../scaffolds');
const readScaffoldManifest = async (scaffoldSrcDir) => {
    const manifestPath = path_1.default.join(scaffoldSrcDir, 'scaffold.json');
    if (!(await fs_extra_1.default.pathExists(manifestPath))) {
        return { version: 'unknown', minCliVersion: '1.0.0' };
    }
    return fs_extra_1.default.readJson(manifestPath);
};
const replaceTokens = async (dir, tokens) => {
    const entries = await fs_extra_1.default.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path_1.default.join(dir, entry.name);
        if (entry.isDirectory()) {
            await replaceTokens(fullPath, tokens);
        }
        else {
            const ext = path_1.default.extname(entry.name);
            const textExts = ['.js', '.ts', '.json', '.yml', '.yaml', '.md', '.env', '.toml', '.py'];
            if (textExts.includes(ext) || entry.name.startsWith('.env')) {
                let content = await fs_extra_1.default.readFile(fullPath, 'utf8');
                for (const [key, value] of Object.entries(tokens)) {
                    content = content.replaceAll(`{{${key}}}`, value);
                }
                await fs_extra_1.default.writeFile(fullPath, content, 'utf8');
            }
        }
    }
};
// ─── Commands ─────────────────────────────────────────────────────────────────
const scaffoldCommand = () => {
    const scaffold = new commander_1.Command('scaffold').description('Manage service scaffolds');
    // idp scaffold list
    scaffold
        .command('list')
        .description('List all available scaffolds')
        .action(async () => {
        console.log('\n' + chalk_1.default.bold('Available scaffolds:\n'));
        const scaffoldsRoot = getScaffoldsRoot();
        for (const [key, s] of Object.entries(SCAFFOLDS)) {
            const srcDir = path_1.default.join(scaffoldsRoot, s.sourceDir);
            const manifest = await readScaffoldManifest(srcDir);
            console.log(`  ${chalk_1.default.cyan(key.padEnd(12))} ${chalk_1.default.bold(s.name)} ${chalk_1.default.gray(`v${manifest.version}`)}`);
            console.log(`  ${' '.repeat(12)} ${chalk_1.default.gray(s.description)}\n`);
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
            console.error(chalk_1.default.red(`\n✗ Unknown scaffold type "${type}". Available: ${Object.keys(SCAFFOLDS).join(', ')}`));
            process.exit(1);
        }
        const destDir = path_1.default.resolve(output, name);
        if (await fs_extra_1.default.pathExists(destDir)) {
            console.error(chalk_1.default.red(`\n✗ Directory "${destDir}" already exists.`));
            process.exit(1);
        }
        const spinner = (0, ora_1.default)(`Creating ${chalk_1.default.cyan(name)} from ${chalk_1.default.bold(SCAFFOLDS[type].name)} scaffold...`).start();
        try {
            const srcDir = path_1.default.join(getScaffoldsRoot(), SCAFFOLDS[type].sourceDir);
            if (!(await fs_extra_1.default.pathExists(srcDir))) {
                spinner.fail(chalk_1.default.red(`Scaffold source not found at: ${srcDir}`));
                process.exit(1);
            }
            const manifest = await readScaffoldManifest(srcDir);
            // Copy scaffold files (excludes scaffold.json — internal metadata)
            await fs_extra_1.default.copy(srcDir, destDir, {
                filter: (src) => path_1.default.basename(src) !== 'scaffold.json',
            });
            // Replace template tokens
            await replaceTokens(destDir, {
                SERVICE_NAME: name,
                SERVICE_DESCRIPTION: description,
            });
            // Write .idp.json manifest into the generated service
            const idpJson = {
                scaffold: type,
                scaffoldVersion: manifest.version,
                generatedAt: new Date().toISOString().split('T')[0],
                generatedBy: 'idp-cli',
            };
            await fs_extra_1.default.writeJson(path_1.default.join(destDir, '.idp.json'), idpJson, { spaces: 2 });
            spinner.succeed(chalk_1.default.green(`Service "${name}" created at ${destDir}`));
            console.log(`\n  ${chalk_1.default.gray('Scaffold:')} ${chalk_1.default.cyan(SCAFFOLDS[type].name)} ${chalk_1.default.gray(`v${manifest.version}`)}`);
            console.log(`  ${chalk_1.default.gray('Manifest:')} .idp.json\n`);
            console.log(chalk_1.default.bold('Next steps:'));
            console.log(`  ${chalk_1.default.gray('1.')} cd ${name}`);
            if (type === 'nodejs') {
                console.log(`  ${chalk_1.default.gray('2.')} npm install`);
                console.log(`  ${chalk_1.default.gray('3.')} cp .env.example .env`);
                console.log(`  ${chalk_1.default.gray('4.')} npm run dev`);
            }
            else if (type === 'fastapi') {
                console.log(`  ${chalk_1.default.gray('2.')} poetry install`);
                console.log(`  ${chalk_1.default.gray('3.')} cp .env.example .env`);
                console.log(`  ${chalk_1.default.gray('4.')} uvicorn app.main:app --reload`);
            }
            console.log(`\n  ${chalk_1.default.cyan('Health check:')} http://localhost:${type === 'nodejs' ? '3000' : '8000'}/api/v1/health\n`);
        }
        catch (err) {
            spinner.fail(chalk_1.default.red('Failed to create scaffold'));
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
        const servicePath = path_1.default.resolve(opts.path);
        const idpJsonPath = path_1.default.join(servicePath, '.idp.json');
        if (!(await fs_extra_1.default.pathExists(idpJsonPath))) {
            console.error(chalk_1.default.red(`\n✗ No .idp.json found in "${servicePath}".\n  This service was not generated by the IDP CLI, or the manifest was deleted.\n`));
            process.exit(1);
        }
        const idpJson = await fs_extra_1.default.readJson(idpJsonPath);
        const scaffoldMeta = SCAFFOLDS[idpJson.scaffold];
        if (!scaffoldMeta) {
            console.error(chalk_1.default.red(`\n✗ Unknown scaffold type "${idpJson.scaffold}" in .idp.json.\n`));
            process.exit(1);
        }
        const srcDir = path_1.default.join(getScaffoldsRoot(), scaffoldMeta.sourceDir);
        const latestManifest = await readScaffoldManifest(srcDir);
        console.log('\n' + chalk_1.default.bold('Scaffold version check:\n'));
        console.log(`  Service path   ${chalk_1.default.gray(servicePath)}`);
        console.log(`  Scaffold type  ${chalk_1.default.cyan(idpJson.scaffold)}`);
        console.log(`  Used version   ${chalk_1.default.yellow(`v${idpJson.scaffoldVersion}`)}`);
        console.log(`  Latest version ${chalk_1.default.green(`v${latestManifest.version}`)}`);
        console.log(`  Generated at   ${chalk_1.default.gray(idpJson.generatedAt)}`);
        if (idpJson.scaffoldVersion === latestManifest.version) {
            console.log(`\n  ${chalk_1.default.green('✓')} Up to date.\n`);
        }
        else {
            console.log(`\n  ${chalk_1.default.yellow('!')} A newer scaffold version is available (v${latestManifest.version}).`);
            console.log(`  ${chalk_1.default.gray('Review the scaffold changelog and apply relevant changes manually.')}\n`);
        }
    });
    return scaffold;
};
exports.scaffoldCommand = scaffoldCommand;
//# sourceMappingURL=scaffold.js.map