var username = getById("username");
var password = getById("password");
var userClearBtn = getById("user-clear-btn");
var passClearBtn = getById("pass-clear-btn");
var questionBtn = getById("question-clear-btn");
var loginBtn = getById("login-btn");
var checkNum = getById("login-check-num");
//获取验证码按钮是否可点击
var isValid = true;
var updateTimer = 0;
//验证码
var realCheckNum = '';

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

//显示密保问题后面的叉号
function showQuestionClose(){
	if(question.value != ""){
		questionBtn.style.visibility='visible';
	}else{
		questionBtn.style.visibility='hidden';
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

//清除密保答案
function clearQuestion(){
	question.value = '';
	questionBtn.style.visibility='hidden';
	checkLoginBtn();
}

//检验是否用户名和密码为空
function checkLoginBtn(){
	if(username.value.trim() != '' && password.value.trim() != '' && question.value.trim()!=''){
		loginBtn.style.opacity = 1;
	}else{
		loginBtn.style.opacity = 0.5;
	}
}

//改变登录方式
function changeLogin(){
	window.location.href = './login.html';
}

//进入注册页面
function register(){
	window.location.href = './register.html';
}

//获取验证码
function getCheckNum(event){
	if(!isValid) return;
	var e = event || window.event;
	updateTime(e.target);
	var arr = [];
	for(var i=0;i<6;i++){
		arr.push(getRandomNum());
	}
	realCheckNum = arr.join('');
	checkNum.innerHTML = realCheckNum;
	checkNum.style.visibility = 'visible';
}

//更新获取验证码的时间
function updateTime(obj){
	var time = 90;
	isValid = false;
	obj.innerHTML = (time--)+'秒内有效';
	updateTimer = setInterval(function(){
		obj.innerHTML = (time--)+'秒内有效';
		if(time < 0){
			clearInterval(updateTimer);
			obj.innerHTML = '重新获取';
			isValid = true;
			realCheckNum = '';
		}
	},1000);
}

//获取0-9之间的随机数
function getRandomNum(){
	return Math.round(Math.random()*9);
}

function nextSegment(){
	var flag = !isValid && username.value.trim()!='' && password.value == realCheckNum 
		&& password.value.trim()!='' && question.value.trim()!=''
	if(flag){
		window.location.href = './register.html';
	}
}
