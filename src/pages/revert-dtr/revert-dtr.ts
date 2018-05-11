import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HrisService } from '../../providers/hris-service';
import { HomePage } from '../home/home';

/**
 * Generated class for the RevertDtr page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-revert-dtr',
  templateUrl: 'revert-dtr.html',
})
export class RevertDtrPage {
  userData: any;
  items: any;
  details: any;
  remarks: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, private hrisService: HrisService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController) {

  }

  action(DtrId, strPeriod, intPeriod, action, approvingEIC) {

    let alert = this.alertCtrl.create(
        {
          title: 'Confirm Return DTR Action',
          message: 'Do you want to continue your action?',
          buttons: [
            { 
               text: 'Cancel', 
               role: 'cancel'
            },
            {
              text: 'Yes, proceed!',
              handler: data => {
                this.remarks = 'DTR is returned as requested.';

                this.hrisService.doDTRReturn(DtrId, strPeriod, intPeriod, action, approvingEIC, this.remarks).subscribe(
                  result => {
                    if(result.dtr_action.has_error) {
                      this.presentToast('Error encountered while returning DTR, please try again.', 3000, 'bottom');
                    } else {
                      this.presentToast('DTR has been returned.', 2000, 'bottom');
                    }
                  },
                  error => {
                    this.presentToast(error, 3000, 'bottom');
                  },
                  () => {

                  }
                );

              }
            }
          ]
        }

      );
      alert.present();
  }
  
  presentToast(message, duration, position) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position
    });

    toast.onDidDismiss(() => {
      this.navCtrl.popTo(HomePage);
    });

    toast.present();
  }

  displayMenu(EIC) {    
    this.hrisService.getDTRRevertRequest(EIC).subscribe(
      result => {
        this.items = result.dtrs;
      },
      error => {
        console.log('displayMenu err: ' + error.err);
      },
      () => {
        console.log((this.items));
      }
    );
  }
  
  ionViewDidEnter() {
    this.storage.get('user').then((value) => {
      this.userData = JSON.parse(value);
      this.displayMenu(this.userData.EIC);
    });
    
  }

}
