import { Component, inject } from '@angular/core';
import { PaymentInputs } from '../../models/payment';
import { PaymentPlanService } from '../../shared/services/payment-plan.service';

@Component({
  selector: 'app-payment-plan',
  standalone: false,
  templateUrl: './payment-plan.component.html',
  styleUrl: './payment-plan.component.scss',
})
export class PaymentPlanComponent {
  private readonly paymentPlanService = inject(PaymentPlanService);
  readonly repaymentPlan = this.paymentPlanService.repaymentPlan;

  calculatePaymentPlan(event: PaymentInputs) {
    this.paymentPlanService.paymentForm.set(event);
  }
}
