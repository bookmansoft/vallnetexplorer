import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ErrorComponentModule } from '../../components/error/error.module';
import { FooterComponentModule } from '../../components/footer/footer.module';
import { HeadNavComponentModule } from '../../components/head-nav/head-nav.module';
import { LoaderComponentModule } from '../../components/loader/loader.module';
import { CopyToClipboardModule } from '../../directives/copy-to-clipboard/copy-to-clipboard.module';
import { PropertyPage } from './property';

@NgModule({
  declarations: [PropertyPage],
  imports: [
    IonicPageModule.forChild(PropertyPage),
    FooterComponentModule,
    HeadNavComponentModule,
    LoaderComponentModule,
    ErrorComponentModule,
    CopyToClipboardModule
  ],
  exports: [PropertyPage]
})
export class PropertyPageModule {}
