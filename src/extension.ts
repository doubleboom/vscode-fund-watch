// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Provider from './Provider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "fund-test" is now active!');
	let interval = vscode.workspace.getConfiguration().get('fund-watch.interval', 2);
	if (interval < 2) {
		interval = 2;
	}
	const provider = new Provider();
	vscode.window.registerTreeDataProvider("fund-list", provider);
	setInterval(() => {
		provider.refresh();
	}, interval * 1000);
	context.subscriptions.push(
		vscode.commands.registerCommand('fund.refresh', () => {
			provider.refresh();
		}),
		vscode.commands.registerCommand('fund.add', () => {
			provider.addFund();
		}),
		vscode.commands.registerCommand('fund.item.remove', (fund) => {
			const { code } = fund;
			provider.removeConfig(code);
			provider.refresh();
		})
	);
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('fund-test.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from fund-test!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
