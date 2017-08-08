import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HrisService } from '../../providers/hris-service';
import { RevertJustificationDetailPage } from '../revert-justification-detail/revert-justification-detail';

/**
 * Generated class for the RevertJustification page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-revert-justification',
  templateUrl: 'revert-justification.html',
})
export class RevertJustificationPage {
  userData: any;
  items: any;
  details: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private storage: Storage,
    private hrisService: HrisService) {

  }
  
  displayDetail(EIC, month, year, period) {
    this.hrisService.getRevertJustificationDetail(EIC, this.userData.EIC, month, year, period).subscribe(
      result => {
        this.details = result.justifications;
      },
      error => {

      },
      () => {
        this.navCtrl.push(RevertJustificationDetailPage, this.details);
      }
    );
  }

  displayMenu(EIC) {    
    this.hrisService.getRevertJustification(EIC).subscribe(
      result => {
        this.items = result.justifications;
      },
      error => {
        console.log('displayMenu err: ' + error.err);
      },
      () => {
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
