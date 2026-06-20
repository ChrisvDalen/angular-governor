import { Command } from 'commander';
import { scanCommand } from './commands/scan.command.js';

export async function runCli(argv: string[]): Promise<void> {
  const program = new Command();

  program
    .name('angular-governor')
    .description('CLI-first governance tool for Angular projects')
    .version('0.1.0');

  program
    .command('scan')
    .argument('[path]', 'path to the Angular project to scan', '.')
    .description('Scan an Angular project and generate reports')
    .action(async (scanPath: string) => {
      await scanCommand(scanPath);
    });

  await program.parseAsync(argv);
}
