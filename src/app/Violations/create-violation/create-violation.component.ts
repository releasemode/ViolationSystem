import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PostgrestError } from '@supabase/supabase-js';
import { City } from 'src/app/models/Cities.model';
import { ViolationStatus } from 'src/app/models/ViolationStatus';
import { SystemUser } from 'src/app/models/systemusers.model';
import { Violation } from 'src/app/models/violation.model';
import { ViolationRange } from 'src/app/models/violationRange.model';
import { ViolationHistory } from 'src/app/models/violationhistory.model';
import { StorageService } from 'src/app/services/storage.service';
import { ViolationApiService } from 'src/app/services/violation.api.service';

@Component({
  selector: 'app-create-violation',
  templateUrl: './create-violation.component.html',
  styleUrls: ['./create-violation.component.css']
})
export class CreateViolationComponent {
  constructor(private violationApi:ViolationApiService,private router:Router,private route:ActivatedRoute,private storage:StorageService,@Inject(DOCUMENT) private document: Document,
  private renderer2: Renderer2){}
  violationForm: FormGroup;
  
  violationRanges=[];
  ViolationTypes=[];
  violatorType:number=1;
  violatorRange:number;
  reportFile:File;
  violationHistroy:ViolationHistory;
  addedViolation = new Violation();
  selectedViolationRange = new ViolationRange();
  isIDShown=true;
  isCRShown=false;
  isViolationAmountInRange=true;
  validationFormSubmitted = false;
  employeeName:string=''
  EditViolation = new Violation();
  formName:string='';
  saveButtonName:string='Create';
  selectedProceduralPenalty='';
  systemUser= new SystemUser();
  isMapVisible=false;
  center: google.maps.LatLngLiteral;
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap
  Cities =[];
  async ngOnInit(){
    const url = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAmIGTTJoppOJpVsfR7fQrKbSrTYsdSZcE';

    this.loadScript(url).then(() => {
      this.loadMap()
    });
     this.systemUser = this.storage.getObject('SystemUser');
     this.GetCities();
     console.log(this.systemUser);
      //  this.EditViolation = ;
       let data = this.route.snapshot.data['data'];
       if(data!=null){
       data.data.map(item=>{
        console.log('violation item in crate compo',item)
        
        this.EditViolation.id = item['id'];
        this.EditViolation.ViolatorType = item['ViolatorType']
        this.EditViolation.IdNumber=  item['IdNumber'];
        this.EditViolation.CRNumber=item['CRNumber'];
        this.EditViolation.CustomerName= item['CustomerName'];
        this.EditViolation.ViolationCity = item['ViolationCity']
        this.EditViolation.CityId = item["CityId"]
         this.EditViolation.ViolationSeverityId = item["ViolationSeverityId"]
         this.EditViolation.ViolationType = item['ViolationType']
        this.EditViolation.ViolationAmount = item['ViolationAmount'];
       
         this.EditViolation.ViolationLocation = item['ViolationLocation']
        this.EditViolation.ViolationDescription = item['ViolationDescription'];
        this.EditViolation.ReportNumber = item['ReportNumber'];
        this.EditViolation.ReportFilePath = item['ReportFilePath'];
        this.EditViolation.ReportDate = item['ReportDate']
        this.EditViolation.InspectorNames = item['InspectorNames']
        this.EditViolation.Notes= item['Notes']
        this.EditViolation.LastStatus = item['LastStatus'];
      
        this.storage.remove('EditViolation');
        this.storage.setObject('EditViolation',this.EditViolation)
        console.log('calling from storage',this.storage.getObject('EditViolation'));
        this.formName="Edit "
        this.EditForm();
      })
    }else{
      this.formName="New"
      
         this.createForm();
    }
      //   console.log('route guard violation',this.EditViolation)
      //     this.storage.remove('EditViolation');
      //     this.storage.setObject('EditViolation',this.EditViolation)
      //     this.formName="Edit "
      //     this.saveButtonName="Update";
      //     this.EditForm();
      //    }
        
      //  else{
      //   this.formName="New"
      
      //   this.createForm();
      //  }
      //}
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
  }
  mapClicked(event){
    console.log(JSON.stringify(event.latLng))
    this.getControl('ViolationLocation').setValue(JSON.stringify(event.latLng));
 
  }
  closeMap(event){
    this.isMapVisible=false;
    event.preventDefault();
  }

