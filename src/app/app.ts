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

    const regex = /^-?(\d{1,3}( \d{3})*|\d+)([.,]\d+)?$/;

    if (!regex.test(this.numStr1.trim())) {
      this.errorMessage = 'Ошибка: Некорректный формат первого числа';
      return;
    }

    if (!regex.test(this.numStr2.trim())) {
      this.errorMessage = 'Ошибка: Некорректный формат второго числа';
      return;
    }

    const n1 = parseFloat(this.numStr1.replace(/ /g, '').replace(',', '.'));
    const n2 = parseFloat(this.numStr2.replace(/ /g, '').replace(',', '.'));

    let res = 0;

    switch (this.operation) {
      case 'add':
        res = n1 + n2;
        break;
      case 'sub':
        res = n1 - n2;
        break;
      case 'mul':
        res = n1 * n2;
        break;
      case 'div':
        if (Math.abs(n2) < 1e-9) {
          this.errorMessage = 'Ошибка: Деление на ноль';
          return;
        }
        res = n1 / n2;
        break;
    }

    if (Math.abs(res) > this.MAX_LIMIT) {
      this.errorMessage = 'Переполнение результата';
      return;
    }

    const rounded = parseFloat(res.toFixed(6));
    const parts = rounded.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    
    this.result = parts.join('.');
  }
}