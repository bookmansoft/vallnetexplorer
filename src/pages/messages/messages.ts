import { Component, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavParams } from 'ionic-angular';
import { ApiProvider, ChainNetwork } from '../../providers/api/api';
import { CurrencyProvider } from '../../providers/currency/currency';
import { PriceProvider } from '../../providers/price/price';
import { SearchProvider } from '../../providers/search/search';


@Injectable()
@IonicPage({
  name: 'messages',
  segment: ':chain/:network/verify-message',
  defaultHistory: ['home']
})
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html'
})
export class MessagesPage {
  public messageForm: FormGroup;
  public error: string;
  public success: string;

  private chainNetwork: ChainNetwork;

  constructor(
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    private apiProvider: ApiProvider,
    private priceProvider: PriceProvider,
    private currencyProvider: CurrencyProvider,
    private searchProvider: SearchProvider
  ) {
    const chain: string = navParams.get('chain');
    const network: string = navParams.get('network');

    this.chainNetwork = {
      chain,
      network
    };
    this.apiProvider.changeNetwork(this.chainNetwork);
    this.currencyProvider.setCurrency(this.chainNetwork);
    this.priceProvider.setCurrency();

    this.messageForm = formBuilder.group({
      address: [
        '',
        Validators.compose([Validators.minLength(1), Validators.required])
      ],
      signature: [
        '',
        Validators.compose([Validators.minLength(1), Validators.required])
      ],
      message: [
        '',
        Validators.compose([Validators.minLength(1), Validators.required])
      ]
    });
  }

  public verify(): void {
    this.success = this.error = null;
    const values = this.messageForm.value;
    if (!this.isAddressValid(values.address)) {
      this.error = 'Invalid Address';
      return;
    }
  }

  private isAddressValid(addr): boolean {    
    return this.searchProvider.isValidAddress(addr);
  }
}
