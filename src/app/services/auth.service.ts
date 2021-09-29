import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private eventAuthError = new BehaviorSubject<string>("");
  eventAuthError$ = this.eventAuthError.asObservable();

  constructor(private  afAuth : AngularFireAuth,private  router: Router) { }

  getUserState() {
    return this.afAuth.authState;
  }

  logout() {
    return this.afAuth.signOut();
  }

  async login(email: string, password: string)
  {
    this.afAuth.signInWithEmailAndPassword(email, password)
      .catch(error => {
        console.log(error)
        this.eventAuthError.next(error);
      })
      .then(userCredential => {
        console.log('nope')
        if(userCredential) {
          console.log(userCredential)
          this.router.navigate(['/list-clients']);
        }
      })
  }
}
