import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Constant } from 'src/app/shared/constant/Contant';
import { SharedService } from 'src/app/shared/service/SharedService';
import { LayoutComponent } from '../layout.component';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  isInProgress : boolean = false;
  userData : any = {
    Name : "",
    Username : "",
    Email : "",
    LastLogin : "",
    UserDepartmentName : "",
    UserRoleName : ""
  };
  authToken : any = "";
  constructor(private sharedService : SharedService, 
    private datePipe : DatePipe, private titleService:Title,
    private layout : LayoutComponent ) { 
    this.authToken = localStorage.getItem(Constant.ACCESS_TOKEN_KEY);
    this.titleService.setTitle("Threat Modeler : User Info");
  }

  ngOnInit(): void {
    this.getUserInfoList();
  }

  getUserInfoList(){
    this.isInProgress = true;
    this.sharedService.getUserInfoList(this.authToken)
    .subscribe(response => {
      // console.log(JSON.stringify(response)); 
      this.userData = response.Data;
      this.userData.LastLogin = this.datePipe.transform(new Date(this.userData.LastLogin), 'HH:mm:ss MM/dd/yyyy');
      this.layout.userData = this.userData;
      this.isInProgress = false;
    },
    (error)=>{
      // console.log(JSON.stringify(error)); 
      if(error.status == Constant.UNAUTORIZED_STATUS_CODE){
        this.getAccessTokenByRefreshToken();
      }
      else{
        this.layout.openSnackBar(Constant.returnServerErrorMessage("getToken"),"Info")
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
      this.getUserInfoList();
    },
    (error)=>{
      //console.log(JSON.stringify(error)); 
      this.layout.openSnackBar(Constant.returnServerErrorMessage("getToken"),"Info")
    });
  }

}
