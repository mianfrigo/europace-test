import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { PaymentInputs } from '../../../models/payment';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface RepaymentForm {
  loanAmount: FormControl<number>;
  interestRate: FormControl<number>;
  initialRepayment: FormControl<number>;
  fixationPeriod: FormControl<number>;
  startDate: FormControl<Date>;
}
@Component({
  selector: 'app-payment-form',
  standalone: false,
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentFormComponent {
  @Output() onSubmit: EventEmitter<PaymentInputs> = new EventEmitter();
  readonly form: FormGroup<RepaymentForm> = new FormGroup<RepaymentForm>({
    startDate: new FormControl(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    loanAmount: new FormControl(100000, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    interestRate: new FormControl(2.12, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    initialRepayment: new FormControl(2, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    fixationPeriod: new FormControl(
      { value: 10, disabled: true },
      {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1)],
      }
    ),
  });

  constructor() {}

  generatePlan() {
    this.onSubmit.emit(this.form.getRawValue());
  }
}
