import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { DataDto } from 'src/app/types/data.dto';
import { BalanceDto } from 'src/app/types/balance.dto';
import { ExpenseDto } from 'src/app/types/expense.dto';
import { UserDto } from 'src/app/types/user.dto';
import { DebtDto } from 'src/app/types/debt.dto';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  groupId: number = 0;
  groupTitle: string = '';
  activeTab = 'expenses';
  showAddExpenseForm: boolean = false;
  showAddUserForm: boolean = false;
  expenses: DataDto<ExpenseDto>[] = []
  users: DataDto<UserDto>[] = []
  balances: DataDto<BalanceDto>[] = []
  debts: DataDto<DebtDto>[] = []

  constructor(private apiService: ApiService, private router: Router, private route: ActivatedRoute, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const groupId = this.route.snapshot.paramMap.get('id');
      if (groupId == null) {
        this.processUnexpectedCondition()
        return
      } 
      
      this.groupId = parseInt(groupId)
      this.groupTitle = history.state.title;
      this.fillScreenData()
    });
  }

  async fillScreenData() {
    const expenses = this.apiService.getExpenses(this.groupId)
    const users = this.apiService.getUsers(this.groupId)
    const balance = this.apiService.getBalance(this.groupId)
    const debts = this.apiService.getDebts(this.groupId)
    const values = await Promise.all([expenses, users, balance, debts])

    this.expenses = this.getFormattedExpenses(values[0].data as DataDto<ExpenseDto>[])
    this.users = values[1].data as DataDto<UserDto>[]
    this.balances = values[2].data as DataDto<BalanceDto>[]
    this.debts = values[3].data as DataDto<DebtDto>[]

    this.cd.detectChanges();
  }

  getFormattedExpenses(expenses: DataDto<ExpenseDto>[]): DataDto<ExpenseDto>[] {
    let expensesWithEpoch: DataDto<ExpenseDto>[] = expenses.map(x => { 
      x.attributes.dateCreatedEpoch = x.attributes.dateCreated ? new Date(x.attributes.dateCreated).getTime() : 0
      return x
    })

    expensesWithEpoch = this.orderExpenses(expensesWithEpoch)
    return this.formatDateCreated(expensesWithEpoch)
  }

  formatDateCreated(expensesWithEpoch: DataDto<ExpenseDto>[]): DataDto<ExpenseDto>[] {
    const epochNow = Date.now() / 1000
    const minuteInSeconds = 60
    const hourInSeconds = minuteInSeconds * 60
    const dayInSeconds = hourInSeconds * 24
    const monthInSeconds = dayInSeconds * 30

    return expensesWithEpoch.map(x => {
      const epoch = x.attributes.dateCreatedEpoch as number / 1000
      if ((epochNow - epoch) < minuteInSeconds) {
        x.attributes.dateCreated = `${Math.trunc(epochNow - epoch)} seconds ago`
      } else if ((epochNow - epoch) < hourInSeconds) {
        x.attributes.dateCreated = `${Math.trunc((epochNow - epoch) / minuteInSeconds)} minutes ago`
      } else if ((epochNow - epoch) < dayInSeconds) {
        x.attributes.dateCreated = `${Math.trunc((epochNow - epoch) / hourInSeconds)} hours ago`
      } else if ((epochNow - epoch) < monthInSeconds) {
        x.attributes.dateCreated = `${Math.trunc((epochNow - epoch) / dayInSeconds)} days ago`
      } else {
        x.attributes.dateCreated = `${Math.trunc((epochNow - epoch) / monthInSeconds)} months ago`
      }

      return x
    })
  }

  orderExpenses(expensesWithEpoch: DataDto<ExpenseDto>[]): DataDto<ExpenseDto>[] {
    return expensesWithEpoch.sort((a, b) => (b.attributes.dateCreatedEpoch as number) - (a.attributes.dateCreatedEpoch as number));
  }

  toggleAddExpenseForm() {
    this.showAddExpenseForm = !this.showAddExpenseForm;
  }

  toggleAddUserForm() {
    this.showAddUserForm = !this.showAddUserForm;
  }

  async addExpense(expenseData: any) {
    const expense: ExpenseDto = {
      amount: Number(expenseData.amount),
      description: expenseData.description,
    };
    await this.apiService.addExpense(this.groupId, expense)

    this.toggleAddExpenseForm()
    await this.fillScreenData()
  }

  async addUser(userData: any) {
    await this.apiService.addUser(this.groupId, userData.username)

    this.toggleAddUserForm()
    await this.fillScreenData()
  }

  processUnexpectedCondition() {
    console.log('Error in GroupComponent'); 
    this.router.navigate(['/login'])
  }
}
