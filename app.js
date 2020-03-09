var WINDOW_WIDTH = window.innerWidth;
var WINDOW_HEIGHT = window.innerHEIGHT;
var _current_lang = null;
var _current_password_lang = null;
var _check_account = false; 
var _check_agree = false; 

// 需创建的密码数据
var _password = {
  "cn":  [],
  "en": []
};

// 提交的数据初始化
var submit_data = {
  "account" : null,
  "public_key1" : null,
  "public_key2" : null,
  "public_key3" : null,
  "referrer": null
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
    "next_step": "下一步",
    "back_button": "回上一页",

    "request": "请求中..."
  },
  "en": {
    "title": "Welcome to BitShares",
    "tip_input_account": "please enter account",
    "tip_argeement": "I agree,",
    "tip_argeement_link": "the service agreement",

    "include_en_digit_char": "Composed of english letter, number, or \"-\"",
    "start_with_char": "start with letter",  
    "length3to32": "Length 3-12 bits",
    "include_digit": "contain number",
    "digit_char_tail": "Numbe, letter end",

    "register_immediately": "Register",
    "exist_account": "have an account?",
    "download_immediately": "Log in here",
    "website": "Web:",
    "referrer": "referrer",
    "tip_save_pwd": "Please keep the following passwords in a safe place.",
    "important_tip": "Important note：Do not <span class='highlight'>copy</span> / <span class='highlight'>photograph</span> / <span class='highlight'>screenshot</span>, use pen and paper to record in order.",
    "next_step": "Next",
    "back_button": "Back",

    "request": "Requesting..."
  }
}

function getUrlParam(name) {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  const r = window.location.search.substr(1).match(reg);
  if (r != null)
    return unescape(r[2]);
  return null;
}

// 显示 block view
function showBlockView(){
  document.getElementById("top-block-view").style.display = "block";
}

// 隐藏 block view
function hideBlockView(){
  document.getElementById("top-block-view").style.display = "none";
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
  document.getElementById("back-button").innerText = i18n["back_button"];

  document.getElementById("top-block-view-tips").innerText = i18n["request"];

}

