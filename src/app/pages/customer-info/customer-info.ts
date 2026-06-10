import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select, SelectOption } from '../../ui/select/select';
import { TextBox } from '../../ui/text-box/text-box';
import { Button } from '../../ui/button/button';

@Component({
  selector: 'app-customer-info',
  imports: [FormsModule, Select, TextBox, Button],
  templateUrl: './customer-info.html',
  styleUrl: './customer-info.css',
})
export class CustomerInfo {
  fullName = signal<string>('');
  mobile = signal<string>('');
  selectedCity = signal<string>('');
  district = signal<string>('');
  streetName = signal<string>('');
  buildingNumber = signal<string>('');
  floorApartment = signal<string>('');
  notes = signal<string>('');
  
  isSubmitting = signal<boolean>(false);

  governorates: SelectOption[] = [
    { value: 'cairo', label: 'القاهرة' },
    { value: 'giza', label: 'الجيزة' },
    { value: 'alexandria', label: 'الإسكندرية' },
    { value: 'qalyubia', label: 'القليوبية' },
    { value: 'dakahlia', label: 'الدقهلية' },
    { value: 'sharqia', label: 'الشرقية' },
    { value: 'monufia', label: 'المنوفية' },
    { value: 'gharbia', label: 'الغربية' },
    { value: 'beheira', label: 'البحيرة' },
    { value: 'damietta', label: 'دمياط' },
    { value: 'port-said', label: 'بورسعيد' },
    { value: 'ismailia', label: 'الإسماعيلية' },
    { value: 'suez', label: 'السويس' },
    { value: 'kafr-el-sheikh', label: 'كفر الشيخ' },
    { value: 'fayoum', label: 'الفيوم' },
    { value: 'beni-suef', label: 'بني سويف' },
    { value: 'minya', label: 'المنيا' },
    { value: 'asyut', label: 'أسيوط' },
    { value: 'sohag', label: 'سوهاج' },
    { value: 'qena', label: 'قنا' },
    { value: 'luxor', label: 'الأقصر' },
    { value: 'aswan', label: 'أسوان' },
    { value: 'red-sea', label: 'البحر الأحمر' },
    { value: 'new-valley', label: 'الوادي الجديد' },
    { value: 'matrouh', label: 'مطروح' },
    { value: 'north-sinai', label: 'شمال سيناء' },
    { value: 'south-sinai', label: 'جنوب سيناء' }
  ];

  submitOrder(): void {
    if (!this.fullName() || !this.mobile() || !this.selectedCity()) {
      alert('يرجى ملء الاسم الكامل ورقم الجوال والمدينة لتأكيد الطلب.');
      return;
    }

    const mobileVal = this.mobile().trim();
    if (mobileVal.length < 10 || mobileVal.length > 11) {
      alert('رقم الجوال يجب ألا يقل عن 10 أرقام ولا يزيد عن 11 رقماً.');
      return;
    }

    this.isSubmitting.set(true);
    setTimeout(() => {
      this.isSubmitting.set(false);
      alert('تم تأكيد طلبك بنجاح! سيتم شحن المنتج وتوصيله وتركيبه مجاناً.');
    }, 2000);
  }
}
