import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiProvider, ChainNetwork } from '../api/api';
import { CurrencyProvider } from '../currency/currency';

export interface StockBid {
  sum: number;
  price: number;
  period: number;  
}

export interface ApiStockAccount { 
  cid: string;   // 厂商ID
  addr: string;  // 权证地址
  sum: number;   // 拥有的权证数量
  price: number; // 权证平均成本 
  seq: number;   // 当前权证交易序号
  stock : StockBid; // 账号凭证拍卖信息
}

export interface ResultStockAccount {
  count: number;  // 道具总数
  page: number;   // 总页数
  cur: number;    // 当前页数
  countCur: number;    // 每页数量
  list: ApiStockAccount[];  // 结果数组
}

export interface ApiStockItem {
  height: number; // 产生高度
  txid: string;  // 对应的交易Id
  type: number;  // 权证交易类型  
  cid: string;   // 厂商ID 
  sum: number;   // 交易的权证数量
  addr: string;  // 权证地址
  to: string;    // 交易对手权证地址
  price: number; // 权证成本 
  seq: number;   // 当前权证交易序号
  sn : number;   // 权证序号(随机)
}

export interface ResultStockItem {
  count: number;  // 道具总数
  page: number;   // 总页数
  cur: number;    // 当前页数
  countCur: number;    // 每页数量
  list: ApiStockItem[];  // 结果数组
}

// App可能需要给StockAccount,StockItem增加其他属性,目前没有,所以是空机构
// export interface AppStockAccount {  
// }

@Injectable()
export class StockProvider {
  constructor(
    public httpClient: HttpClient,
    public currency: CurrencyProvider,
    private apiProvider: ApiProvider
  ) {}
  
  // public toAppStockAccount(stockAccount: ApiStockAccount): AppStockAccount {
  //   return {      
  //   };
  // }  

  /**
   * 根据Cid查询拥有权证的账号列表
   * @param chainNetwork 
   * @param args 查询条件对象
   */
  public getStockAccountList(
    chainNetwork: ChainNetwork,
    args?: { page?: number, cid?: string}
  ): Observable<ResultStockAccount> {
    let queryString = '';    
    if (args.page) {
      queryString += `?page=${args.page}`;
    }
    if (args.cid) {
      queryString += `?cid=${args.cid}`;
    }    
    const url = `${this.apiProvider.getUrlPrefix()}/${chainNetwork.chain}/${
      chainNetwork.network
    }/stock/holder?${queryString}`;
    return this.httpClient.get<ResultStockAccount>(url);
  }

  /**
   * 根据Cid查询权证交易记录
   * @param chainNetwork 
   * @param args 查询条件对象
   */
  public getStockItemList( 
    chainNetwork: ChainNetwork,
    args?: { page?: number, cid?: string, type?: string}
    ): Observable<ResultStockItem> {
    let queryString = '';    
    if (args.page) {
      queryString += `?page=${args.page}`;
    }
    if (args.cid) {
      queryString += `?cid=${args.cid}`;
    }   
    if (args.type) {
      queryString += `?type=${args.type}`;
    } 
    const url = `${this.apiProvider.getUrlPrefix()}/${chainNetwork.chain}/${
      chainNetwork.network
    }/stock/record?${queryString}`;
    return this.httpClient.get<ResultStockItem>(url);
  }
  
}
