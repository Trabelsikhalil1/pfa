import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DateTime } from "luxon";

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private tasksCollection: AngularFirestoreCollection<Task>;
  tasks: Observable<Task[]>;
  constructor(private db: AngularFirestore) {
    this.tasksCollection = db.collection<Task>('Tasks');
    this.tasks = this.tasksCollection.valueChanges();
   }

  addItem(task: Task) {
    return this.tasksCollection.add(task);
  }
  getAllTasks()
  {
    return this.tasksCollection.valueChanges({idField:"id"});
    
  }
  updateTask(id:string,task: Task) {
    return this.tasksCollection.doc(id).update(task);
  }

  getAllCompletedTasksByUser(client_id:any)
  {
    return this.db.collection<Task>('Tasks',ref => ref.where('completed', '==', false).where('client_id', '==', client_id)).valueChanges({idField:"id"});
  }

  getAllCompletedTasks()
  {
    return this.db.collection<Task>('Tasks',ref => ref.where('completed', '==', true)).valueChanges({idField:"id"});
  }

  getAllUncompletedTasks()
  {
    return this.db.collection<Task>('Tasks',ref => ref.where('completed', '==', false)).valueChanges({idField:"id"});
  }

  getAllUncompletedTasksByClientId(client_id:string)
  {
    return this.db.collection<Task>('Tasks',ref => ref.where('completed', '==', false).where('client_id', '==', client_id)).valueChanges({idField:"id"});
  }

  getAllCompletedTasksByClientId(client_id:string)
  {
    return this.db.collection<Task>('Tasks',ref => ref.where('client_id', '==', client_id).where('completed', '==', true).orderBy("completed_at")).valueChanges({idField:"id"});
  }


  getOverdueTasks(client_id:string)
  {
    return this.db.collection<Task>('Tasks',ref => ref.where('client_id', '==', client_id).where('completed', '==', false).where('due_date', '<',new Date() )).valueChanges({idField:"id"});
  }

  getNext7daysTasks(client_id:string)
  {
    return this.db.collection<Task>('Tasks',ref => ref.where('client_id', '==', client_id).where('completed', '==', false).where('due_date', '>',new Date(new Date().setHours(23,59,59)) )).valueChanges({idField:"id"});
  }

  getTodaysTasks(client_id:string)
  {
    return this.db.collection<Task>('Tasks',ref => ref.where('client_id', '==', client_id).where('completed', '==', false).where('due_date', '<=',new Date(new Date().setHours(23,59,59))).where('due_date', '>',new Date())).valueChanges({idField:"id"});
  }



  getAllUncompletedTasksByUser(user_id:string)
  {
    return this.db.collection<Task>('Tasks',ref => ref.where('completed', '==', false).where('created_by.email',"==",user_id)).valueChanges({idField:"id"});
  }

  


}
