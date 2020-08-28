import * as vscode from 'vscode';
import fundApi from './api';
import FundItem from './TreeItem';

interface FundInfo {
    now: string
    name: string
    code: string
    lastClose: string
    changeRate: string
    changeAmount: string
}

export default class DataProvider implements vscode.TreeDataProvider<FundInfo>{
    private refreshEvent: vscode.EventEmitter<FundInfo | null> = new vscode.EventEmitter<FundInfo | null>();
    readonly onDidChangeTreeData: vscode.Event<FundInfo | null> = this.refreshEvent.event;
    refresh() {
        // 更新视图
        setTimeout(() => {
            this.refreshEvent.fire(null);
        }, 200);
    }
    // 更新配置
    updateConfig(funds: string[]) {
        const config = vscode.workspace.getConfiguration();
        const favorites = Array.from(
            // 通过 Set 去重
            new Set([
                ...config.get('fund.favorites', []),
                ...funds,
            ])
        );
        config.update('fund.favorites', favorites, true);
    }
    async addFund() {
        // 弹出输入框
        const res = await vscode.window.showInputBox({
            value: '',
            valueSelection: [5, -1],
            prompt: '添加基金到自选',
            placeHolder: 'Add Fund To Favorite',
            validateInput: (inputCode: string) => {
                const codeArray = inputCode.split(/[\W]/);
                const hasError = codeArray.some((code) => {
                    return code !== '' && !/^\d+$/.test(code);
                });
                return hasError ? '基金代码输入有误' : null;
            },
        });
        if (!!res) {
            const codeArray = res.split(/[\W]/) || [];
            const result = await fundApi([...codeArray]);
            if (result && result.length > 0) {
                // 只更新能正常请求的代码
                const codes = result.map(i => i.code);
                this.updateConfig(codes);
                this.refresh();
            } else {
                vscode.window.showWarningMessage('stocks not found');
            }
        }
    }

    // 删除配置
    removeConfig(code: string) {
        const config = vscode.workspace.getConfiguration();
        const favorites: string[] = [...config.get('fund.favorites', [])];
        const index = favorites.indexOf(code);
        if (index === -1) {
            return;
        }
        favorites.splice(index, 1);
        config.update('fund.favorites', favorites, true);
    }

    getTreeItem(info: FundInfo): FundItem {
        // const {name,changeRate} = element;
        return new FundItem(info);
    }
    getChildren(): Promise<FundInfo[]> {
        // const {} = this;
        const favorites: string[] = vscode.workspace.getConfiguration().get("fund.favorites", []);
        return fundApi([...favorites]).then(
            (results: FundInfo[]) => results.sort(
                (prev, next) => (prev.changeRate >= next.changeRate ? 1 : -1)
            ));
    }
}