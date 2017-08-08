import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HrisService } from '../../providers/hris-service';

import { HomePage } from '../home/home';

/**
 * Generated class for the Ptlos page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-ptlos',
  templateUrl: 'ptlos.html',
})
export class PtlosPage {
  userData: any;
  items: any;

  constructor(public navCtrl: NavController, 
    private storage: Storage,
    private hrisService: HrisService,
    private toastCtrl: ToastController,
    public navParams: NavParams) {

  }

  action(recNo, tag) {
    this.hrisService.doPtlosApproval(recNo, tag).subscribe(
      result => {
        if(result.ptlos_approval.tag == 5) {
          this.presentToast("Approved!", 2000, "bottom");
        }
        if(result.ptlos_approval.tag == 6) {
          this.presentToast("Disapproved!", 2000, "bottom");
        }
        if(result.ptlos_approval.tag == 0) {
          this.presentToast("Returned!", 2000, "bottom");
        }
      },
      error => {
        this.presentToast("Error: " + error.err, 3000, "bottom");
      },
      () => {
        
      }
    );
  }
  
  displayMenu(EIC) {    
    this.hrisService.getPtlosForApproval(EIC).subscribe(
      result => {
        this.items = result.ptlos_detail;
      },
      error => {
        console.log('displayMenu err: ' + error.err);
      },
      () => {
        console.log(this.items);
      }
    );
  } 

  presentToast(message, duration, position) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position
    });

    toast.onDidDismiss(() => {
      this.navCtrl.setRoot(HomePage, null, null, () => {
        this.navCtrl.popToRoot();
      });
    });

    toast.present();
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.storage.get('user').then((value) => {
      this.userData = JSON.parse(value);
      this.displayMenu(this.userData.EIC);
    });
    
  }

}
