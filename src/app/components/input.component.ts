
import { Component } from '@angular/core';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';

@Component({
  selector: 'spartan-input-preview',
  standalone: true,
  imports: [HlmInputDirective],
  template: `<input class="w-80" hlmInput placeholder='Email' type='email' />`,
})
export class InputPreviewComponent {}
