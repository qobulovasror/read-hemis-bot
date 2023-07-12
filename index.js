const axios = require('axios');
const cheerio = require('cheerio')
const qs = require('qs');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot('5393139686:AAGsbK5D2mJDI2bQU5zaexneKFPtxA7DKOU', { polling: true });

const refresh = async ()=>{
    let data = qs.stringify({
      '_frontendUser': '3bbee3be6a7a98bd28c8082aaa8f3339df87757436b9bf0dc63edb0c3bd02d10a:2:{i:0;s:13:"_frontendUser";i:1;s:48:"["2983","aJasMA4WwQp7tsa7vL4nTMdoMkQ_sjqk",3600]";}' 
    });
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://student.samdu.uz/education/performance',
      headers: { 
        '_frontendUser': '3bbee3be6a7a98bd28c8082aaa8f3339df87757436b9bf0dc63edb0c3bd02d10a:2:{i:0;s:13:"_frontendUser";i:1;s:48:"["2983","aJasMA4WwQp7tsa7vL4nTMdoMkQ_sjqk",3600]";}', 
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Cookie': '_csrf-frontend=edd66d53c5973fbe37792d02c68dcc7b3af2804ee366b278540076f71fdd4f27a%3A2%3A%7Bi%3A0%3Bs%3A14%3A%22_csrf-frontend%22%3Bi%3A1%3Bs%3A32%3A%22jWtW4rycCyyUWc3Z3t0yU-0llf1jZpU5%22%3B%7D; _frontendUser=3bbee3be6a7a98bd28c8082aaa8f3339df87757436b9bf0dc63edb0c3bd02d10a%3A2%3A%7Bi%3A0%3Bs%3A13%3A%22_frontendUser%22%3Bi%3A1%3Bs%3A48%3A%22%5B%222983%22%2C%22aJasMA4WwQp7tsa7vL4nTMdoMkQ_sjqk%22%2C3600%5D%22%3B%7D; frontend=masv766v2arhc8chm5gf43adg3'
      },
      data : data
    };
    axios.request(config)
    .then((response) => {
        const $ = cheerio.load(response.data);
        let table = $('table.table.table-striped').text().split('Fanlar')[6]
        table = table.toString().replaceAll(/\n/g, "").replaceAll(' ', '');
        fs.readFile('./text.txt', 'utf-8', (err, data)=>{
            if(!err){
                if(data==table){
                    let date = new Date()
                    let data = date.toLocaleDateString() + '-' + date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+'\n';
                    fs.appendFile('./date.txt', data, function (err) {
                        if(err) errWrite(err)
                      });
                }else{
                    fs.writeFile('./text.txt', table, 'utf-8', (err)=>{
                        if(err) errWrite(err)
                    })
                    alert(table)
                }
            }else{
                if(err) errWrite(err)
            }
        });
    })
    .catch((error) => {
        if(err) errWrite(err)
    });
}
// setInterval(refresh,  180000)
setInterval(refresh,  30000)

const errWrite = async (err)=> {
    fs.appendFile('./err.txt',err+'\n', function (err) {
        if(err) console.log(err);
    });
}

function sendMessageToUser(chatId, message) {
    bot.sendMessage(chatId, message)
      .then(() => {
        console.log('Message sent successfully');
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
  }
  

const alert = (msg)=>{
    sendMessageToUser('492277763', msg);
}
