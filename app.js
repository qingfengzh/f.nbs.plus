var WINDOW_WIDTH = window.innerWidth;
var WINDOW_HEIGHT = window.innerHEIGHT;
var DEFAULT_LANG = "cn";
var _current_lang = DEFAULT_LANG;

var _password = null;

// 提交的数据初始化
var submit_data = {
  "account" : null,
  "password" : null
}

var I18n = {
  "cn": {
    "title": "欢迎来到比特股去中心化交易平台",
    "tip_input_account": "请输入账号",
    "tip_argeement": "我同意,",
    "tip_argeement_link": "服务协议",

    "include_en_digit_char": "由英文字母,数字或短横线 \"-\"组成",
    "start_with_char": "必须字母开头",  
    "length3to32": "长度3-32位",
    "include_digit": "必须包含数字",
    "digit_char_tail": "数字或字母结尾",

    "register_immediately": "立即注册",
    "exist_account": "已有账号",
    "download_immediately": "立即下载",
    "website": "官网:",
    "referrer": "推荐人",
    "tip_save_pwd": "请妥善保管以下密码",
    "important_tip": "重要提示: 请勿<span class='highlight'>复制</span>/<span class='highlight'>拍照</span>/<span class='highlight'>截屏</span>,使用纸笔按顺序抄录保存,请妥善保管您的密码信息,丢失<span class='highlight'>无法找回</span>",
    "next_step": "下一步"

  }
}

function isLangCN(){
  return _current_lang === "cn";
}

function tranlate(){
  var i18n = I18n[_current_lang];
  document.getElementById("title").innerText = i18n["title"];
  document.getElementById("tip-input-account").innerText = i18n["tip_input_account"];
  // document.getElementById("input-account").placeholder = i18n["tip_input_account"];

  document.getElementById("cb-text-include-en-digest-char").innerText = i18n["include_en_digit_char"];
  document.getElementById("cb-text-start-with-char").innerText = i18n["start_with_char"];
  document.getElementById("cb-text-length3to32").innerText = i18n["length3to32"];
  document.getElementById("cb-text-include-digit").innerText = i18n["include_digit"];
  document.getElementById("cb-text-digit-char-tail").innerText = i18n["digit_char_tail"];

  document.getElementById("submit-button").innerText = i18n["register_immediately"];
  document.getElementById("text-exist-account").innerText = i18n["exist_account"];
  document.getElementById("link-download").innerText = i18n["download_immediately"];
  document.getElementById("text-website").innerText = i18n["website"];
  document.getElementById("text-referrer").innerText = i18n["referrer"];

  document.getElementById("tip-save-pwd").innerText = i18n["tip_save_pwd"];
  document.getElementById("important-tip").innerHTML = i18n["important_tip"];
  document.getElementById("next-button").innerText = i18n["next_step"];
  document.getElementById("argeement-checkbox-tip-agreement").innerText = i18n["tip_argeement"];
  document.getElementById("argeement-checkbox-tip-agreement-link").innerText = i18n["tip_argeement_link"];



}

function renderPassword(text16Array){
  var wrap_div = document.getElementById("word-password-wrap")
  text16Array.forEach(function(text){
    var div = document.createElement("div");
    div.innerText = text;
    div.style.color = "white";
    div.style.fontSize = "16px";
    div.style.fontWeight = "700";
    div.style.float = "left";
    div.style.width = "12.5%";
    div.style.textAlign = "center";
    div.style.paddingTop = "3.25%";
    div.style.paddingBottom = "3.25%";

    wrap_div.appendChild(div);

  });
}

function renderStyle(){
  document.getElementById("register-step1").style.display = "block";
  // document.getElementById("input-account").style.width = (WINDOW_WIDTH - 
  //   WINDOW_WIDTH * 0.2 - document.getElementById("tip-input-account").offsetWidth - 15) + "px" ;

  document.getElementById(isLangCN() ? "lang-cn" : "lang-en").style.color = "#5c7ed2";
  renderPassword(_password);

}

function bindEvents(){
  // 立即注册按钮
  document.getElementById("submit-button").addEventListener('click',function() {
    onSubmitButton();
  });

  // 下一步
  document.getElementById("next-button").addEventListener('click',function() {
    onNextClickButton();
  });

  // 回上一页
  document.getElementById("back-button").addEventListener('click',function() {
    onBackClickButton();
  });

  // 监测账号输入
  document.getElementById("input-account").addEventListener('input',function(e) {
    var target = e.target;
    onAccountChange(target);
  });
}

