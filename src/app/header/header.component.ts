import { Component, Input } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { ViolationApiService } from '../services/violation.api.service';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

   employeeName:string=''
   loginDisplay=false;
   constructor(private storage: StorageService,private violationApi:ViolationApiService,private authService: MsalService){

   }
   ngOnInit(){
     console.log('header called..')
    console.log('logged_in_user_header',this.storage.getObject('SystemUser'));
    this.employeeName = this.storage.getObject('SystemUser')['name'];

    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
   }

   logout() {
    this.storage.clear();
    this.authService.logoutRedirect({
      postLogoutRedirectUri: "/login",
    });
    
  }

}
