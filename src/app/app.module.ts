import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from 'ionic-angular';
import { BlocksPage, HomePage, PagesModule } from '../pages';
import { AddressProvider } from '../providers/address/address';
import { ApiProvider } from '../providers/api/api';
import { BlocksProvider } from '../providers/blocks/blocks';
import { CurrencyProvider } from '../providers/currency/currency';
import { CpsProvider } from '../providers/custcom-producers/custom-producers';
import { DefaultProvider } from '../providers/default/default';
import { HttpErrorInterceptor } from '../providers/error-handler/error-handler';
import { Logger } from '../providers/logger/logger';
import { PriceProvider } from '../providers/price/price';
import { PropProvider } from '../providers/property/property';
import { RedirProvider } from '../providers/redir/redir';
import { HttpResultInterceptor } from '../providers/result-handler/result-handler';
import { SearchProvider } from '../providers/search/search';
import { StockProvider } from '../providers/stock/stock';
import { TxsProvider } from '../providers/transactions/transactions';
import { InsightApp } from './app.component';

@NgModule({
  declarations: [InsightApp],
  imports: [
    BrowserModule,
    HttpClientModule,
    PagesModule,
    IonicModule.forRoot(InsightApp, {
      mode: 'md',
      animate: false
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [InsightApp, HomePage, BlocksPage],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpResultInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    ApiProvider,
    CurrencyProvider,
    BlocksProvider,
    CpsProvider,
    TxsProvider,
    DefaultProvider,
    PriceProvider,
    SearchProvider,
    RedirProvider,
    Logger,
    AddressProvider,
    PropProvider,
    StockProvider
  ]
})
export class AppModule {}