  async GetCities(){
    this.violationApi.GetCities().then(data=>{
      data.data.map(item=>{
        let fetchedCity=new City();
        fetchedCity.id = item['id'];
        fetchedCity.CityName = item["CityName"];
        this.Cities.push(fetchedCity);
      })
    })
  }
   async GetViolationById(id:number){
     this.violationApi.GetViolationById(id).then(data=>{
      console.log('violation from db',data);
      data.data.map(item=>{
        this.EditViolation.id = item['id'];
        this.EditViolation.ViolatorType = item['ViolatorType']
        this.EditViolation.IdNumber=  item['IdNumber'];
        this.EditViolation.CRNumber=item['CRNumber'];
        this.EditViolation.CustomerName= item['CustomerName'];
       // this.EditViolation.ViolationSeverityId = item["ViolationSeverity"]
        this.EditViolation.ViolationType = item['ViolationTypes']
        this.EditViolation.ViolationAmount = item['ViolationAmount'];
        this.EditViolation.ViolationCity = item['ViolationCity']
        this.EditViolation.ViolationLocation = item['ViolationLocation']
        this.EditViolation.ViolationDescription = item['ViolationDescription'];
        this.EditViolation.ReportNumber = item['ReportNumber'];
        this.EditViolation.ReportDate = item['ReportDate']
        this.EditViolation.ReportFilePath = item['ReportFilePath']
        this.EditViolation.InspectorNames = item['InspectorNames']
        this.EditViolation.Notes= item['Notes']
        this.EditViolation.LastStatus = item['LastStatus'];

        this.storage.remove('EditViolation');
        this.storage.setObject('EditViolation',this.EditViolation)
        
      })
          });

  }
  EditForm(){
    console.log("Edit form fn called..")
    this.employeeName = this.storage.getObject('SystemUser')['name'];
    this.EditViolation = this.storage.getObject('EditViolation');
    console.log('for edit binding1:',this.EditViolation);
    if(this.EditViolation.ViolatorType==1){
      this.isIDShown=true;
      this.isCRShown=false;
    }else if (this.EditViolation.ViolatorType==2){
      this.isIDShown=false;
      this.isCRShown=true;
    }
    this.violationForm= new FormGroup({
      ViolatorType: new FormControl(this.EditViolation.ViolatorType),
      IdNumber: new FormControl(this.EditViolation.IdNumber,[Validators.pattern("^[0-9]{10}$")]),
      CRNumber:new FormControl(this.EditViolation.CRNumber,[Validators.pattern("^[0-9]{10}$")]),
       CustomerName:new FormControl(this.EditViolation.CustomerName,Validators.required),
      ViolationCity:new FormControl(this.EditViolation.ViolationCity,Validators.required),
            CityId:new FormControl(this.EditViolation.CityId,Validators.required),
       ViolationLocation:new FormControl(this.EditViolation.ViolationLocation,Validators.required),

     ViolationSeverityId: new FormControl( this.EditViolation.ViolationSeverityId,Validators.required),
      ViolationType:new FormControl(this.EditViolation.ViolationType ,Validators.required),
      ViolationAmount:new FormControl(this.EditViolation.ViolationAmount,[Validators.required]),
      ViolationDescription: new FormControl( this.EditViolation.ViolationDescription,Validators.required),
      ReportNumber: new FormControl(this.EditViolation.ReportNumber,Validators.required),
      ReportDate: new FormControl(this.EditViolation.ReportDate,Validators.required),
      ReportFilePath: new FormControl(''),
      InquiryFilePath: new FormControl(''),
      InspectorNames: new FormControl( this.EditViolation.InspectorNames,Validators.required),
      Notes:new FormControl( this.EditViolation.Notes,Validators.required),
      CreatedBy: new FormControl(1),
      ApprovalBy: new FormControl(1),
      LastStatus: new FormControl(''),
      LastStatusDate: new FormControl(''),

    });
    this.violationApi.GetViolationSeverity().then(({data,error})=>{
      //console.log(ViolationRange);
      data.map(item=>{
        let violationRangeItem=new ViolationRange();
        violationRangeItem.id = item['id'];
        violationRangeItem.ViolationCategory = item['ViolationCategory'];
        violationRangeItem.ViolationCategoryId = item['ViolationCategoryId'];
        violationRangeItem.PriceRangeMin = item['PriceRangeMin'];
        violationRangeItem.PriceRangeMax = item['PriceRangeMax'];
        violationRangeItem.createdat= item['created_at'];
        console.log('ViolationRangeItem',violationRangeItem);
       
        this.violationRanges.push(violationRangeItem)
      });
       console.log(this.violationRanges);
       
      })

     this.onRangeSelected(this.EditViolation.ViolationSeverityId.toString())
  
  

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
  
    this.violationApi.downloadFile(this.EditViolation.ReportFilePath).then(data=>{
      this.blobToFile(data.data,this.EditViolation.ReportFilePath);
   
   })
   e.preventDefault();
  }
  createForm(){
    this.employeeName = this.storage.getObject('SystemUser')['name'];
    
    this.violationForm= new FormGroup({
      ViolatorType: new FormControl(1),
      IdNumber: new FormControl(null,[Validators.pattern("^[0-9]{10}$")]),
      CRNumber:new FormControl(null,[Validators.pattern("^[0-9]{10}$")]),
      CustomerName:new FormControl('',Validators.required),
      ViolationCity:new FormControl(1),
      CityId:new FormControl('',Validators.required),
      ViolationLocation:new FormControl('',Validators.required),
      ViolationSeverityId: new FormControl('',Validators.required),
      ViolationType:new FormControl('',Validators.required),
      ViolationAmount:new FormControl(0,Validators.required),
      ViolationDescription: new FormControl('',Validators.required),
      ReportNumber: new FormControl('',Validators.required),
      ReportDate: new FormControl('',Validators.required),
      ReportFilePath: new FormControl('',Validators.required),
      InquiryFilePath: new FormControl(''),
      InspectorNames: new FormControl('',Validators.required),
      Notes:new FormControl('',Validators.required),
      CreatedBy: new FormControl(1),
      ApprovalBy: new FormControl(1),
      LastStatus: new FormControl(''),
      LastStatusDate: new FormControl(''),

    });
 
    this.violationApi.GetViolationSeverity().then(({data,error})=>{
      //console.log(ViolationRange);
      data.map(item=>{
        let violationRangeItem=new ViolationRange();
        violationRangeItem.id = item['id'];
        violationRangeItem.ViolationCategory = item['ViolationCategory'];
        violationRangeItem.ViolationCategoryId = item['ViolationCategoryId'];
        violationRangeItem.PriceRangeMin = item['PriceRangeMin'];
        violationRangeItem.PriceRangeMax = item['PriceRangeMax'];
        violationRangeItem.createdat= item['created_at'];
        console.log('ViolationRangeItem',violationRangeItem);
       
        this.violationRanges.push(violationRangeItem)
      });
       console.log(this.violationRanges);
      
      })
  }
  nospaceAllowed(control:FormControl){
    if(control.value!=null && control.value.toString().indexOf(' ')!=-1){
      return {noSpaceAllowed:true}
    }
    return null;
  }

