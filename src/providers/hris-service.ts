import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the HrisService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class HrisService {

  domainURL: String;

  constructor(public http: Http) { 
    this.domainURL = 'http://222.127.105.70:333';
    // this.domainURL = 'http://172.16.199.105';
  }

  getUserImage(EIC) {
    return this.domainURL + '/WebService/Toolbox/UserImage/' + EIC;
  }

  doDTRReturn(DtrId, strPeriod, intPeriod, action, approvingEIC, remarks) {
    let params = {DtrId: DtrId, 
      strPeriod: strPeriod, 
      intPeriod: intPeriod, 
      action: action, 
      approvingEIC: approvingEIC, 
      remarks: remarks};
    let url = this.domainURL + '/WebService/DTR/DTRAction';
    return this.http.post(url, params).map(res => res.json());
  }

  getDTRRevertRequest(EIC) {
    let params = {approvingEIC: EIC};
    let url = this.domainURL + '/WebService/DTR/DTRReturnRequest';
    return this.http.post(url, params).map(res => res.json());
  }

  getRevertJustificationDetail(EIC, approvingEIC, month, year, period) {
    let params = {EIC: EIC, 
                  approvingEIC: approvingEIC, 
                  month: month, 
                  year: year, 
                  period: period};
    let url = this.domainURL + '/WebService/Justification/JustificationRevertDetail2';
    return this.http.post(url, params).map(res => res.json());
  }
  
  getRevertJustification(EIC) {
    let params = {approvingEIC: EIC};
    let url = this.domainURL + '/WebService/Justification/JustificationRevertPending2';
    return this.http.post(url, params).map(res => res.json());
  }

  doJustificationApproval(EIC, month, year, month_year, approvingEIC, statusID, period, remarks) {
    let params = {
      EIC: EIC,
      month: month,
      year: year,
      month_year: month_year,
      approvingEIC: approvingEIC,
      statusID: statusID,
      period: period,
      remarks: remarks
    };
    let url = this.domainURL + '/WebService/Justification/JustificationApproval';
    return this.http.post(url, params).map(res => res.json());
  }

  getJustificationDetail(EIC, approvingEIC, month, year, period) {
    let params = {EIC: EIC, 
                  approvingEIC: approvingEIC, 
                  month: month, 
                  year: year, 
                  period: period};
    let url = this.domainURL + '/WebService/Justification/JustificationDetail2';
    return this.http.post(url, params).map(res => res.json());
  }

  getJustification(EIC) {
    let params = {approvingEIC: EIC};
    let url = this.domainURL + '/WebService/Justification/JustificationPending2';
    return this.http.post(url, params).map(res => res.json());
  }

  doPtlosApproval(recNo, tag) {
    let params = {id: recNo, tag: tag};
    let url = this.domainURL + '/WebService/PTLOS/PTLOSApproval';
    return this.http.post(url, params).map(res => res.json());
  }

  getPtlosForApproval(EIC) {
    let params = {approvingEIC: EIC};
    let url = this.domainURL + '/WebService/PTLOS/PTLOSDetail2';
    return this.http.post(url, params).map(res => res.json());
  }

  doPassSlipApproval(recNo, statusId, isOfficial) {
    let params = {id: recNo, statusId: statusId, isOfficial: isOfficial};
    let url = this.domainURL + '/WebService/PassSlip/PassSlipApproval';
    return this.http.post(url, params).map(res => res.json());
  }

  getPassSlipForApproval(EIC) {
    let params = {approvingEIC: EIC};
    let url = this.domainURL + '/WebService/PassSlip/PassSlipDetail2';
    return this.http.post(url, params).map(res => res.json());
  }

  getMenus(EIC) {
    let params = {approvingEIC: EIC};
    let url = this.domainURL + '/WebService/Toolbox/GetAllApplications';
    return this.http.post(url, params).map(res => res.json());
  }

}
