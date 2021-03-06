import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiProvider, ChainNetwork } from '../../providers/api/api';
import { CurrencyProvider } from '../../providers/currency/currency';

export interface ApiBlockResult {
  blocks : ApiBlock[];
}

export interface ApiBlock {
  height: number;
  nonce: number;
  bits: number;
  size: number;
  confirmations: number;
  hash: string;
  merkleroot: string;
  nextblockhash: string;
  previousblockhash: string;
  transactioncount: number;
  reward: number;
  minedby: string;
  version: number;
  time: Date;
  timeNormalized: Date;
}

export interface AppBlock {
  height: number;
  merkleroot: string;
  nonce: number;
  size: number;
  confirmations: number;
  version: number;
  difficulty: number;
  bits: string;
  virtualSize: number;
  hash: string;
  time: number;
  tx: {
    length: number;
  };
  txlength: number;
  previousblockhash: string;
  nextblockhash: string;
  poolInfo: {
    poolName: string;
    url: string;
  };
  reward: number;
}

@Injectable()
export class BlocksProvider {
  constructor(
    public httpClient: HttpClient,
    public currency: CurrencyProvider,
    private api: ApiProvider
  ) {}

  public toAppBlock(block: ApiBlock): AppBlock {
    const difficulty: number = 0x1d00ffff / block.bits;
    return {
      height: block.height,
      confirmations: block.confirmations,
      nonce: block.nonce,
      size: block.size,
      virtualSize: block.size,
      merkleroot: block.merkleroot,
      version: block.version,
      difficulty,
      bits: block.bits.toString(16),
      hash: block.hash,
      time: new Date(block.time).getTime() / 1000,
      tx: {
        length: block.transactioncount
      },
      txlength: block.transactioncount,
      previousblockhash: block.previousblockhash,
      nextblockhash: block.nextblockhash,
      poolInfo: {
        poolName: block.minedby,
        url: ''
      },
      reward: block.reward
    };
  }

  public getCurrentHeight(chainNetwork: ChainNetwork): Observable<ApiBlock> {
    const heightUrl = `${this.api.getUrlPrefix()}/${chainNetwork.chain}/${
      chainNetwork.network
    }/block-tip`;
    return this.httpClient.get<ApiBlock>(heightUrl);
  }

  public getBlocks(
    chainNetwork: ChainNetwork,
    numBlocks: number = 10
  ): Observable<ApiBlockResult> {
    const url = `${this.api.getUrlPrefix()}/${chainNetwork.chain}/${
      chainNetwork.network
    }/blocks?limit=${numBlocks}`;
    return this.httpClient.get<ApiBlockResult>(url);    
  }

  /**
   * example: http://localhost:8100/api/BTC/regtest/block?since=582&limit=100&paging=height&direction=1
   */
  public pageBlocks(
    since: number,
    numBlocks: number = 10,
    chainNetwork: ChainNetwork
  ): Observable<ApiBlock[]> {
    const url = `${this.api.getUrlPrefix()}/${chainNetwork.chain}/${
      chainNetwork.network
    }/blocks?since=${since}&limit=${numBlocks}&paging=height&direction=-1`;
    return this.httpClient.get<ApiBlock[]>(url);
  }

  public getBlock(
    hash: string,
    chainNetwork: ChainNetwork
  ): Observable<ApiBlock> {
    const url = `${this.api.getUrlPrefix()}/${chainNetwork.chain}/${
      chainNetwork.network
    }/block/${hash}`;
    return this.httpClient.get<ApiBlock>(url);
  }
}
