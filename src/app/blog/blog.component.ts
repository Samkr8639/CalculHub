import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog',
  imports: [CommonModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogComponent {}
