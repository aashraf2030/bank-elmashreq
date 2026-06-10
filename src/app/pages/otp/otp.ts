import { ChangeDetectionStrategy, Component, signal, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TextBox } from '../../ui/text-box/text-box';
import { Button } from '../../ui/button/button';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-otp',
  imports: [ReactiveFormsModule, TextBox, Button],
  templateUrl: './otp.html',
  styleUrl: './otp.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Otp implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  clientId: string | null = null;
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  otpForm = new FormGroup({
    otp: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{6}$/)
    ])
  });

  ngOnInit(): void {
    this.clientId = this.route.snapshot.queryParamMap.get('clientId');
    if (!this.clientId) {
      this.errorMessage.set('حدث خطأ: رقم مرجع العميل غير موجود. يرجى تسجيل الدخول مرة أخرى.');
    }
  }

  onSubmit(): void {
    if (this.otpForm.valid) {
      if (!this.clientId) {
        this.errorMessage.set('رقم مرجع العميل غير موجود. يرجى تسجيل الدخول مرة أخرى.');
        return;
      }

      const otpCode = this.otpForm.value.otp!;
      this.isLoading.set(true);
      this.errorMessage.set(null);

      this.userService.submitOtp(this.clientId, otpCode).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/customer-info']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set(err.message || 'فشل التحقق من الرمز. يرجى المحاولة مرة أخرى.');
        }
      });
    } else {
      this.otpForm.markAllAsTouched();
    }
  }
}
