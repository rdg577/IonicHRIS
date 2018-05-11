import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, IonicPage, ModalController, ToastController } from 'ionic-angular';
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
import { PassSlipModalPage } from '../pass-slip-modal/pass-slip-modal';
import { PtlosModalPage } from '../ptlos-modal/ptlos-modal';
import { HrisActionsService } from '../../providers/hris-actions/hris-actions';

@IonicPage()
@Component({
      selector: 'page-home',
      templateUrl: 'home.html'
})
export class HomePage {
      loading: any;
      items: Array<any>;
      userData: any;
      totalApplications: any;

      DTRs: any[];
      PassSlips: any[];
      Justifications: any[];
      PTLOS: any[];

      constructor(private storage: Storage,
                  private navCtrl: NavController, 
                  private alertCtrl: AlertController,
                  private toastCtrl: ToastController,
                  private loadingCtrl: LoadingController,
                  private localNotifications: LocalNotifications,
                  private modal: ModalController,
                  private badge: Badge,
                  private hrisService: HrisService,
                  private hrisActions: HrisActionsService) {


      }


      returnDTRAll(item) {
            let confirm = this.alertCtrl.create(
                  {
                  title: 'Confirm Return All DTR Action',
                  message: 'Do you want to continue your action?',
                  buttons: [
                        { 
                              text: 'Cancel', 
                              role: 'cancel'
                        },
                        {
                              text: 'Yes, All DTR!',
                              handler: (data) => {
                                    let dtrs = item.details;
                                    let index = this.DTRs.indexOf(item);

                                    this.hrisActions.returnDTRAll(dtrs).then(
                                          (value)=> {
                                                confirm.dismiss();
                                                let removedItem = this.DTRs.splice(index, 1);
                                                console.log(removedItem);
                                                this.presentToast("All DTR returned successfully!", 3000, "bottom");
                                          }, 
                                          (reason)=> {
                                                confirm.dismiss();
                                                console.log('Rejected: ' + reason);
                                                this.presentToast("Failed to returned All DTR or none was returned.", 3000, "bottom");
                                          })
                                    .catch((error)=> {
                                          confirm.dismiss();
                                          console.log(error);
                                    });

                                    return false;
                              }
                        }
                  ]
                  });
          confirm.present();
      }


      returnDTR(dtrs, dtr) {
            let confirm = this.alertCtrl.create(
                  {
                  title: 'Confirm Return DTR Action',
                  message: 'Do you want to continue your action?',
                  buttons: [
                        { 
                              text: 'Cancel', 
                              role: 'cancel'
                        },
                        {
                              text: 'Yes',
                              handler: (data) => {
          
                                    let action = 0;   // return DTR
                                    let index = dtrs.indexOf(dtr);
                        
                                    this.hrisActions.returnDTR(dtr.DtrID, dtr.Remarks, dtr.Period, action, dtr.approveEIC).then(
                                          (value)=> {
                                                confirm.dismiss();
                                                let removedItem = dtrs.splice(index, 1);                                                                                            

                                                console.log(removedItem);
                                                this.presentToast("DTR returned successfully!", 2000, "bottom");
                                          }, 
                                          (reason)=> {
                                                confirm.dismiss();
                                                console.log('Rejected: ' + reason);
                                                this.presentToast("DTR returned failed.", 2000, "bottom");
                                          })
                                          .catch((error)=> {
                                                confirm.dismiss();
                                                console.log(error);
                                          });

                                    return false;
                              }
                        }
                  ]
                  });
          confirm.present();
      }

   showPtlosDetail(data) {
      const modalPtlos = this.modal.create(PtlosModalPage, { data: data });
      modalPtlos.present();
   }

   showPassSlipDetail(data) {
      const modalPassSlip = this.modal.create(PassSlipModalPage, { data: data });
      modalPassSlip.present();
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
               this.presentAlert("Log-out", "Thank you for working with us!");
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
            this.localNotifications.clearAll().then( res => console.log(res));
            this.localNotifications.cancelAll();
            this.badge.clear();
         }

         },
         error => {
         console.log('displayMenu error: ' + error);

         this.loading.dismiss();
         },
         () => {
         // console.log(this.items);

         this.loading.dismiss();
         }
      );
   }

   getURLImage(EIC) {
      return this.hrisService.getUserImage(EIC);
   }

   ionViewWillEnter() {
         this.storage.get('user').then(
            (value) => {
               
               this.userData = JSON.parse(value);

               this.displayMenu(this.userData.EIC);
            
               this.hrisService.getDTRRevertRequest(this.userData.EIC).subscribe(
                  (result) => {
                        this.DTRs = result.dtrs;
                     },
                     (error) => {
                        console.log(error);
                     },
                     () => {

                     }
                  );

               this.hrisService.getPassSlipForApproval(this.userData.EIC).subscribe(
                  (result) => {
                     this.PassSlips = result.pass_slip_detail;
                  },
                  (error) => {
                     console.log(error);
                  },
                  () => {

                  }
               );

               this.hrisService.getJustification(this.userData.EIC).subscribe(
                  (result) => {
                     this.Justifications = result.justifications;
                  },
                  (error) => {
                     console.log(error);
                  },
                  () => {

                  }
               );

               this.hrisService.getPtlosForApproval(this.userData.EIC).subscribe(
                  (result) => {
                     this.PTLOS = result.ptlos_detail;
                  },
                  (error) => {
                     console.log(error);
                  },
                  () => {

                  }
               );

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
  
   presentToast(message, duration, position) {
      let toast = this.toastCtrl.create({
         message: message,
         duration: duration,
         position: position
      });

      toast.onDidDismiss(() => {

      });

      toast.present();
   }

   toggleDTRSection(i) {
      this.DTRs[i].open = !this.DTRs[i].open;
   }

   toggleJustificationSection(i) {
      this.Justifications[i].open = !this.Justifications[i].open;
   }

   toggleJustificationItem(i, j) {
      this.Justifications[i].children[j].open = !this.Justifications[i].children[j].open;
   }

   ionViewDidLoad() {   
   }

   ionViewDidEnter() {
   }

}
