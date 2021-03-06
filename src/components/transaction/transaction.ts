import { Component, Input, OnInit } from '@angular/core';
import { ApiProvider, ChainNetwork } from '../../providers/api/api';
import { BlocksProvider } from '../../providers/blocks/blocks';
import { CurrencyProvider } from '../../providers/currency/currency';
import { RedirProvider } from '../../providers/redir/redir';
import {
  AppInput,
  AppOutput,
  TxsProvider
} from '../../providers/transactions/transactions';

import { Logger } from '../../providers/logger/logger';

/**
 * Generated class for the TransactionComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 * 用在Block-detail页面中,显示该Block包含的Tx
 * 用在transaction页面中,显示该tx包含的Tx(复用)
 */
@Component({
  selector: 'transaction',
  templateUrl: 'transaction.html'
})
export class TransactionComponent implements OnInit {
  public expanded = false;
  @Input()
  public tx: any = {};
  @Input()
  public showCoins = false;
  @Input()
  public chainNetwork: ChainNetwork;
  public confirmations: number;

  private COIN = 100000000;

  constructor(
    public currencyProvider: CurrencyProvider,
    public apiProvider: ApiProvider,
    public txProvider: TxsProvider,
    public redirProvider: RedirProvider,
    public blocksProvider: BlocksProvider,
    public logger: Logger,
  ) {}

  public ngOnInit(): void {
    this.showCoins ? this.getCoins() : this.getConfirmations();
  }

  // 实际也是调用getTx方法进行展示,并不是仅仅获取coins
  public getCoins(): void {
    this.txProvider
      // getCoins(this.tx.txid, this.chainNetwork)
      .getTx(this.tx.txid, this.chainNetwork)
      .subscribe(data => {
        this.tx = data;
        this.tx.fee = this.txProvider.getFee(this.tx);
        this.tx.valueOut = data.vout.reduce((a, b) => a + b.value, 0);
        this.getConfirmations();
      });
  }

  public getInputAddress(v: AppInput): string {
    if (!v.scriptSig || !v.scriptSig.addresses) {
      return 'Unparsed address';
    }
    // 返回的是地址数组(多签,这里只取第一个地址)
    return v.scriptSig.addresses[0];
  }

  public getOutputAddress(v: AppOutput): string {
    if (!v.scriptPubKey || !v.scriptPubKey.addresses) {
      return 'Unparsed address';
    }
    // 返回的是地址数组(多签,这里只取第一个地址)  
    return v.scriptPubKey.addresses[0];
  }

  public getConfirmations() {
    this.txProvider
      .getConfirmations(this.tx.blockheight, this.chainNetwork)
      .subscribe(confirmations => {
        this.confirmations = confirmations;
      });
  }

  public goToTx(txId: string, vout?: number, fromVout?: boolean): void {
    this.redirProvider.redir('transaction', {
      txId,
      chain: this.chainNetwork.chain,
      network: this.chainNetwork.network,
      vout,
      fromVout
    });
  }

  public goToAddress(v: AppOutput): void {
    // 返回的是地址数组(多签,这里只取第一个地址)         
    const addrStr = v.scriptPubKey.addresses[0];
    this.redirProvider.redir('address', {
      addrStr,
      chain: this.chainNetwork.chain,
      network: this.chainNetwork.network
    });
  }

  public toggleExpanded(): void {
    this.expanded = !this.expanded;
  }

  public aggregateItems(items: any[]): any[] {
    if (!items) {
      return [];
    }

    const l: number = items.length;

    const ret: any[] = [];
    const tmp: any = {};
    let u = 0;

    for (let i = 0; i < l; i++) {
      let notAddr = false;
      // non standard input
      if (items[i].scriptSig && !items[i].address) {
        items[i].address = 'Unparsed address [' + u++ + ']';
        items[i].notAddr = true;
        notAddr = true;
      }

      // non standard output
      if (items[i].scriptPubKey && !items[i].scriptPubKey.addresses) {
        items[i].scriptPubKey.addresses = ['Unparsed address [' + u++ + ']'];
        items[i].notAddr = true;
        notAddr = true;
      }

      // multiple addr at output
      if (items[i].scriptPubKey && items[i].scriptPubKey.addresses.length > 1) {
        items[i].address = items[i].scriptPubKey.addresses.join(',');
        ret.push(items[i]);
        continue;
      }

      const address: string =
        items[i].address ||
        (items[i].scriptPubKey && items[i].scriptPubKey.addresses[0]);

      if (!tmp[address]) {
        tmp[address] = {};
        tmp[address].valueSat = 0;
        tmp[address].count = 0;
        tmp[address].address = address;
        tmp[address].items = [];
      }
      tmp[address].isSpent = items[i].spentTxId;

      tmp[address].doubleSpentTxID =
        tmp[address].doubleSpentTxID || items[i].doubleSpentTxID;
      tmp[address].doubleSpentIndex =
        tmp[address].doubleSpentIndex || items[i].doubleSpentIndex;
      tmp[address].dbError = tmp[address].dbError || items[i].dbError;
      tmp[address].valueSat += Math.round(items[i].value * this.COIN);
      tmp[address].items.push(items[i]);
      tmp[address].notAddr = notAddr;

      if (items[i].unconfirmedInput) {
        tmp[address].unconfirmedInput = true;
      }

      tmp[address].count++;
    }

    for (const v of Object.keys(tmp)) {
      const obj: any = tmp[v];
      obj.value = obj.value || parseInt(obj.valueSat, 10) / this.COIN;
      ret.push(obj);
    }

    return ret;
  }
}
