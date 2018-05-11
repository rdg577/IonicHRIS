import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PtlosModalPage } from './ptlos-modal';

@NgModule({
  declarations: [
   PtlosModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PtlosModalPage),
  ],
  exports: [
   PtlosModalPage
  ]
})
export class PassSlipModalModule {}
