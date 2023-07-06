import { Component } from '@angular/core';
import { Subject, filter, takeUntil } from 'rxjs';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { ViolationApiService } from '../services/violation.api.service';
import { SystemUser } from '../models/systemusers.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  title = 'violationSystem';
  isIframe = false;
  loginDisplay = false;
  NotAuthorized=false;
  private readonly _destroying$ = new Subject<void>();

  constructor(private broadcastService: MsalBroadcastService,
     private authService: MsalService,private storage: StorageService,
     private route: Router,private violationApi:ViolationApiService) { }

  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;
    this.storage.clear();
    this.broadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    )
    .subscribe(() => {
      this.setLoginDisplay();
    })
    
    
  }

  login() {
    
    this.authService.loginRedirect();

  }
  logout() {
      this.storage.clear();
      this.authService.logoutRedirect({
        postLogoutRedirectUri: "/",
      });
      
    }
 

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    console.log('Accounts',this.authService.instance.getAllAccounts());
 
    console.log('login display',this.loginDisplay)
    if(this.loginDisplay){
      this.storage.setObject('loggedInUser',this.authService.instance.getAllAccounts());

      const systemUser = new SystemUser();
      const email =  this.storage.getObject('loggedInUser')[0]['username'];
      const name = this.storage.getObject('loggedInUser')[0]['name'];
    

      this.violationApi.GetSystemUsersByEmail(email).then(data=>{
        console.log('getsystemuser',data.data);
       if(data.data.length>0){
        systemUser.id = data.data[0]['id']
        systemUser.email = email;
        systemUser.name = name;
        systemUser.roleId = data.data[0]['RoleId']
     
        console.log('system_users',systemUser);
        this.storage.setObject('SystemUser',systemUser);
        this.route.navigate(['ViolationList']);
      }else{
        this.NotAuthorized=true;
        console.log('not authorized:',this.NotAuthorized);
      
      }
    });
    
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
