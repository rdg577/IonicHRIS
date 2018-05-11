import { Component } from '@angular/core';
import { NavParams, ViewController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-pass-slip-modal',
  templateUrl: 'pass-slip-modal.html',
})
export class PassSlipModalPage {
   data: any;
   constructor(private view: ViewController, private navParams: NavParams) {

   }

   ionViewWillLoad() {
      this.data = this.navParams.get("data")
      console.log(this.data);
      console.log('ionViewWillLoad PassSlipModalPage');
   }

   close() {
      this.view.dismiss();
      console.log('Dismissed');
   }

   ionViewDidLoad() {
      console.log('ionViewDidLoad PassSlipModalPage');
   }

}
