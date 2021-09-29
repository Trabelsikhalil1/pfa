import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, getDateMeta} from '@fullcalendar/angular';
import { AuthService } from 'src/app/services/auth.service';
import { TasksService } from 'src/app/services/tasks.service';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';



@Component({
  selector: 'app-tasks-calendar',
  templateUrl: './tasks-calendar.component.html',
  styleUrls: ['./tasks-calendar.component.scss']
})
export class TasksCalendarComponent implements OnInit {

  currentEvents: any = [];
  client_id: any;
  user: any;

  constructor(private auth:AuthService,private taskService:TasksService,private dialog: MatDialog,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.auth.getUserState()
      .subscribe( user => {
        this.user = user;
        this.taskService.getAllUncompletedTasksByUser(this.user.email).subscribe((tasks) => {
          this.currentEvents = fixData(tasks)
          this.calendarOptions.events = this.currentEvents
        })   
      })
    
    
  }

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth', // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };
  
  




  handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;
    let passedData = {"dialog_action":"Add","due_date":{"seconds":Math.floor(new Date(selectInfo.start).getTime() / 1000)}}
    let dialogRef = this.dialog.open(TaskDialogComponent,{ data:passedData})
      dialogRef.afterClosed().subscribe((result) => {
       if (result != "cancel")
       {
        result = this.fixDialogData(result,result.client_id)
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

    calendarApi.unselect(); // clear date selection

  }

  handleEventClick(clickInfo: EventClickArg) {
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //   clickInfo.event.remove();
    // }
    let passedData = cleanDataForDB(clickInfo.event)
    console.log(passedData)
    this.passToEditDialog(passedData,passedData.client_id,passedData.id)
    if (passedData["completed"])
    {
      clickInfo.event.remove()
    }

  }

  handleEvents(events: any) {
    this.currentEvents = events;
  }


  passToEditDialog(task:any,client_id:any,id:any)
  {
    let passedData = {"dialog_action":"Edit",...task}
    let dialogRef = this.dialog.open(TaskDialogComponent,{ data:passedData})
    dialogRef.afterClosed().subscribe((result) => {
      if (result != "cancel")
      {
        result = this.fixDialogData(result,client_id)
        // console.log(result,id)
        this.taskService.updateTask(id,result).then((res) => {
          this._snackBar.open('Task Edited !!', 'Dismiss', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 3000
          });
        })
      }
      // cleanDataForDB(result)
      // console.log("res", cleanDataForDB(result))
    })
  }

  fixDialogData(task:any,client_id:any)
  {
    console.log("task",task,client_id)
    // fixing due time
    task.due_date.setHours(task.time.hours,task.time.minutes,"00","00")
    // init client_id to current client
    task["client_id"] = client_id
    // adding user_id
    // task["created_by"] = {"displayName":this.user.displayName,"email":this.user.email}

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

}


function fixData(data:any)
{
  let colors = {
    "Call": "#D32608",
    "Email": "#D36C00",
    "Meeting": "#A2D300",
    "Send": "#00A2D3",
    "Milestone": "#00D283",
    "Follow-up": "#D2C300"
  }

  let newData = data.map((task:any) => {
    task["start"] = task.due_date.toDate().toISOString()
    task["allDay"] = false
    if (Object.keys(colors).includes(task["category"]))
    {
      let cat:keyof typeof colors = task["category"]
      task["color"] = colors[cat]
    }
    return task
  })
  // console.log("fixed ",newData, "old", data)
  return newData
}


function cleanDataForDB(data:any)
{
  return {"title":data["title"],"id":data._def["publicId"],...data["extendedProps"]}
}


// .call {
//   background-color: #D32608;
// }

// .email {
// background-color: #D36C00;
// }

// .meeting {
// background-color: #A2D300;
// }

// .send{
// background-color: #00A2D3;
// }

// .milestone {
// background-color: #00D283;
// }

// .follow-up {
// background-color: #D2C300;
// }

// .none {
//    display: none;
// }




// {
//   title  : 'event1',
//   start  : '2021-08-19T12:30:00',
//   allDay : false
// }
