import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Button } from '../../ui/button/button';
import { TextBox } from '../../ui/text-box/text-box';
import { Select, SelectOption } from '../../ui/select/select';

@Component({
  selector: 'app-home',
  imports: [ReactiveFormsModule, Button, TextBox, Select, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  // Signals for button loading states
  primaryBtnLoading = signal<boolean>(false);

  // Options for custom select dropdowns
  acModelOptions: SelectOption[] = [
    { value: 'eco-1.5', label: 'تكييف انفيرتر اقتصادي 1.5 حصان' },
    { value: 'pro-2.25', label: 'تكييف ذكي برو 2.25 حصان' },
    { value: 'elite-3.0', label: 'تكييف إيليت فائق القوة 3.0 حصان' }
  ];

  cityOptions: SelectOption[] = [
    { value: 'cairo', label: 'القاهرة' },
    { value: 'giza', label: 'الجيزة' },
    { value: 'alex', label: 'الإسكندرية' },
    { value: 'mansoura', label: 'المنصورة' },
    { value: 'suez', label: 'السويس' }
  ];

  // Demo Reactive Form
  offerForm = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    acModel: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    notes: new FormControl('')
  });

  // Submit Handler
  onSubmit(): void {
    if (this.offerForm.valid) {
      this.primaryBtnLoading.set(true);
      console.log('Form Submitted!', this.offerForm.value);
      
      // Simulate API call
      setTimeout(() => {
        this.primaryBtnLoading.set(false);
        alert('تم تقديم طلبك بنجاح! سنتواصل معك قريباً لتأكيد التوصيل والتركيب.');
        this.offerForm.reset();
      }, 2000);
    } else {
      this.offerForm.markAllAsTouched();
    }
  }
}
