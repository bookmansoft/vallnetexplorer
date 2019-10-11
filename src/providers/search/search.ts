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
      case 'cpOrProp':
        return Observable.forkJoin(
          this.searchCp(input).catch(err => Observable.of(err)),
          this.searchProp(input).catch(err => Observable.of(err))
        );
      case 'stockProp':
        return this.searchProp(input);
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
      .get<{ addr: any }>(`${this.apiURL}/addr/${address}`)
      .pipe(map(res => ({ addr: res })));
  }
  private searchCp(cpId: string): Observable<{ cp: any }> {    
    return this.httpClient
      .get<{ cp: any }>(`${this.apiURL}/cp/${cpId}`)
      .pipe(map(res => ({ cp: res })));
  }
  private searchProp(propId: string): Observable<{ propResult: any }> {    
    return this.httpClient
      .get<{ propResult: any }>(`${this.apiURL}/props/query?pid=${propId}`)
      .pipe(map(res => ({ propResult: res })));
  }

  public isInputValid(inputValue) {
    if (this.isValidBlockOrTx(inputValue)) {
      return { isValid: true, type: 'blockOrTx' };
    } else if (this.isValidAddress(inputValue)) {
      return { isValid: true, type: 'addr' };
    } else if (this.isValidBlockIndex(inputValue)) {
      return { isValid: true, type: 'blockOrTx' };
    } else if (this.isValidCpOrProp(inputValue)) { 
      return { isValid: true, type: 'cpOrProp' }; 
    } else if (this.isValidStockProp(inputValue)) { 
      return { isValid: true, type: 'stockProp' }; 
    } else {
      return { isValid: false, type: 'invalid' };
    }
  }
  // 对search框校验是否是块Hash或校验Hash
  public isValidBlockOrTx(inputValue): boolean {
    const regexp = /^[0-9a-fA-F]{64}$/;
    if (regexp.test(inputValue)) {
      return true;
    } else {
      return false;
    }
  }
  // 对search框校验是否是地址
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
  // 对search框校验是否是生产商或普通道具
  private isValidCpOrProp(inputValue): boolean {
    const regexp = /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/;
    return regexp.test(inputValue);
  }
  // 对search框校验是否是权证道具
  private isValidStockProp(inputValue): boolean {
    const reg = /^\w{11}-\w{4}-\w{4}-\w{4}-\w{3}"$/;
    return reg.test(inputValue);
  }
  // 对search框校验是否是纯数字-块高度
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
