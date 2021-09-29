import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  myForm!: FormGroup;
  constructor(private fb:FormBuilder,private auth: AuthService,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      'email':['',[Validators.required,Validators.email]],
      'password':['',[Validators.required]],
    })
    this.auth.eventAuthError$.subscribe( data => {
      if (data)
      {
        this._snackBar.open(data, 'Dismiss', {
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 3000
        });
      }
    });
  }


  onFormSubmit()
  {
    const formValue = this.myForm.value;
    this.auth.login(formValue.email,formValue.password)
  }


// getters & setters
get email()
{
  return this.myForm.get("email");
}

get password()
{
  return this.myForm.get("password");
}


}
