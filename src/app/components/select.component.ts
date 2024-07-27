
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrnSelectImports } from '@spartan-ng/ui-select-brain';
import { HlmSelectImports } from '@spartan-ng/ui-select-helm';
import { filter } from 'rxjs';

@Component({
  selector: 'select-preview',
  standalone: true,
  imports: [CommonModule, BrnSelectImports, HlmSelectImports],
  template: `
    <brn-select class="inline-block" placeholder="{{ placeholder }}">
      <hlm-select-trigger class="w-28">
        <hlm-select-value />
      </hlm-select-trigger>
      <hlm-select-content>
        <hlm-option *ngFor="let filterOption of filterOptions" value="{{filterOption}}" (click)="select(filterOption)">{{filterOption}}</hlm-option>
      </hlm-select-content>
    </brn-select>
  `,
})
export class SelectPreviewComponent {
  @Input() placeholder! : string;
  @Input() filterOptions! : string[];
  @Input() filterColumn! : string
  @Output() valueChangedEvent = new EventEmitter<string[]>()
  @Input() selectedValue : string = ""; 

  select(filterOption : string): void {
    this.valueChangedEvent.emit([this.filterColumn, filterOption])
  }

}
