import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as gamegold from 'gamegold-cordova';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiProvider, ChainNetwork } from '../api/api';
import { Logger } from '../logger/logger';

@Injectable()
export class SearchProvider {
  private config: ChainNetwork;
  private apiURL: string;

  constructor(
    private apiProvider: ApiProvider,
    private httpClient: HttpClient,
    private logger: Logger
  ) {}

  public search(
    input: string,
    type: string,
    chainNetwork: ChainNetwork
  ): Observable<any> {
    this.apiURL = `${this.apiProvider.getUrlPrefix()}/${chainNetwork.chain}/${
      chainNetwork.network
    }`;

    switch (type) {
      case 'blockOrTx':
        return Observable.forkJoin(
          this.searchBlock(input).catch(err => Observable.of(err)),
          this.searchTx(input).catch(err => Observable.of(err))
        );
      case 'addr':
        return this.searchAddr(input);
    }
  }

  private searchBlock(block: string): Observable<{ block: any }> {
    return this.httpClient
      .get<{ block: any }>(`${this.apiURL}/block/${block}`)
      .pipe(map(res => ({ block: res })));
  }
  private searchTx(txid: string): Observable<{ tx: any }> {
    return this.httpClient
      .get<{ tx: any }>(`${this.apiURL}/tx/${txid}`)
      .pipe(map(res => ({ tx: res })));
  }
  private searchAddr(addr: string): Observable<{ addr: any }> {
    const address = this.extractAddress(addr);
    return this.httpClient
      .get<{ addr: any }>(`${this.apiURL}/address/${address}`)
      .pipe(map(res => ({ addr: res })));
  }

  public isInputValid(inputValue) {
    if (this.isValidBlockOrTx(inputValue)) {
      return { isValid: true, type: 'blockOrTx' };
    } else if (this.isValidAddress(inputValue)) {
      return { isValid: true, type: 'addr' };
    } else if (this.isValidBlockIndex(inputValue)) {
      return { isValid: true, type: 'blockOrTx' };
    } else {
      return { isValid: false, type: 'invalid' };
    }
  }

  public isValidBlockOrTx(inputValue): boolean {
    const regexp = /^[0-9a-fA-F]{64}$/;
    if (regexp.test(inputValue)) {
      return true;
    } else {
      return false;
    }
  }

  public isValidAddress(inputValue): boolean {
    this.config = this.apiProvider.getConfig();
    const coin = this.config.chain;
    const network = this.config.network;
    const addr = this.extractAddress(inputValue);
    this.logger.info('nav.addr:' +addr); 

    try{
      const address = gamegold.address.fromString(addr); 
      this.logger.info('valid addr'+ JSON.stringify(address));
      return true;
    }
    catch(error){
      this.logger.info("error addr:"+ error)
      return false;
    }

  }

  private isValidBlockIndex(inputValue): boolean {
    return isFinite(inputValue);
  }

  private extractAddress(address: string): string {
    const extractedAddress = address
      .replace(/^(gamegold:)/i, '')
      .replace(/\?.*/, '');
    return extractedAddress || address;
  }
}
