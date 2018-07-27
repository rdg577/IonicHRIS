import { Component } from '@angular/core';
import { ViewController, NavParams, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-ptlos-modal',
  templateUrl: 'ptlos-modal.html',
})
export class PtlosModalPage {

   data: any;

   constructor(private view: ViewController, public navParams: NavParams) {
   }

   close() {
      this.view.dismiss();
   }

   ionViewWillLoad() {
      this.data = this.navParams.get("data");
   }

   ionViewDidLoad() {
      console.log('ionViewDidLoad PtlosModalPage');
   }

}
