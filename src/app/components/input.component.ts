import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

@Component({
  selector: 'spartan-input-preview',
  standalone: true,
  imports: [FormsModule, HlmInputDirective],
  template: `<input class="w-80" hlmInput placeholder='Email' type='email' [(ngModel)]="inputValue" (input)="onChange(inputValue)"/>`,
})
export class InputPreviewComponent {
  @Output() valueChangedEvent : EventEmitter<string> = new EventEmitter<string>()
  inputValue : string = "";

  onChange(value : string):void {
    this.valueChangedEvent.emit(value)
  }
}
