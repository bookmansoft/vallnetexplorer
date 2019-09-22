import { Component, Injectable } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { ApiProvider, ChainNetwork } from '../../providers/api/api';
import { CpsProvider } from '../../providers/custcom-producers/custom-producers';
import { RedirProvider } from '../../providers/redir/redir';

@Injectable()
@IonicPage({
  name: 'custom-producer',
  segment: ':chain/:network/cp/:cpId',
  defaultHistory: ['home']
})
@Component({
  selector: 'page-custom-producer',
  templateUrl: 'custom-producer.html'
})
export class CustomProducerPage {
  public loading = true;
  public cp: any = {};
  public confirmations: number;
  public errorMessage: string;

  private cpId: string;
  private chainNetwork: ChainNetwork;

  constructor(
    public navParams: NavParams,
    public redirProvider: RedirProvider,
    private apiProvider: ApiProvider,
    private cpsProvider: CpsProvider,
  ) {
    this.cpId = navParams.get('cpId');
    const chain: string = navParams.get('chain');
    const network: string = navParams.get('network');

    this.chainNetwork = {
      chain,
      network
    };
    this.apiProvider.changeNetwork(this.chainNetwork);
  }

  public ionViewDidEnter(): void {
    this.cpsProvider.getCp(this.cpId, this.chainNetwork).subscribe(
      data => {     
        this.cp = data;
        this.loading = false;
      },
      err => {
        this.errorMessage = err;
        this.loading = false;
      }
    );
  }
}
