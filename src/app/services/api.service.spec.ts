import { ApiService } from './api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoginRequest } from '../types/login.request';
import { LoginResponse } from '../types/login.response';
import { ApiResponse } from '../types/api.response';
import { GroupDto } from '../types/group.dto';
import { ExpenseDto } from '../types/expense.dto';
import { firstValueFrom, of } from 'rxjs';
import { BalanceDto } from '../types/balance.dto';
import { UserDto } from '../types/user.dto';
import { DebtDto } from '../types/debt.dto';

describe('ApiService', () => {
  let apiService: ApiService;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = {
      post: jest.fn(),
      get: jest.fn()
    } as any;

    apiService = new ApiService(httpClient);
  });

  describe('login', () => {
    it('should set the token and return the login response', async () => {
      const loginRequest: LoginRequest = {
        username: 'testuser',
        password: 'testpassword'
      };

      const loginResponse: LoginResponse = {
        username: 'testuser',
        access_token: 'tes_ttoken',
        token_type: 'Bearer',
        expires_in: 3600
      };
      (httpClient.post as jest.Mock).mockReturnValue(of(loginResponse));

      const result = await apiService.login(loginRequest);

      expect(httpClient.post).toHaveBeenCalledWith(
        `${environment.apiBaseUrl}/login`,
        loginRequest
      );
      expect(result).toEqual(loginResponse);
    });
  });

  describe('getGroups', () => {
    it('should return the groups', async () => {
      const groupDto: GroupDto = {
        groupTitle: "fakeGroupTitle"
      };

      const apiResponse: ApiResponse<GroupDto> = {
        data: [
          {
            type: 'group',
            id: 1,
            attributes: groupDto
          }
        ]
      };
      (httpClient.get as jest.Mock).mockReturnValue(of(apiResponse));

      const result = await apiService.getGroups();

      expect(result).toEqual(apiResponse);
    });
  });

  describe('getExpenses', () => {
    it('should return the expenses', async () => {
      const groupId = 1;
      const expenseDto: ExpenseDto = {
        amount: 125.23,
        description: "Fake description"
      };

      const apiResponse: ApiResponse<ExpenseDto> = {
        data: [
          {
            type: 'expense',
            id: 1,
            attributes: expenseDto
          }
        ]
      };
      (httpClient.get as jest.Mock).mockReturnValue(of(apiResponse));

      const result = await apiService.getExpenses(groupId);

      expect(result).toEqual(apiResponse);
    });
  });

  describe('getUsers', () => {
    it('should return the users', async () => {
      const groupId = 1;
      const userDto: UserDto = {
        username: 'FakeUser'
      };

      const apiResponse: ApiResponse<UserDto> = {
        data: [
          {
            type: 'user',
            id: 1,
            attributes: userDto
          }
        ]
      };

      (httpClient.get as jest.Mock).mockReturnValue(of(apiResponse));

      const result = await apiService.getUsers(groupId);

      expect(result).toEqual(apiResponse);
    });
  });

  describe('getBalance', () => {
    it('should return the balance', async () => {
      const groupId = 1;
      const balanceDto: BalanceDto = {
        amount: 912.21,
        name: "FakeUser",
        currency: "EUR"
      };
      const apiResponse: ApiResponse<BalanceDto> = {
        data: [
          {
            type: 'balance',
            id: 1,
            attributes: balanceDto
          }
        ]
      };
      (httpClient.get as jest.Mock).mockReturnValue(of(apiResponse));

      const result = await apiService.getBalance(groupId);

      expect(result).toEqual(apiResponse);
    });
  });

  describe('getDebts', () => {
    it('should return the debts', async () => {
      const groupId = 1;
      const debtDto: DebtDto = {
        fromUser: 'fakeFrom',
        toUser: 'fakeTo',
        amount: 262,
        currency: 'EUR'
      };
      const apiResponse: ApiResponse<DebtDto> = {
        data: [
          {
            type: 'debt',
            id: 1,
            attributes: debtDto
          }
        ]
      };
      (httpClient.get as jest.Mock).mockReturnValue(of(apiResponse));

      const result = await apiService.getDebts(groupId);

      expect(result).toEqual(apiResponse);
    });
  });

  describe('addExpense', () => {
    it('should add an expense', async () => {
      const groupId = 1;
      const expenseDto: ExpenseDto = {
        amount: 3423.2,
        description: 'fakeDesc'
      };
      const apiResponse: ApiResponse<BalanceDto> = {
        data: [
          {
            id: 224,
            type: 'balance',
            attributes: {
              amount: 3423.2,
              name: 'fakeUser',
              currency: 'EUR'
            }
          }
        ]
      };

      (httpClient.post as jest.Mock).mockReturnValue(of(apiResponse));

      const result = await apiService.addExpense(groupId, expenseDto);

      expect(result).toEqual(apiResponse);
    });
  });

})