  isAmountInRange(e:any){
    let amount= +e.target.value
    console.log(amount);
   if(amount>=this.selectedViolationRange.PriceRangeMin && amount<=this.selectedViolationRange.PriceRangeMax){
      this.isViolationAmountInRange=true;
      return;
    }
    this.isViolationAmountInRange=false;
    console.log(this.isViolationAmountInRange);
  }
  
  onViolatorTypeSelected($event){
  //  console.log('Violator Type Value',$event.target.value)
    this.violatorType = this.violationForm.controls["ViolatorType"].value;
    if(this.violatorType ==1){
      this.isIDShown=true;
      this.isCRShown=false;
      this.getControl('CRNumber').setValue(null);
    }
    else{
      this.isCRShown=true;
      this.isIDShown =false;
      this.getControl('IdNumber').setValue(null);
    }
    
   // this.violatorType=1
    console.log('parsed violator type',this.violatorType)
    if(this.violatorRange != undefined)
      this.GetViolationTypes(this.violatorType,this.violatorRange);
  }
  GetViolationTypes(violatorType:number,severityId:number){
    this.violationApi.GetViolationTypes(violatorType,severityId).then(({data,error})=>{
      this.ViolationTypes = data;
    })
  }
  onRangeSelected(value:string){
    console.log('my range id:',value );
    this.violatorRange= parseInt(value);
    this.selectedProceduralPenalty='';
    console.log(this.violationRanges);
    this.selectedViolationRange = this.violationRanges.find(i=>i.id == this.violatorRange);
    console.log('selected range',this.selectedViolationRange);
    if(this.formName=="Edit "){
      this.violatorType = this.EditViolation.ViolatorType;
    }
    this.GetViolationTypes(this.violatorType,this.violatorRange);
  }

