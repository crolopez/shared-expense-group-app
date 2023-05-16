import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoginResponse } from '../types/login.response';
import { LoginRequest } from '../types/login.request';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from '../types/api.response';
import { GroupDto } from '../types/group.dto';
import { ExpenseDto } from '../types/expense.dto';
import { DataDto } from '../types/data.dto';
import { UserDto } from '../types/user.dto';
import { BalanceDto } from '../types/balance.dto';
import { DebtDto } from '../types/debt.dto';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private API_PREFIX = '/v1/group'
 
  constructor(private http: HttpClient) { }

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const url = `${environment.apiBaseUrl}/login`;

    const response = await firstValueFrom(this.http.post<LoginResponse>(url, loginRequest))
    this.setToken(response.access_token)
    return response
  }

  async getGroups(): Promise<ApiResponse<GroupDto>> {
    const url = `${environment.apiBaseUrl}${this.API_PREFIX}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);

    const response = await firstValueFrom(this.http.get<ApiResponse<GroupDto>>(url, { headers }));
    return response
  }

  async getExpenses(groupId: number): Promise<ApiResponse<ExpenseDto>> {
    const url = `${environment.apiBaseUrl}${this.API_PREFIX}/${groupId}/expense`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);

    const response = await firstValueFrom(this.http.get<ApiResponse<ExpenseDto>>(url, { headers }));
    response.data = response.data.map(x => ({ ... x, 
      attributes: {
        ... x.attributes,
        amount: Number(x.attributes.amount.toFixed(2))
      }
    }))
    return response
  }

  async getUsers(groupId: number): Promise<ApiResponse<UserDto>> {
    const url = `${environment.apiBaseUrl}${this.API_PREFIX}/${groupId}/user`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);

    const response = await firstValueFrom(this.http.get<ApiResponse<UserDto>>(url, { headers }));
    return response
  }

  async getBalance(groupId: number): Promise<ApiResponse<BalanceDto>> {
    const url = `${environment.apiBaseUrl}${this.API_PREFIX}/${groupId}/balance`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);

    const response = await firstValueFrom(this.http.get<ApiResponse<BalanceDto>>(url, { headers }));
    response.data = response.data.map(x => ({ ... x, 
      attributes: {
        ... x.attributes,
        amount: Number(x.attributes.amount.toFixed(2))
      }
    }))
    return response
  }

  async getDebts(groupId: number): Promise<ApiResponse<DebtDto>> {
    const url = `${environment.apiBaseUrl}${this.API_PREFIX}/${groupId}/debt`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);

    const response = await firstValueFrom(this.http.get<ApiResponse<DebtDto>>(url, { headers }));
    response.data = response.data.map(x => ({ ... x, 
      attributes: {
        ... x.attributes,
        amount: Number(x.attributes.amount.toFixed(2))
      }
    }))
    return response
  }

  async addExpense(groupId: number, expense: ExpenseDto) {
    const url = `${environment.apiBaseUrl}${this.API_PREFIX}/${groupId}/expense`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);

    const response = await firstValueFrom(this.http.post<ApiResponse<BalanceDto>>(url, expense, { headers }));
    response.data = response.data.map(x => ({ ... x, 
      attributes: {
        ... x.attributes,
        amount: Number(x.attributes.amount.toFixed(2))
      }
    }))
    return response
  }

  async addUser(groupId: number, username: string) {
    const url = `${environment.apiBaseUrl}${this.API_PREFIX}/${groupId}/user/${username}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);

    const response = await firstValueFrom(this.http.post(url, {}, { headers }));
    return response
  }

  private setToken(token: string) {
    localStorage.setItem('token', token)
  }

  private getToken(): string {
    return localStorage.getItem('token') as string
  }

}
