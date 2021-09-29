import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from 'src/app/models/Client';
import { AuthService } from 'src/app/services/auth.service';
import { ClientserviceService } from 'src/app/services/clientservice.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';


interface Tag {
  title:string
}

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.scss']
})
export class EditClientComponent implements OnInit {

  myForm!: FormGroup;
  currentUser: any;
  client_id:any;


  keywords = new Set<string>([]);

  tagsList:Tag[] = []
  
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  removable = true;


  constructor(private fb: FormBuilder,private clientService:ClientserviceService,private _snackBar: MatSnackBar,private auth: AuthService,private route:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      gender: ['Male',[Validators.required]],
      firstname:['',[Validators.required]],
      lastname:['',[Validators.required]],
      job:['',[Validators.required]],
      phone:['',[Validators.required,Validators.minLength(8)]],
      email:['',[Validators.required,Validators.email]],
      address:['',[Validators.required]],
      organization:['',[Validators.required]],
      tags: this.fb.control(this.tagsList)
    })
    this.route.queryParams.subscribe(params => {
      this.client_id = params["client_id"];
      // this.client.tags = this.unparseTags(this.client.tags)
      this.clientService.getClientById(this.client_id).subscribe((client) => {
        console.log(client)
        this.myForm.patchValue({
          gender: client?.gender,
          firstname:client?.firstname,
          lastname:client?.lastname,
          job:client?.job,
          phone:client?.phone,
          email:client?.email,
          address:client?.address,
          organization:client?.organization,
          tags: client?.tags
        })
        // updating keyword arr
        client?.tags.forEach((tag:Tag) => {
          this.keywords.add(tag.title)
        })

        console.log('val ',this.myForm.value)
      })
    });

    this.auth.getUserState()
      .subscribe( user => {
        this.currentUser = user;
      })
  }

  onFormSubmit()
  {
    let formValue = this.myForm.value;
    formValue.tags = this.tagsList;
    let client = {"responsable":{"displayName":this.currentUser.displayName,"email":this.currentUser.email},...formValue}
    this.clientService.updateClient(this.client_id,client)
    this.clientService.clients.subscribe((res) => {
      this._snackBar.open('Client/Organization Edited !!', 'Dismiss', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000
      });
      this.router.navigate(['/list-clients'])
    }, (err) => {
      this._snackBar.open('There has been an Error Try Again !!', 'Dismiss', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 3000
      });
      this.router.navigate(['/list-clients'])
    })
  }


  // form
  addKeywordFromInput(event: MatChipInputEvent) {
    if (event.value && !this.keywords.has(event.value)) {
      this.keywords.add(event.value);
      this.tagsList.push({"title":event.value})
      event.chipInput!.clear();
    }
  }
  
  removeKeyword(keyword: string) {
    this.keywords.delete(keyword);
    this.tagsList = removeItemOnce(this.tagsList,keyword)
  }
  


  // getters & setters
  get gender()
  {
    return this.myForm.get("gender");
  }

  get firstname()
  {
    return this.myForm.get("firstname");
  }

  get lastname()
  {
    return this.myForm.get("lastname");
  }

  get job()
  {
    return this.myForm.get("job");
  }

  get organization()
  {
    return this.myForm.get("organization");
  }

  get phone()
  {
    return this.myForm.get("phone");
  }

  get email()
  {
    return this.myForm.get("email");
  }

  get address()
  {
    return this.myForm.get("address");
  }

  get tags()
  {
    return this.myForm.get("tags") as FormArray;
  }

}


// utils
function removeItemOnce(arr: any[], value: any) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

