import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Badge } from '@ionic-native/badge';
import { Storage } from '@ionic/storage';

import { HrisService } from '../../providers/hris-service';

import { LoginPage } from '../login/login';
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
  totalApplications: any;

  constructor(private storage: Storage,
              public navCtrl: NavController, 
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private hrisService: HrisService,
              private localNotifications: LocalNotifications,
              private badge: Badge) {


  }

  logout() {
    // confirm the user's action
    let confirm = this.alertCtrl.create({
      title: 'Log out?',
      message: 'Do you really want to log out?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {            
            // reset badge
            this.badge.clear().catch( exception => console.log(exception)).then(() => console.log("Badge is clear..."));
            // turn off local notifications
            this.localNotifications.clearAll();
            this.localNotifications.cancelAll();
            // clear storage
            this.storage.clear();
            // route
            this.navCtrl.setRoot(LoginPage, null, null, () => {
              this.presentAlert("Log-out", "Thank you working with us!");
              this.navCtrl.popToRoot();
            });
          }
        }
      ]
    });
    confirm.present();
  }

  forcedRefresh() {
    this.displayMenu(this.userData.EIC);
  }


  doRefresh(refresher) {
    this.displayMenu(this.userData.EIC);
    refresher.complete(); 
    /* setTimeout(()=> { 
      this.displayMenu(this.userData.EIC);
      refresher.complete(); 
      }, 
      3000
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

    this.hrisService.getMenus(EIC).subscribe(
      result => {
        this.loading.present();

        this.items = result;

        this.totalApplications = 0;
        this.items.forEach(element => {
          this.totalApplications += element.TotalApplications;
        });
        // display the badge and notify user when there is an application
        if(this.totalApplications > 0) {
          this.badge.set(this.totalApplications).catch( exception => console.log(exception)).then(() => console.log("Launcher Badge success: " + this.totalApplications));
          this.localNotifications.schedule({
            id: 57,
            title: 'HRIS',
            text: 'Total applications that needs your attention: ' + this.totalApplications,
            every: 'hour',
            at: new Date( new Date().getTime() + 2 * 1000 )
          });
        } else {
          this.localNotifications.clearAll();
          this.localNotifications.cancelAll();
          this.badge.clear();
        }

      },
      error => {
        console.log('displayMenu error: ' + error);

        this.loading.dismiss();
      },
      () => {
        console.log(this.items);

        this.loading.dismiss();
      }
    );
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
    this.storage.get('user').then((value) => {
      this.userData = JSON.parse(value);
      this.displayMenu(this.userData.EIC);
      console.log(this.userData);
    });
  }

  ionViewDidLoad() {   
  }

  ionViewDidEnter() {
  }

}
