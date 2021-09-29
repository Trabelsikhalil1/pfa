import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ClientserviceService } from 'src/app/services/clientservice.service';
import { TasksService } from 'src/app/services/tasks.service';
import { TaskDialogComponent } from '../../tasks/task-dialog/task-dialog.component';
import { DateTime } from "luxon";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-info-client',
  templateUrl: './info-client.component.html',
  styleUrls: ['./info-client.component.scss']
})
export class InfoClientComponent implements OnInit {
  client_id: any;
  client:any;
  showSpinner = false
  user: any;

  // tasksList:any = []

  overdueList:any = []
  todayList:any = []
  next7daysList:any = []

  historyList:any = []

  constructor(private auth:AuthService,private _snackBar: MatSnackBar,private dialog: MatDialog,private route:ActivatedRoute,private router:Router,private clientService:ClientserviceService,private taskService:TasksService) { }

  ngOnInit(): void {
    this.showSpinner = true
    this.route.queryParams.subscribe(params => {
      this.client_id = params["client_id"];
      this.clientService.getClientById(this.client_id).subscribe((client) => {
        this.client = client
        this.showSpinner = false
      })
    })
    this.showSpinner = true
    // this.taskService.getAllUncompletedTasksByClientId(this.client_id).subscribe((Tasks) => {
    //   this.tasksList = Tasks
    //   console.log("all",this.tasksList)
    //   this.showSpinner = false
    // })

    this.taskService.getOverdueTasks(this.client_id).subscribe((res) => {
      this.overdueList = res
    })

    this.taskService.getNext7daysTasks(this.client_id).subscribe((res) => {
      this.next7daysList = res
    })

    this.taskService.getTodaysTasks(this.client_id).subscribe((res) => {
      this.todayList = res
    })

    this.taskService.getAllCompletedTasksByClientId(this.client_id).subscribe((res) => {
      this.historyList = res
      this.historyList.reverse()
    })

    this.auth.getUserState()
      .subscribe( user => {
        this.user = user;
      })
  }

  openDialog()
  {
    let dialogRef = this.dialog.open(TaskDialogComponent)
    dialogRef.afterClosed().subscribe((result) => {
     if (result != "cancel")
     {
      result = this.fixDialogData(result)
      // adding Task
      this.taskService.addItem(result).then((res) => {
        this._snackBar.open('Task Added !!', 'Dismiss', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 3000
        });
      })
     }
    })
  }

  passToEditDialog(task:any)
  {
    let passedData = {"dialog_action":"Edit",...task}
    let dialogRef = this.dialog.open(TaskDialogComponent,{ data:passedData})
    dialogRef.afterClosed().subscribe((result) => {
      if (result != "cancel")
      {
        result = this.fixDialogData(result)
        this.taskService.updateTask(task.id,result).then((res) => {
          this._snackBar.open('Task Edited !!', 'Dismiss', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000
          });
        })
      }
    })
  }


  passData(client_id:any)
  {
    let navigationExtras: NavigationExtras = {
      queryParams: {
          "client_id": client_id
      }
    };

    this.router.navigate(["/edit-client"],  navigationExtras);

  }


  addANote()
  {
    // to do add notes
  }

  displayDate(timestamp:any)
  {
    let d = DateTime.fromSeconds(timestamp.seconds)
    const now = DateTime.local();
    const fmtObj = {
      sameDay: "'Today', T",
      nextDay: "'Tomorrow', T",
      nextWeek: 'EEE, dd MMM, T',
      lastDay: "'Yesterday', T",
      lastWeek: "EEE, dd MMM, T",
      sameElse: 'EEE, dd MMM, T'
    };
    return myCalendar(d, now, fmtObj)

  }

  displayRelativeDate(timestamp:any)
  {
    let d = DateTime.fromMillis(timestamp.toMillis())
    const now = DateTime.local();
    const fmtObj = {
        seconds: "s 'seconds ago'",
        minutes: "m 'minutes ago'",
        sameElse: 'dd MMM'
    };
    return myTimeSetter(d, now, fmtObj)
  }



  fixDialogData(task:any)
  {
    // fixing due time
    task.due_date.setHours(task.time.hours,task.time.minutes,"00","00")
    // init client_id to current client
    task["client_id"] = this.client_id
    // adding user_id
    console.log(this.user)
    task["created_by"] = {"displayName":this.user.displayName,"email":this.user.email}

    if(task?.completed)
    {
      // adding id of the user who completed the task
      task["completed_by"] = {"displayName":this.user.displayName,"email":this.user.email}
      task["completed_at"] = new Date()
    } else {
      // adding id of the user who completed the task
      task["completed_by"] = ""
      // init completed to false!
      task["completed"] = false
    }

    return task
  }


  setCategoryClasses(category:string)
  {
    return {[category.toLowerCase()]:true}
  }

  setGenderClass(gender: any)
  {
    switch (gender) {
      case "Male":
        return "male"
        break;
      case "Female":
        return "female"
        break;
      default:
        return "male"
        break;
    }
  }



  RelativeDate(date:any)
{
    date = new Date(date?.seconds * 1000)
    let now = new Date()
    let diff = (now.getTime() - date.getTime()) / 1000
    return diff <= 60? `${Math.floor(diff)} seconds ago` : diff < 3600 ? `${Math.floor(diff / 60)} minutes ago` : DateTime.fromJSDate(date).toFormat('dd MMM')
}





}


// utils

function getCalendarFormat(myDateTime:DateTime, now:DateTime) {
  var diff = myDateTime.diff(now.startOf("day"), 'days').as('days');
  return diff < -6 ? 'sameElse' :
    diff < -1 ? 'lastWeek' :
    diff < 0 ? 'lastDay' :
    diff < 1 ? 'sameDay' :
    diff < 2 ? 'nextDay' :
    diff < 7 ? 'nextWeek' : 'sameElse';
}

function myCalendar(dt1:DateTime, dt2:DateTime, obj:any){
  const format = getCalendarFormat(dt1, dt2) || 'sameElse';
  return dt1.toFormat(obj[format]);
}


function getTimeFormat(myDateTime:DateTime, now:DateTime) {
  var diff = myDateTime.diff(now).shiftTo('seconds').toObject().seconds;
  if (diff)
  {
    return diff <= 60 ? 'seconds' :
    diff < 3601 ? 'minutes' : 'sameElse';  
  }
  return 'sameElse'
}

function myTimeSetter(dt1:DateTime, dt2:DateTime, obj:any){
    const format = getTimeFormat(dt1, dt2) || 'sameElse';
    return dt1.toFormat(obj[format]);
}




// function RelativeDate(date:Date)
// {
//     let now:Date = new Date()
//     let diff = (now.getTime() - date.getTime()) / 1000
//     return diff <= 60? `${diff} seconds ago` : diff < 3600 ? `${Math.floor(diff / 60)} minutes ago` : DateTime.fromJSDate(date).toFormat('dd MMM')
// }









