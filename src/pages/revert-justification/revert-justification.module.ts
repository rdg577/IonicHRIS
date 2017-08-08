import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RevertJustificationPage } from './revert-justification';

@NgModule({
  declarations: [
    RevertJustificationPage,
  ],
  imports: [
    IonicPageModule.forChild(RevertJustificationPage),
  ],
  exports: [
    RevertJustificationPage
  ]
})
export class RevertJustificationModule {}
