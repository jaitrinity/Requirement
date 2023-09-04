import { DatePipe } from '@angular/common';
import { Component, Injectable, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Constant } from '../shared/constant/Contant';
import { SharedService } from '../shared/service/SharedService';

@Injectable({ providedIn: 'root'})
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  durationInSeconds = 5;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  public userData : any = {
    Username : "",
    LastLogin : ""
  };
  threatsPageLink = "threats";
  userInfoPageLink = "user-info";
  constructor(private router:Router, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
  }

  public openSnackBar(msg : string,action : string) {
    this._snackBar.open(msg, action, {
      // panelClass : "snack-bar",
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  logout(){
    let isConfirm = confirm("Do you want to logout ?");
    if(isConfirm){
      localStorage.clear();
      this.router.navigate(['/login']);
    }
    
  }

}
