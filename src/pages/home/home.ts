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

      notYetImplemented(moduleName) {
            this.presentToast("Apply " + moduleName + "? It is coming soon!", 3000, "bottom");
      }

      doPTLOSAction(item, actionId) {
            let actionDesc: string;
            switch(actionId) {
                  case 0:
                        actionDesc = 'Return';
                        break;
                  case 5:
                        actionDesc = 'Approve';
                        break;
                  case 6:
                        actionDesc = 'Disapprove';
                        break;                  
            }
            
            let confirm = this.alertCtrl.create({
                  title: 'Confirm ' + actionDesc,
                  message: 'Do you want to continue your action?',
                  buttons: [
                        {
                              text: 'Cancel', role: 'cancel'
                        },
                        {
                              text: 'Yes, I ' + actionDesc,
                              handler: () => {
                                    this.hrisActions.ptlosAction(item.recNo, actionId).then(
                                          (value) => {
                                                confirm.dismiss();

                                                let index = this.PTLOS.indexOf(item);
                                                this.PTLOS.splice(index, 1);

                                                this.presentToast(actionDesc + ' action ... successful!', 3000, 'bottom');
                                          },
                                          (reason) => {
                                                confirm.dismiss();
                                                this.presentToast(actionDesc + ' action ... failed.', 3000, 'bottom');
                                          }
                                    ).catch((error) => { 
                                          confirm.dismiss();
                                          console.log(error) 
                                    });

                                    return false;
                              }
                        }
                  ]
            }); // end -> confirm = this.alertCtrl()
                  
            confirm.present();
      }

      doJustificationActionAll(item, actionId) {
            let askRemarkAlert: any;
            let remarks: string = null;
            if(actionId==0){    // if returned
                  askRemarkAlert = this.alertCtrl.create(
                        {
                              title: 'Return Justification?',
                              message: 'Please enter why?',
                              inputs: [
                                    { name: 'remarks', placeholder: 'Your remarks here...' }
                              ],
                              buttons: [
                                    { 
                                          text: 'Cancel', role: 'cancel'
                                    },
                                    {
                                          text: 'Submit',
                                          handler: data => {
                                                
                                          }
                                    }
                              ]
                        }
            
                  );
                  askRemarkAlert.present();
            }

            let actionDesc: string;
            switch(actionId) {
                  case 0:
                        actionDesc = 'Return';
                        break;
                  case 1:
                        actionDesc = 'Approve';
                        break;
                  case 2:
                        actionDesc = 'Revert';
                        break;                  
            }
            
            let confirm = this.alertCtrl.create({
                  title: 'Confirm ' + actionDesc,
                  message: 'Do you want to continue your action?',
                  buttons: [
                        {
                              text: 'Cancel', role: 'cancel'
                        },
                        {
                              text: 'Yes, I ' + actionDesc + ' All!',
                              handler: () => {
                                    let justifications: any;

                                    if(actionId==0 || actionId==1) {
                                          justifications = item.forApproval;
                                    } else {
                                          justifications = item.forRevert;
                                    }

                                    this.hrisActions.justificationActionAll(justifications, actionId, remarks).then(
                                          (value)=>{  
                                                confirm.dismiss();

                                                // remove all elements
                                                if(actionId==0 || actionId==1) {
                                                      item.forApproval.splice(0);
                                                } else if(actionId==2) {
                                                      item.forRevert.splice(0);
                                                }                

                                                // remove item, if no more items left for revert
                                                if(item.forApproval && item.forRevert && item.forApproval.length == 0 && item.forRevert.length == 0) {
                                                      let index = this.Justifications.indexOf(item);
                                                      this.Justifications.splice(index, 1);
                                                }

                                                this.presentToast(actionDesc + ' action on ' + item.fullnameLast + ' ... successful!', 3000, 'bottom');
                                          },
                                          (reason)=>{
                                                confirm.dismiss();
                                                console.log('Rejected: ' + reason);
                                                this.presentToast(actionDesc + ' action on ' + item.fullnameLast + ' ... failed.', 3000, "bottom");
                                          }
                                    )
                                    .catch((error)=> {
                                          confirm.dismiss();
                                          console.log(error);
                                    });


                                    return false;
                              }
                        }
                  ]
            }); // end -> confirm = this.alertCtrl()

            if(actionId==1 || actionId==2)
                  confirm.present();
            else if(actionId==0 ){
                  askRemarkAlert.onDidDismiss((data)=>{
                        if(data.remarks!="") {
                              remarks = data.remarks;
                              confirm.present();
                        }
                  });
            }
      }

      doJustificationAction(item, justification, actionId) {
            let askRemarkAlert: any;
            let remarks: string = null;
            if(actionId==0){    // if returned
                  askRemarkAlert = this.alertCtrl.create(
                        {
                              title: 'Return Justification?',
                              message: 'Please enter why?',
                              inputs: [
                                    { name: 'remarks', placeholder: 'Your remarks here...' }
                              ],
                              buttons: [
                                    { 
                                          text: 'Cancel', role: 'cancel'
                                    },
                                    {
                                          text: 'Submit',
                                          handler: data => {
                                                
                                          }
                                    }
                              ]
                        }
            
                  );
                  askRemarkAlert.present();
            }

            let actionDesc: string;
            switch(actionId) {
                  case 0:
                        actionDesc = 'Return';
                        break;
                  case 1:
                        actionDesc = 'Approve';
                        break;
                  case 2:
                        actionDesc = 'Revert';
                        break;                  
            }
            
            let confirm = this.alertCtrl.create({
                  title: 'Confirm ' + actionDesc,
                  message: 'Do you want to continue your action?',
                  buttons: [
                        {
                              text: 'Cancel', role: 'cancel'
                        },
                        {
                              text: 'Yes, I ' + actionDesc + '!',
                              handler: () => {
                                    let index: any;
                                    if(actionId==0 || actionId==1)
                                          index = item.forApproval.indexOf(justification);
                                    else
                                          index = item.forRevert.indexOf(justification);

                                    this.hrisActions.justificationAction(justification.recNo, actionId, remarks).then(
                                          (value)=>{
                                                confirm.dismiss();

                                                if(actionId==0 || actionId==1) {
                                                      item.forApproval.splice(index, 1);
                                                } else {
                                                      item.forRevert.splice(index, 1);
                                                }
                                    
                                                // remove item from list if no more details
                                                if(item.forApproval && item.forRevert && (item.forApproval.length == 0 && item.forRevert.length == 0)) {
                                                      index = this.Justifications.indexOf(item);
                                                      this.Justifications.splice(index, 1);
                                                } 

                                                this.presentToast(actionDesc + ' action on ' + item.fullnameLast + ' ... successful!', 3000, 'bottom');
                                          },
                                          (reason)=>{
                                                confirm.dismiss();
                                                console.log('Rejected: ' + reason);
                                                this.presentToast(actionDesc + ' action on ' + item.fullnameLast + ' ... failed.', 3000, "bottom");
                                          }
                                    )
                                    .catch((error)=> {
                                          confirm.dismiss();
                                          console.log(error);
                                    });

                                    return false;
                              }
                        }
                  ]
            }); // end -> confirm = this.alertCtrl()

            if(actionId==1 || actionId==2)
                  confirm.present();
            else if(actionId==0 ){
                  askRemarkAlert.onDidDismiss((data)=>{
                        if(data.remarks!="") {
                              remarks = data.remarks;
                              confirm.present();
                        }
                  });
            }
      }

      doPassSlipActionAll(item, actionId) {
            console.log(item);

            let actionDesc: string;
            switch(actionId) {
                  case 1:
                        actionDesc = 'Approve';
                        break;
                  case 2:
                        actionDesc = 'Disapprove';
                        break;
                  case 3:
                        actionDesc = 'Cancel';
                        break;                  
            }
            let confirm = this.alertCtrl.create({
                  title: 'Confirm ' + actionDesc + ' All',
                  message: 'Do you want to continue your action?',
                  buttons: [
                        {
                              text: 'Cancel', role: 'cancel'
                        },
                        {
                              text: 'Yes, I ' + actionDesc + ' ALL!',
                              handler: () => {
                                    let index = this.PassSlips.indexOf(item);
                                    let passSlips = item.details;
                                    this.hrisActions.passSlipActionAll(passSlips, actionId).then(
                                          (value)=>{
                                                confirm.dismiss();
                                                this.PassSlips.splice(index, 1);
                                                this.presentToast(actionDesc + ' action on ' + item.fullnameLast + ' pass slip ... successful!', 3000, 'bottom');
                                          },
                                          (reason)=>{
                                                confirm.dismiss();
                                                console.log('Rejected: ' + reason);
                                                this.presentToast(actionDesc + ' action on ' + item.fullnameLast + ' pass slip ... failed.', 3000, "bottom");
                                          }
                                    )
                                    .catch((error)=> {
                                          confirm.dismiss();
                                          console.log(error);
                                    });

                                    return false;
                              }
                        }
                  ]
            }); // end -> confirm = this.alertCtrl()
            confirm.present();
      }

      doPassSlipAction(item, passSlip, actionId) {

            let actionDesc: string;
            switch(actionId) {
                  case 1:
                        actionDesc = 'Approve';
                        break;
                  case 2:
                        actionDesc = 'Disapprove';
                        break;
                  case 3:
                        actionDesc = 'Cancel';
                        break;                  
            }
            
            let confirm = this.alertCtrl.create({
                  title: 'Confirm ' + actionDesc,
                  message: 'Do you want to continue your action?',
                  buttons: [
                        {
                              text: 'Cancel', role: 'cancel'
                        },
                        {
                              text: 'Yes, I ' + actionDesc + '!',
                              handler: () => {
                                    let index = item.details.indexOf(passSlip);

                                    this.hrisActions.passSlipAction(passSlip.recNo, actionId).then(
                                          (value)=>{
                                                confirm.dismiss();
                                                item.details.splice(index, 1);
                                    
                                                // remove item from list if no more details
                                                if(item.details && item.details.length == 0) {
                                                      index = this.PassSlips.indexOf(item);
                                                      this.PassSlips.splice(index, 1);
                                                }

                                                this.presentToast(actionDesc + ' action on ' + item.fullnameLast + ' pass slip ... successful!', 3000, 'bottom');
                                          },
                                          (reason)=>{
                                                confirm.dismiss();
                                                console.log('Rejected: ' + reason);
                                                this.presentToast(actionDesc + ' action on ' + item.fullnameLast + ' pass slip ... failed.', 3000, "bottom");
                                          }
                                    )
                                    .catch((error)=> {
                                          confirm.dismiss();
                                          console.log(error);
                                    });

                                    return false;
                              }
                        }
                  ]
            }); // end -> confirm = this.alertCtrl()
            confirm.present();
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
                                                this.DTRs.splice(index, 1);
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

      returnDTR(item, dtr) {
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
                                    let index = item.details.indexOf(dtr);
                        
                                    this.hrisActions.returnDTR(dtr.DtrID, dtr.Remarks, dtr.Period, action, dtr.approveEIC).then(
                                          (value)=> {
                                                confirm.dismiss();
                                                item.details.splice(index, 1); 
                                    
                                                // remove item from list if no more details
                                                if(item.details && item.details.length == 0) {
                                                      index = this.DTRs.indexOf(item);
                                                      this.DTRs.splice(index, 1);
                                                }

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
                              this.badge.set(this.totalApplications)
                                    .then(() => console.log("Launcher Badge success: " + this.totalApplications))
                                    .catch( exception => console.log(exception));

                              this.localNotifications.schedule({
                                    id: 57,
                                    title: 'HRIS',
                                    text: 'Total applications that needs your attention: ' + this.totalApplications,
                                    every: 'hour',
                                    at: new Date( new Date().getTime() + 2 * 1000 )
                              });

                        } 
                        // else {
                        //       this.localNotifications.clearAll().then( res => console.log(res));
                        //       this.localNotifications.cancelAll().then( res => console.log(res));
                        //       this.badge.clear().then( res => console.log(res));
                        // }

                  },
                  error => {
                        console.log('displayMenu error: ' + error);

                        this.loading.dismiss();
                  },
                  () => {
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
                              () => {}
                        );

                        this.hrisService.getPassSlipForApproval(this.userData.EIC).subscribe(
                              (result) => {
                                    this.PassSlips = result.pass_slip_detail;
                              },
                              (error) => {
                              console.log(error);
                              },
                              () => {}
                        );

                        this.hrisService.getJustification(this.userData.EIC).subscribe(
                              (result) => {
                                    this.Justifications = result.justifications;
                              },
                              (error) => {
                              console.log(error);
                              },
                              () => {}
                        );

                        this.hrisService.getPtlosForApproval(this.userData.EIC).subscribe(
                              (result) => {
                                    this.PTLOS = result.ptlos_detail;
                              },
                              (error) => {
                                    console.log(error);
                              },
                              () => {}
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

      togglePassSlipSection(i) {
            this.PassSlips[i].open = !this.PassSlips[i].open;
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
