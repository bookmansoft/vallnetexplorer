import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiProvider, ChainNetwork } from '../api/api';
import { CurrencyProvider } from '../currency/currency';

export interface PropBid {
  raw: string;
  fixed: number;
  period: number;
  hash: string;
  value: number;
  address: string;
}

export interface PropCurrent {
  hash: string;
  index: number;
  address: string;
}

export interface ApiProp {
  pid: string;  // 道具ID
  cid: string;  // 厂商ID
  oid: string;  // 订单ID(厂商权证时等于CID)
  gold: number;
  current: PropCurrent;  
  height: number;
  pst: number;  // 状态
  wid: number;  // 钱包序号,浏览器始终为0
  account: string; // 账号名,浏览器始终未空
  bid: PropBid // 拍卖信息
}

export interface ResultProps {
  count: number;  // 道具总数
  page: number;   // 总页数
  cur: number;    // 当前页数
  countCur: number;    // 每页数量
  list: ApiProp[];  // 结果数组
}

// App可能需要给Prop增加其他属性,目前没有,所以是空机构
// export interface AppProp {  
// }

@Injectable()
export class PropProvider {
  constructor(
    public httpClient: HttpClient,
    public currency: CurrencyProvider,
    private apiProvider: ApiProvider
  ) {}
  
  // public toAppProp(prop: ApiProp): AppProp {
  //   return {      
  //   };
  // }  

  public getPropList(
    chainNetwork: ChainNetwork,
    args?: { page?: number, cid?: string, addr?: string}
  ): Observable<ResultProps> {
    let queryString = '';    
    if (args.page) {
      queryString += `?page=${args.page}`;
    }
    if (args.cid) {
      queryString += `?cid=${args.cid}`;
    }
    if (args.cid) {
      queryString += `?addr=${args.addr}`;
    }
    const url = `${this.apiProvider.getUrlPrefix()}/${chainNetwork.chain}/${
      chainNetwork.network
    }/props/query?${queryString}`;
    return this.httpClient.get<ResultProps>(url);
  }

  /**
   * 根据Pid查询道具
   * @param pid 道具ID
   * @param chainNetwork 
   */
  public getProp(pid: string, chainNetwork: ChainNetwork): Observable<ResultProps> {
    const url = `${this.apiProvider.getUrlPrefix()}/${chainNetwork.chain}/${
      chainNetwork.network
    }/props/query?pid=${pid}`;
    return this.httpClient.get<ResultProps>(url);
  }
  
}
