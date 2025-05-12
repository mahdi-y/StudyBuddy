import { Injectable } from '@angular/core';
   import { HttpClient } from '@angular/common/http';
   import { Observable } from 'rxjs';
   import { map } from 'rxjs/operators';
import {environment} from "../../environments/environment";

   @Injectable({
     providedIn: 'root'
   })
   export class UserService {

     constructor(private http: HttpClient) {}

     getAllUsers(): Observable<any[]> {
       return this.http.get<any[]>(environment.apiUrlUser).pipe(
         map(users => users.map(user => {
           let profilePicture = user.profilePicture;
           if (profilePicture && !profilePicture.startsWith('http')) {
             profilePicture = `${environment.baseUrlUser}${profilePicture}`;
           } else if (!profilePicture) {
             profilePicture = 'assets/backoffice/images/profile.jpg';
           }
           console.log(`Transformed profile picture for ${user.username}: ${profilePicture}`);
           return {
             ...user,
             profilePicture
           };
         }))
       );
     }

     getUserStatistics(): Observable<any> {
       return this.http.get<any>(`${environment.apiUrlUser}/statistics`);
     }
  getUserIdByEmail(email: string): Observable<number> {
    return this.http.get<number>(`${environment.apiUrlUser}/user-id/${email}`);  // Using path parameter, not query
  }

  checkIfEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrlUser}/check-address?address=${email}`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(environment.apiUrlUser, user);
  }

     updateUser(id: number, user: any): Observable<any> {
       return this.http.put<any>(`${environment.apiUrlUser}/${id}`, user);
     }

     deleteUser(id: number): Observable<void> {
       return this.http.delete<void>(`${environment.apiUrlUser}/${id}`);
     }

     requestPasswordReset(email: string): Observable<any> {
       return this.http.post<any>(`${environment.apiUrlUser}/request-reset`, { email });
     }

     resetPassword(token: string, newPassword: string): Observable<any> {
       return this.http.post<any>(`${environment.apiUrlUser}/reset-password`, { token, newPassword });
     }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrlUser}/${id}`);
  }

}
