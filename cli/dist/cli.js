#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const scaffold_1 = require("./commands/scaffold");
const blueprint_1 = require("./commands/blueprint");
const program = new commander_1.Command();
program
    .name('idp')
    .description('Internal Developer Platform CLI — golden paths for your team')
    .version('1.0.0');
program.addCommand((0, scaffold_1.scaffoldCommand)());
program.addCommand((0, blueprint_1.blueprintCommand)());
program.parse(process.argv);
//# sourceMappingURL=cli.js.map