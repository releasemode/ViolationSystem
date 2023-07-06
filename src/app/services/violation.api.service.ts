import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { initSupabase } from '../utils/initSupabase';
import { Violation } from '../models/violation.model';
import { ViolationRange } from '../models/violationRange.model';
import { ViolationHistory } from '../models/violationhistory.model';
import { ViolationStatus } from '../models/ViolationStatus';
@Injectable({
  providedIn: 'root'
})
export class ViolationApiService {

  supabase: SupabaseClient;
  
  constructor() { 
    this.supabase= createClient(initSupabase.supabaseUrl,initSupabase.supabaseKey);

  }

  async addViolation(newViolation:Violation){
    console.log('newViolation',newViolation);
    const {data,error} = await this.supabase
        .from('Violations')
        .insert(newViolation)
        .select();
      return {data,error}
  }

  async updateViolations(EditedViolation:Violation){
    const { data, error } = await this.supabase
        
         .from('Violations')
         .update({ 
                    ViolatorType: EditedViolation.ViolatorType,
                    IdNumber: EditedViolation.IdNumber,
                    CRNumber: EditedViolation.CRNumber,
                    CustomerName:EditedViolation.CustomerName,
                    ViolationCity:EditedViolation.ViolationCity,
                    CityId:EditedViolation.CityId,
                    ViolationLocation:EditedViolation.ViolationLocation,
                    ViolationSeverityId:EditedViolation.ViolationSeverityId,
                    ViolationType:EditedViolation.ViolationType,
                    ViolationAmount:EditedViolation.ViolationAmount,
                    ViolationDescription: EditedViolation.ViolationDescription,
                    ReportNumber:EditedViolation.ReportNumber,
                    ReportDate:EditedViolation.ReportDate,
                    ReportFilePath:EditedViolation.ReportFilePath,
                    InspectorNames:EditedViolation.InspectorNames,
                    Notes:EditedViolation.Notes,
                    LastStatus:EditedViolation.LastStatus,
                    LastStatusDate:EditedViolation.LastStatusDate,
                    CreatedBy:EditedViolation.CreatedBy,
                    ApprovalBy:EditedViolation.ApprovalBy
                 })
         .eq('id', EditedViolation.id)

         return {data,error}
  }

  async GetViolations(){
    let {data,error} = await this.supabase
            .from('Violations')
            .select('*,ViolationTypes(*)')
            .order('id', { ascending: false })
    
    
    return {data,error};
  }

  async UpdateViolationStatus(status:number,id:number){
    const { data, error } = await this.supabase
      .from('Violations')
      .update({ LastStatus:status,LastStatusDate:new Date() })
      .eq('id', id);
      return {data,error}
  }

  async UpdateManagerNotes(notes:string,id:number){
    const { data, error } = await this.supabase
      .from('Violations')
      .update({CancelNotes:notes })
      .eq('id', id);
      return {data,error}
  }
  async UpdateRejectionNotes(notes:string,id:number){
    const { data, error } = await this.supabase
      .from('Violations')
      .update({RejectionNotes:notes })
      .eq('id', id);
      return {data,error}
  }
  async GetViolationSeverity(){
    let {data,error} = await this.supabase
            .from('ViolationSeverity')
            .select('*')
            .order('id', { ascending: true })
    
    
    return {data,error};
  }

  async GetViolationTypes(violatorType:number,severityId:number){
    console.log('customer type and severityid',violatorType,severityId)
    let {data,error} = await this.supabase
    .from('ViolationTypes')
    .select('*')
    .eq('Customertype', violatorType)
    .eq('SeverityId', severityId)
    .order('id', { ascending: true })
    return {data,error};
  }

  async GetViolationById(violationId:number){
    let {data,error} = await this.supabase
    .from('Violations')
    .select('*,ViolationTypes(*),ViolationSeverity(*),Cities(*)')
    .eq('id', violationId)
    
    console.log('check violation types for dropdown select',data)

    return {data,error};
  }
  async uploadFile(reportFile:File,fileName:string){
    console.log(reportFile?.name);
    const { data, error } = await this.supabase
      .storage
      .from('ViolationFiles')
      .upload('ReportFiles/'+fileName,reportFile as File, {
        cacheControl: '3600',
        upsert: false
      })
      console.log(error);
  }

  async downloadFile(reportFile:string){
    const { data, error } = await this.supabase
    .storage
    .from('ViolationFiles')
    .download('ReportFiles/'+reportFile)
    return {data,error}
  }

  async InsertViolationHistory(ViolationHistory:ViolationHistory){{
    const { data, error } = await this.supabase
        .from('ViolationHistory')
       .insert(ViolationHistory)
       return {data,error};
  }

  }

  async GetSystemUsersByEmail(email:string){
    let { data, error } = await this.supabase
         .from('SystemUsers')
         .select("*")
         .eq('email', email)

    return {data,error};
  }
  async GetCities(){
    let { data, error } = await this.supabase
    .from('Cities')
    .select('*')
    return {data,error}
  }
}