// 渲染界面 - 密码
function renderPassword(array_password){
  var wrap_div = document.getElementById("word-password-wrap");
  wrap_div.innerHTML = "";

  array_password.forEach(function(text){
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

function renderReferrer(name){
  document.getElementById("referrer").innerText = name;
}

function renderStyle(){
  // 渲染推荐人
  renderReferrer(submit_data["referrer"] || "");

  // 显示第一步的界面
  document.getElementById("register-step1").style.display = "block";

  // 无效化下一步和提交按钮样式
  disableNextButtonStyle();
  disableSubmitButtonStyle();

  if (isLangCN()) {
    renderPassword(_password["cn"]);
    
  } else {
    renderPassword(_password["en"]);
    // 以下是英文界面的样式修复
    document.getElementById("agreement-wrap").style.width = "240px";  // 同意tip文字在英文下样式超宽
  }

  // 中英文
  if (_current_password_lang === "cn"){
    document.getElementById("lang-cn").style.color = "white";
    document.getElementById("lang-en").style.color = "#5c7ed2";
  } else {
    document.getElementById("lang-cn").style.color = "#5c7ed2";
    document.getElementById("lang-en").style.color = "white";
  }
}

function bindEvents(){
  // 立即注册按钮
  document.getElementById("submit-button").addEventListener('click',function() {
    onSubmitButton();
  });

  // 中英文密码切换按钮
  document.getElementById("lang-cn").addEventListener('click',function() {
    onLangCnClickButton();
  });
  document.getElementById("lang-en").addEventListener('click',function() {
    onLangEnClickButton();
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

  // 初始化检查步骤 和 下一步按钮灰色
  var check_finishs = 0;
  _check_account = false;
  disableNextButtonStyle();

  // 检测包含字母数字-
  if (/^[a-zA-Z0-9-]+$/.test(value)){
    showCheckImgIncEnDigestChar();
    showHighLightCheckIncEnDigestCharText();
    check_finishs++;
  }

  // 检测字母开头
  var first_char = value[0];
  if (/^[a-zA-Z]$/.test(first_char)){
    showCheckImgStartWithChar();
    showHighLightCheckStartWithCharText();
    check_finishs++;
  }

  // 检测3-32位
  if (value.length >= 3 && value.length <= 32){
    showCheckImgLength3to32();
    showHighLightCheckLength3to32Text();
    check_finishs++;
  }

  // 检测包含数字
  if ((/[0-9]+/ig).test(value)){
    showCheckImgIncludeDigit();
    showHighLightCheckIncludeDigitText();
    check_finishs++;
  }

  // 数字或字母结尾
  var last_char = value[value.length-1];
  if (/^[a-zA-Z0-9]$/.test(last_char)){
    showCheckImgDigitCharTail();
    showHighLightCheckDigitCharTailText();
    check_finishs++;
  }

  // 5步检测全部通过 -> 点亮下一步按钮
  if (check_finishs === 5) {
    _check_account = true;
    enableNextButtonStyle();
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

  if (!_check_account){
    return;
  }

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

// 无效化 下一步按钮样式
function disableNextButtonStyle(){
  document.getElementById("next-button").style.backgroundColor = "#474a54";
}

// 有效化 下一步按钮样式
function enableNextButtonStyle(){
  document.getElementById("next-button").style.backgroundColor = "#5c7ed2";
}

// 无效化 提交按钮样式
function disableSubmitButtonStyle(){
  document.getElementById("submit-button").style.backgroundColor = "#474a54";
}

// 有效化 提交按钮样式
function enableSubmitButtonStyle(){
  document.getElementById("submit-button").style.backgroundColor = "#5c7ed2";
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

// 中文密码切换点击
function onLangCnClickButton(){
  if (_current_password_lang === "cn") return;
  _current_password_lang = "cn";
  document.getElementById("lang-cn").style.color = "white";
  document.getElementById("lang-en").style.color = "#5c7ed2";
  renderPassword(_password["cn"]);
}

// 英文密码切换点击
function onLangEnClickButton(){
  if (_current_password_lang === "en") return;
  _current_password_lang = "en";
  document.getElementById("lang-cn").style.color = "#5c7ed2";
  document.getElementById("lang-en").style.color = "white";
  renderPassword(_password["en"]);
}

// 请求注册接口
function requestRegisterApi(callback){

  // Todo: 请求注册接口

  callback();
}

// 立即注册提交
function onSubmitButton(){
  var check_agree = document.getElementById("agreement-checkbox");
  if (!check_agree.checked){
    return;
  }

  // 提交前遮罩
  showBlockView();

  // Todo 提交请求逻辑
  requestRegisterApi(function(){

    // 隐藏遮罩
    // hideBlockView();
  });
}

// 生成中文密码
function generatePasswordForCn(){
  _password["cn"] = ["勤","网","股","速","提","充","楼","范","腰","就","定","浓","位","淋","塞","布"];
}

// 生成英文密码
function generatePasswordForEn(){
  _password["en"] = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","1","2","3","4","5","6"];
}

// 生成密码
function generatePassword(){
  generatePasswordForCn();
  generatePasswordForEn();
}

// 初始化数据
function initializeData(){

  // 设定语言
  _current_lang = "en";
  _current_password_lang = "en";

  // 生成随机密码
  generatePassword();

  // 获取浏览器参数
  submit_data["referrer"] = getUrlParam("r");

  // Todo: 其他数据
}

// 主函数
function main(){
  
  // 1 初始化数据
  initializeData();

  // 2. 翻译界面
  tranlate();

  // 3. 渲染样式
  renderStyle();

  // 4. 绑定事件
  bindEvents();
}

window.addEventListener('load', function () {
  main();
});