  private loadMap() {
    const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 0, lng: 0 },
      zoom: 1,
    });
  }


  private loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = this.renderer2.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      script.text = ``;
      script.onload = resolve;
      script.onerror = reject;
      this.renderer2.appendChild(this.document.head, script);
    })
  }


  showMap(){
    this.isMapVisible=!this.isMapVisible;
  }
  onViolationTypeSelected(value:string){
    let selectedViolationType= parseInt(value);
    // console.log("the selected value is " + value);
    // console.log(this.ViolationTypes)

    this.selectedProceduralPenalty=this.ViolationTypes.find(i=>i.id == selectedViolationType).ProceduralPenalty;
  }
  convertArrayToObject<T extends {[key: string]: any}>(array: T[], key: string): {[key: string]: T} {
    const obj: {[key: string]: T} = {};
    array.forEach(item => {
      obj[item[key]] = item
    });
  
    return obj;
  }

  getControl(name:any):AbstractControl | null{

    
    return this.violationForm.get(name);
    
  }

  onConsoleSubmit(){
    console.log('Violation form',this.violationForm)
  }
  onSubmit(){
     console.log('Why am i called..',this.systemUser.id )
    if(this.formName == "New"){
    this.validationFormSubmitted=true;
    if(this.violationForm.status != 'INVALID'){
    if(this.isViolationAmountInRange){
  console.log(this.selectedViolationRange.PriceRangeMin,this.selectedViolationRange.PriceRangeMax);
  console.log('Violation form',this.violationForm)
  let newViolation:Violation = this.violationForm.value;
  newViolation.CreatedBy = this.systemUser.id ;
  newViolation.ApprovalBy=3;
  newViolation.LastStatus = ViolationStatus.UnderReview;
  newViolation.LastStatusDate = new Date();
  newViolation.ViolatorType= +newViolation.ViolatorType;
 
  newViolation.ReportFilePath = "ReportFile_"+new Date().getMilliseconds();
  console.log(newViolation);


  let insertedViolation = this.violationApi.addViolation(newViolation);
  

  insertedViolation.then(data=>{
    if(data.error==null){
      this.violationApi.uploadFile(this.reportFile,newViolation.ReportFilePath);
    data.data.map(item=>{
          this.addedViolation.id=item['id'];
          this.addedViolation.CreatedBy = item['CreatedBy'];
          console.log('added violation id',this.addedViolation.id);
          const newHistory = new ViolationHistory();
          newHistory.ViolationId= this.addedViolation.id;
          newHistory.Status=ViolationStatus.UnderReview;
          newHistory.StatusBy = this.addedViolation.CreatedBy;
          newHistory.StatusDate = new Date();
          newHistory.created_at= new Date();
          let insertedHistory= this.violationApi.InsertViolationHistory(newHistory);
          console.log(insertedHistory.then(data=> {
            if(data.error == null){
              this.validationFormSubmitted=false;
              this.router.navigate(['ViolationList']);
            }
          }));
          
        })
      }else{
        console.log(data.error)
        alert('Unable to insert');
      }
         });
        
         
         
        }
        
    else{
      alert('Amount not in range');
    }
  //this.violationHistroy ={ }
   } else{
    alert("Please verify the inputs")
   }
  }else{
    
    //if(this.violationForm.status != 'INVALID'){
      console.log(this.EditViolation.ViolationType)
      if(this.isViolationAmountInRange){
        
        let EditedViolation:Violation = this.violationForm.value;
        EditedViolation.CreatedBy = this.systemUser.id ;
        EditedViolation.ApprovalBy=3;
        EditedViolation.LastStatus = ViolationStatus.UnderReview;
        EditedViolation.LastStatusDate = new Date();
        if(this.violationForm.controls['ViolationType'].value == "") {
          EditedViolation.ViolationType = this.EditViolation.ViolationType['id'];
        }
        if(this.violationForm.controls['ReportFilePath'].value == "") {
          console.log(this.EditViolation.ReportFilePath);
          EditedViolation.ReportFilePath = this.EditViolation.ReportFilePath;
      
        }else{
          console.log(this.reportFile?.name)
          EditedViolation.ReportFilePath="ReportFile_"+new Date().getMilliseconds();
          this.violationApi.uploadFile(this.reportFile,  EditedViolation.ReportFilePath);
        }
        EditedViolation.id = this.EditViolation.id;
        console.log("I am updating..",this.violationForm.value)
    console.log(this.formName)
    this.violationApi.updateViolations(EditedViolation).then(data=>{
      if(data.error ==null){
     
        
     
          const newHistory = new ViolationHistory();
          newHistory.ViolationId= EditedViolation.id 
          newHistory.Status=ViolationStatus.UnderReview;
          newHistory.StatusBy = this.systemUser.id;
          newHistory.StatusDate = new Date();
          newHistory.created_at= new Date();
       
          
       
          let insertedHistory= this.violationApi.InsertViolationHistory(newHistory);
          console.log(insertedHistory.then(data=> {
            if(data.error == null){
              this.validationFormSubmitted=false;
              this.router.navigate(['ViolationList']);
            }
          }));
      }
    });
    
  }
 // }
}
}

  // isViolationAmountInRange(control:FormControl){
  //   if(control.value!=null){
  //     console.log('control value',control.value>=this.selectedViolationRange.)
  //     return {ViolationAmountNotInRange:true}
  //   }
  //   return null;
  // }



  onFileSelect(e:any){
    
    this.reportFile= e.target.files[0];
    console.log('filechanged:',this.reportFile)
  }
  
 
}
