import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ViolationStatus } from 'src/app/models/ViolationStatus';
import { Violation } from 'src/app/models/violation.model';
import { StorageService } from 'src/app/services/storage.service';
import { ViolationApiService } from 'src/app/services/violation.api.service';

@Component({
  selector: 'app-violations-list',
  templateUrl: './violations-list.component.html',
  styleUrls: ['./violations-list.component.css']
})
export class ViolationsListComponent {
  violationsList:Violation[]=[];
  
  constructor(private violationApi:ViolationApiService,private router:Router,private storage:StorageService){}
  ngOnInit(){
    if(this.storage.getObject('SystemUser')['name']!=null){
     console.log(this.storage.getObject('SystemUser'))
    this.violationApi.GetViolations().then(({data,error})=>{
      //console.log('ViolationList with foriegn key',data);
      data.map(item=>{
        let violationItem=new Violation();
        console.log('violation item',item)
        violationItem.id = item['id'];
        violationItem.CRNumber = item['CRNumber'];
        violationItem.IdNumber = item['IdNumber'];
        violationItem.CustomerName= item['CustomerName'];
        violationItem.ViolationSeverityId = item['ViolationSeverity']['ViolationCategory']
        violationItem.ViolationType = item['ViolationTypes']['ViolationName']
        violationItem.ViolationAmount = item['ViolationAmount']
        violationItem.LastStatus = item['LastStatus']
        violationItem.CreatedAt = item['created_at']
        this.violationsList.push(violationItem)
      });
     
      console.log(this.violationsList);
      
      })
    }
  }

  getViolationStatus(statusId:number){
    return Object.values(ViolationStatus)[statusId-1].toString()
  }
  ShowSingleViolation(violationId:number){
    
    let url: string = "/ViolationList/" + violationId;
    this.router.navigateByUrl(url);
    //this.router.navigate(['ViolationAction']);
  }

  Edit(violationId:number){
    let url: string = "/CreateViolation/" + violationId;
    this.router.navigateByUrl(url);
    //this.router.navigate(['ViolationAction']);
  }
  CreateViolation(){
    this.router.navigate(['CreateViolation']);
  }
}
