import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'CRM-DEMO';
  user: any;
  constructor(private auth: AuthService, 
    private router: Router) { }

  ngOnInit(): void {
    this.auth.getUserState()
      .subscribe( user => {
        this.user = user;
      })
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  
  hasRoute() {
    return !this.router.url.includes("login") ;
  }
}
