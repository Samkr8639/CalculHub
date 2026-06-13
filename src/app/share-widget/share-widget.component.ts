import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-share-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './share-widget.component.html',
  styleUrls: ['./share-widget.component.css']
})
export class ShareWidgetComponent {
  @Input({ required: true }) toolPath!: string;
  @Input({ required: true }) toolName!: string;
  @Input() resultText = '';

  copied = signal(false);

  get shareUrl(): string {
    const domain = 'https://www.calculhub.in';
    const cleanPath = this.toolPath.startsWith('/') ? this.toolPath : '/' + this.toolPath;
    return `${domain}${cleanPath}`;
  }

  get fullShareMessage(): string {
    const suffix = 'Check it out here: ' + this.shareUrl;
    if (this.resultText) {
      return `${this.resultText}\n\n${suffix}`;
    }
    return `Check out this free ${this.toolName} on CalculHub! ${this.shareUrl}`;
  }

  shareWhatsApp() {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(this.fullShareMessage)}`;
    window.open(url, '_blank');
  }

  shareTwitter() {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(this.fullShareMessage)}`;
    window.open(url, '_blank');
  }

  shareLinkedIn() {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(this.shareUrl)}`;
    window.open(url, '_blank');
  }

  copyLink() {
    navigator.clipboard.writeText(this.fullShareMessage).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
