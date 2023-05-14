import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { DataDto } from 'src/app/types/data.dto';
import { DebtDto } from 'src/app/types/debt.dto';
import { ExpenseDto } from 'src/app/types/expense.dto';
import { UserDto } from 'src/app/types/user.dto';

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
  balances: DataDto<DebtDto>[] = []
  debts: string[] = []

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
    const values = await Promise.all([expenses, users, balance])

    this.expenses = values[0].data as unknown as DataDto<ExpenseDto>[]
    this.users = values[1].data as unknown as DataDto<UserDto>[]
    this.balances = values[2].data as unknown as DataDto<DebtDto>[]

    this.cd.detectChanges();
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
