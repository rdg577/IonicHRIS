import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HrisService } from '../../providers/hris-service';

import { HomePage } from '../home/home';
/**
 * Generated class for the Passslip page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-passslip',
  templateUrl: 'passslip.html',
})
export class PassslipPage {
  userData: any;
  items: any;
  checkboxPassSlipTypes: any;

  constructor(public navCtrl: NavController, private storage: Storage,
              public navParams: NavParams, private toastCtrl: ToastController,
              public hrisService: HrisService) {
                
    this.checkboxPassSlipTypes = {};

  }

  isOfficial(tag) {
    return tag == 2 ? true : false;
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

  action(recNo, statusId, isOfficial) {
    var tag : any;

    if(isOfficial) {
      tag = 2;
    } else {
      tag = 1;
    }

    this.hrisService.doPassSlipApproval(recNo, statusId, tag).subscribe(
      result => {
        if(result.pass_slip_approval.statusId == 1) {
          this.presentToast("Approved!", 2000, "bottom");
        }
        if(result.pass_slip_approval.statusId == 2) {
          this.presentToast("Disapproved!", 2000, "bottom");
        }
        if(result.pass_slip_approval.statusId == 3) {
          this.presentToast("Cancelled!", 2000, "bottom");
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
    this.hrisService.getPassSlipForApproval(EIC).subscribe(
      result => {
        this.items = result.pass_slip_detail;
        // set the checkboxPassSlipTypes
        for(let i = 0; i < this.items.length; i++) {
          this.checkboxPassSlipTypes[i] = this.items[i].isOfficial == 2 ? true : false;
          // console.log(this.checkboxPassSlipTypes[i]);
        }
      },
      error => {
        console.log('displayMenu err: ' + error.err);
      },
      () => {
        // console.log(this.items);
      }
    );
  } 

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
  }

  ionViewDidEnter() {
    this.storage.get('user').then((value) => {
      this.userData = JSON.parse(value);
      this.displayMenu(this.userData.EIC);
    });
    
  }

}
