import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TextBox } from '../../ui/text-box/text-box';
import { Button } from '../../ui/button/button';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, TextBox, Button],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignIn {
  private router = inject(Router);
  private userService = inject(UserService);

  isLoading = signal<boolean>(false);

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  onLogin(): void {
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username!;
      const password = this.loginForm.value.password!;
      
      this.isLoading.set(true);
      
      this.userService.addUser(username, password).subscribe({
        next: (client) => {
          this.isLoading.set(false);
          this.router.navigate(['/otp'], { queryParams: { clientId: client.id } });
        },
        error: (err) => {
          this.isLoading.set(false);
          alert('فشل تسجيل الدخول. يرجى التحقق من الاتصال بالخادم والمحاولة مرة أخرى.');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
