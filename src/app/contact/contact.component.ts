import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [RouterLink, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  formName = signal('');
  formEmail = signal('');
  formSubject = signal('');
  formMessage = signal('');
  formSubmitted = signal(false);
  formError = signal('');

  submitForm() {
    const name = this.formName().trim();
    const email = this.formEmail().trim();
    const subject = this.formSubject().trim();
    const message = this.formMessage().trim();

    if (!name || !email || !subject || !message) {
      this.formError.set('Please fill in all fields before submitting.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.formError.set('Please enter a valid email address.');
      return;
    }

    this.formError.set('');
    // Build a mailto link as a simple client-side form submission
    const mailtoUrl = `mailto:sameervirak@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailtoUrl;
    this.formSubmitted.set(true);
  }

  resetForm() {
    this.formName.set('');
    this.formEmail.set('');
    this.formSubject.set('');
    this.formMessage.set('');
    this.formSubmitted.set(false);
    this.formError.set('');
  }
}
