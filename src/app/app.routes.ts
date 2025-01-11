import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'payment-plan',
    pathMatch: 'full',
  },
  {
    path: 'payment-plan',
    loadChildren: () =>
      import('./modules/payment-plan/payment-plan.module').then(
        (m) => m.PaymentPlanModule
      ),
  },
  {
    path: '**',
    redirectTo: 'payment-plan',
  },
];
