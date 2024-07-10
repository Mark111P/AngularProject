import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../services/http.service';
import { LocalService } from '../services/local.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [LocalService, HttpService]
})
export class LoginComponent {
  userLogin: string = '';
  userPassword: string = '';

  text: string = '';

  constructor(private localService: LocalService, private httpService: HttpService){}

  registrate(){
    if (this.userLogin.length < 4 || this.userPassword.length < 4){
      this.text = 'Login & Password must be 4+ chars';
    }
    else{
      this.httpService.registrate(this.userLogin, this.userPassword).subscribe((data: any) => {
        if (data.message == 'ok'){
          this.localService.saveData('login', data.login);
          window.location.href = 'game';
        }
        else{
          this.text = 'Error';
        }});
      }
  }
  login(){
    if (this.userLogin.length < 4 || this.userPassword.length < 4){
      this.text = 'Login & Password must be 4+ chars';
    }
    else{
      this.httpService.login(this.userLogin, this.userPassword).subscribe((data: any) => {
          if (data.message == 'ok'){
            this.localService.saveData('login', data.login);
            window.location.href = 'game';
          }
          else{
            this.text = 'Error';
          }});
    }
  }

  clearText(){
    this.text = '';
  }
}
