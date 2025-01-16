import { computed, Injectable, signal } from '@angular/core';
import {
  BehaviorSubject,
  first,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { PaymentInputs, RepaymentPlanEntry } from '../../models/payment';
import { rxResource } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class PaymentPlanService {
  readonly paymentForm = signal<PaymentInputs | null>(null);

  readonly repaymentPlanResource = rxResource({
    request: () => this.paymentForm(),
    loader: ({ request: data }) => {
      return data
        ? this.getRepaymentPlan(data)
        : of([] as RepaymentPlanEntry[]);
    },
  });
  readonly repaymentPlan = computed(
    () => this.repaymentPlanResource.value() ?? []
  );

  cache: BehaviorSubject<{ [key: string]: RepaymentPlanEntry[] }> =
    new BehaviorSubject<{
      [key: string]: RepaymentPlanEntry[];
    }>({});
  cache$: Observable<{ [key: string]: RepaymentPlanEntry[] }> =
    this.cache.asObservable();

  constructor() {}

  getRepaymentPlan(data: PaymentInputs): Observable<RepaymentPlanEntry[]> {
    return this.cache$.pipe(
      first(),
      switchMap((payments) => {
        const id = this.generateRepaymentId(data);
        if (payments[id]) {
          return of(payments[id]);
        }
        return of(this.generateRepaymentPlan(data)).pipe(
          tap((data) => {
            this.cache.next({ ...payments, [id]: data });
          })
        );
      })
    );
  }

  private generateRepaymentId(data: PaymentInputs): string {
    return Object.values(data).reduce((acc, curr: number | Date) => {
      if (typeof curr === 'object') {
        return acc;
      }
      return acc === ''
        ? `${curr}`
        : `${acc}-${curr.toString().replace('.', '-')}`;
    }, '');
  }

  private generateRepaymentPlan(data: PaymentInputs): RepaymentPlanEntry[] {
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

    return repaymentPlan;
  }

  private getLastDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }
}
