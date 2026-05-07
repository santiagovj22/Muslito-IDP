#!/usr/bin/env node
import { Command } from 'commander';
import { scaffoldCommand } from './commands/scaffold';
import { blueprintCommand } from './commands/blueprint';

const program = new Command();

program
  .name('idp')
  .description('Internal Developer Platform CLI — golden paths for your team')
  .version('1.0.0');

program.addCommand(scaffoldCommand());
program.addCommand(blueprintCommand());

program.parse(process.argv);
