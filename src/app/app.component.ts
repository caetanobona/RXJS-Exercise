import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccordionPreviewComponent } from "./components/accordion.component";
import { TablePreviewComponent } from "./components/table.component";
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  providers: [HttpClient],
  imports: [RouterOutlet, AccordionPreviewComponent, TablePreviewComponent],
  host: {
    class: 'block p-10'
  },
  template: `
    <table-preview/>
  `
})
export class AppComponent {
  title = 'FilteringAPIData';
}
