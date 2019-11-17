var LiuSong = {
	init: function(param) {
		//页面刚进来的时候默认显示的iframe页面
		this.homeIframePage = this.getById('default-page');
		//首页li，此选项卡不允许删除
		this.homeItem = this.getById('ls-home');
		//存放所有iframe页面的盒子容器
		this.pageContainer = document.getElementById('pageContainer');
		//当前显示的item选项卡,页面顶部选项卡
		this.currentItem = this.homeItem;
		//用来记录当前激活的菜单选项左边
		this.currentMenu = null;
		//当前显示的iframe页面
		this.currentIframePage = this.homeIframePage;
		//顶部菜单栏选项卡容器
		this.itemContainer = this.getById('ls-tabbar-list');
		//包裹头部选项卡的容器
		this.itemBarContainer = this.getById('ls-tabbar');
		//顶部菜单栏已点开的选项卡个数
		this.itemNumber = 1;
		//以下三个数组具有映射关系，相同索引（菜单=>选项卡=>iframe页）
		this.menuList = [];
		//存放所有的iframe页
		this.iframeList = [];
		//头部所有的菜单栏
		this.itemList = [];
		//顶部菜单栏平移距离,向左为负，向右为正
		this.move = 0;
		//选项卡容器左边隐藏的选项卡个数
		this.hideItemNum = 0;
		//是否全屏标志
		this.screenFlag = true;
		//头部选项卡的宽度,需结合css使用（width+paddingWidth+bordrWidth）
		this.itemWidth = param.itemWidth;
		//头部home选项卡宽度
		this.homeItemW = param.homeItemW;
		//头部选项卡的初始长度
		this.itemContainerW = this.itemWidth + this.homeItemW + 20;
		//便签关闭按钮
		this.noteContainer = this.getById('noteContainer');
		//便签textarea
		this.noteContents = this.getById('note-contents');
		//遮罩层
		this.shade = this.getById('shade');
		//版权信息模块
		this.copyRight = this.getById('copyRight');
		//菜单栏左边跟踪条
		this.barTips = this.getById('barTips');
		//右边部分整体盒子
		this.contentContainer = this.getById('container');
		//左边菜单是否处于打开状态
		this.menuOpen = true;
		//所有的二级菜单部分
		this.menuSecList = document.getElementsByClassName('ls-main-menu');
		//存放所有的二级菜单
		this.firstMenuList = [];
		this.initMenuArr();
		//皮肤模块
		this.skins = this.getById('ls-skins');
		//右边侧边栏默认展示模块
		this.modules = 'copyRight';
		//初始化皮肤样式
		this.initSkin();
		//初始化便签内容
		this.showNote(true);
	},
	initMenuArr: function() {
		var len = this.menuSecList.length;
		for(var i = 0; i < len; i++) {
			this.firstMenuList.push(this.menuSecList[i]);
		}
	},
	//根据点击的类型，分发给对应的处理函数
	click: function(obj) {
		var clickType = obj.getAttribute('ls-event');
		if(obj.parentNode.getAttribute && obj.parentNode.getAttribute('ls-event') == 'ls-main-menu') {
			this.showSecMenu(obj.parentNode);
			return;
		}
		switch(clickType) {
			//点击的是一级菜单，此时需要展开二级菜单，同时更多选项小箭头方向更换
			case 'ls-main-menu':
				this.showSecMenu(obj);
				break;
				//点击侧边栏菜单选项卡，页面头部进行菜单的增加及页面的调度
			case 'ls-side-item':
				this.addItem(obj, true, false);
				break;
				//点击顶部删除小叉号，删除选项卡及页面项
			case 'ls-remove-item':
				this.removeItem(obj, false);
				break;
				//头部选项卡整体向左平移
			case 'ls-pre-button':
				this.moveLeft();
				break;
				//头部选项卡整体向右平移
			case 'ls-next-button':
				this.moveRight();
				break;
				//切换头部选项卡
			case 'ls-header-item':
				this.changeMenu(obj);
				break;
				//点击主页按钮
			case 'ls-home-click':
				this.homeClick(obj);
				break;
				//关闭当前选项卡
			case 'ls-close-current':
				this.closeCurrent();
				break;
				//关闭其他选项卡
			case 'ls-close-others':
				this.closeOthers();
				break;
				//关闭所有选项卡
			case 'ls-close-all':
				this.closeAll();
				break;
				//全屏展示
			case 'ls-fullscreen':
				var el = document.documentElement;
				this.screenFlag ? this.fullScreen(el) : this.exitFullScreen(el);
				break;
			case 'ls-note':
				this.showNote(false);
				break;
			case 'ls-note-close':
				this.closeNote();
				break;
			case 'ls-shade-hidden':
				this.hideShade(this.modules);
				break;
			case 'ls-showcopyright':
				this.showCopyRight();
				break;
			case 'ls-shrink-menu':
				this.shrinkMenu();
				break;
			case 'ls-show-msg':
				//三个参数，添加对象，左边菜单是否打开，是否需要打开左边菜单
				this.addItem(obj, false, true);
				break;
			case 'ls-refresh':
				this.reFresh();
				break;
			case 'ls-net-connection':
				this.getNetAddr();
				break;
			case 'ls-show-skin':
				this.showSkinModule();
				break;
			case 'ls-change-skin':
				this.changeSkin(obj);
				break;
			case 'ls-author-info':
				this.addItem(obj, false, true);
				break;
		}
	},
	//页面中所有的mouseove事件，在此处进行分发
	mouseover: function(obj) {
		var mouseOverType = obj.getAttribute('ls-event');
		switch(mouseOverType) {
			case 'ls-main-menu':
				this.showTips(obj);
				break;
		}
	},
	//页面中所有的mouseleave事件，在此处进行分发
	mouseleave: function(obj) {
		var mouseLeaveType = obj.getAttribute('ls-event');
		switch(mouseLeaveType) {
			case 'ls-hideBarTips':
				this.hideTips();
				break;
		}
	},
	initSkin: function() {
		var skin = localStorage.getItem('skin') || 'skin1';
		document.getElementById('skins').href = "./style/" + skin + '.css';
	},
	//换肤功能
	changeSkin: function(obj) {
		var skin = obj.getAttribute('ls-skin-style');
		document.getElementById('skins').href = "./style/" + skin + '.css';
		localStorage.setItem('skin', skin);
		this.hideShade('skins');
	},
	//显示皮肤模块
	showSkinModule: function() {
		//document.getElementById('skins').href = './style/skin3.css';
		this.startMove(this.skins, {
			'right': '0px'
		}, 300);
		this.modules = 'skins';
		this.shade.style.display = 'block';
	},
	//点击网络小图标，页面跳转
	getNetAddr: function() {
		window.open("http://lsdemo.gitee.io/demo", "_blank");
	},
	//刷新页面
	reFresh: function() {
		var iframe = this.currentIframePage.getElementsByTagName('iframe')[0];
		iframe.src = iframe.src;
	},
	//缩小菜单栏
	shrinkMenu: function() {
		//如果当前菜单已打开，则将左边菜单折叠
		if(this.menuOpen) {
			var len = this.menuSecList.length;
			for(var i = 0; i < len; i++) {
				this.menuSecList[i].flag = false;
				this.showMenu(this.menuSecList[i]);
			}
			this.startMove(this.contentContainer, {
				'left': 50
			}, 300);
			//显示logo头像
			document.getElementById('head-logo').style.display = 'block';
			this.menuOpen = false;
		} else {
			//如果左边菜单未打开，则将菜单打开
			this.startMove(this.contentContainer, {
				'left': 220
			}, 300);
			//隐藏logo头像
			document.getElementById('head-logo').style.display = 'none';
			this.menuOpen = true;
		}

	},
	//显示右侧版权模块
	showCopyRight: function() {
		this.startMove(this.copyRight, {
			'right': '0px'
		}, 300);
		this.modules = 'copyRight';
		this.shade.style.display = 'block';
	},
	//隐藏遮罩层
	hideShade: function(module) {
		if(module == 'copyRight') {
			this.startMove(this.copyRight, {
				'right': '-300px'
			}, 300);
		} else if(module == 'skins') {
			this.startMove(this.skins, {
				'right': '-300px'
			}, 300);
		}
		setTimeout(function() {
			this.shade.style.display = 'none';
		}.bind(this), 300);
	},
	//关闭便签模块
	closeNote: function() {
		this.noteContainer.style.display = 'none';
		var value = this.noteContents.value;
		var noteContent = localStorage.setItem('ls-note', value);
	},
	//显示便签模块
	showNote: function(init) {
		var temStr = '在这里写入你的笔记内容，他会存储到本地的localStorage中，方便你下次翻阅，刷新或关闭浏览器页不会消失！'
		var noteContent = localStorage.getItem('ls-note') || temStr;
		this.noteContents.value = noteContent;
		this.noteContainer.style.display = init ? 'none' : 'block';
	},
	//隐藏左边菜单栏指示条
	hideTips: function() {
		this.barTips.style.display = 'none';
	},
	//显示左边菜单栏指示条
	showTips: function(obj) {
		this.barTips.style.display = 'block';
		var top = obj.getBoundingClientRect().top;
		this.barTips.style.top = top + 'px';
	},
	//点击某个主题菜单，则将该主题下菜单进行展开
	showMenu: function(obj) {
		var idStr = obj.getAttribute('ls-for');
		//获取对应的二级菜单ID
		//obj.flag = (obj.flag) ? false : true;
		var dom1 = this.getById(idStr),
			dom2 = this.getById(idStr + '-more');
		if(obj.flag) {
			dom1.style.display = 'block';
			dom2.className = 'ls-menu-morelow';
		} else {
			dom1.style.display = 'none';
			dom2.className = 'ls-menu-moreup';
		}
	},
	//显示二级菜单
	showSecMenu: function(obj) {
		//显示二级菜单前先判断菜单是否展开
		if(!this.menuOpen) {
			this.startMove(this.contentContainer, {
				'left': 220
			}, 300);
			this.menuOpen = true;
			document.getElementById('head-logo').style.display = 'none';
			var len = this.menuSecList.length;
			var index = this.firstMenuList.indexOf(obj);
			for(var i = 0; i < len; i++) {
				if(i == index) {
					this.menuSecList[i].flag = obj.flag ? false : true;
				} else {
					this.menuSecList[i].flag = false;
				}
				this.showMenu(this.menuSecList[i]);
			}
		} else {
			obj.flag = (obj.flag) ? false : true;
			this.showMenu(obj);
		}

	},
	/*
	 第二个参数
	 	menuFlag:true，添加选项卡事件是通过点击左边菜单栏添加的
	 	menuFlag:false，添加选项卡事件是通过点击其他地方进行添加的
	 第三个参数，如果要添加菜单，此时左边菜单处于折叠状态
	 	other:true，不需要展开左边菜单
	 	other:false，需要展开左边菜单
	 * */
	addItem: function(obj, menuFlag, other) {
		//每次点击菜单的时候，如果菜单没有伸开，则把菜单伸开
		if(!this.menuOpen && !other) {
			this.startMove(this.contentContainer, {
				'left': 220
			}, 300);
			this.menuOpen = true;
		}
		var index = this.menuList.lastIndexOf(obj);
		//如果点卡菜单超过12个，则不允许继续添加，理论上可以无限添加，此处稍加限制
		//如果index>0表示选项卡中已有展示的对象
		if(this.itemNumber >= 12 && index < 0) {
			alert('您点开的菜单太多了，请关闭一些！');
			return;
		}
		var pageName = obj.getAttribute('ls-href');
		//如果没有该页面，则进入404页面
		pageName == 'no' ? pageName = './html/notfound/404.html' : pageName;
		//左边上次激活的菜单
		if(this.currentMenu) {
			this.removeClass(this.currentMenu, 'active-menu');
		}
		//头部上次激活的选项卡
		if(this.currentItem) {
			this.removeClass(this.currentItem, 'active-item');
		}
		//下边展示的iframe页面
		this.removeClass(this.currentIframePage, 'active-iframe');
		if(menuFlag) {
			//左边当前点击的选项卡处于激活状态
			this.addClass(obj, 'active-menu');
			//把当前对象赋值给上一次激活的临时存储变量
			this.currentMenu = obj;
		} else {
			this.currentMenu = null;
		}
		//如果这个选项卡，之前点击过，且已显示
		if(index > -1) {
			this.currentIframePage = this.iframeList[index];
			this.currentItem = this.itemList[index];
			this.addClass(this.currentIframePage, 'active-iframe');
			this.addClass(this.currentItem, 'active-item');
		} else {
			//经过查找，发现新点击的菜单对应的选项卡及页面并未展现，则新增选项卡，同时更换iframe页
			var itemName = obj.getAttribute('ls-item-name');
			var item = document.createElement('li');
			this.addClass(item, 'ls-nav-item');
			item.setAttribute('ls-event', 'ls-header-item');
			this.addClass(item, 'active-item');
			item.innerHTML = itemName + '<i ls-event="ls-remove-item">&#xe6a6;</i>';
			this.itemContainer.appendChild(item);
			this.menuList.push(obj);
			this.itemList.push(item);
			this.currentItem = item;
			//动态计算选项卡列表容器的长度
			this.itemContainerW += this.itemWidth;
			this.itemContainer.style.width = this.itemContainerW + 'px';
			//动态增加选项卡
			var div = document.createElement('div');
			this.addClass(div, 'pageContainer');
			this.addClass(div, 'active-iframe');
			div.innerHTML = '<iframe src="' + pageName + '" scrolling="auto" frameborder="no" allowtransparency="yes"></iframe>';
			this.pageContainer.appendChild(div);
			this.iframeList.push(div);
			this.currentIframePage = div;
			//页面显示的选项卡数加1
			this.itemNumber++;
		}
		//将对应选项卡平移到可视区位置	
		this.setPosition();
	},
	//不管是新增选项卡还是删除选项卡以及切换选项卡都需要重新确定选项卡容器的偏移量
	setPosition: function() {
		var containerW = this.itemBarContainer.offsetWidth,
			pageSize = Math.floor((containerW - this.homeItemW) / this.itemWidth) + 1,
			index = this.itemList.lastIndexOf(this.currentItem) + 2;
		if(index <= pageSize) {
			this.hideItemNum = 0;
			this.move = 0;
		} else if(index == pageSize + 1) {
			this.hideItemNum = (index - pageSize) + 1;
			this.move = 0 - this.homeItemW - this.itemWidth;
		} else if(index > pageSize + 1) {
			this.hideItemNum = (index - pageSize) + 1;
			this.move = 0 - this.homeItemW - (this.hideItemNum - 1) * this.itemWidth;
		}
		//添加动画特效
		this.startMove(this.itemContainer, {
			'marginLeft': this.move
		}, 500);
	},
	//移除选项卡，第二个参数在删除当前页，其他页及所有页时有用，因为传入的obj对象不一样
	//flag:true,传递过来的是选项卡对象；flag:false,传递过来的是关闭小按钮对象
	removeItem: function(obj, flag) {
		//如果当前只留下home页，则不允许删除
		if(this.currentItem == this.homeItem && this.itemList.length <= 0) return;
		this.removeClass(this.currentItem, 'active-item');
		this.currentMenu ? this.removeClass(this.currentMenu, 'active-menu') : '';
		this.removeClass(this.currentIframePage, 'active-iframe');
		var oldIndex;
		//获得要删除的选项卡在数组中的索引
		if(flag) {
			obj.parentNode.removeChild(obj);
			oldIndex = this.itemList.lastIndexOf(obj);
		} else {
			//从dom节点中将选中选项卡删除
			obj.parentNode.parentNode.removeChild(obj.parentNode);
			oldIndex = this.itemList.lastIndexOf(obj.parentNode);
		}
		if(this.currentIframePage != this.homeIframePage) {
			this.currentIframePage.parentNode.removeChild(this.iframeList[oldIndex]);
		}
		this.itemContainerW -= this.itemWidth;
		//从数组中删除菜单对象和选项卡对象
		this.menuList.splice(oldIndex, 1);
		this.itemList.splice(oldIndex, 1);
		this.iframeList.splice(oldIndex, 1);
		//获取删除后的数组长度
		var newMaxIndex = this.itemList.length - 1;
		//如果直接点选项卡的叉号删除，用到的是parentNode,如果点右边的关闭当前页等选项用到的是obj
		if(this.currentItem === obj.parentNode || this.currentItem === obj) {
			//如果数组为空，则表示当前除home选项卡外没有选项卡，需显示主页面
			if(newMaxIndex < 0) {
				this.currentItem = this.homeItem;
				this.currentIframePage = this.homeIframePage;
				this.currentMenu = null;
			} else if(newMaxIndex >= oldIndex) {
				//显示上次删除的那一项对应的下标位置
				this.currentItem = this.itemList[oldIndex];
				this.currentMenu = this.menuList[oldIndex];
				this.currentIframePage = this.iframeList[oldIndex];
			} else {
				//显示最后一项
				this.currentItem = this.itemList[newMaxIndex];
				this.currentMenu = this.menuList[newMaxIndex];
				this.currentIframePage = this.iframeList[newMaxIndex];
			}
		}
		this.addClass(this.currentItem, 'active-item');
		this.addClass(this.currentIframePage, 'active-iframe');
		this.currentMenu ? this.addClass(this.currentMenu, 'active-menu') : '';
		this.itemContainer.style.width = this.itemContainerW + 'px';
		this.itemNumber--;
		this.setPosition();
	},
	//选项卡切换
	changeMenu: function(obj) {
		this.currentMenu ? this.removeClass(this.currentMenu, 'active-menu') : '';
		this.removeClass(this.currentItem, 'active-item');
		this.removeClass(this.currentIframePage, 'active-iframe');
		var index = this.itemList.lastIndexOf(obj);
		this.currentMenu = this.menuList[index];
		this.addClass(this.currentMenu, 'active-menu');
		this.currentItem = this.itemList[index];
		this.currentIframePage = this.iframeList[index];
		this.addClass(this.currentItem, 'active-item');
		this.addClass(this.currentIframePage, 'active-iframe');
	},
	//点击home选项卡
	homeClick: function() {
		this.removeClass(this.currentItem, 'active-item');
		this.removeClass(this.currentIframePage, 'active-iframe');
		this.currentMenu ? this.removeClass(this.currentMenu, 'active-menu') : '';
		this.currentMenu = null;
		this.currentIframePage = this.homeIframePage;
		this.currentItem = this.homeItem;
		this.addClass(this.currentItem, 'active-item');
		this.addClass(this.currentIframePage, 'active-iframe');
	},
	//关闭当前选项卡
	closeCurrent: function() {
		this.removeItem(this.currentItem, true);
	},
	//关闭其他选项卡
	closeOthers: function() {
		var index = this.itemList.lastIndexOf(this.currentItem);
		var len = this.itemList.length;
		for(var i = 0; i < len; i++) {
			if(i != index) {
				this.removeItem(this.currentItem, true);
			}
		}
	},
	//关闭所有选项卡
	closeAll: function() {
		var index = this.itemList.lastIndexOf(this.currentItem);
		var len = this.itemList.length;
		for(var i = 0; i < len; i++) {
			this.removeItem(this.currentItem, true);
		}
	},
	//全屏展示
	fullScreen: function(element) {
		//兼容性设置
		var requestMethod = element.requestFullscreen ||
			element.webkitRequestFullScreen ||
			element.mozRequestFullScreen ||
			element.msRequestFullscreen;
		if(requestMethod) {
			requestMethod.call(element);
		}
		//判断是否支持ActiveX控件
		else if(typeof window.ActiveXObject != 'undefined') {
			//这里其实就是模拟了按下键盘的F11，使浏览器全屏
			var wscript = new ActiveXObject('WScript.Shell');
			if(wscript != null) {
				wscript.SendKeys('{F11}');
			}
		}
		this.screenFlag = false;
	},
	//退出全屏
	exitFullScreen: function(element) {
		var exitMethod = document.exitFullscreen ||
			document.mozCancelFullScreen ||
			document.webkitExitFullscreen ||
			document.webkitCancelFullScreen ||
			document.msExitFullscreen;
		if(exitMethod) {
			exitMethod.call(document);
		} else if(typeof window.ActiveXObject != 'undefined') {
			//这里其实就是模拟了按下键盘的F11，使浏览器全屏
			var wscript = new ActiveXObject('WScript.Shell');
			if(wscript != null) {
				wscript.SendKeys('{F11}');
			}
		}
		this.screenFlag = true;
	},
	//选项卡整体向左平移
	moveLeft: function() {
		var parLicRight = this.itemBarContainer.getBoundingClientRect().right;
		var len = this.itemList.length - 1,
			lastItemLicR = 0;
		var x = 0;
		if(this.itemList[len]) {
			lastItemLicR = this.itemList[len].getBoundingClientRect().right;
			x = parLicRight - lastItemLicR;
		}
		//只有容器右边有隐藏的选项卡才移动
		if(x < 0) {
			this.hideItemNum === 0 ? this.move = (-this.homeItemW) : this.move -= this.itemWidth;
			this.hideItemNum += 1;
			this.startMove(this.itemContainer, {
				'marginLeft': this.move
			}, 500);
		} else {
			alert('已到达尾部了，不可以再点击！');
		}
	},
	//选项卡整体向右平移
	moveRight: function(obj) {
		//只有左边有隐藏的选项卡才移动
		if(this.hideItemNum > 0) {
			this.hideItemNum === 1 ? this.move = 0 : this.move += this.itemWidth;
			this.hideItemNum -= 1;
			this.startMove(this.itemContainer, {
				'marginLeft': this.move
			}, 500);
		} else {
			alert('已经到达头部了，不可以再点击！');
		}
	},
	//给指定对象添加类
	addClass: function(obj, cls) {
		//如果原来没有class：
		if(obj.className == '') {
			obj.className = cls;
		} else {
			//本来已经有class，新增class的情况：
			var arrclassname = obj.className.split(' ');
			var index = arrclassname.indexOf(cls);
			if(index == -1) {
				//如果要添加的class在原来的元素上不存在：
				obj.className += ' ' + cls;
			}
		}
	},
	//删除指定对象的类名
	removeClass: function(obj, cls) {
		//如果有class的话：
		if(obj.className != '') {
			var arrClassName = obj.className.split(' ');
			//对原有class进行拆分，看看是否包含需要移除的class
			var index = arrClassName.indexOf(cls);
			//r如果有需要移除的class
			if(index != -1) {
				arrClassName.splice(index, 1);
				obj.className = arrClassName.join(' ');
			}
		}

	},
	//判断当前对象是否有这个类名
	hasClass: function(obj, cls) {
		var cls = cls || '';
		if(cls.replace(/\s/g, '').length == 0) {
			return false; //当cls没有参数时,返回false;
		} else {
			return new RegExp(' ' + cls + '').test(' ' + obj.className);
		}

	},
	//根据Id获取dom对象
	getById: function(id) {
		return document.getElementById(id);
	},
	//获取行内样式
	getStyle: function(obj, attr) {
		if(obj.currentStyle) {
			return obj.currentStyle[attr];
		} else {
			return getComputedStyle(obj, false)[attr];
		}
	},
	//运动辅助函数
	startMove: function(obj, mJson, time, cv) {
		cv = cv || 'easeOut';
		var startVal = {};
		var endVal = {};
		var startTime = new Date();
		for(var key in mJson) {
			startVal[key] = parseInt(this.getStyle(obj, key));
			endVal[key] = parseInt(mJson[key]);
		}
		var timer = setInterval(function() {
			var t = new Date() - startTime; // 经过了多长时间
			var d = time; // 总运行时间
			if(t >= d) {
				t = d;
				clearInterval(timer);
			};
			for(var key in mJson) {
				var b = startVal[key];
				var c = endVal[key] - b;
				var s = Tween[cv](t, b, c, d);
				obj.style[key] = s + 'px';
			};
		}, 13);
	}
}