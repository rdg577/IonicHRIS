import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RevertDtrPage } from './revert-dtr';

@NgModule({
  declarations: [
    RevertDtrPage,
  ],
  imports: [
    IonicPageModule.forChild(RevertDtrPage),
  ],
  exports: [
    RevertDtrPage
  ]
})
export class RevertDtrModule {}
