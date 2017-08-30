import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Badge } from '@ionic-native/badge';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { SQLite } from '@ionic-native/sqlite';

import { HrisService } from '../providers/hris-service';
import { LoginService } from '../providers/login-service';
import { DatabaseService } from '../providers/database-service';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { PassslipPage } from '../pages/passslip/passslip';
import { PtlosPage } from '../pages/ptlos/ptlos';
import { JustificationPage } from '../pages/justification/justification';
import { JustificationDetailPage } from '../pages/justification-detail/justification-detail';
import { RevertJustificationPage } from '../pages/revert-justification/revert-justification';
import { RevertJustificationDetailPage } from '../pages/revert-justification-detail/revert-justification-detail';
import { RevertDtrPage } from '../pages/revert-dtr/revert-dtr';

// for using the angular2-moment used for piping
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    PassslipPage,
    PtlosPage,
    JustificationPage,
    JustificationDetailPage,
    RevertJustificationPage,
    RevertJustificationDetailPage,
    RevertDtrPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    PassslipPage,
    PtlosPage,
    JustificationPage,
    JustificationDetailPage,
    RevertJustificationPage,
    RevertJustificationDetailPage,
    RevertDtrPage
  ],
  providers: [
    HrisService,
    LoginService,
    DatabaseService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LocalNotifications,
    Badge,
    SQLitePorter,
    SQLite
  ]
})
export class AppModule {}
