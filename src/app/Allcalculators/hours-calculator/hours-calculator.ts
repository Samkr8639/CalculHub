import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface TimeEntry {
  id: number;
  hours: number | null;
  minutes: number | null;
  label: string;
}

@Component({
  selector: 'app-hours-calculator',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './hours-calculator.html',
  styleUrls: ['./hours-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HoursCalculatorComponent {
  private nextId = 1;

  entries = signal<TimeEntry[]>([
    { id: this.nextId++, hours: 8, minutes: 30, label: 'Monday' },
    { id: this.nextId++, hours: 7, minutes: 45, label: 'Tuesday' },
    { id: this.nextId++, hours: 8, minutes: 0, label: 'Wednesday' },
    { id: this.nextId++, hours: 8, minutes: 15, label: 'Thursday' },
    { id: this.nextId++, hours: 7, minutes: 30, label: 'Friday' },
  ]);

  hourlyRate = signal<number | null>(null);

  totalResult = computed(() => {
    const totalMins = this.entries().reduce((sum, e) => {
      const h = e.hours ?? 0;
      const m = e.minutes ?? 0;
      return sum + h * 60 + m;
    }, 0);
    const hours = Math.floor(totalMins / 60);
    const minutes = totalMins % 60;
    const rate = this.hourlyRate();
    const totalPay = rate ? (totalMins / 60) * rate : null;
    return { hours, minutes, totalMins, totalPay };
  });

  addEntry() {
    this.entries.update(e => [...e, { id: this.nextId++, hours: 0, minutes: 0, label: `Entry ${this.entries().length + 1}` }]);
  }

  removeEntry(id: number) {
    if (this.entries().length <= 1) return;
    this.entries.update(e => e.filter(entry => entry.id !== id));
  }

  updateLabel(id: number, label: string) { this.entries.update(e => e.map(en => en.id === id ? { ...en, label } : en)); }
  updateHours(id: number, hours: number | null) { this.entries.update(e => e.map(en => en.id === id ? { ...en, hours } : en)); }
  updateMinutes(id: number, minutes: number | null) { this.entries.update(e => e.map(en => en.id === id ? { ...en, minutes } : en)); }
  updateRate(event: Event) { const v = parseFloat((event.target as HTMLInputElement).value); this.hourlyRate.set(isNaN(v) ? null : v); }
}
