import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { AddClientComponent } from './components/clients/add-client/add-client.component';
import { EditClientComponent } from './components/clients/edit-client/edit-client.component';
import { InfoClientComponent } from './components/clients/info-client/info-client.component';
import { ListClientsComponent } from './components/clients/list-clients/list-clients.component';
import { TasksCalendarComponent } from './components/tasks/tasks-calendar/tasks-calendar.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'list-clients',
    component: ListClientsComponent
  },
  {
    path: 'add-client',
    component: AddClientComponent
  },
  {
    path: 'edit-client',
    component: EditClientComponent
  },
  {
    path: 'info-client',
    component: InfoClientComponent
  },
  {
    path: 'tasks-calendar',
    component: TasksCalendarComponent
  },
  {
    path: '',
    redirectTo: '/list-clients',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
