import { workspace, ExtensionContext, window } from 'vscode';

import * as vscode from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  const joePath = workspace.getConfiguration('joe').get('path', '');
  const debugLog = workspace.getConfiguration('joe').get('debugLog', false);

  window.showInformationMessage("hi!");
  
  if (!joePath) {
    window.showErrorMessage("Failed to find zls executable! Please specify its path in your settings with `joe.path`.");
    return;
  }

  let serverOptions: ServerOptions = {
    command: joePath,
    args: debugLog ? [ "--debug-log" ] : []
  };

  // Options to control the language client
  let clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'joe' }],
    outputChannel: window.createOutputChannel("Joe Language Server")
  };  

  // Create the language client and start the client.
  client = new LanguageClient(
    'joe',
    'Joe Language Server Client',
    serverOptions,
    clientOptions
  );

  client.start();

  vscode.commands.registerCommand("joe.start", () => {
    client.start();
  });

  vscode.commands.registerCommand("joe.stop", async () => {
    await client.stop();
  });

  vscode.commands.registerCommand("joe.restart", async () => {
    await client.stop();
    client.start();
  });
}

export function deactivate(): Thenable<void> {
  return client.stop();
}
