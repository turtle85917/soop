export interface APIPlayerLive{
  CHANNEL: {
    BJID: string;
    BJNICK: string;
    CHATNO: string;
    TITLE: string;
    CHPT: string;
    CHDOMAIN: string;
  }
}

export enum ServiceCode{
  KEEPALIVE = 0,
  LOGIN = 1,
  JOINCH = 2,
  QUITCH = 3,
  CHUSER = 4,
  CHATMESG = 5,
  SETCHNAME = 6,
  SETBJSTAT = 7,
  SETDUMB = 8,
  DIRECTCHAT = 9,
  NOTICE = 10,
  KICK = 11,
  SETUSERFLAG = 12,
  SETSUBBJ = 13,
  SETNICKNAME = 14,
  SVRSTAT = 15,
  RELOADHOST = 16,
  CLUBCOLOR = 17,
  SENDBALLOON = 18,
  ICEMODE = 19,
  SENDFANLETRTRER = 20,
  ICEMODE_EX = 21,
  GET_ICEMODE_RELAY = 22,
  SLOWMODE = 23,
  RELOADBURNLEVEL = 24,
  BLINDKICK = 25,
  MANAGERCHAT = 26,
  APPENDDATA = 27,
  BASEBALLEVENT = 28,
  PAIDITEM = 29,
  TOPFAN = 30,
  SNSMESSAGE = 31,
  SNSMODE = 32,
  SENDBALLOONSUB = 33,
  SENDFANLETRTRERSUB = 34,
  TOPFANSUB = 35,
  BJSTICKERITEM = 36,
  CHOCOLATE = 37,
  CHOCOLATESUB = 38,
  TOPCLAN = 39,
  TOPCLANSUB = 40,
  SUPERCHAT = 41,
  UPDATETICKET = 42,
  NOTIGAMERANKER = 43,
  STARCOIN = 44,
  SENDQUICKVIEW = 45,
  ITEMSTATUS = 46,
  ITEMUSING = 47,
  USEQUICKVIEW = 48,
  NOTIFY_POLL = 50,
  CHATBLOCKMODE = 51,
  BDM_ADDBLACKINFO = 52,
  SETBROADINFO = 53,
  BAN_WORD = 54,
  SENDADMINNOTICE = 58,
  FREECAT_OWNER_JOIN = 65,
  BUYGOODS = 70,
  BUYGOODSSUB = 71,
  SENDPROMOTION = 72,
  NOTIFY_VR = 74,
  NOTIFY_MOBBROAD_PAUSE = 75,
  KICK_AND_CANCEL = 76,
  KICK_USERLIST = 77,
  ADMIN_CHUSER = 78,
  CLIDOBAEINFO = 79,
  VOD_BALLOON = 86,
  ADCON_EFFECT = 87,
  SVC_KICK_MSG_STATE = 90,
  FOLLOW_ITEM = 91,
  ITEM_SELL_EFFECT = 92,
  FOLLOW_ITEM_EFFECT = 93,
  TRANSLATION_STATE = 94,
  TRANSLATION = 95,
  GIFT_TICKET = 102,
  VODADCON = 103,
  BJ_NOTICE = 104,
  VIDEOBALLOON = 105,
  STATION_ADCON = 107,
  SENDSUBSCRIPTION = 108,
  OGQ_EMOTICON = 109,
  ITEM_DROPS = 111,
  VIDEOBALLOON_LINK = 117,
  OGQ_EMOTICON_GIFT = 118,
  AD_IN_BROAD_JSON = 119,
  GEM_ITEMSEND = 120,
  MISSION = 121,
  LIVE_CAPTION = 122,
  MISSION_SETTLE = 125,
  SET_ADMIN_FLAG = 126
}
