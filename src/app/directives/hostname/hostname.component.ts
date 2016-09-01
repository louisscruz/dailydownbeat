import { Input, Component } from '@angular/core';

@Component({
  selector: 'hostname',
  template: `<i class="hostname">({{hostname}})</i>`,
})

export class Hostname {
  private hostname: string;

  @Input() url: string;

  // This uses the DOM; Fix in the future
  getHostname(url: string): string {
    let parser = document.createElement('a');
    parser.href = url;
    let hostname = parser.hostname;
    return parser.hostname;
  }

  ngOnInit() {
    this.hostname = this.getHostname(this.url);
  }
}
