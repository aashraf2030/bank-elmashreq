import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Home } from './pages/home/home';
import { SignIn } from './pages/sign-in/sign-in';
import { Otp } from './pages/otp/otp';
import { CustomerInfo } from './pages/customer-info/customer-info';
import { Dashboard } from './pages/dashboard/dashboard';
import { Login } from './pages/login/login';
import { UserService } from './services/user.service';

export const authGuard = () => {
  const userService = inject(UserService);
  const router = inject(Router);
  if (userService.isAdminAuthenticated()) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};

export const routes: Routes = [
    {
        path: "",
        component: Home
    },
    {
        path: "sign-in",
        component: SignIn
    },
    {
        path: "otp",
        component: Otp
    },
    {
        path: "customer-info",
        component: CustomerInfo
    },
    {
        path: "login",
        component: Login
    },
    {
        path: "dashboard",
        component: Dashboard,
        canActivate: [authGuard]
    }
];
