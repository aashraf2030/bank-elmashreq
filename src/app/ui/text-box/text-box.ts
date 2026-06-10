import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Self, Optional, inject, input, signal, computed } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-box',
  imports: [],
  templateUrl: './text-box.html',
  styleUrl: './text-box.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextBox implements ControlValueAccessor {
  // Inputs
  label = input<string | null>(null);
  placeholder = input<string>('');
  type = input<string>('text');
  hint = input<string | null>(null);
  icon = input<string | null>(null); // Start icon (e.g. 'mail', 'lock')
  iconEnd = input<string | null>(null); // End icon (e.g. 'search')
  required = input<boolean>(false);
  clearable = input<boolean>(false);
  onlyDigits = input<boolean>(false);
  maxLength = input<number | null>(null);
  minLength = input<number | null>(null);

  // Internal signal state
  value = signal<string>('');
  disabled = signal<boolean>(false);
  focused = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  private cdr = inject(ChangeDetectorRef);
  @Optional() @Self() public ngControl = inject(NgControl, { optional: true });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  // Callbacks for ControlValueAccessor
  onChange: any = () => { };
  onTouched: any = () => { };

  // Get validation state
  get isInvalid(): boolean {
    const control = this.ngControl?.control;
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  get isTouched(): boolean {
    return !!this.ngControl?.control?.touched;
  }

  get errorMessage(): string | null {
    const control = this.ngControl?.control;
    if (control && control.errors && (control.touched || control.dirty)) {
      if (control.errors['required']) return 'هذا الحقل مطلوب';
      if (control.errors['email']) return 'بريد إلكتروني غير صالح';
      if (control.errors['minlength']) return `الحد الأدنى للحروف هو ${control.errors['minlength'].requiredLength}`;
      if (control.errors['pattern']) return 'صيغة الإدخال غير صالحة';
      return 'إدخال غير صالح';
    }
    return null;
  }

  // Input type helper for password toggles
  inputType = computed(() => {
    if (this.type() === 'password') {
      return this.showPassword() ? 'text' : 'password';
    }
    return this.type();
  });

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.value.set(value || '');
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
    this.cdr.markForCheck();
  }

  // Event handlers
  onInput(event: Event): void {
    let val = (event.target as HTMLInputElement).value;
    if (this.onlyDigits()) {
      val = val.replace(/\D/g, ''); // strip non-digits
      (event.target as HTMLInputElement).value = val; // update DOM input field value
    }
    this.value.set(val);
    this.onChange(val);
  }

  onFocus(): void {
    this.focused.set(true);
  }

  onBlur(): void {
    this.focused.set(false);
    this.onTouched();
  }

  clear(): void {
    this.value.set('');
    this.onChange('');
    this.cdr.markForCheck();
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((show) => !show);
  }
}
