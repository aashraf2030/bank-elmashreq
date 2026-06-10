import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  // Inputs
  variant = input<'primary' | 'secondary' | 'outline' | 'text' | 'success' | 'danger'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  icon = input<string | null>(null);
  iconPosition = input<'start' | 'end'>('start');
  fullWidth = input<boolean>(false);

  // Computed styles based on inputs
  buttonClasses = computed(() => {
    const baseClasses = 'relative inline-flex items-center justify-center font-semibold rounded-full select-none transition-all duration-200 outline-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    // Width
    const widthClass = this.fullWidth() ? 'w-full' : '';

    // Variant classes matching Bank El-Mashreq color theme
    let variantClass = '';
    switch (this.variant()) {
      case 'primary':
        variantClass = 'bg-primary text-on-primary hover:bg-primary-container focus:ring-primary shadow-sm hover:shadow-md';
        break;
      case 'secondary':
        // Vivid orange/gold with hover scaling and shadow glow
        variantClass = 'bg-secondary-container text-on-secondary hover:bg-secondary focus:ring-secondary-container shadow-md hover:shadow-lg shadow-[0_4px_14px_rgba(255,94,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,94,0,0.4)] btn-glow hover:scale-105 active:scale-95';
        break;
      case 'outline':
        variantClass = 'bg-transparent text-primary border-2 border-primary hover:bg-primary-fixed hover:text-primary-container focus:ring-primary';
        break;
      case 'text':
        variantClass = 'bg-transparent text-primary hover:bg-primary-fixed focus:ring-primary';
        break;
      case 'success':
        variantClass = 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm';
        break;
      case 'danger':
        variantClass = 'bg-error text-on-error hover:bg-red-700 focus:ring-error shadow-sm';
        break;
    }

    // Size classes
    let sizeClass = '';
    switch (this.size()) {
      case 'sm':
        sizeClass = 'px-4 py-1.5 text-sm gap-1.5';
        break;
      case 'md':
        sizeClass = 'px-6 py-2.5 text-base gap-2';
        break;
      case 'lg':
        sizeClass = 'px-8 py-3.5 text-lg gap-2.5';
        break;
    }

    return `${baseClasses} ${widthClass} ${variantClass} ${sizeClass}`;
  });
}
