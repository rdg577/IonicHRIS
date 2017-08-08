import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PassslipPage } from './passslip';

@NgModule({
  declarations: [
    PassslipPage,
  ],
  imports: [
    IonicPageModule.forChild(PassslipPage),
  ],
  exports: [
    PassslipPage
  ]
})
export class PassslipModule {}
