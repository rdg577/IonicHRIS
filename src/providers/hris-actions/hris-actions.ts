import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HrisService } from '../hris-service';

@Injectable()
export class HrisActionsService {

  constructor(private hrisService: HrisService) {

  }

  ptlosActionAll(PTLOS, actionId) {
    return new Promise((resolve, reject)=>{
      let returnValue: any = null;

      PTLOS.forEach(ptlos=>{
        this.ptlosAction(ptlos.recNo, actionId).then(
          value => {
            returnValue = value;
          },
          reason => {
            reject(reason);
          }
        );
      });
      resolve(returnValue);
    })
  }

  ptlosAction(recNo, actionId) {
    let returnValue: any = null;

    return new Promise((resolve, reject)=>{

      this.hrisService.doPtlosApproval(recNo, actionId).subscribe(
        result => {
          returnValue = result.ptlos_approval.tag;
          resolve(returnValue);
        },
        error => {
          reject(error);
        },
        () => {}
      );

    });
  }

  justificationActionAll(justifications, actionId, remarks) {
    return new Promise((resolve, reject)=>{
      let returnValue: any = null;

      justifications.forEach(justification=>{

        this.justificationAction(justification.recNo, actionId, remarks).then(
          value=>{
            returnValue = 0;
          },
          reason=>{
            reject(reason);
          }
        );        
      });
      resolve(returnValue);
    });
  }

  justificationAction(recNo, actionId, remarks) {
    return new Promise((resolve, reject)=>{
      let returnValue: any = null;

      this.hrisService.doJustificationApproval(recNo, actionId, remarks).subscribe(
        result => {
          returnValue = 0;
          if(result.justification_approval.has_error) { reject(1) }
          resolve(returnValue);
        },
        error=>{
          reject(error);
        }, () => {}
      );

    });
  }

  passSlipActionAll(PassSlips, actionId) {
    return new Promise((resolve, reject)=>{
      let returnValue: any = null;
      let typePersonal = 1;
      PassSlips.forEach(passSlip=>{
        this.hrisService.doPassSlipApproval(passSlip.recNo, actionId, typePersonal).subscribe(
          result => {
            returnValue = result.pass_slip_approval.statusId;
          },
          error => {
            reject(error);
          },
          () => {}
        );
      });
      resolve(returnValue);
    })
  } // end -> passSlipActionAll()

  passSlipAction(recNo, actionId) {

    return new Promise((resolve, reject)=>{
      let returnValue: any = null;
      let typePersonal = 1;

      this.hrisService.doPassSlipApproval(recNo, actionId, typePersonal).subscribe(
        result => {
          returnValue = result.pass_slip_approval.statusId;

          resolve(returnValue);
        },
        error => {
          reject(error);
        },
        () => {
          
        }
      );

    }) // end -> new Promise()
  } // end -> passSlipApproval

  returnDTR(DtrId, strPeriod, intPeriod, action, approveEIC) {
    
    return new Promise((resolve, reject)=>{
      let returnValue: any = null;   
      let action = 0; // for return dtr                  
      let remarks = 'DTR is returned as requested.';

      this.hrisService.doDTRReturn(DtrId, strPeriod, intPeriod, action, approveEIC, remarks).subscribe(
          result => {
            returnValue = 0;
            if(result.dtr_action.has_error) {
                reject(1);
            }
          },
          error => {
            reject(error);
          },
          () => {}
      );
      resolve(returnValue);

    }); // end -> return new Promise()

  }  // end -> revertDTR()


  returnDTRAll(DTRs) {
    
    return new Promise((resolve, reject)=>{
      let returnValue: any = null;

      DTRs.forEach(dtr => {
        let action = 0; // for return dtr
        let remarks = 'DTR is returned as requested.';  
        this.hrisService.doDTRReturn(dtr.DtrID, dtr.Remarks, dtr.Period, action, dtr.approveEIC, remarks).subscribe(
            result => {
              returnValue = 0;
              if(result.dtr_action.has_error) {
                  reject(1); // one is unsuccessful return of dtr and been stopped
              }
            },
            error => {
              reject(error);
            },
            () => {}
        );
      });

      resolve(returnValue);
    });

  }  // end -> revertDTR()
}