function onAccountChange(target){
  var value = target.value;

  clearAllCheckImg()
  clearAllCheckTextStyleColor();

  // 检测包含字母数字-
  if (/^[a-zA-Z0-9-]+$/.test(value)){
    showCheckImgIncEnDigestChar();
    showHighLightCheckIncEnDigestCharText();
  }

  // 检测字母开头
  var first_char = value[0];
  if (/^[a-zA-Z]$/.test(first_char)){
    showCheckImgStartWithChar();
    showHighLightCheckStartWithCharText();
  }

  // 检测3-32位
  if (value.length >= 3 && value.length <= 32){
    showCheckImgLength3to32();
    showHighLightCheckLength3to32Text();
  }

  // 检测包含数字
  if ((/[0-9]+/ig).test(value)){
    showCheckImgIncludeDigit();
    showHighLightCheckIncludeDigitText();
  }

  // 数字或字母结尾
  var last_char = value[value.length-1];
  if (/^[a-zA-Z0-9]$/.test(last_char)){
    showCheckImgDigitCharTail();
    showHighLightCheckDigitCharTailText();
  }

}

// 显示所有未 check 的图片
function clearAllCheckImg(){
  var tags = document.getElementsByClassName("img-no-check");
  for (var i = 0; i < tags.length; i++){
    var tag = tags[i];
    tag.style.display = "block";
  }
  tags = document.getElementsByClassName("img-check");
  for (var i = 0; i < tags.length; i++){
    var tag = tags[i];
    tag.style.display = "none";
  }
}

// 清除所有check文字的颜色
function clearAllCheckTextStyleColor(){
  var tags = document.getElementsByClassName("field-text");
  for (var i = 0; i < tags.length; i++){
    var tag = tags[i];
    tag.style.color = "white";
  }
}

// 下一步提交
function onNextClickButton(){
  var div_step1 = document.getElementById("register-step1")
  var div_step2 = document.getElementById("register-step2")
  div_step1.style.display = "none";
  div_step2.style.display = "block";

  // 下一步二维码和推荐人不显示
  document.getElementById("qrcode").style.display = "none";
  document.getElementById("referrer-wrap").style.display = "none";
}

function onBackClickButton(){
  var div_step1 = document.getElementById("register-step1")
  var div_step2 = document.getElementById("register-step2")
  div_step1.style.display = "block";
  div_step2.style.display = "none";

  // 下一步二维码和推荐人不显示
  document.getElementById("qrcode").style.display = "block";
  document.getElementById("referrer-wrap").style.display = "block";
}

// 显示高亮包含字母数字-check文字颜色
function showHighLightCheckIncEnDigestCharText(){
  document.getElementById("cb-text-include-en-digest-char").style.color = "#5c7ed2";
}

// 显示高亮包含字符check文字颜色
function showHighLightCheckStartWithCharText(){
  document.getElementById("cb-text-start-with-char").style.color = "#5c7ed2";
}

// 显示高亮至少3-32位check文字颜色
function showHighLightCheckLength3to32Text(){
  document.getElementById("cb-text-length3to32").style.color = "#5c7ed2";
}

// 显示高亮包含数字check文字颜色
function showHighLightCheckIncludeDigitText(){
  document.getElementById("cb-text-include-digit").style.color = "#5c7ed2";
}

// 显示高亮数字或字母结尾check文字颜色
function showHighLightCheckDigitCharTailText(){
  document.getElementById("cb-text-digit-char-tail").style.color = "#5c7ed2";
}


// 显示包含字母数字 - check image
function showCheckImgIncEnDigestChar(){
  document.getElementById("check-yes-cb-text-include-en-digest-char").style.display = "block";
  document.getElementById("check-no-cb-text-include-en-digest-char").style.display = "none";
}

// 显示字母开头 check image
function showCheckImgStartWithChar(){
  document.getElementById("check-yes-start-with-char").style.display = "block";
  document.getElementById("check-no-start-with-char").style.display = "none";
}

// 显示至少3-32位 check image
function showCheckImgLength3to32(){
  document.getElementById("check-yes-length3to32").style.display = "block";
  document.getElementById("check-no-length3to32").style.display = "none";
}

// 显示包含数字 check image
function showCheckImgIncludeDigit(){
  document.getElementById("check-yes-include-digit").style.display = "block";
  document.getElementById("check-no-include-digit").style.display = "none";
}

// 显示数字或字母结尾
function showCheckImgDigitCharTail(){
  document.getElementById("check-yes-digit-char-tail").style.display = "block";
  document.getElementById("check-no-digit-char-tail").style.display = "none";
}

// 立即注册提交
function onSubmitButton(){

}

// 生成密码
function generatePassword(){
  _password = ["勤","网","股","速","提","充","楼","范","腰","就","定","浓","位","淋","塞","布"];
}

function main(){
  generatePassword();
  tranlate();
  renderStyle();
  bindEvents();
}

window.addEventListener('load', function () {
  main();
});
