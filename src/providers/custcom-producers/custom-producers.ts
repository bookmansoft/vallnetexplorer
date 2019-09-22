import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiProvider, ChainNetwork } from '../api/api';
import { CurrencyProvider } from '../currency/currency';

export interface CpCurrent {
  hash: string;
  index: number;
  address: string;
}

export interface CpStock {
  hHeight: number;
  hSum: number;
  hPrice: number;
  hBonus: number;
  hAds: number;
  sum: number;
  price: number;
  height: number;
}

export interface ApiCp {
  cid: string;
  name: string;
  url: string;
  ip: string;
  cls: string;
  grant: number;
  current: CpCurrent;  
  stock: CpStock;
  status: number;
  owned: boolean;
}

export interface ResultCps {
  cur: number;
  page: number;
  cps: ApiCp[];
}


export interface AppCp {  
}

@Injectable()
export class CpsProvider {
  constructor(
    public httpClient: HttpClient,
    public currency: CurrencyProvider,
    private apiProvider: ApiProvider
  ) {}
  
  public toAppCp(cp: ApiCp): AppCp {
    return {
      
    };
  }  

  public getCps(
    chainNetwork: ChainNetwork,
    args?: { page?: number }
  ): Observable<ResultCps> {
    let queryString = '';
    if (args.page) {
      queryString += `?page=${args.page}`;
    }
    const url = `${this.apiProvider.getUrlPrefix()}/${chainNetwork.chain}/${
      chainNetwork.network
    }/cpss/${queryString}`;
    return this.httpClient.get<ResultCps>(url);
  }

  public getCp(cpid: string, chainNetwork: ChainNetwork): Observable<ApiCp> {
    const url = `${this.apiProvider.getUrlPrefix()}/${chainNetwork.chain}/${
      chainNetwork.network
    }/cp/${cpid}`;
    return this.httpClient.get<ApiCp>(url);
  }
  
}
