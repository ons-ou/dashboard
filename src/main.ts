import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {registerLicense} from '@syncfusion/ej2-base'
registerLicense("Ngo9BigBOggjHTQxAR8/V1NBaF5cXmZCekx3QXxbf1x0ZFNMY19bQXJPIiBoS35RckVnWXhfeHdWQ2RUU0B/")
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
