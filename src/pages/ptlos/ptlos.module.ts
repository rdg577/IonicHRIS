import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PtlosPage } from './ptlos';

@NgModule({
  declarations: [
    PtlosPage,
  ],
  imports: [
    IonicPageModule.forChild(PtlosPage),
  ],
  exports: [
    PtlosPage
  ]
})
export class PtlosModule {}
