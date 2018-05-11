import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HrisService } from '../hris-service';
import { AlertController } from 'ionic-angular';

@Injectable()
export class HrisActionsService {

  constructor(private hrisService: HrisService,
            private alertCtrl: AlertController) {

  }

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
