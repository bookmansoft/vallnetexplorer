import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiProvider, ChainNetwork } from '../../providers/api/api';
import { CurrencyProvider } from '../../providers/currency/currency';
import { BlocksProvider } from '../blocks/blocks';

// 并未调用CoinAPI
interface CoinsApiResponse {
  inputs: ApiCoin[];
  outputs: ApiCoin[];
}
export interface ResultTxs {
  pagesTotal: number;
  txs: AppTx[];
}
// 不用目前都是直接返回APPTx
export interface ApiTx {
  address: string;
  chain: string;
  network: string;
  txid: string;
  blockHeight: number;
  blockHash: string;
  blockTime: Date;
  blockTimeNormalized: Date;
  coinbase: boolean;
  size: number;
  confirmations: number;
  locktime: number;
  inputs: ApiCoin[];
  outputs: ApiCoin[];
  mintTxid: string;
  mintHeight: number;
  spentTxid: string;
  spentHeight: number;
  value: number;
  version: number;
}

export interface ApiCoinOld {
  txid: string;
  mintTxid: string;
  coinbase: boolean;
  vout: number;
  address: string;
  script: {
    asm: string;
    type: string;
  };
  spentTxid: string;
  mintHeight: number;
  spentHeight: number;
  value: number;
}

export interface ApiCoin {
  txid: string; 
  vout: number;
  address: string;
  scriptPubKey: string;
  amount: number;
  satoshis: number;
  height: number;
  confirmations: number;  
}

export interface AppCoin {
  txid: string;
  valueOut: number;
  value: number;
  spentTxid: string;
  mintTxid: string;
  mintHeight: number;
  spentHeight: number;
}

export interface AppInput {
  coinbase: boolean;
  sequence: number;
  n: number;
  txid: string;
  vout: number;
  scriptSig: {
    hex: string;
    asm: string;
    addresses: string[];
    type: string;
  };
  addr: string;
  valueSat: number;
  value: number;
  doubleSpentTxID: string;
  isConfirmed: boolean;
  confirmations: number;
  unconfirmedInput: string;
}

export interface AppOutput {
  value: number;
  n: number;
  scriptPubKey: {
    hex: string;
    asm: string;
    addresses: string[];
    type: string;
  };
  spentTxId: null;
  spentIndex: null;
  spentHeight: null;
}

export interface AppTx {
  txid: string;
  blockhash: string;
  version: number;
  locktime: number;
  isCoinBase: boolean;
  vin: AppInput[];
  vout: AppOutput[];
  confirmations: number;
  time: number;
  valueOut: number;
  size: number;
  fee: number;
  blockheight: number;
  blocktime: number;
  clsData: any;
}

@Injectable()
export class TxsProvider {
  constructor(
    public httpClient: HttpClient,
    public currency: CurrencyProvider,
    public blocksProvider: BlocksProvider,
    private apiProvider: ApiProvider
  ) {}

  public getFee(tx: AppTx): number {
    const sumSatoshis: any = (arr: any): number =>
      arr.reduce((prev, cur) => prev + cur.value, 0);
    const inputs: number = sumSatoshis(tx.vin);
    const outputs: number = sumSatoshis(tx.vout);
    const fee: number = tx.isCoinBase ? 0 : inputs - outputs;
    return fee;
  }

  // 实际并没有调用,目前直接返回AppTx
  public toAppTx(tx: ApiTx): AppTx {
    return {
      txid: tx.txid,
      fee: null, // calculated later, when coins are retrieved
      blockheight: tx.blockHeight,
      confirmations: tx.confirmations,
      blockhash: tx.blockHash,
      blocktime: new Date(tx.blockTime).getTime() / 1000,
      time: new Date(tx.blockTime).getTime() / 1000,
      isCoinBase: tx.coinbase,
      size: tx.size,
      locktime: tx.locktime,
      vin: [], // populated when coins are retrieved
      vout: [], // populated when coins are retrieved
      valueOut: tx.value,
      version: tx.version,
      clsData: null
    };
  }

  // 注意,目前没有返回coin的花费信息
  public toAppCoin(coin: ApiCoin): AppCoin {
    return {
      txid: coin.txid,
      mintTxid: coin.txid,
      mintHeight: coin.height,
      spentHeight: 0,
      valueOut: coin.vout,
      value: coin.amount,
      spentTxid: null
    };
  }

  public getTxs(
    chainNetwork: ChainNetwork,
    args?: { blockHash?: string }
  ): Observable<ResultTxs> {
    let queryString = '';
    if (args.blockHash) {
      queryString += `?blockHash=${args.blockHash}`;
    }
    const url = `${this.apiProvider.getUrlPrefix()}/${chainNetwork.chain}/${
      chainNetwork.network
    }/txs/${queryString}`;
    return this.httpClient.get<ResultTxs>(url);
  }

  public getTx(hash: string, chainNetwork: ChainNetwork): Observable<AppTx> {
    const url = `${this.apiProvider.getUrlPrefix()}/${chainNetwork.chain}/${
      chainNetwork.network
    }/tx/${hash}`;
    return this.httpClient.get<AppTx>(url);
  }

  // 目前不提供这个方法
  // public getCoins(
  //   txId: string,
  //   chainNetwork: ChainNetwork
  // ): Observable<CoinsApiResponse> {
  //   const url = `${this.apiProvider.getUrlPrefix()}/${chainNetwork.chain}/${
  //     chainNetwork.network
  //   }/tx/${txId}/coins`;
  //   return this.httpClient.get<CoinsApiResponse>(url);
  // }

  public getConfirmations(
    blockheight: number,
    chainNetwork: ChainNetwork
  ): Observable<number> {
    return this.blocksProvider.getCurrentHeight(chainNetwork).map(data => {
      return blockheight > 0 ? data.height - blockheight + 1 : blockheight;
    });
  }
}
