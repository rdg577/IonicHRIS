import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PassSlipModalPage } from './pass-slip-modal';

@NgModule({
  declarations: [
    PassSlipModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PassSlipModalPage),
  ],
  exports: [
   PassSlipModalPage
  ]
})
export class PassSlipModalModule {}
