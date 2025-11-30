import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  numStr1 = '0';
  numStr2 = '0';
  numStr3 = '0';
  numStr4 = '0';

  op1 = 'add';
  op2 = 'add';
  op3 = 'add';

  rawResult: number | null = null;
  displayResult: string | null = null;
  
  roundingType: string = 'math';
  finalInteger: string | null = null;
  errorMessage: string | null = null;

  private readonly MAX_LIMIT = 1000000000000;

  private isValidInput(value: string): boolean {
    const regex = /^-?(\d{1,3}( \d{3})*|\d+)([.,]\d+)?$/;
    return regex.test(value.trim());
  }

  private parseNumber(value: string): number {
    return parseFloat(value.replace(/ /g, '').replace(',', '.'));
  }

  private roundTo(num: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  }

  private formatOutput(num: number): string {
    const rounded = parseFloat(num.toFixed(6));
    const parts = rounded.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join('.');
  }

  private calcPair(a: number, b: number, op: string): number {
    switch (op) {
      case 'add': return a + b;
      case 'sub': return a - b;
      case 'mul': return a * b;
      case 'div':
        if (Math.abs(b) < 1e-9) throw new Error('Деление на ноль');
        return a / b;
      default: return 0;
    }
  }

  calculate() {
    this.errorMessage = null;
    this.rawResult = null;
    this.displayResult = null;
    this.finalInteger = null;

    if (!this.isValidInput(this.numStr1) || !this.isValidInput(this.numStr2) || 
        !this.isValidInput(this.numStr3) || !this.isValidInput(this.numStr4)) {
      this.errorMessage = 'Ошибка: неверный формат чисел';
      return;
    }

    const n1 = this.parseNumber(this.numStr1);
    const n2 = this.parseNumber(this.numStr2);
    const n3 = this.parseNumber(this.numStr3);
    const n4 = this.parseNumber(this.numStr4);

    try {
      let mid = this.calcPair(n2, n3, this.op2);
      mid = this.roundTo(mid, 10);

      if (Math.abs(mid) > this.MAX_LIMIT) throw new Error('Переполнение');

      let res = 0;
      const isOp1High = (this.op1 === 'mul' || this.op1 === 'div');
      const isOp3High = (this.op3 === 'mul' || this.op3 === 'div');

      if (isOp1High && !isOp3High) {
        let tmp = this.calcPair(n1, mid, this.op1);
        tmp = this.roundTo(tmp, 10);
        if (Math.abs(tmp) > this.MAX_LIMIT) throw new Error('Переполнение');
        res = this.calcPair(tmp, n4, this.op3);
      } else if (!isOp1High && isOp3High) {
        let tmp = this.calcPair(mid, n4, this.op3);
        tmp = this.roundTo(tmp, 10);
        if (Math.abs(tmp) > this.MAX_LIMIT) throw new Error('Переполнение');
        res = this.calcPair(n1, tmp, this.op1);
      } else {
        let tmp = this.calcPair(n1, mid, this.op1);
        tmp = this.roundTo(tmp, 10);
        if (Math.abs(tmp) > this.MAX_LIMIT) throw new Error('Переполнение');
        res = this.calcPair(tmp, n4, this.op3);
      }

      if (Math.abs(res) > this.MAX_LIMIT) throw new Error('Переполнение результата');

      this.rawResult = res;
      this.displayResult = this.formatOutput(res);
      this.applyRounding();

    } catch (e: any) {
      this.errorMessage = e.message;
    }
  }

  applyRounding() {
    if (this.rawResult === null) return;
    let val = this.rawResult;
    let r = 0;

    if (this.roundingType === 'math') {
      r = Math.round(val);
    } else if (this.roundingType === 'trunc') {
      r = Math.trunc(val);
    } else if (this.roundingType === 'bank') {
      const n = Math.abs(val);
      const f = n - Math.floor(n);
      let rounded = Math.round(n);
      if (Math.abs(f - 0.5) < 1e-9) {
        if (rounded % 2 !== 0) rounded -= 1;
      }
      r = val < 0 ? -rounded : rounded;
    }
    this.finalInteger = r.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}