import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { TableInterface } from '../interfaces/tableData';
import { concat, map, Observable } from 'rxjs';

interface paymentsWithEmails {
  id : string
  amount : number
  status : string
  email : string
}


@Injectable({
  providedIn: 'root'
})
export class GetTableDataService {
  constructor(private http : HttpClient) { }

  fetchTableData() : Observable<TableInterface[]> {
    const tableData$ = this.http.get<TableInterface[]>("http://localhost:3000/TableData");

    const emailData$ = this.http.get<paymentsWithEmails[]>("http://localhost:3000/emails");

    return tableData$;
  }
}
