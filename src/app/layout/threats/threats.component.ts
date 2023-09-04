import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { Constant } from 'src/app/shared/constant/Contant';
import { SharedService } from 'src/app/shared/service/SharedService';
import { LayoutComponent } from '../layout.component';

export interface DialogData {}

@Component({
  selector: 'app-threats',
  templateUrl: './threats.component.html',
  styleUrls: ['./threats.component.scss']
})
export class ThreatsComponent implements OnInit {
  durationInSeconds = 3;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  isInProgress : boolean = false;
  authToken : any = "";
  threatsList = [];
  uniqueSecurity : any = "";
  uniqueSecurityList = [];
  selectedUniqueSecurity = [];
  onLoad : boolean = true;
  onSelect : boolean = false;
  onSelectThreatsList = [];
  multiSelectdropdownSettings = {};
  singleSelectdropdownSettings = {};
  constructor(private sharedService : SharedService, private layout : LayoutComponent,
    private clip : Clipboard,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private titleService:Title) { 
    this.authToken = localStorage.getItem(Constant.ACCESS_TOKEN_KEY);
    this.titleService.setTitle("Threat Modeler : Threats");
  }

  ngOnInit(): void {
    this.multiSelectdropdownSettings = {
      singleSelection: false,
      idField: 'paramCode',
      textField: 'paramDesc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };
    this.singleSelectdropdownSettings = {
      singleSelection: true,
      idField: 'paramCode',
      textField: 'paramDesc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      closeDropDownOnSelection : true
    };
    this.getThreatsList();
  }

  openSnackBar() {
    this._snackBar.open('Copied to Clipboard', "Info",{
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  onSelectOrDeselect($event){
    this.selectMultiSecurity();
  }
  onSelectAllOrDeselectAll($event){
    this.selectMultiSecurity();
  }

  getThreatsList(){
    this.isInProgress = true;
    this.sharedService.getThreatsList(this.authToken)
    .subscribe(response => {
      // console.log(JSON.stringify(response)); 
      this.threatsList = response.Data;
      let uniqueSecurityList = [];
      for(let i=0;i<this.threatsList.length;i++){
        let securityRequirementsList = this.threatsList[i].SecurityRequirements;
        for(let j=0;j<securityRequirementsList.length;j++){
          let Name = securityRequirementsList[j].Name;
          if (uniqueSecurityList.indexOf(Name) == -1) {
            uniqueSecurityList.push(Name);
          }
        }
      }
      this.uniqueSecurityList  = uniqueSecurityList;
      this.isInProgress = false;
    },
    (error)=>{
      // console.log(JSON.stringify(error)); 
      if(error.status == Constant.UNAUTORIZED_STATUS_CODE){
        this.getAccessTokenByRefreshToken();
      }
      else{
        this.layout.openSnackBar(Constant.returnServerErrorMessage("getToken"),"Info");
      }
      this.isInProgress = false;
    });
  }

  getAccessTokenByRefreshToken(){
    this.sharedService.getAccessTokenByFreshToken()
    .subscribe(response => { 
      this.authToken = response.access_token;
      localStorage.setItem(Constant.ACCESS_TOKEN_KEY,response.access_token);
      localStorage.setItem(Constant.REFRESH_TOKEN_KEY,response.refresh_token);
      this.getThreatsList();
    },
    (error)=>{
      //console.log(JSON.stringify(error)); 
      this.layout.openSnackBar(Constant.returnServerErrorMessage("getToken"),"Info")
    });
  }

  selectSecurity(){
    this.makeAsDefault();
    if(this.uniqueSecurity == ""){
      this.onLoad = true;
    }
    else{
      let uniqueSecurityList = [];
      for(let i=0;i<this.threatsList.length;i++){
        let securityRequirementsList = this.threatsList[i].SecurityRequirements;
        for(let j=0;j<securityRequirementsList.length;j++){
          let Name = securityRequirementsList[j].Name;
          if (Name == this.uniqueSecurity) {
            uniqueSecurityList.push(this.threatsList[i]);
            break;
          }
        }
      }
      this.onSelectThreatsList = uniqueSecurityList;
      this.onSelect = true;
    }
  }

  selectMultiSecurity(){
    this.makeAsDefault();
    if(this.selectedUniqueSecurity.length == 0){
      this.onLoad = true;
    }
    else{
      // let idList = [];
      let uniqueSecurityList = [];
      for(let i=0;i<this.selectedUniqueSecurity.length;i++){
        let security = this.selectedUniqueSecurity[i];
        for(let j=0;j<this.threatsList.length;j++){
          let securityRequirementsList = this.threatsList[j].SecurityRequirements;
          for(let k=0;k<securityRequirementsList.length;k++){
            let Name = securityRequirementsList[k].Name;
            if (Name == security) {
              // let id = this.threatsList[j].Id;
              // if(idList.indexOf(id) == -1){
                uniqueSecurityList.push(this.threatsList[j]);
                // idList.push(id);
                break;
              // }
              
            }
          }
        }
      }
      this.onSelectThreatsList = uniqueSecurityList;
      this.onSelect = true;
    }
  }

  copyToClipboard(object : any){
    this.clip.copy("Threat Name : "+object.ThreatName+"\n"+
    "Source Name : "+object.SourceName+"\n"+
    "Risk : "+object.ActualRiskName+"\n"+
    "Status : "+object.StatusName+"\n"+
    "Project Id : "+object.ProjectId+"\n"+
    "No. Of Security Requirements : "+object.SecurityRequirements.length+"\n"+
    "Description : "+object.Description+"\n");
    this.openSnackBar();
  }
  
  expandThreats(object : any){
    const dialogRef = this.dialog.open(ExpendModalDialog,{
      data :{
        Id : object.Id,
        ThreatName : object.ThreatName,
        SourceName : object.SourceName,
        ActualRiskName : object.ActualRiskName,
        StatusName : object.StatusName,
        ProjectId : object.ProjectId,
        Description : object.Description,
        noOfSecurityRequirement : object.SecurityRequirements.length,
        SecurityRequirements : object.SecurityRequirements
      },
      autoFocus: false 
    });
    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  makeAsDefault(){
    this.onLoad = false;
    this.onSelect = false;
    this.onSelectThreatsList = [];
  }
}

@Component({
  selector: 'expend-modal',
  templateUrl: 'expend-modal.html',
})
export class ExpendModalDialog {
  expendData : any;
  constructor(public dialogRef: MatDialogRef<ExpendModalDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
      this.expendData = data;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

