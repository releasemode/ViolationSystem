import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Params
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ViolationApiService } from './violation.api.service';
import { Violation } from '../models/violation.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ViolationResolver implements Resolve<any> {
  EditViolation = new Violation();
  constructor(private violationApi:ViolationApiService,private storage:StorageService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)  {
    let id = route.params['id'];
    console.log('Resolver called..')
    return this.violationApi.GetViolationById(id)
    }
  
}
