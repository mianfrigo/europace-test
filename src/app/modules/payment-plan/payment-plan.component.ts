import { Component } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { PaymentInputs, RepaymentPlanEntry } from '../../models/payment';
import { PaymentPlanService } from '../../shared/services/payment-plan.service';

@Component({
  selector: 'app-payment-plan',
  standalone: false,
  templateUrl: './payment-plan.component.html',
  styleUrl: './payment-plan.component.scss',
})
export class PaymentPlanComponent {
  repaymentPlan: BehaviorSubject<RepaymentPlanEntry[]> = new BehaviorSubject<
    RepaymentPlanEntry[]
  >([]);
  repaymentPlan$: Observable<RepaymentPlanEntry[]> = this.repaymentPlan
    .asObservable()
    .pipe(shareReplay({ bufferSize: 1, refCount: true }));

  constructor(private readonly paymentPlanService: PaymentPlanService) {}

  calculatePaymentPlan(event: Partial<PaymentInputs>) {
    const {
      loanAmount,
      interestRate,
      initialRepayment,
      fixationPeriod,
      startDate,
    } = event;
    this.paymentPlanService
      .getRepaymentPlan({
        loanAmount: loanAmount!,
        interestRate: interestRate!,
        initialRepayment: initialRepayment!,
        fixationPeriod: fixationPeriod!,
        startDate: startDate!,
      })
      .subscribe((repayment) => {
        this.repaymentPlan.next(repayment);
      });
  }
}
