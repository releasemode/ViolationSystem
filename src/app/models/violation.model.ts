export class Violation{
    id:number;
    ViolatorType:number;
    IdNumber: number;
    CRNumber: number;
    CustomerName: string;
    ViolationCity: string;
    CityId:number;
    ViolationLocation: string;
    ViolationSeverityId: number;
    ViolationType:number;
    ViolationAmount: number;
    ViolationDescription: string;
    ReportNumber: string;
    ReportDate: Date;
    InquiryNumber: string;
    InquiryDate: Date;
    ReportFilePath: string;
    InquiryFilePath: string;
    InspectorNames: string;
    Notes: string;
    CreatedBy: number;
    ApprovalBy: number;
    LastStatus: number;
    LastStatusDate: Date;
    CreatedAt: Date;
    CancelNotes:string;
    RejectionNotes:string;
}