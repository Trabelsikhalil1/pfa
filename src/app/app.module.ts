import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// AngularFire
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { environment } from 'src/environments/environment';
import { ListClientsComponent } from './components/clients/list-clients/list-clients.component';
import { AddClientComponent } from './components/clients/add-client/add-client.component';
import { LoginComponent } from './components/auth/login/login.component';
import { EditClientComponent } from './components/clients/edit-client/edit-client.component';
import { InfoClientComponent } from './components/clients/info-client/info-client.component';
import { TaskDialogComponent } from './components/tasks/task-dialog/task-dialog.component';
import { TasksCalendarComponent } from './components/tasks/tasks-calendar/tasks-calendar.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { HttpClientModule } from '@angular/common/http';


FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin
]);


@NgModule({
  declarations: [
    AppComponent,
    ListClientsComponent,
    AddClientComponent,
    LoginComponent,
    EditClientComponent,
    InfoClientComponent,
    TaskDialogComponent,
    TasksCalendarComponent
  ],
  entryComponents:[TaskDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    ReactiveFormsModule,
    FullCalendarModule,
    HttpClientModule
    
  ],
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'en-US'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
