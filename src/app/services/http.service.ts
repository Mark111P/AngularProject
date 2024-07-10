import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable()
export class HttpService{
    constructor (private http: HttpClient){}

    getRandom(count: number){
        let params = new HttpParams()
        .set('count', count);
        return this.http.get('http://localhost:3333/getRandom', {params});
    }
    login(login: string, password: string){
        let params = new HttpParams()
        .set('login', login)
        .set('password', password);
        return this.http.get('http://localhost:3333/login', {params});
    }
    registrate(login: string, password: string){
        let params = new HttpParams()
        .set('login', login)
        .set('password', password);
        return this.http.get('http://localhost:3333/registrate', {params});
    }
    addRecord(login: string, pairCount: number, time: string, attempts: number){
        let params = new HttpParams()
        .set('login', login)
        .set('pairCount', pairCount)
        .set('time', time)
        .set('attempts', attempts);
        return this.http.get('http://localhost:3333/addRecord', {params});
    }
    getRecords(login: string){
        let params = new HttpParams()
        .set('login', login);
        return this.http.get('http://localhost:3333/getRecords', {params});
    }
}