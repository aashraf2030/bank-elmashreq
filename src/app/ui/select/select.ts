import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Self, Optional, inject, input, signal, computed, ElementRef } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

export interface SelectOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-select',
  imports: [],
  templateUrl: './select.html',
  styleUrl: './select.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(keydown)': 'onKeyDown($event)'
  }
})
export class Select implements ControlValueAccessor {
  // Inputs
  label = input<string | null>(null);
  placeholder = input<string>('اختر خياراً...');
  options = input<SelectOption[]>([]);
  hint = input<string | null>(null);
  icon = input<string | null>(null); // Start icon
  required = input<boolean>(false);
  searchable = input<boolean>(false);

  // Internal signal state
  value = signal<any>(null);
  disabled = signal<boolean>(false);
  focused = signal<boolean>(false);
  isOpen = signal<boolean>(false);
  searchTerm = signal<string>('');
  focusedIndex = signal<number>(-1);

  private cdr = inject(ChangeDetectorRef);
  private elementRef = inject(ElementRef);
  @Optional() @Self() public ngControl = inject(NgControl, { optional: true });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  // Callbacks
  onChange: any = () => {};
  onTouched: any = () => {};

  // Computed state
  filteredOptions = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const opts = this.options();
    if (!term) return opts;
    return opts.filter(opt => opt.label.toLowerCase().includes(term));
  });

  selectedLabel = computed(() => {
    const val = this.value();
    const found = this.options().find(opt => opt.value === val);
    return found ? found.label : '';
  });

  get isInvalid(): boolean {
    const control = this.ngControl?.control;
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  get errorMessage(): string | null {
    const control = this.ngControl?.control;
    if (control && control.errors && (control.touched || control.dirty)) {
      if (control.errors['required']) return 'هذا الحقل مطلوب';
      return 'إدخال غير صالح';
    }
    return null;
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.value.set(value);
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
  toggleDropdown(): void {
    if (this.disabled()) return;
    if (this.isOpen()) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown(): void {
    this.isOpen.set(true);
    this.focused.set(true);
    this.searchTerm.set('');
    // Focus first option or selected option
    const currentIndex = this.filteredOptions().findIndex(opt => opt.value === this.value());
    this.focusedIndex.set(currentIndex >= 0 ? currentIndex : 0);
  }

  closeDropdown(): void {
    this.isOpen.set(false);
    this.focused.set(false);
    this.onTouched();
  }

  selectOption(option: SelectOption): void {
    this.value.set(option.value);
    this.onChange(option.value);
    this.closeDropdown();
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.set(term);
    this.focusedIndex.set(0); // reset focus index to top when search filters
  }

  onDocumentClick(event: MouseEvent): void {
    // Close dropdown if click occurs outside the element
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled()) return;

    const list = this.filteredOptions();
    const index = this.focusedIndex();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.openDropdown();
        } else if (list.length > 0) {
          const nextIndex = (index + 1) % list.length;
          this.focusedIndex.set(nextIndex);
          this.scrollIntoView(nextIndex);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen()) {
          this.openDropdown();
        } else if (list.length > 0) {
          const prevIndex = (index - 1 + list.length) % list.length;
          this.focusedIndex.set(prevIndex);
          this.scrollIntoView(prevIndex);
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (this.isOpen()) {
          if (list[index]) {
            this.selectOption(list[index]);
          }
        } else {
          this.openDropdown();
        }
        break;
      case 'Escape':
      case 'Tab':
        if (this.isOpen()) {
          this.closeDropdown();
          if (event.key === 'Escape') {
            event.preventDefault();
          }
        }
        break;
    }
  }

  private scrollIntoView(index: number): void {
    setTimeout(() => {
      const activeEl = this.elementRef.nativeElement.querySelector(`.option-item-${index}`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    });
  }
}
