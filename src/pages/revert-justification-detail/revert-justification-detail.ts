import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { RevertJustificationPage } from '../revert-justification/revert-justification';
import { HrisService } from '../../providers/hris-service';

/**
 * Generated class for the RevertJustificationDetail page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-revert-justification-detail',
  templateUrl: 'revert-justification-detail.html',
})
export class RevertJustificationDetailPage {
  justifications: any;
  employeeName: any;
  justi: any;
  remarks: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private hrisService: HrisService,
              private toastCtrl: ToastController) {

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
          this.presentToast('Justification has been reverted.', 2000, 'bottom');
        }
      },
      error => {
        this.presentToast(error, 3000, 'bottom');
      },
      () => {

      }
    );
  }

  action(EIC, month, year, month_year, approveEIC, statusID, period) {
    this.remarks = 'Reverted as per request';
    this.finalAction(EIC, month, year, month_year, approveEIC, statusID, period, this.remarks);    
  }
  
  presentToast(message, duration, position) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position
    });

    toast.onDidDismiss(() => {
      this.navCtrl.popTo(RevertJustificationPage);
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

      this.justi.recNo = this.justifications[0].recNo;
    }
      
  }

}

class JustificationDetail {
  recNo: any;
  employeeName: any;
  EIC: any;
  month: any;
  year: any; 
  monthyear: any;
  period: any;
  approveEIC: any;
}