import { Component, OnInit,ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { NavigationExtras, Router } from '@angular/router';
import { Client } from 'src/app/models/Client';
import { AuthService } from 'src/app/services/auth.service';
import { ClientserviceService } from 'src/app/services/clientservice.service';

@Component({
  selector: 'app-list-clients',
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.scss']
})
export class ListClientsComponent implements OnInit {

  showSpinner = false

  displayedColumns: string[] = ['summary',"gender","email","phone","location","responsable","tags"];

  dataSource!: MatTableDataSource<Client>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  user:any

  constructor(private auth:AuthService,private clientService:ClientserviceService,private router:Router){}

  ngOnInit(): void {
    this.showSpinner = true
    this.auth.getUserState().subscribe((user) => {
      this.user = user
      this.clientService.getAllClientsByUser(this.user.email).subscribe((res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.showSpinner = false
      })  
    })
    
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



  passData(client_id:any)
  {
    let navigationExtras: NavigationExtras = {
      queryParams: {
          "client_id": client_id
      }
    };

    // this.router.navigate(["/edit-client"],  navigationExtras);
    this.router.navigate(["/info-client"],  navigationExtras);

    // this.router.navigateByUrl('/client', { state: client });
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


}
