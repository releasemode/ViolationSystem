import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateViolationComponent } from './Violations/create-violation/create-violation.component';
import { ViolationsListComponent } from './Violations/violations-list/violations-list.component';
import { ViolationActionComponent } from './Violations/violation-action/violation-action.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { ViolationResolver } from './services/violation.resolver';

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'header',component:HeaderComponent},
  { path: 'CreateViolation', component: CreateViolationComponent },
  { path: 'CreateViolation/:id', component: CreateViolationComponent,resolve:{
        data: ViolationResolver
  }},
  { path: 'ViolationList',component: ViolationsListComponent},
  { path: 'ViolationList/:id',component:ViolationActionComponent} 
  
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
