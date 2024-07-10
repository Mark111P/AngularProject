import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalService } from './services/local.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [LocalService]
})
export class AppComponent implements OnInit {
  login: any;

  constructor(public localService: LocalService){}

  ngOnInit(): void {
    this.login = this.localService.getData('login');

    let route = window.location.href.split('/')[window.location.href.split('/').length - 1];
    if (this.login == null && route != 'login'){
      window.location.href = 'login';
    }
    else if (this.login != null && route != 'game'){
      window.location.href = 'game';
    }
  }
  exit(){
    this.localService.clearData();
    window.location.href = 'login';
  }
}

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpService } from './services/http.service';
// import { HttpClientModule } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule, FormsModule],
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.css',
//   providers: [HttpService]
// })
// export class AppComponent implements OnInit {
//   title: string = 'angular';

//   constructor (private httpService: HttpService){}

//   arr: Array<any> = new Array();

//   cardCount: number;

//   same: number = 0;
//   attempts: number = 0;

//   text: string = 'play';
  
//   img1: number = -1;
//   img2: number = -1;
  
//   startGame(count: number){
//     this.cardCount = count;
//     this.same = 0;
//     this.attempts = 0;
//     this.text = 'play';
//     this.img1 = -1;
//     this.img2 = -1;
//     this.arr = [];
//     this.httpService.getRandom(count).subscribe((data: any) => this.arr = data);
//   }
  
//   ngOnInit(): void {
//     this.startGame(15);
//   }

//   doFront(index: number){
//     let frontElement = <HTMLElement> document.getElementsByClassName('frontImg')[index];
//     let backElement = <HTMLElement> document.getElementsByClassName('backImg')[index];

//     frontElement.style.transform = 'perspective(300px) rotateY(0deg)';
//     backElement.style.transform = 'perspective(300px) rotateY(-180deg)';
//   }
//   doBack(index: number){
//     let frontElement = <HTMLElement> document.getElementsByClassName('frontImg')[index];
//     let backElement = <HTMLElement> document.getElementsByClassName('backImg')[index];

//     frontElement.style.transform = 'perspective(300px) rotateY(180deg)';
//     backElement.style.transform = 'perspective(300px) rotateY(0deg)';
//   }
//   doDark(index: number){
//     let frontElement = <HTMLElement> document.getElementsByClassName('frontImg')[index];
//     frontElement.style.filter = 'brightness(60%)';
//   }

//   clickImg(index: number){
//     let frontElement = <HTMLElement> document.getElementsByClassName('frontImg')[index];

//     if (frontElement.style.transform == 'perspective(300px) rotateY(0deg)' || this.arr[index] == 'white'){
//       return;
//     }
//     else{
//       this.doFront(index);
      
//       if (this.img1 == -1){
//         this.img1 = index;
//       }
//       else if (this.img2 == -1){
//         this.img2 = index;
//         this.attempts++;

//         if (this.arr[this.img1] == this.arr[this.img2]){
//           this.doDark(this.img1);
//           this.doDark(this.img2);

//           this.same++;
//           if (this.same == this.cardCount){
//             this.text = 'You won';
//           }
//         }
//       }
//       else{
//         if (this.arr[this.img1] != this.arr[this.img2]){
//           this.doBack(this.img1);
//           this.doBack(this.img2);
//         }
//         this.img1 = index;
//         this.img2 = -1;
//       }
//     }
//   }
// }