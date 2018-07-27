import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class HrisService {

  domainURL: String;

  constructor(public http: Http) { 
    // this.domainURL = 'http://192.168.56.102';
  }

  logNotification(moduleName, status, remarks, approvingEIC, ctrlNo) {
    let params = {moduleName: moduleName, 
      status: status, 
      actionEic: approvingEIC, 
      remarks: remarks,
      ctrlNo: ctrlNo
    };
    let url = this.domainURL + '/WebService/Toolbox/Notify';
    return this.http.post(url, params).map(res => res.json());
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
    let url = this.domainURL + '/WebService/DTR/DTRReturnRequest2';
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

  doJustificationApproval(recNo, statusID, remarks) {
    let params = {
      recNo: recNo,
      statusID: statusID,
      remarks: remarks
    };
    let url = this.domainURL + '/WebService/Justification/JustificationApproval2';
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
    let url = this.domainURL + '/WebService/Justification/JustificationPending3';
    return this.http.post(url, params).map(res => res.json());
  }
  
  doPtlosApproval(recNo, tag) {
    let params = {id: recNo, tag: tag};
    let url = this.domainURL + '/WebService/PTLOS/PTLOSApproval';
    return this.http.post(url, params).map(res => res.json());
  }

  getPtlosForApproval(EIC) {
    let params = {approvingEIC: EIC};
    let url = this.domainURL + '/WebService/PTLOS/PTLOSDetail3';
    return this.http.post(url, params).map(res => res.json());
  }

  doPassSlipApproval(recNo, statusId, isOfficial) {
    let params = {id: recNo, statusId: statusId, isOfficial: isOfficial};
    let url = this.domainURL + '/WebService/PassSlip/PassSlipApproval';
    return this.http.post(url, params).map(res => res.json());
  }

  getPassSlipForApproval(EIC) {
    let params = {approvingEIC: EIC};
    let url = this.domainURL + '/WebService/PassSlip/PassSlipDetail3';
    return this.http.post(url, params).map(res => res.json());
  }

  getMenus(EIC) {
    let params = {approvingEIC: EIC};
    let url = this.domainURL + '/WebService/Toolbox/GetAllApplications2';
    return this.http.post(url, params).map(res => res.json());
  }

}
