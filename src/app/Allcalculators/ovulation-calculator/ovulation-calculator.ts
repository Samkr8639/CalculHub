import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ovulation-calculator',
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './ovulation-calculator.html',
  styleUrls: ['./ovulation-calculator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OvulationCalculatorComponent {
  lmpDate = signal<string>('');
  cycleLength = signal<number>(28);

  today = new Date();

  result = computed(() => {
    const lmp = this.lmpDate();
    const cycle = this.cycleLength();
    if (!lmp || cycle < 21 || cycle > 35) return null;
    const lmpTime = new Date(lmp).getTime();
    if (isNaN(lmpTime)) return null;

    const MS = 24 * 60 * 60 * 1000;
    const ovulationDay = cycle - 14; // days after LMP
    const ovulationDate = new Date(lmpTime + ovulationDay * MS);
    const fertileStart = new Date(lmpTime + (ovulationDay - 5) * MS);
    const fertileEnd = new Date(lmpTime + (ovulationDay + 1) * MS);
    const nextPeriod = new Date(lmpTime + cycle * MS);
    const nextOvulation = new Date(nextPeriod.getTime() + (cycle - 14) * MS);
    const nextFertileStart = new Date(nextPeriod.getTime() + (cycle - 14 - 5) * MS);

    const nowMs = this.today.getTime();
    const isInFertileWindow = nowMs >= fertileStart.getTime() && nowMs <= fertileEnd.getTime();
    const daysToOvulation = Math.round((ovulationDate.getTime() - nowMs) / MS);

    return { ovulationDate, fertileStart, fertileEnd, nextPeriod, nextOvulation, nextFertileStart, isInFertileWindow, daysToOvulation };
  });

  onLmpChange(event: Event) { this.lmpDate.set((event.target as HTMLInputElement).value); }
  onCycleChange(event: Event) { this.cycleLength.set(parseInt((event.target as HTMLInputElement).value) || 28); }
}
