import {TreeItem} from 'vscode';
interface FundInfo{
    now:string,
    name:string,
    code:string,
    lastClose:string,
    changeRate:string,
    changeAmount:string
}
export default class FundItem extends TreeItem{
    info:FundInfo;
    constructor(info:FundInfo){
        const icon = Number(info.changeRate) >=0? '📈' : '📉';
        super(`${icon}${info.name}   ${info.changeRate}%`);

        let sliceName = info.name;
        if(sliceName.length>8){
            sliceName = `${sliceName.slice(0,8)}...`;
        }
        const tips=[
            `代码： ${info.code}`,
            `名称： ${info.code}`,
            `-----------------------`,
            `单位净值： ${info.now}`,
            `涨跌幅： ${info.changeRate}%`,
            `涨跌额： ${info.changeAmount}`,
            `昨收： ${info.lastClose}`,
        ];
        this.info = info;
        this.tooltip = tips.join('\r\n');
    }
}