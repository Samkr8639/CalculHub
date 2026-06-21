import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pregnancy-calculator',
  imports: [CommonModule, DatePipe, FormsModule, RouterLink],
  templateUrl: './pregnancy-calculator.html',
  styleUrls: ['./pregnancy-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PregnancyCalculatorComponent {
  lmpDate = signal<string>('');
  cycleLength = signal<number>(28);

  today = new Date();

  result = computed(() => {
    const lmp = this.lmpDate();
    if (!lmp) return null;
    const lmpTime = new Date(lmp).getTime();
    const now = this.today.getTime();
    if (isNaN(lmpTime) || lmpTime > now) return null;

    const dueDate = new Date(lmpTime + 280 * 24 * 60 * 60 * 1000);
    const daysSinceLmp = Math.floor((now - lmpTime) / (24 * 60 * 60 * 1000));
    const currentWeek = Math.floor(daysSinceLmp / 7);
    const currentDay = daysSinceLmp % 7;
    const daysRemaining = Math.max(0, Math.ceil((dueDate.getTime() - now) / (24 * 60 * 60 * 1000)));
    const progressPct = Math.min(100, Math.round((daysSinceLmp / 280) * 100));

    const trimester = currentWeek < 13 ? 1 : currentWeek < 27 ? 2 : 3;
    const trimesterName = trimester === 1 ? 'First Trimester' : trimester === 2 ? 'Second Trimester' : 'Third Trimester';

    const milestones = [
      { label: 'Heartbeat detectable (6 weeks)', date: new Date(lmpTime + 42 * 24 * 60 * 60 * 1000), week: 6 },
      { label: 'First trimester ends (13 weeks)', date: new Date(lmpTime + 91 * 24 * 60 * 60 * 1000), week: 13 },
      { label: 'Anatomy scan / Gender reveal (20 weeks)', date: new Date(lmpTime + 140 * 24 * 60 * 60 * 1000), week: 20 },
      { label: 'Viability milestone (24 weeks)', date: new Date(lmpTime + 168 * 24 * 60 * 60 * 1000), week: 24 },
      { label: 'Third trimester begins (27 weeks)', date: new Date(lmpTime + 189 * 24 * 60 * 60 * 1000), week: 27 },
      { label: 'Full term begins (37 weeks)', date: new Date(lmpTime + 259 * 24 * 60 * 60 * 1000), week: 37 },
      { label: 'Estimated Due Date (40 weeks)', date: dueDate, week: 40 },
    ].map(m => ({ ...m, passed: currentWeek >= m.week }));

    return { dueDate, currentWeek, currentDay, daysRemaining, progressPct, trimester, trimesterName, milestones };
  });

  onLmpChange(event: Event) {
    this.lmpDate.set((event.target as HTMLInputElement).value);
  }
}
