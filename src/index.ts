import WebSocket from "ws";
import fetch from "node-fetch";
import {type APIPlayerLive, ServiceCode} from "./type";

const ESC = "\x1b\t";
const REGEX_PACKET = /(\d{1,4})(\d{6})00/;

const SOOP_PLAYER_LIVE_API = "https://live.afreecatv.com/afreeca/player_live_api.php";
const bjId = "kumamyong";

function createPacket(service:ServiceCode, ...data:string[]){
  // 0000   - 서비스 코드
  // 000000 - 데이터 길이
  // 00     - 길이 맞추기용이라 함
  const header = service.toString().padStart(4, '0');
  const body = "\f".concat(...data, "\f");
  return `${ESC}${header}${body.length.toString().padStart(6, '0')}00${body}`;
}

function pingInterval(ws:WebSocket):() => void{
  return async() => {
    await ws.send(createPacket(ServiceCode.KEEPALIVE));
    setTimeout(pingInterval(ws), 60_000);
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
  if(playerLive.CHANNEL.BJNICK === undefined){
    console.log(`${bjId} : 방송 중이 아님`);
    return;
  }
  console.log(`${playerLive.CHANNEL.BJNICK} : [${playerLive.CHANNEL.TITLE}]`);
  const ws = new WebSocket(`ws://${playerLive.CHANNEL.CHDOMAIN}:${playerLive.CHANNEL.CHPT}/Websocket/${playerLive.CHANNEL.BJID}`, ["chat"], {
    timeout: 5000
  });
  ws.addEventListener("open", async() => {
    console.log("Connected sooplive socket server.");
    await ws.send(createPacket(ServiceCode.LOGIN, "16"));
    setTimeout(async() => {
      await ws.send(createPacket(ServiceCode.JOINCH, playerLive.CHANNEL.CHATNO));
    }, 200);

    setTimeout(pingInterval(ws), 60_000);
  });
  ws.addEventListener("message", async(event) => {
    const [packet, ...chunk] = event.data.toString().split('\n');
    const [,service, dataLength] = packet.match(REGEX_PACKET)!.map(Number) as [any, ServiceCode, number];
    switch(service){
    }
  });
}

main();
