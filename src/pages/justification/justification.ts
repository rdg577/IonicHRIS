import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HrisService } from '../../providers/hris-service';
import { Storage } from '@ionic/storage';
import { JustificationDetailPage } from '../justification-detail/justification-detail';

/**
 * Generated class for the Justification page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-justification',
  templateUrl: 'justification.html',
})
export class JustificationPage {
  items: any;
  userData: any;
  details: any;

  constructor(private hrisService: HrisService, 
    private storage: Storage,
    public navCtrl: NavController, public navParams: NavParams) {
      
  }

  displayDetailPage(EIC, month, year, period) {
    this.hrisService.getJustificationDetail(EIC, this.userData.EIC, month, year, period).subscribe(
      result => {
        this.details = result.justifications;
      },
      error => {

      },
      () => {
        this.navCtrl.push(JustificationDetailPage, this.details);
      }
    );
  }

  displayMenu(EIC) {    
    this.hrisService.getJustification(EIC).subscribe(
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
