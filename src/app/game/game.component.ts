import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpService } from '../services/http.service';
import { LocalService } from '../services/local.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterOutlet],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
  providers: [HttpService]
})
export class GameComponent implements OnInit {
  title: string = 'angular';
  login: any;

  constructor (private httpService: HttpService, private localService: LocalService){}

  arr: Array<any> = new Array();

  userAttempts: Array<any> = new Array();
  userTimes: Array<any> = new Array();
  allAttempts: Array<any> = new Array();
  allTimes: Array<any> = new Array();
  last: Array<any> = new Array();

  cardCount: number;

  same: number = 0;
  attempts: number = 0;

  text: string;
  
  img1: number = -1;
  img2: number = -1;

  startTime: Date;
  endTime: Date;

  isSound: boolean = false;

  setRecords(data: any){
    this.userAttempts = data.userAttempts;
    this.userTimes = data.userTimes;
    this.allAttempts = data.attempts;
    this.allTimes = data.times;
    this.last = data.last;
  }
  
  startGame(count: number){
    this.cardCount = count;
    this.same = 0;
    this.attempts = 0;
    this.text = 'Game started';
    this.img1 = -1;
    this.img2 = -1;
    this.arr = [];
    this.httpService.getRandom(count).subscribe((data: any) => this.arr = data);
    this.startTime = new Date();
  }
  
  ngOnInit(): void {
    this.login = this.localService.getData('login');
    this.httpService.getRecords(this.login).subscribe((data: any) => this.setRecords(data));
    this.startGame(5);
    document.body.style.transitionDuration = '1s';
  }

  doFront(index: number){
    let frontElement = <HTMLElement> document.getElementsByClassName('frontImg')[index];
    let backElement = <HTMLElement> document.getElementsByClassName('backImg')[index];

    frontElement.style.transform = 'perspective(300px) rotateY(0deg)';
    backElement.style.transform = 'perspective(300px) rotateY(-180deg)';
  }
  doBack(index: number){
    let frontElement = <HTMLElement> document.getElementsByClassName('frontImg')[index];
    let backElement = <HTMLElement> document.getElementsByClassName('backImg')[index];

    frontElement.style.transform = 'perspective(300px) rotateY(180deg)';
    backElement.style.transform = 'perspective(300px) rotateY(0deg)';
  }
  doDark(index: number){
    let frontElement = <HTMLElement> document.getElementsByClassName('frontImg')[index];
    frontElement.style.filter = 'brightness(60%)';
  }

  clickImg(index: number){
    let frontElement = <HTMLElement> document.getElementsByClassName('frontImg')[index];

    if (frontElement.style.transform == 'perspective(300px) rotateY(0deg)' || this.arr[index] == 'white'){
      return;
    }
    else{
      this.doFront(index);
      
      if (this.img1 == -1){
        this.img1 = index;
      }
      else if (this.img2 == -1){
        this.img2 = index;
        this.attempts++;

        if (this.arr[this.img1] == this.arr[this.img2]){
          this.doDark(this.img1);
          this.doDark(this.img2);

          if (this.isSound){
            let audio = new Audio();
            audio.src = "sounds/right.m4r";
            audio.load();
            audio.play();
          }

          this.same++;
          if (this.same == this.cardCount){
            this.endTime = new Date();
            let timeSpan = this.endTime.getTime() - this.startTime.getTime();

            let textTime = new Date(timeSpan).getMinutes() + ':' + new Date(timeSpan).getSeconds();

            this.text = 'You won! Your time: ' + textTime;
            this.httpService.addRecord(this.login, this.cardCount, textTime, this.attempts).subscribe((data: any) => this.setRecords(data));
          }
        }
        else{
          if (this.isSound){
            let audio = new Audio();
            audio.src = "sounds/wrong.m4r";
            audio.load();
            audio.play();
          }
        }
      }
      else{
        if (this.arr[this.img1] != this.arr[this.img2]){
          this.doBack(this.img1);
          this.doBack(this.img2);

          
        }
        this.img1 = index;
        this.img2 = -1;
      }
    }
  }
  sound(){
    this.isSound = !this.isSound;
  }
  public isLightTheme = true;

  onThemeSwitchChange() {
    this.isLightTheme = !this.isLightTheme;

    document.body.style.backgroundColor = this.isLightTheme ? 'white' : 'rgb(57, 57, 57)';
  }
}