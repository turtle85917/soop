import WebSocket from "ws";
import fetch from "node-fetch";
import {type APIPlayerLive, ServiceCode} from "./type";

const ESC = "\x1b";
const COLOR_24BIT = ESC.concat("[38;2;");
const KEEPALIVE_INTERVAL = 30_000;
const REGEX_PACKET = /(\d{1,4})(\d{6})00/;
const REGEX_HEXCODE = /([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i;

const HEADER = "+".concat("-".repeat(process.stdout.rows), "+");

const SOOP_PLAYER_LIVE_API = "https://live.afreecatv.com/afreeca/player_live_api.php";
const bjId = "kumamyong";

let viewers = 0;

function hexcodeToRgb(hexcode:string):[number, number, number]{
  const chunk = hexcode.match(REGEX_HEXCODE);
  if(chunk === null) return [0, 0, 0];
  return chunk.slice(1).map(item => parseInt(item, 16)) as [number, number, number];
}

function createPacket(service:ServiceCode, ...data:string[]){
  // 0000   - 서비스 코드
  // 000000 - 데이터 길이
  // 00     - 길이 맞추기용이라 함
  const header = service.toString().padStart(4, '0');
  const body = "\f".concat(...data, "\f");
  return `${ESC}\t${header}${body.length.toString().padStart(6, '0')}00${body}`;
}

function pingInterval(ws:WebSocket):() => void{
  return async() => {
    await ws.send(createPacket(ServiceCode.KEEPALIVE));
    console.log("[Socket] : Sended ping!");
    setTimeout(pingInterval(ws), KEEPALIVE_INTERVAL);
  }
}

async function main(){
  const chunk = await fetch(SOOP_PLAYER_LIVE_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      "bid": bjId,
      "type": "live",
      "player_type": "html5"
    })
  });
  const playerLive:APIPlayerLive = await chunk.json() as any;
  if(playerLive.CHANNEL.RESULT === "0"){
    console.log(`${bjId} : 방송 중이 아님`);
    return;
  }
  console.log(`${playerLive.CHANNEL.BJNICK} : [${playerLive.CHANNEL.TITLE}]`);
  const ws = new WebSocket(`ws://${playerLive.CHANNEL.CHDOMAIN}:${playerLive.CHANNEL.CHPT}/Websocket/${playerLive.CHANNEL.BJID}`, ["chat"], {
    timeout: 5000
  });
  ws.addEventListener("open", async() => {
    console.log("Connected sooplive socket server.");
    await ws.send(createPacket(ServiceCode.LOGIN, "\f\f16"));

    setTimeout(pingInterval(ws), KEEPALIVE_INTERVAL);
  });
  ws.addEventListener("message", async(event) => {
    const [packet, ...chunk] = event.data.toString().split('\f').filter(Boolean);
    const [,service, dataLength] = packet.match(REGEX_PACKET)!.map(Number) as [any, ServiceCode, number];
    switch(service){
      case ServiceCode.LOGIN:
        await ws.send(createPacket(ServiceCode.JOINCH, playerLive.CHANNEL.CHATNO, "\f".repeat(5)));
        console.log("[Socket] : Try login.");
        break;
      case ServiceCode.CHATMESG:{
        const [content, userId,,,, userName,,, randomColor, idColor] = chunk;
        const rgb = hexcodeToRgb(randomColor);
        const rgb2 = hexcodeToRgb(idColor);
        console.log(HEADER);
        console.log(`| ${COLOR_24BIT.concat(rgb.join(';'), ";22", "m")}${userName}${ESC}[0m ${COLOR_24BIT.concat(rgb2.join(';'), "m")}${userId}${ESC}[0m ${content}`);
        break;
      }
      case ServiceCode.JOINCH:
      case ServiceCode.CHUSER:{
        const [status, ...users] = chunk;
        const addViewers = users.length / 3;
        console.log(HEADER);
        if(users[0] === bjId && users.length === 5){ // 뭔진 잘 몰르겠음 [bjId, ?, ?, ?, ?]
          console.log(`| [Socket] ${playerLive.CHANNEL.BJNICK} : 채널 입장함.`);
          break;
        }
        if(status === "-1")
          viewers--;
        else
          viewers += addViewers;
        // 특정 한 유저가 입장 혹은 퇴장함.
        if(addViewers === 1 || status === "-1"){
          const [userId, userName] = users;
          console.log(`| ${userName} [${userId}] 님 : ${status === "-1" ? "퇴장" : "입장"}함.`);
        }
        console.log(`| ${playerLive.CHANNEL.BJNICK} 님 방송을 시청하는 시청자 수 : ${viewers}명`);
        break;
      }
    }
  });
}

main();
