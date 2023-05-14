import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService  } from 'src/app/services/api.service';
import { LoginRequest } from 'src/app/types/login.request';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html', 
})
export class LoginComponent {
  loginRequest: LoginRequest = { username: 'goku', password: '235hxa' }; // FOR TESTING PURPOSES
  
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) { }

  login(): void {
    this.apiService.login(this.loginRequest)
      .then(() => {
        this.errorMessage = '';
        this.router.navigate(['/group-selection']); 
      })
      .catch(() => {
        this.errorMessage = 'Invalid username or password'; 
      })
  }
}