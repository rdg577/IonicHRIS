import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JustificationPage } from './justification';

@NgModule({
  declarations: [
    JustificationPage,
  ],
  imports: [
    IonicPageModule.forChild(JustificationPage),
  ],
  exports: [
    JustificationPage
  ]
})
export class JustificationModule {}
