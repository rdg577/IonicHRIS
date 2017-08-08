import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JustificationDetailPage } from './justification-detail';

@NgModule({
  declarations: [
    JustificationDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(JustificationDetailPage),
  ],
  exports: [
    JustificationDetailPage
  ]
})
export class JustificationDetailModule {}
