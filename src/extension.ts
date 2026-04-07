import * as vscode from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';

let client: LanguageClient | undefined;

export function activate(context: vscode.ExtensionContext): void {
  const config = vscode.workspace.getConfiguration('ding');
  const dingPath = config.get<string>('serverPath') ?? 'ding';

  const serverOptions: ServerOptions = {
    command: dingPath,
    args: ['lsp'],
    transport: TransportKind.stdio,
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'ding' }],
    synchronize: {
      fileEvents: vscode.workspace.createFileSystemWatcher('**/*.dg'),
    },
  };

  client = new LanguageClient(
    'ding',
    'Ding Language Server',
    serverOptions,
    clientOptions,
  );

  client.start().catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    vscode.window.showErrorMessage(
      `Ding language server failed to start ("${dingPath} lsp"): ${message}. ` +
        `Install the Ding compiler from https://dinglang.dev or set "ding.serverPath" in settings.`,
    );
  });

  context.subscriptions.push({
    dispose: () => {
      void client?.stop();
    },
  });

  context.subscriptions.push(
    vscode.commands.registerCommand('ding.run', () => {
      runInTerminal('run');
    }),
    vscode.commands.registerCommand('ding.build', () => {
      runInTerminal('build');
      vscode.window.showInformationMessage('Ding: build dispatched');
    }),
    vscode.commands.registerCommand('ding.repl', () => {
      const terminal = getOrCreateTerminal();
      terminal.show();
      terminal.sendText('ding repl');
    }),
  );
}

export function deactivate(): Thenable<void> | undefined {
  return client?.stop();
}

function runInTerminal(subcommand: 'run' | 'build'): void {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('Ding: no active file');
    return;
  }
  const filePath = editor.document.fileName;
  const terminal = getOrCreateTerminal();
  terminal.show();
  terminal.sendText(`ding ${subcommand} "${filePath}"`);
}

function getOrCreateTerminal(): vscode.Terminal {
  const existing = vscode.window.terminals.find((t) => t.name === 'Ding');
  return existing ?? vscode.window.createTerminal('Ding');
}
