import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Client } from '../models/Client';
@Injectable({
  providedIn: 'root'
})
export class ClientserviceService {
  private clientsCollection: AngularFirestoreCollection<Client>;
  clients: Observable<Client[]>;
  constructor(private db: AngularFirestore) {
    this.clientsCollection = db.collection<Client>('Clients');
    this.clients = this.clientsCollection.valueChanges({ idField: 'id' });
   }

  addItem(client: Client) {
    return this.clientsCollection.add(client);
  }
  getAllClients()
  {
    return this.clientsCollection.valueChanges({idField:"id"});
  }
  updateClient(id:string,client: Client) {
    return this.clientsCollection.doc(id).update(client);
  }

  getClientById(id:string)
  {
    return this.clientsCollection.doc(id).valueChanges({idField:"id"});
  }

  getAllClientsByUser(user_email:string)
  {
    return this.db.collection<Client>('Clients',ref => ref.where('responsable.email', '==', user_email)).valueChanges({idField:"id"});
  }
}
