import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  HlmCaptionComponent,
  HlmTableComponent,
  HlmTdComponent,
  HlmThComponent,
  HlmTrowComponent,
} from '@spartan-ng/ui-table-helm';
import { SelectPreviewComponent } from './select.component';
import { InputPreviewComponent } from './input.component';
import { GetTableDataService } from '../services/get-table-data.service';
import { TableInterface } from '../interfaces/tableData';
import { BehaviorSubject, Observable, map, combineLatest, of } from 'rxjs';

@Component({
  selector: 'table-preview',
  standalone: true,
  imports: [
    HlmTableComponent,
    HlmTrowComponent,
    HlmThComponent,
    HlmTdComponent,
    HlmCaptionComponent,
    SelectPreviewComponent,
    CommonModule,
    FormsModule,
    InputPreviewComponent,
  ],
  host: {
    class: 'w-full overflow-x-auto',
  },
  template: `
    <spartan-input-preview (valueChangedEvent)="onEmailSearch($event)" />
    <hlm-table class="w-full min-w-[400px]">
      <hlm-caption>A list of your recent invoices.</hlm-caption>
      <hlm-trow>
        <hlm-th class="w-[206px]">Index</hlm-th>
        <div class="flex mr-14 items-center">
          <hlm-th>Status</hlm-th>
          <select-preview
            [filterOptions]="['None', 'Paid', 'Pending', 'Unpaid']"
            [placeholder]="'Filter by'"
            [filterColumn]="'Status'"
            (valueChangedEvent)="onFilterChange($event)"
          />
        </div>
        <div class="flex items-center w-64">
          <hlm-th>Method</hlm-th>
          <select-preview
            [filterOptions]="['None', 'Bank Transfer', 'Credit Card', 'PayPal']"
            [placeholder]="'Filter by'"
            [filterColumn]="'Method'"
            (valueChangedEvent)="onFilterChange($event)"
          />
        </div>
        <hlm-th class="flex-1">Email</hlm-th>
        <hlm-th class="justify-end w-40">Amount</hlm-th>
      </hlm-trow>
      <!-- async para que angular atualize a lista conforme valores são alterados na observable -->
      @for (invoice of filteredTableData$ | async; track invoice.id) {
      <hlm-trow>
        <hlm-td truncate class="font-medium w-52">{{ invoice.id }}</hlm-td>
        <hlm-td class="w-60">{{ invoice.paymentStatus }}</hlm-td>
        <hlm-td class="w-64">{{ invoice.paymentMethod }}</hlm-td>
        <hlm-td class="flex-1">{{ invoice.email }}</hlm-td>
        <hlm-td class="justify-end w-40">{{
          invoice.totalAmount | currency
        }}</hlm-td>
      </hlm-trow>
      }
      <hlm-trow class="bg-muted/50 hover:bg-muted">
        <hlm-td truncate class="w-[100px] font-semibold">Total</hlm-td>
        <hlm-td class="w-40"></hlm-td>
        <hlm-td class="flex-1"></hlm-td>
        <hlm-td class="justify-end w-40">{{ totalAmount$ | async | currency }}</hlm-td>
      </hlm-trow>
    </hlm-table>
  `,
})
export class TablePreviewComponent {
  tableData$: Observable<TableInterface[]> = new Observable<TableInterface[]>();
  filteredTableData$: Observable<TableInterface[]> = new Observable<TableInterface[]>();
  totalAmount$: Observable<number> = new Observable<number>();
  private statusFilterSubject: BehaviorSubject<string> = new BehaviorSubject<string>('None');
  private methodFilterSubject: BehaviorSubject<string> = new BehaviorSubject<string>('None');
  private emailSearchSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private getTableDataService: GetTableDataService) {}

  ngOnInit(): void {
    this.tableData$ = this.getTableDataService.fetchTableData();

    // atualiza sempre que um subject tem seu valor alterado pelo .next()
    // já que por padrão os filtros são "None", a filteredTableData$ inicializa com o mesmo valor da tableData$
    this.filteredTableData$ = combineLatest([
      this.tableData$,
      this.statusFilterSubject.asObservable(),
      this.methodFilterSubject.asObservable(),
      this.emailSearchSubject.asObservable(),
    ]).pipe(
      // mapeia todos os dados (tableData) passando os paramêtros dos filtros
      map(([tableData, statusFilter, methodFilter, emailSearch]) => {
        // filter para filtrar de acordo com os parâmetros (atualizados conforme evento valueChangedEvent do componente select)
        return tableData.filter((invoice) => {
          // invoice só passa pelo filtro se o filtro for "None" ou se o valor do filtro condizer com a devida propriedade do 
          return (
            (statusFilter === 'None' ||
              invoice.paymentStatus === statusFilter) &&
            (methodFilter === 'None' ||
              invoice.paymentMethod === methodFilter) &&
            (emailSearch === '' ||
              invoice.email.toLowerCase().includes(emailSearch.toLowerCase()))
          );
        });
      })
    );

    //atualiza sempre que a filteredTableData$ tem seu valor atualizado pelo código acima (filtro)
    this.totalAmount$ = this.filteredTableData$.pipe(
        //reduce() está somando a propriedade totalAmount de cada um dos itens, tendo como retorno final essa soma
        //tableData está recebendo o valor de retorno de reduce(), filteredTableData$ recebe o valor de tableData e passa-o em forma de Observable para totalAmount$
        map(tableData => tableData.reduce((totalAmount, invoice) => totalAmount + invoice.totalAmount, 0))
    )
  }

  onFilterChange(filterArgs: string[]): void {
    const [filterColumn, filterValue] = filterArgs;

    console.log(`Filter Column: ${filterColumn}`);
    console.log(`Filter Value: ${filterValue}`);

    // checa de qual coluna veio a atualização, para então atualizar seu respectivo BehaviorSubject (por padrão emitindo um evento e atualizando filteredTableData$)
    if (filterColumn === 'Status') {
      this.statusFilterSubject.next(filterValue);
    } else if (filterColumn === 'Method') {
      this.methodFilterSubject.next(filterValue);
    }
  }

  onEmailSearch(searchText: string): void {
    this.emailSearchSubject.next(searchText);
  }

}
