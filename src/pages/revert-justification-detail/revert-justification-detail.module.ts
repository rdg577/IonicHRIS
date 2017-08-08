import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RevertJustificationDetailPage } from './revert-justification-detail';

@NgModule({
  declarations: [
    RevertJustificationDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(RevertJustificationDetailPage),
  ],
  exports: [
    RevertJustificationDetailPage
  ]
})
export class RevertJustificationDetailModule {}
