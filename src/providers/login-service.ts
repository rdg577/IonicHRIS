import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Injectable()
export class LoginService {

  private domainURL: any;
  private isLogin: boolean;

  public userEIC: any;
  public userIdNo: any;
  public userSchemeCode: any;
  public userFullnameLast: any;
  public designation: any;

  constructor(private http: Http, 
              private storage: Storage) { 
  
    this.domainURL = 'http://222.127.105.70:333';
  }

  getDomainURL() {
    return this.domainURL;
  }

  checkCredentials(username, password, domainURL) {
    let params = {username: username, password: password};
    let url = domainURL + '/WebService/Account/Login';
    return this.http.post(url, params).map(res => res.json())
  }

  // check if user has logged in
  didUserLoggedIn(): boolean {
    return this.isLogin;
  }

  saveSessionData(EIC, Fullname, IdNo, Designation, SchemeCode, isLogin, domainURL) {
    this.storage.set('user', JSON.stringify({
      EIC: EIC,
      Fullname: Fullname,
      IdNo: IdNo,
      Designation: Designation,
      SchemeCode: SchemeCode,
      isLogin: isLogin,
      PhotoURL: domainURL + '/WebService/Toolbox/UserImage/' + EIC, 
      domainURL: domainURL
    }));
  }

  

}
