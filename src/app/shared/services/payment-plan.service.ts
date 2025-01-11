import { Injectable } from '@angular/core';
import { BehaviorSubject, first, map, Observable, of, switchMap } from 'rxjs';
import { PaymentInputs, RepaymentPlanEntry } from '../../models/payment';

@Injectable({
  providedIn: 'root',
})
export class PaymentPlanService {
  store: BehaviorSubject<{ [key: string]: RepaymentPlanEntry[] }> =
    new BehaviorSubject({});
  store$: Observable<{ [key: string]: RepaymentPlanEntry[] }> =
    this.store.asObservable();

  constructor() {}

  getRepaymentPlan(data: PaymentInputs): Observable<RepaymentPlanEntry[]> {
    const id = this.generateRepaymentId(data);
    return this.store$.pipe(
      first(),
      map((store) => {
        return store[id];
      }),
      switchMap((paymentPlan) => {
        if (paymentPlan) {
          return of(paymentPlan);
        }
        return of(this.generateRepaymentPlan(data));
      })
    );
  }

  private generateRepaymentId(data: PaymentInputs): string {
    return Object.values(data).reduce((acc, curr) => {
      if (typeof curr === 'object') {
        return acc === ''
          ? `${curr.toLocaleDateString()}`
          : `${acc}-${curr.toLocaleDateString()}`;
      }
      return acc === '' ? `${curr}` : `${acc}-${curr}`;
    }, '');
  }

  generateRepaymentPlan(data: PaymentInputs): RepaymentPlanEntry[] {
    const {
      loanAmount,
      initialRepayment,
      interestRate,
      fixationPeriod,
      startDate,
    } = data;
    const repaymentPlan = [];
    const monthlyInterestRate = interestRate / 100 / 12;
    const monthlyRepayment = (loanAmount * initialRepayment) / 100 / 12;

    let residualDebt = loanAmount;
    let totalInterestCharges = 0;
    let totalRepayment = 0;
    let currentDate = new Date(startDate);

    repaymentPlan.push({
      date: this.getLastDayOfMonth(currentDate).toLocaleDateString(),
      residualDebt: -loanAmount,
      interestCharges: 0,
      repayment: -loanAmount,
      rate: -loanAmount,
    });

    currentDate.setMonth(currentDate.getMonth() + 1);

    for (let month = 1; month <= fixationPeriod * 12; month++) {
      const interestCharges = residualDebt * monthlyInterestRate;
      const principalRepayment = monthlyRepayment;
      const totalRate = principalRepayment + interestCharges;

      residualDebt -= principalRepayment;
      totalInterestCharges += interestCharges;
      totalRepayment += totalRate;

      repaymentPlan.push({
        date: this.getLastDayOfMonth(currentDate).toLocaleDateString(),
        residualDebt: residualDebt,
        interestCharges: interestCharges,
        repayment: principalRepayment,
        rate: totalRate,
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    repaymentPlan.push({
      date: this.getLastDayOfMonth(currentDate).toLocaleDateString(),
      residualDebt: residualDebt,
      interestCharges: totalInterestCharges,
      repayment: totalRepayment,
      rate: totalRepayment,
    });

    const id = this.generateRepaymentId(data);
    const stored = this.store.value;
    stored[id] = repaymentPlan;
    this.store.next(stored);

    return repaymentPlan;
  }

  private getLastDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }
}
