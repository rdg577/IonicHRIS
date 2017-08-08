import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginService } from '../../providers/login-service';
import { HomePage } from '../home/home';
/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  isLogin: any;
  username: String;
  password: String;
  domainURL: any;
  userData: any;

  constructor(private storage: Storage,
              public navCtrl: NavController, 
              private alertCtrl: AlertController,
              public navParams: NavParams,
              private loginService: LoginService) {

    
    // this.storage.clear();

    this.storage.get('user').then((value) => {
      if(value != null) {
        this.navCtrl.setRoot(HomePage, null, null, () => {
          this.navCtrl.popToRoot();
        })
      } 
    });
    
    this.domainURL = 'http://222.127.105.70:333';
    
  }

  login(username, password) {
    this.loginService.checkCredentials(username, password, this.domainURL).subscribe(
      result => {
        this.userData = result.data[0];   
      },
      error => {
        this.alertCtrl.create({
          title: 'Error',
          message: error,
          buttons: ['Dismiss']
        });
      },
      () => {
        if(this.userData != null) {
          // save user data into session
          this.loginService.saveSessionData(
            "EB13329278333FAC0E72",
            // this.userData.EIC,
            this.userData.fullnameLast,
            this.userData.idNo,
            this.userData.designation,
            this.userData.schemeCode,
            true,
            this.domainURL
          );
          
          // go back to root page
          this.navCtrl.setRoot(HomePage, null, null, () => {
            this.navCtrl.popToRoot();
          }); 

        }
      }
    );

    /**
     * MS1229370656BF505D6E
     * EB13329278333FAC0E72
     * SA168298389632EB9AD5
     * GG509743801BE28F3B0E
     * SG11024211748EF3FCD4
     * HP158780225294D64318
     * SG13299974519D8FF010
     * JR1942559638B931650A
     * EP1831954384C6C94D75
     * AS14098100684CA974F5
     * SA168298389632EB9AD5
     * RE122721079481636D9E
     * RR205308603CFECEA977
      */
  }

  ionViewWillEnter() {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }

}
