const fs = require('fs');

let colors = ['red', 'blue', 'yellow', 'green', 'orange'];
let figures = ['Star', 'Circle', 'Polygon'];

function generateArray(count){
    let arr = [];
    for (let i = 0; i < figures.length; i++){
        for (let j = 0; j < colors.length; j++){
            if (i * colors.length + j >= count){
                return arr;
            } 
            arr.push(colors[j] + figures[i]);
            arr.push(colors[j] + figures[i]);
        }
    }
    return arr;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandomArray(count){
    let arr = generateArray(count);
    let newArr = [];

    for (let i = arr.length; i > 0; i--){
        let r = getRandomInt(i);
        newArr.push(arr[r]);
        arr.splice(r, 1);
    }
    return newArr;
}

const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

app.get("/getRandom", function(request, response){
    let count = request.query.count;
    response.send(getRandomArray(count));
});

app.get("/registrate", function(request, response){
    let login = request.query.login;
    let password = request.query.password;

    let rawdata = fs.readFileSync('users.json');
    let users = JSON.parse(rawdata);

    if (users.filter((i) => i.login == login).length > 0){
        response.send({message: 'error', login: ''});
    }
    else{
        users.push({
            "login": login,
            "password": password
        });
        let data = JSON.stringify(users);
        fs.writeFileSync('users.json', data);

        response.send({message: 'ok', login: login});
    }
});

app.get("/login", function(request, response){
    let login = request.query.login;
    let password = request.query.password;

    let rawdata = fs.readFileSync('users.json');
    let users = JSON.parse(rawdata);

    if (users.filter((i) => i.login == login && i.password == password).length > 0){
        response.send({message: 'ok', login: login});
    }
    else{
        response.send({message: 'error', login: ''});
    }
});

function getRecords(login){
    let rawdata = fs.readFileSync('records.json');
    let records = JSON.parse(rawdata);

    let userRecords = records.filter((r) => r.login == login);
    let lastUserRecords = userRecords.slice(-10);

    compareAttempts = (a, b) => {
        return parseInt(a.attempts) < parseInt(b.attempts) ? 1 : -1
    }
    compareTimes = (a, b) => {
        let aTime = parseInt(a.time.split(':')[0] * 60) + parseInt(a.time.split(':')[1]);
        let bTime = parseInt(b.time.split(':')[0] * 60) + parseInt(b.time.split(':')[1]);
        return aTime < bTime ? 1 : -1;
    }

    let userAttempts1 = userRecords.filter((r) => r.pairCount == 5).sort((a, b) => compareAttempts(a, b)).splice(-1)[0];
    let userAttempts2 = userRecords.filter((r) => r.pairCount == 10).sort((a, b) => compareAttempts(a, b)).splice(-1)[0];
    let userAttempts3 = userRecords.filter((r) => r.pairCount == 15).sort((a, b) => compareAttempts(a, b)).splice(-1)[0];
    let userAttempts = [userAttempts1, userAttempts2, userAttempts3].filter((r) => r != undefined);

    let userTimes1 = userRecords.filter((r) => r.pairCount == 5).sort((a, b) => compareTimes(a, b)).splice(-1)[0];
    let userTimes2 = userRecords.filter((r) => r.pairCount == 10).sort((a, b) => compareTimes(a, b)).splice(-1)[0];
    let userTimes3 = userRecords.filter((r) => r.pairCount == 15).sort((a, b) => compareTimes(a, b)).splice(-1)[0];
    let userTimes = [userTimes1, userTimes2, userTimes3].filter((r) => r != undefined);

    let attempts1 = records.filter((r) => r.pairCount == 5).sort((a, b) => compareAttempts(a, b)).splice(-1)[0];
    let attempts2 = records.filter((r) => r.pairCount == 10).sort((a, b) => compareAttempts(a, b)).splice(-1)[0];
    let attempts3 = records.filter((r) => r.pairCount == 15).sort((a, b) => compareAttempts(a, b)).splice(-1)[0];
    let attempts = [attempts1, attempts2, attempts3].filter((r) => r != undefined);

    let times1 = records.filter((r) => r.pairCount == 5).sort((a, b) => compareTimes(a, b)).splice(-1)[0];
    let times2 = records.filter((r) => r.pairCount == 10).sort((a, b) => compareTimes(a, b)).splice(-1)[0];
    let times3 = records.filter((r) => r.pairCount == 15).sort((a, b) => compareTimes(a, b)).splice(-1)[0];
    let times = [times1, times2, times3].filter((r) => r != undefined);

    return {userAttempts: userAttempts, userTimes: userTimes, attempts: attempts, times: times, last: lastUserRecords};
}

app.get("/addRecord", function(request, response){
    let login = request.query.login;
    let pairCount = request.query.pairCount;
    let time = request.query.time;
    let attempts = request.query.attempts;

    let rawdata = fs.readFileSync('records.json');
    let records = JSON.parse(rawdata);

    records.push({login: login, pairCount: pairCount, time: time, attempts: attempts});
    let data = JSON.stringify(records);
    fs.writeFileSync('records.json', data);

    response.send(getRecords(login));
});

app.get("/getRecords", function(request, response){
    let login = request.query.login;
    
    response.send(getRecords(login));
});

app.listen(3333, ()=>console.log('App listen 3333'));