import { Component, Injectable } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';
import { ApiProvider, ChainNetwork } from '../../providers/api/api';
import { PropProvider } from '../../providers/property/property';
import { RedirProvider } from '../../providers/redir/redir';

@Injectable()
@IonicPage({
  name: 'property',
  segment: ':chain/:network/prop/:pid',
  defaultHistory: ['home']
})
@Component({
  selector: 'page-property',
  templateUrl: 'property.html'
})
export class PropertyPage {
  public loading = true;
  public prop: any = {};
  public errorMessage: string;

  private pid: string;
  private chainNetwork: ChainNetwork;

  constructor(
    public navParams: NavParams,
    public redirProvider: RedirProvider,
    private apiProvider: ApiProvider,
    private propProvider: PropProvider,
  ) {
    this.pid = navParams.get('pid');
    const chain: string = navParams.get('chain');
    const network: string = navParams.get('network');

    this.chainNetwork = {
      chain,
      network
    };
    this.apiProvider.changeNetwork(this.chainNetwork);
  }

  public ionViewDidEnter(): void {
    this.propProvider.getProp(this.pid, this.chainNetwork).subscribe(
      data => {
        if(data.list.length > 0){
          this.prop = data.list[0];
          this.loading = false;
        }
        else{
          this.errorMessage = "无法查询到道具信息";
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
