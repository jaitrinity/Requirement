import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map, retry } from 'rxjs/operators';
import { Constant } from "../constant/Contant";

@Injectable({ providedIn: 'root'})
export class SharedService{
    private baseURL : string = ""; 
    constructor(private http:HttpClient){
      this.baseURL = Constant.baseURL;
    }

    getToken(jsonData : any): Observable<any> {
        let params = new HttpParams({
          fromObject: { 
            grant_type: jsonData.grant_type, 
            username: jsonData.username, 
            password: jsonData.password 
          },
        });
    
        let httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
        };
        let url = this.baseURL+"token";
        return this.http.post<any>(url, params, httpOptions)
        .pipe(
          map(res => {
            return res;
          })
         )
    }

    getThreatsList(authToken : any) : Observable<any>{
      // console.log(authToken)
      // let httpOptions = {
      //   headers: new HttpHeaders({ 
      //     'Content-Type': 'application/json',
      //     'Authorization': "Bearer "+authToken 
      //   }),
      // };
      const headers = new HttpHeaders({
        // 'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${authToken}`
      })
      let url = this.baseURL+"api/project/9009/threats/true";
      return this.http.get<any>(url, { headers: headers })
      .pipe(
        map(res => {
          return res;
        })
       )
    }

    getUserInfoList(authToken : any) : Observable<any>{
      let httpOptions = {
        headers: new HttpHeaders({ 
          // 'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Authorization': `Bearer ${authToken}`
        }),
      };
      let url = this.baseURL+"api/user/info";
      return this.http.get<any>(url, httpOptions)
      .pipe(
        map(res => {
          return res;
        })
       )
    }

    getAccessTokenByFreshToken() : Observable<any>{
      let params = new HttpParams({
        fromObject: { 
          grant_type: 'refresh_token', 
          refresh_token: localStorage.getItem(Constant.REFRESH_TOKEN_KEY)
        },
      });
  
      let httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      };
      let url = this.baseURL+"token";
      return this.http.post<any>(url, params, httpOptions)
      .pipe(
        map(res => {
          return res;
        })
       )
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          console.error('An error occurred:', error.error.message);
        } else {
    
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        return throwError(
          'Something bad happened; please try again later.');
      }

}