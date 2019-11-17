var username = getById("username");
var password = getById("password");
var loginBtn = getById("register-btn");

//根据Id获取dom对象
function getById(id) {
	return document.getElementById(id);
}


//检验是否用户名和密码为空
function checkLoginBtn(){
	if(username.value != '' && password.value != ''){
		loginBtn.style.opacity = 1;
	}else{
		loginBtn.style.opacity = 0.5;
	}
}

function changeLogin(){
	window.location.href = './login.html';
}