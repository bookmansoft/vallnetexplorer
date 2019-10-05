import { Component, Injectable } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { ApiProvider, ChainNetwork } from '../../providers/api/api';
import { RedirProvider } from '../../providers/redir/redir';
import { StockProvider } from '../../providers/stock/stock';

@Injectable()
@IonicPage({
  name: 'stocks',
  segment: ':chain/:network/stocklist/:cid',
  defaultHistory: ['home']
})
@Component({
  selector: 'page-stocks',
  templateUrl: 'stocks.html'
})
export class StocksPage {
  public loading = true;
  public stockAccoutList: any = {};
  public errorMessage: string;

  private cid: string;
  private chainNetwork: ChainNetwork;

  constructor(
    public navParams: NavParams,
    public redirProvider: RedirProvider,
    private apiProvider: ApiProvider,
    private stockProvider: StockProvider,
  ) {
    this.cid = navParams.get('cid');
    const chain: string = navParams.get('chain');
    const network: string = navParams.get('network');

    this.chainNetwork = {
      chain,
      network
    };
    this.apiProvider.changeNetwork(this.chainNetwork);
  }

  public ionViewDidEnter(): void {
    this.stockProvider.getStockAccountList(this.chainNetwork, {cid: this.cid, page: 1}).subscribe(
      data => {
        if(data.list.length > 0){
          this.stockAccoutList = data.list;         
          this.loading = false;
        }
        else{
          this.errorMessage = "无法查询到权证账号信息";
        this.loading = false;
        }
      },
      err => {
        this.errorMessage = err;
        this.loading = false;
      }
    );
  }
}
