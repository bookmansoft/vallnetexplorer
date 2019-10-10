import { Component, Input, OnInit } from '@angular/core';
import { Events } from 'ionic-angular';
import _ from 'lodash';
import { AddressProvider } from '../../providers/address/address';
import { ChainNetwork } from '../../providers/api/api';
import { BlocksProvider} from '../../providers/blocks/blocks';
import { Logger } from '../../providers/logger/logger';
import { TxsProvider } from '../../providers/transactions/transactions';

@Component({
  selector: 'coin-list',
  templateUrl: 'coin-list.html'
})
export class CoinListComponent implements OnInit {
  @Input()
  public addrStr?: string;
  @Input()
  public chainNetwork: ChainNetwork;

  public txs: any = [];
  public coins: any = [];
  public showTransactions: boolean;
  public loadingTx: boolean;
  public loadingHeight: boolean;
  public limit = 100;
  public chunkSize = 100;
  public currentHeight = 0;

  constructor(
    private addrProvider: AddressProvider,
    private blocksProvider: BlocksProvider,
    private txsProvider: TxsProvider,
    private events: Events,
    private logger: Logger,
  ) {}

  public ngOnInit(): void {
    if (this.txs && this.txs.length === 0) {
      this.loadingTx = true;
      this.loadingHeight = true;
      // 增加获取当前块高度
      this.blocksProvider.getCurrentHeight(this.chainNetwork).subscribe(data => {
        this.currentHeight =  data.height;
        this.loadingHeight = false;
      });
      this.addrProvider.getAddressActivity(this.addrStr, this.chainNetwork).subscribe(
        data => {
          const formattedData = data.map(this.txsProvider.toAppCoin);
          this.txs = this.processData(formattedData);
          this.showTransactions = true;
          this.loadingTx = false;
          this.events.publish('CoinList', { length: data.length });
        },
        () => {
          this.loadingTx = false;
          this.showTransactions = false;
        }
      );
    }
    
  }

  processData(data) {
    const txs = [];
    data.forEach(tx => {
      const { mintHeight, mintTxid, value, spentHeight, spentTxid } = tx;
      // 目前
      // txs.push({ height: spentHeight, spentTxid, value });
      txs.push({ height: mintHeight, mintTxid, value });
    });
    return txs;
  }

  public loadMore(infiniteScroll) {
    this.limit += this.chunkSize;
    // this.chunkSize *= 2;
    infiniteScroll.complete();
  }
  
}
