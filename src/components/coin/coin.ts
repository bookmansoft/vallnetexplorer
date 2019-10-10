import { Component, Input } from '@angular/core';
import { ApiProvider, ChainNetwork } from '../../providers/api/api';
import { CurrencyProvider } from '../../providers/currency/currency';
import { RedirProvider } from '../../providers/redir/redir';
import { TxsProvider } from '../../providers/transactions/transactions';

@Component({
  selector: 'coin',
  templateUrl: 'coin.html'
})
export class CoinComponent {
  @Input()
  public coin;
  @Input()
  public chainNetwork: ChainNetwork;
  @Input()
  public currentHeight: number;

  public confirmations: number;

  constructor(
    public apiProvider: ApiProvider,
    public currencyProvider: CurrencyProvider,
    public redirProvider: RedirProvider,
    public txProvider: TxsProvider
  ) {}

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.getConfirmations();
  }

  public getConfirmations() {
    this.confirmations = this.coin.height? this.currentHeight-this.coin.height+1 : 0;
  }

  public goToTx(txId: string): void {
    this.redirProvider.redir('transaction', {
      txId,
      chain: this.chainNetwork.chain,
      network: this.chainNetwork.network
    });
  }
}
