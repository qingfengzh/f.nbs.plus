var WINDOW_WIDTH = window.innerWidth;
var WINDOW_HEIGHT = window.innerHEIGHT;
var _current_lang = null;
var _current_password_lang = null;
var _referrer = null;
var _check_account = false; 
var _check_agree = false; 
var WS_API = "wss://api.weaccount.cn";

// 需创建的密码数据
var _password = {
  "zh":  [],
  "en": []
};

// 提交的数据初始化
var _submit_data = {
  "account_name" : null,
  "owner_key" : null,
  "active_key" : null,
  "memo_key" : null,
  "chid": 20,
  "referrer_code": null
}

// 注册接口返回STATUS枚举
API_REGISTER_RETURN_STATUS_MSG = {
  "0": "正常",
  "10": "无效参数",
  "20": "高级名称不支持",
  "30": "账号已经存在",
  "40": "区块链上注册失败（错误信息查看日志）",
  "41": "单IP达到最大注册数量",
  "42": "单IP冷却时间未到（注册太过频繁）",
  "51": "商家主不存在",
  "52": "商家备不存在",
  "999": "服务器维护中"
}


var I18n = {
  "zh": {
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

function isLangZh(){
  return _current_lang === "zh";
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
    
    if (_current_password_lang === "zh"){
      div.style.width = "12.5%";
    } else {
      div.style.width = "25%";
    }
    
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
  renderReferrer(_referrer || "");

  // 显示第一步的界面
  document.getElementById("register-step1").style.display = "block";

  // 无效化下一步和提交按钮样式
  disableNextButtonStyle();
  disableSubmitButtonStyle();

  var link_agreement = document.getElementById("argeement-checkbox-tip-agreement-link");

  if (isLangZh()) {
    renderPassword(_password["zh"]);

    // 用户协议中文版
    link_agreement.href = "http://btspp.io/zh-cn/agreement.html";

  } else {
    renderPassword(_password["en"]);
    // 以下是英文界面的样式修复
    document.getElementById("agreement-wrap").style.width = "240px";  // 同意tip文字在英文下样式超宽

    // 用户协议英文版
    link_agreement.href = "http://btspp.io/en/agreement.html";
  }

  // 中英文
  if (_current_password_lang === "zh"){
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
    onLangZhClickButton();
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

  // checkbox 同意事件
  document.getElementById("agreement-checkbox").addEventListener('click',function() {
    onBackCheckAgreeChecked();
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
    _submit_data["account_name"] = value;
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

  // 请求查找账号是否存在
  var account_name = document.getElementById("input-account").value;
  showBlockView();
  bitsharesQueryAccount(account_name,function(res){
    hideBlockView();
    console.log(res)
    if (res){
      alert("Account: "+ account_name + " exist.");
      return;
    }

    var div_step1 = document.getElementById("register-step1")
    var div_step2 = document.getElementById("register-step2")
    div_step1.style.display = "none";
    div_step2.style.display = "block";

    // 下一步二维码和推荐人不显示
    document.getElementById("qrcode").style.display = "none";
    document.getElementById("referrer-wrap").style.display = "none";

  });
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

// 同意注册协议事件
function onBackCheckAgreeChecked(){
  var check_agree = document.getElementById("agreement-checkbox");
  if (check_agree.checked){
    enableSubmitButtonStyle();
  } else {
    disableSubmitButtonStyle();
  }
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
function onLangZhClickButton(){
  if (_current_password_lang === "zh") return;
  _current_password_lang = "zh";
  document.getElementById("lang-cn").style.color = "white";
  document.getElementById("lang-en").style.color = "#5c7ed2";
  renderPassword(_password["zh"]);
}

// 英文密码切换点击
function onLangEnClickButton(){
  if (_current_password_lang === "en") return;
  _current_password_lang = "en";
  document.getElementById("lang-cn").style.color = "#5c7ed2";
  document.getElementById("lang-en").style.color = "white";
  renderPassword(_password["en"]);
}

// 注册接口完成
function onRequestRegisterApiFinished(resp){
  // 隐藏遮罩
  hideBlockView();

  console.log(resp);

  // Todo 注册接口返回数据处理
  // if (resp["status"] !== 0 && resp["msg"] !== "ok"){
  //   var error_msg = API_REGISTER_RETURN_STATUS_MSG[resp["status"].toString()];
  //   alert(error_msg);
  // } else {
  //   // Todo 完成后逻辑
  //   alert("success!");
  // }

  alert("success!");
}

// 请求注册接口
function requestRegisterApi(callback){

  // 创建提交用的公/私钥对
  generateSubmitKeyPairs();

  // Todo: 请求注册接口
  // $.post("http://faucet.ofree.vip/v1/chain/vv_register",_submit_data,function(resp){
  //   callback(resp);
  // })

  callback()
}

// 立即注册提交
function onSubmitButton(){
  var check_agree = document.getElementById("agreement-checkbox");
  if (!check_agree.checked){
    return;
  }

  // 提交前遮罩
  showBlockView();

  // 查找推荐人id
  if (_referrer){
    bitsharesQueryAccount(_referrer,function(res){

      // 查找到推荐人 则放到提交数据中
      if (res.id){
        _submit_data["referrer_code"] = res.id;
      }

      // 提交请求逻辑
      requestRegisterApi(onRequestRegisterApiFinished);
    });
  } else {
      // 提交请求逻辑
      requestRegisterApi(onRequestRegisterApiFinished);
  }
}

// 执行 bts api
function bitsharesExecApi(api_name,params, callback){
  window.apis.instance().db_api().exec(api_name,params).then(function(res){
    callback(res);
  }).catch(function(err){
    console.log(err)
    alert("[Request exception] \n code: " + err.code + ",\n message: " + err.data.message);
  })
}

// 查询账号
function bitsharesQueryAccount(account, callback){
  if(typeof(window.bitshares_js) === "object"){
    if (!window.apis){
      window.apis = window.bitshares_js.bitshares_ws.Apis
      window.apis.instance(WS_API, true).init_promise.then(function(res){
        bitsharesExecApi("get_account_by_name",[account],callback);
      }).catch(function(err){
        alert("[Connect api node failed] \n code: " + err.code + ",\n message: " + err.data.message);
      })
    } else {
      bitsharesExecApi("get_account_by_name",[account],callback);
    }
  }
}

// 创建公/私钥
function createKeyPair(){
  return "xxxxxxxxxxxx";
}

// 创建注册用的公/私钥对
function generateSubmitKeyPairs(){

   // Todo 创建逻辑未完成
  _submit_data["owner_key"] = createKeyPair();
  _submit_data["active_key"] = createKeyPair();
  _submit_data["memo_key"] = createKeyPair();
}

// 生成中文密码
function generatePasswordForZh(){
  _password["zh"] = ["勤","网","股","速","提","充","楼","范","腰","就","定","浓","位","淋","塞","布"];
}

// 生成英文密码
function generatePasswordForEn(){
  _password["en"] = ["abcd","efgh","ijkl","mnop","qrst","uvwx","yz12","3456"];
}

// 生成密码
function generatePassword(){
  generatePasswordForZh();
  generatePasswordForEn();
}

// 初始化数据
function initializeData(){

  // 设定语言
  _current_lang = getUrlParam("lang") || "zh";
  _current_password_lang = _current_lang;

  // 获取浏览器参数
  _referrer = getUrlParam("r");

  // 生成随机密码
  generatePassword();
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
