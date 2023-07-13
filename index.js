const axios = require('axios');
const cheerio = require('cheerio')
const qs = require('qs');
const fs = require('fs');
const config = require('config')
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(config.get('botToken'), { polling: true });

const refresh = async ()=>{
    let data = qs.stringify({
      '_frontendUser': config.get('userCookie') 
    });
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: config.get('url'),
      headers: { 
        '_frontendUser': config.get('userCookie'), 
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Cookie': config.get('cookie')
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
                    fs.appendFile('./assets/date.txt', data, function (err) {
                        if(err) errWrite(err)
                      });
                }else{
                    fs.writeFile('./assets/text.txt', table, 'utf-8', (err)=>{
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
    fs.appendFile('./assets/err.txt',err+'\n', function (err) {
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
    sendMessageToUser( config.get('chatiD'), msg);
}
