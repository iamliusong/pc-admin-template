var username = getById("username");
var password = getById("password");
var userClearBtn = getById("user-clear-btn");
var passClearBtn = getById("pass-clear-btn");
var passIcon = getById("pass-icon");
var loginBtn = getById("login-btn");
var shade = getById("shade-box");
var eyesOpen = false;

//根据Id获取dom对象
function getById(id) {
	return document.getElementById(id);
}
//获取行内样式
function getStyle(obj, attr) {
	if(obj.currentStyle) {
		return obj.currentStyle[attr];
	} else {
		return getComputedStyle(obj, false)[attr];
	}
}

//显示用户名后面的叉号
function showUserClose(){
	if(username.value != ""){
		userClearBtn.style.visibility='visible';
	}else{
		userClearBtn.style.visibility='hidden';
	}
	checkLoginBtn();
}

//显示密码后面的叉号
function showPassClose(){
	if(password.value != ""){
		passClearBtn.style.visibility='visible';
	}else{
		passClearBtn.style.visibility='hidden';
	}
	checkLoginBtn();
}

//清除用户名
function clearUsername(){
	username.value = '';
	userClearBtn.style.visibility='hidden';
	checkLoginBtn();
}

//清除密码
function clearPass(){
	password.value = '';
	passClearBtn.style.visibility='hidden';
	checkLoginBtn();
}

//是否遮挡密码
function showOrHidePass(){
	if(eyesOpen){
		passIcon.innerHTML = '&#xe669;';
		password.setAttribute('type','password');
	}else{
		passIcon.innerHTML = '&#xe63d;';
		password.setAttribute('type','text');
	}
	eyesOpen = !eyesOpen;
}

//检验是否用户名和密码为空
function checkLoginBtn(){
	if(username.value != '' && password.value != ''){
		loginBtn.style.opacity = 1;
	}else{
		loginBtn.style.opacity = 0.5;
	}
}

function showShade(){
	shade.style.top = 0;
}

function hideShade(){
	shade.style.top = '-100%';
}

function changeLogin(){
	window.location.href = './phonelogin.html';
}

function register(){
	window.location.href = './register.html';
}
