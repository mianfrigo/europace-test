import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideRouter, Routes } from '@angular/router';
import { PaymentPlanComponent } from './payment-plan.component';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TableModule } from 'primeng/table';
import { DatePickerModule } from 'primeng/datepicker';

const routes: Routes = [
  {
    path: '',
    component: PaymentPlanComponent,
  },
];

@NgModule({
  declarations: [PaymentPlanComponent, PaymentFormComponent],
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    DatePickerModule,
    InputGroupModule,
    InputNumberModule,
    InputGroupAddonModule,
    ReactiveFormsModule,
  ],
  providers: [provideRouter(routes)],
})
export class PaymentPlanModule {}
