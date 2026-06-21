import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-age-calculator',
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './age-calculator.html',
  styleUrls: ['./age-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgeCalculatorComponent {
  dob = signal<string>('');
  asOfDate = signal<string>(new Date().toISOString().split('T')[0]);

  today = new Date().toISOString().split('T')[0];

  result = computed(() => {
    const dobStr = this.dob();
    const asOf = this.asOfDate();
    if (!dobStr || !asOf) return null;

    const dob = new Date(dobStr);
    const ref = new Date(asOf);
    if (isNaN(dob.getTime()) || isNaN(ref.getTime()) || dob > ref) return null;

    let years = ref.getFullYear() - dob.getFullYear();
    let months = ref.getMonth() - dob.getMonth();
    let days = ref.getDate() - dob.getDate();

    if (days < 0) { months--; const prevMonth = new Date(ref.getFullYear(), ref.getMonth(), 0); days += prevMonth.getDate(); }
    if (months < 0) { years--; months += 12; }

    const msPerDay = 24 * 60 * 60 * 1000;
    const totalDays = Math.floor((ref.getTime() - dob.getTime()) / msPerDay);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;

    // Next birthday
    const nextBirthday = new Date(ref.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBirthday <= ref) nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    const daysToNextBirthday = Math.ceil((nextBirthday.getTime() - ref.getTime()) / msPerDay);
    const isBirthdayToday = daysToNextBirthday === 365 || daysToNextBirthday === 366 || (dob.getMonth() === ref.getMonth() && dob.getDate() === ref.getDate());

    // Day of week born
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const bornOnDay = dayNames[dob.getDay()];

    return { years, months, days, totalDays, totalWeeks, totalMonths, totalHours, daysToNextBirthday, nextBirthday, isBirthdayToday, bornOnDay };
  });

  onDobChange(event: Event) { this.dob.set((event.target as HTMLInputElement).value); }
  onAsOfChange(event: Event) { this.asOfDate.set((event.target as HTMLInputElement).value); }
}
