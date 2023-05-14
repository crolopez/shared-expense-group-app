import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoginResponse } from '../types/login.response';
import { LoginRequest } from '../types/login.request';
import { Observable, firstValueFrom } from 'rxjs';
import { ErrorResponse } from '../types/error.response';
import { ApiResponse } from '../types/api.response';
import { GroupDto } from '../types/group.dto';
import { ExpenseDto } from '../types/expense.dto';
import { DataDto } from '../types/data.dto';
import { UserDto } from '../types/user.dto';
import { DebtDto } from '../types/debt.dto';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private API_PREFIX = '/v1/group'
  private jwtToken = ''
 
  constructor(private http: HttpClient) { }

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const url = `${environment.apiBaseUrl}/login`;

    const response = await firstValueFrom(this.http.post<LoginResponse>(url, loginRequest))
    this.jwtToken = response.access_token
    return response
  }

  async getGroups(): Promise<ApiResponse<GroupDto>> {
    const url = `${environment.apiBaseUrl}${this.API_PREFIX}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.jwtToken}`);

    const response = await firstValueFrom(this.http.get<ApiResponse<GroupDto>>(url, { headers }));
    return response
  }

  async getExpenses(groupId: number): Promise<ApiResponse<ExpenseDto>> {
    const url = `${environment.apiBaseUrl}${this.API_PREFIX}/${groupId}/expense`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.jwtToken}`);

    const response = await firstValueFrom(this.http.get<ApiResponse<ExpenseDto>>(url, { headers }));
    response.data = response.data.map(x => ({
      type: x.type,
      id: x.id,
      attributes: {
          amount: Number(x.attributes.amount),
          currency: x.attributes.currency,
          dateCreated: x.attributes.dateCreated,
          user: x.attributes.user,
          description: x.attributes.description
      }
    }))
    return response
  }

  async getUsers(groupId: number): Promise<ApiResponse<UserDto>> {
    const url = `${environment.apiBaseUrl}${this.API_PREFIX}/${groupId}/user`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.jwtToken}`);

    const response = await firstValueFrom(this.http.get<ApiResponse<UserDto>>(url, { headers }));
    return response
  }

  async getBalance(groupId: number): Promise<ApiResponse<DebtDto>> {
    const url = `${environment.apiBaseUrl}${this.API_PREFIX}/${groupId}/debt`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.jwtToken}`);

    const response = await firstValueFrom(this.http.get<ApiResponse<DebtDto>>(url, { headers }));
    response.data = response.data.map(x => ({
      type: x.type,
      id: x.id,
      attributes: {
          amount: Number(x.attributes.amount),
          name: x.attributes.name,
      }
    }))
    return response
  }

  async addExpense(groupId: number, expense: ExpenseDto) {
    const url = `${environment.apiBaseUrl}${this.API_PREFIX}/${groupId}/expense`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.jwtToken}`);

    const response = await firstValueFrom(this.http.post<ApiResponse<DebtDto>>(url, expense, { headers }));
    response.data = response.data.map(x => ({
      type: x.type,
      id: x.id,
      attributes: {
          amount: Number(x.attributes.amount),
          name: x.attributes.name,
      }
    }))
    return response
  }

  async addUser(groupId: number, username: string) {
    const url = `${environment.apiBaseUrl}${this.API_PREFIX}/${groupId}/user/${username}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.jwtToken}`);

    const response = await firstValueFrom(this.http.post(url, {}, { headers }));
    return response
  }

}
