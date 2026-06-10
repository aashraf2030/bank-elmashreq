import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TextBox } from '../../ui/text-box/text-box';
import { Button } from '../../ui/button/button';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, TextBox, Button],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private router = inject(Router);
  private userService = inject(UserService);

  isLoading = signal<boolean>(false);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  onLogin(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email!;
      const password = this.loginForm.value.password!;
      
      this.isLoading.set(true);
      
      this.userService.loginAdmin(email, password).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading.set(false);
          alert('فشل تسجيل الدخول. يرجى التحقق من البريد الإلكتروني وكلمة المرور.');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
