import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { Constant } from '../shared/constant/Contant';
import { SharedService } from '../shared/service/SharedService';
import { AuthenticateModel } from './model/AuthenticateModel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginModel : AuthenticateModel;
  isInProgress : boolean = false;
  invalid : boolean = false;
  hide : boolean = true;
  constructor(private sharedService : SharedService,private router:Router,
    private titleService:Title, private layout : LayoutComponent) { 
    this.loginModel = new AuthenticateModel();
    this.titleService.setTitle("Threat Modeler : Login");
  }

  ngOnInit(): void {
    // this.getToken();
  }

  // getToken(){
  //   let jsonData = {
  //     grant_type : "password",
  //     username : this.loginModel.username,
  //     password : this.loginModel.password
  //   }
  //   this.sharedService.getToken(jsonData)
  //     .subscribe(response => {
  //       //console.log(JSON.stringify(response)); 
  //     },
  //     (error)=>{
  //       //console.log(JSON.stringify(error)); 
  //     });
  // }

  OnSubmitting() {
    this.isInProgress = true;
    let jsonData = {
      grant_type : "password",
      username : this.loginModel.username,
      password : this.loginModel.password
    }
    this.sharedService.getToken(jsonData)
      .subscribe(response => {
        localStorage.setItem(btoa("isValidToken"),btoa(Constant.TRINITY_PRIVATE_KEY));
        localStorage.setItem(Constant.ACCESS_TOKEN_KEY,response.access_token);
        localStorage.setItem(Constant.REFRESH_TOKEN_KEY,response.refresh_token);
        this.isInProgress = false;
        this.router.navigate(['/layout']);
      },
      (error)=>{
        // console.log(JSON.stringify(error)); 
        if(error.status == Constant.BAD_REQUEST_STATUS_CODE){
          this.layout.openSnackBar(error.error.error_description,'Info');
        }
        else{
          this.layout.openSnackBar(Constant.returnServerErrorMessage("getToken"),'Info')
        }
        this.isInProgress = false;
      });
    
  }

  openForgetPasswordModel(){

  }

}
