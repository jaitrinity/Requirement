import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ThreatsComponent } from './layout/threats/threats.component';
import { UserInfoComponent } from './layout/user-info/user-info.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './shared/guard/auth.guard';


const routes: Routes = [
  {path : '' ,  redirectTo: '/login', pathMatch: 'full'},
  {path : 'login', component :LoginComponent},
  {path : 'layout', component :LayoutComponent,  canActivate: [AuthGuard],
  children: [
    {path: '', redirectTo: 'user-info', pathMatch: 'full'},
    { path: 'user-info', component: UserInfoComponent },
    { path: 'threats', component: ThreatsComponent },
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
