import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { JustificationPage } from '../justification/justification';
import { HrisService } from '../../providers/hris-service';

/**
 * Generated class for the JustificationDetail page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-justification-detail',
  templateUrl: 'justification-detail.html',
})
export class JustificationDetailPage {
  justifications: any;
  employeeName: any;
  justi: any;
  remarks: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private toastCtrl: ToastController,
              private hrisService: HrisService,
              private alertCtrl: AlertController) {

    this.justi = new JustificationDetail();

  }

  finalAction(EIC, month, year, month_year, approveEIC, statusID, period, remarks) {
    this.hrisService.doJustificationApproval(EIC, month, year, month_year, 
                                              approveEIC, statusID, period, 
                                              remarks).subscribe(
      result => {
        if(result.justification_approval.has_error) {
          this.presentToast('Error encountered while approving justification, please try again.', 3000, 'bottom');
        } else {
          if(statusID == 1) {
            this.presentToast('Justification approved!', 2000, 'bottom');
          } else {
            this.presentToast('Justification has been returned.', 2000, 'bottom');
          }
        }
      },
      error => {
        this.presentToast(error.err, 3000, 'bottom');
      },
      () => {

      }
    );
  }

  action(EIC, month, year, month_year, approveEIC, statusID, period) {
    if(statusID == 1) {           // if approved
      this.remarks = null;
      this.finalAction(EIC, month, year, month_year, approveEIC, statusID, period, this.remarks);
    } else if(statusID == 0) {    // if returned
      let alert = this.alertCtrl.create(
        {
          title: 'Remarks',
          message: 'Please enter remarks why you returned the justifications.',
          inputs: [
            { name: 'remarks', placeholder: 'Remarks' }
          ],
          buttons: [
            { text: 'Cancel', role: 'cancel'},
            {
              text: 'Submit',
              handler: data => {
                this.remarks = data.remarks;
                this.finalAction(EIC, month, year, month_year, approveEIC, statusID, period, this.remarks);
              }
            }
          ]
        }

      );
      alert.present();
    }    
  }
  
  presentToast(message, duration, position) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position
    });

    toast.onDidDismiss(() => {
      this.navCtrl.popTo(JustificationPage);
    });

    toast.present();
  }

  ionViewDidEnter() {
    this.justifications = this.navParams.data;
    if(this.justifications.length >= 0 && this.justifications[0] != null) {
      this.justi.employeeName = this.justifications[0].fullnameFirst;
      this.justi.EIC = this.justifications[0].EIC;
      this.justi.month = this.justifications[0].month;
      this.justi.year = this.justifications[0].year;
      this.justi.monthyear = this.justifications[0].monthyear;
      this.justi.period = this.justifications[0].period;
      this.justi.approveEIC = this.justifications[0].approveEIC; 
    }
  }

  

}

class JustificationDetail {
  employeeName: any;
  EIC: any;
  month: any;
  year: any; 
  monthyear: any;
  period: any;
  approveEIC: any;
}