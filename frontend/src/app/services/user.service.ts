import { Injectable } from '@angular/core';
   import { HttpClient } from '@angular/common/http';
   import { Observable } from 'rxjs';
   import { map } from 'rxjs/operators';

   @Injectable({
     providedIn: 'root'
   })
   export class UserService {
     private apiUrl = 'http://localhost:8083/api/users';
     private baseUrl = 'http://localhost:8083';

     constructor(private http: HttpClient) {}

     getAllUsers(): Observable<any[]> {
       return this.http.get<any[]>(this.apiUrl).pipe(
         map(users => users.map(user => {
           let profilePicture = user.profilePicture;
           if (profilePicture && !profilePicture.startsWith('http')) {
             profilePicture = `${this.baseUrl}${profilePicture}`;
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
       return this.http.get<any>(`${this.apiUrl}/statistics`);
     }
  getUserIdByEmail(email: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/user-id/${email}`);  // Using path parameter, not query
  }

  checkIfEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-address?address=${email}`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

     updateUser(id: number, user: any): Observable<any> {
       return this.http.put<any>(`${this.apiUrl}/${id}`, user);
     }

     deleteUser(id: number): Observable<void> {
       return this.http.delete<void>(`${this.apiUrl}/${id}`);
     }

     requestPasswordReset(email: string): Observable<any> {
       return this.http.post<any>(`${this.apiUrl}/request-reset`, { email });
     }

     resetPassword(token: string, newPassword: string): Observable<any> {
       return this.http.post<any>(`${this.apiUrl}/reset-password`, { token, newPassword });
     }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

}
