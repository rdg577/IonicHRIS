import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { HrisService } from '../../providers/hris-service';

import { PassslipPage } from '../passslip/passslip';
import { PtlosPage } from '../ptlos/ptlos';
import { JustificationPage } from '../justification/justification';
import { RevertJustificationPage } from '../revert-justification/revert-justification';
import { RevertDtrPage } from '../revert-dtr/revert-dtr';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  loading: any;
  items: Array<any>;
  userData: any;

  constructor(private storage: Storage,
              public navCtrl: NavController, 
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private hrisService: HrisService) {

  }


  doRefresh(refresher) {
    this.displayMenu(this.userData.EIC);
    refresher.complete();

    /* setTimeout(()=> { 
      refresher.complete(); 
      }, 
      4000
    ); */
  }

  gotoPage(id) {
    switch(id) {
      case 1:
        this.navCtrl.push(PassslipPage);
        break;
      case 2:
        this.navCtrl.push(PtlosPage);
        break;
      case 3:
        this.navCtrl.push(JustificationPage);
        break;
      case 4:
        this.navCtrl.push(RevertJustificationPage);
        break;
      case 5:
        this.navCtrl.push(RevertDtrPage);
        break;
    }
  }

  displayMenu(EIC) {

    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    this.loading.present();

    this.hrisService.getMenus(EIC).subscribe(
      result => {
        this.items = result;
      },
      error => {
        console.log('displayMenu error: ' + error);
      },
      () => {
      }
    );

    this.loading.dismiss();
  } 

  presentAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  ionViewWillEnter() {
  }

  ionViewDidLoad() {   
  }

  ionViewDidEnter() {
    this.storage.get('user').then((value) => {
      this.userData = JSON.parse(value);
      this.displayMenu(this.userData.EIC);
      // console.log(this.userData);
    });
    
  }

}
