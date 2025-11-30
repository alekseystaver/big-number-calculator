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
  numStr1 = '';
  numStr2 = '';
  operation = 'add';
  result: string | null = null;
  errorMessage: string | null = null;

  private readonly MAX_LIMIT = 1000000000000;

  calculate() {
    this.errorMessage = null;
    this.result = null;

    const v1 = this.numStr1.replace(/,/g, '.');
    const v2 = this.numStr2.replace(/,/g, '.');

    const n1 = parseFloat(v1);
    const n2 = parseFloat(v2);

    if (isNaN(n1) || v1.trim() === '') {
      this.errorMessage = 'Ошибка в первом числе';
      return;
    }
    if (isNaN(n2) || v2.trim() === '') {
      this.errorMessage = 'Ошибка во втором числе';
      return;
    }

    let res = 0;
    if (this.operation === 'add') {
      res = n1 + n2;
    } else {
      res = n1 - n2;
    }

    if (Math.abs(res) > this.MAX_LIMIT) {
      this.errorMessage = 'Переполнение результата';
      return;
    }

    this.result = res.toLocaleString('en-US', {
      useGrouping: false,
      maximumFractionDigits: 6,
      minimumFractionDigits: 0
    });
  }
}