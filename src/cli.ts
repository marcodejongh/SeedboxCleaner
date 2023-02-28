#!/usr/bin/env node
import meow from "meow";
import { cosmiconfig } from "cosmiconfig";
import { ConfigInterface } from "./ConfigInterface.js";
import { scan } from "./commands/scan.js";
import { clean } from "./commands/clean.js";

enum Commands {
  scan = "scan",
  clean = "clean",
}

const main = async (command: string, flags: any) => {
  const explorer = cosmiconfig("seedboxcleaner");
  const config: ConfigInterface = (await explorer.search())?.config;

  if (!config) {
    console.error("Couldn't find config");
    process.exit(1);
  }

  switch (command) {
    case Commands.scan:
      scan(config);
      break;
    case Commands.clean:
      clean(config);
      break;
    default:
      console.error(`Command ${command} not supported`);
      process.exit(1);
  }
};

const cli = meow(
  `
	Usage
	  $ seedboxcleaner <command>
    Command
        scan    Scan filemanagers for files that could be deleted and mark them with labels
        clean   Wizard for cleaning up files, requires scan to have  beeen completed successfully before
	Options

	Examples
	  $ seedboxcleaner --scan
	  🌈 unicorns 🌈
`,
  {
    importMeta: import.meta,
    flags: {
      scan: {
        type: "boolean",
        alias: "s",
      },
    },
  }
);
/*
{
    input: ['unicorns'],
    flags: {rainbow: true},
    ...
}
*/

main(cli.input[0], cli.flags);
