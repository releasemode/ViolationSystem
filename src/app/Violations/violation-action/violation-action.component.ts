import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViolationStatus } from 'src/app/models/ViolationStatus';
import { SystemUser } from 'src/app/models/systemusers.model';
import { Violation } from 'src/app/models/violation.model';
import { ViolationHistory } from 'src/app/models/violationhistory.model';
import { StorageService } from 'src/app/services/storage.service';
import { ViolationApiService } from 'src/app/services/violation.api.service';

@Component({
  selector: 'app-violation-action',
  templateUrl: './violation-action.component.html',
  styleUrls: ['./violation-action.component.css']
})
export class ViolationActionComponent {



       
  violationId:number;
  violationLastStatus:string='';
  isApprovalAuthority=false;
  employeeName:string=''
  systemUser= new SystemUser();
  notes:string=''
  notesEmptyDiv=false;
  constructor(private violationAPI:ViolationApiService,private activatedRoute : ActivatedRoute,private storage:StorageService,private router:Router){
    this.activatedRoute.params.subscribe( (data) => {
           
      this.violationId = +this.activatedRoute.snapshot.paramMap.get('id');
    
   
    })
  }
  violation=new Violation();
  ngOnInit(){
    this.systemUser = this.storage.getObject('SystemUser')
    this.employeeName = this.systemUser.name;
     this.violationAPI.GetViolationById(this.violationId).then(data=>{
      console.log(data);
      data.data.map(item=>{
        this.violation.id = item['id'];
        this.violation.IdNumber=  item['IdNumber'];
        this.violation.CRNumber=item['CRNumber'];
        this.violation.CustomerName= item['CustomerName'];
        this.violation.ViolationSeverityId = item['ViolationSeverity']['ViolationCategory']
        this.violation.ViolationType = item['ViolationTypes']['ViolationName']
        this.violation.ViolationAmount = item['ViolationAmount'];
        this.violation.LastStatus = item['LastStatus'];
        this.violation.ReportFilePath = item['ReportFilePath']
        this.violation.CancelNotes = item['CancelNotes']
        this.violation.RejectionNotes = item['RejectionNotes']
        this.violationLastStatus = Object.values(ViolationStatus)[this.violation.LastStatus-1].toString();
      })
      })
      this.isManager();
     }
     
     isManager(){
    
      this.isApprovalAuthority = this.systemUser.roleId==2;
      console.log("isApprovalAuthority",this.isApprovalAuthority);
      return this.isApprovalAuthority;
     }
     approve(id:number){
      
      this.violationAPI.UpdateViolationStatus(ViolationStatus.Approved,id).then(data=>{
        if(data.error == null){
          const newHistory = new ViolationHistory();
          newHistory.ViolationId= id
          newHistory.Status=ViolationStatus.Approved;
          newHistory.StatusBy = this.systemUser.id;
          newHistory.StatusDate = new Date();
          newHistory.created_at= new Date();
       
          
       
          let insertedHistory= this.violationAPI.InsertViolationHistory(newHistory);
          console.log(insertedHistory.then(data=> {
            if(data.error == null){
             
              this.router.navigate(['ViolationList']);
            }
          }));
        }
      });
     }

     reject(id:number){
      if(this.notes!=''){
        this.notesEmptyDiv=false;
      this.violationAPI.UpdateViolationStatus(ViolationStatus.Rejected,id).then(data=>{
        if(data.error == null){
          const newHistory = new ViolationHistory();
          newHistory.ViolationId= id
          newHistory.Status=ViolationStatus.Rejected;
          newHistory.StatusBy = this.systemUser.id;
          newHistory.StatusDate = new Date();
          newHistory.created_at= new Date();
       
          
       
          let insertedHistory= this.violationAPI.InsertViolationHistory(newHistory);
          insertedHistory.then(data=> {
            if(data.error == null){
             
              let updatedNotes =this.violationAPI.UpdateRejectionNotes(this.notes,newHistory.ViolationId);
              updatedNotes.then(data=>{
                if(data.error == null){
                  this.router.navigate(['ViolationList']);
                }
              });
            }
          });
        }
      });
    } else{
      this.notesEmptyDiv=true;
    }
     }

     cancel(id:number){
      if(this.notes!=''){
        this.notesEmptyDiv=false;
        this.violationAPI.UpdateViolationStatus(ViolationStatus.Cancelled,id).then(data=>{
        if(data.error == null){
          const newHistory = new ViolationHistory();
          newHistory.ViolationId= id
          newHistory.Status=ViolationStatus.Cancelled;
          newHistory.StatusBy = this.systemUser.id;
          newHistory.StatusDate = new Date();
          newHistory.created_at= new Date();
       
          
       
          let insertedHistory= this.violationAPI.InsertViolationHistory(newHistory);
          insertedHistory.then(data=> {
            if(data.error == null){
              let updatedNotes =this.violationAPI.UpdateManagerNotes(this.notes,newHistory.ViolationId);
              updatedNotes.then(data=>{
                if(data.error == null){
                  this.router.navigate(['ViolationList']);
                }
              });
              
            }});
        }
      });
      } else{
        this.notesEmptyDiv=true;
      }
    }

     public blobToFile = (theBlob: Blob, fileName:string): File => {
      const b: any = theBlob;
      //A Blob() is almost a File() - it's just missing the two properties below which we will add
      b.lastModifiedDate = new Date();
      b.name = fileName;
      console.log(theBlob);
      var url= window.URL.createObjectURL(theBlob);
      window.open(url);
      //Cast to a File() type
      return theBlob as File;
    }
  
    
    downloadFile(e:Event){
     console.log('dnload called..')
      this.violationAPI.downloadFile(this.violation.ReportFilePath).then(data=>{
        this.blobToFile(data.data,this.violation.ReportFilePath);
     
     })
     e.preventDefault();
    }
}
