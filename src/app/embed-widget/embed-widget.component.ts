import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-embed-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './embed-widget.component.html',
  styleUrls: ['./embed-widget.component.css']
})
export class EmbedWidgetComponent {
  @Input({ required: true }) toolPath!: string;
  @Input({ required: true }) toolName!: string;
  @Input() height = 650;

  copied = signal(false);

  get embedCode(): string {
    const domain = 'https://www.calculhub.in';
    const cleanPath = this.toolPath.startsWith('/') ? this.toolPath : '/' + this.toolPath;
    
    return `<iframe src="${domain}${cleanPath}" width="100%" height="${this.height}" style="border:none; overflow:hidden; border-radius:12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" title="${this.toolName} - CalculHub"></iframe>\n<p style="font-size: 13px; text-align: center; font-family: sans-serif; color: #8F8F8F; margin-top: 8px;">Powered by <a href="${domain}" style="color: #E11931; text-decoration: none; font-weight: 500;" target="_blank">CalculHub</a></p>`;
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.embedCode).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
