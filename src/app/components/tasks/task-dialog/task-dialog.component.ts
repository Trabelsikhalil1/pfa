import { Component, OnInit, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ClientserviceService } from 'src/app/services/clientservice.service';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent implements OnInit {

  hours = ['00','01','02','03','04', '05', '06', '07','08' ,'09', '10', '11', '12', '13','14' ,'15', '16','17','18' ,'19','20', '21','22','23']
  minutes = ["00","05","10","15","20","25","30","35","40","45","50","55"]
  categories = ["None","Call","Email","Follow-up","Meeting","Milestone","Send"]

  clients:any = []

  myForm!: FormGroup
  constructor(private clientService:ClientserviceService,private fb: FormBuilder,public dialogRef: MatDialogRef<TaskDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.clientService.getAllClients().subscribe((clients) => {
      this.clients = clients
    })
    this.myForm = this.fb.group({
      title: [(this.data?.title || ''),[Validators.required]],
      due_date:[(this.data?.due_date ? new Date(this.data?.due_date.seconds * 1000) : new Date),[Validators.required]],
      time: this.fb.group({
        hours:[(this.data?.time?.hours ||'00'),Validators.required],
        minutes:[(this.data?.time?.minutes ||'00'),Validators.required]
      }),
      category:[(this.data?.category ||'None'),[Validators.required]],
      notes:[(this.data?.notes || '')],
      completed:[false],
      client_id:['']
    })
  }

  markAsCompleted()
  {
    this.myForm.controls.completed.setValue(true)
  }

  setCategoryClasses(category:string)
  {
    if (category.toLowerCase() === "none")
    {
      return {}
    }
    return {[category.toLowerCase()]:true}
  }

}
