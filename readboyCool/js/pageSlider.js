/*
 * pageSlider - Zepto plugin for mobile single page sliding
 *
 * Copyright (c) 2015 Frans Lee dmon@foxmail.com
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Version:  1.0
 *
 */
;(function($, window, document, undefined) {
	/**
	 * Instantiate parameters
	 *
	 * @constructor
	 */
	function PageSlider(optOrIndex){
			this.inited = false,
			this.startY = 0,
			this.distance = 0,
			this.timer = null,
			this.nextPageTop = 0,
			this.prevPageTop = 0,
			this.index = 0,
			this.curPagePos = 0,
			this.nextPagePos = 0,
			this.pageHeight = 0,
			this.prevPagePos = 0;

			this.opt = {
					startPage: 1,
					range: 70,
					duration: 200,
					loop: false,
					elastic: true,
					translate3d: true,
					callback:{}
				};

			this.init(optOrIndex);
	};

	/**
	 * Set translate/translate3d according to the option
	 *
	 * @param {Number|String} offsetY  Vertical Offset
	 * @returns {String}  translate/translate3d
	 */
	PageSlider.prototype.motion = function(offsetY){
		if (this.opt.translate3d) {
			return 'translate3d(0,' + offsetY + 'px,0)';
		} else {
			return 'translate(0,' + offsetY + 'px)';
		}
	};

	/**
	 * Show the specified page
	 *
	 * @param {Number} index  The target page number
	 * @param {string} direction  The direction of the sliding,'next' or 'prev'
	 */
	//招聘信息
	var data={
		detailIfo:[
		{
			"position":"PHP开发工程师",
			"pay":"7K-10K",
			"info":{
				"work":"跟进用户反馈信息，改善网站的功能并提供改善建议；根据开发进度和任务分配，完成相应模块软件的设计，开发、编程任务；代码编写及重构，开发及维护公司官网、商城、论坛、电商及新浪、微信平台；",
				"need":"具有一年及以上的开发经验,对技术和新技术有强烈的渴望，了解移动设备的网页设计和开发技术；熟悉CI、Yii，至少一种PHP框架.掌握XHTML、CSS、DIV、Javascript等前端技术；精通MVC框架，熟悉面向对象编程，具有PHP缓存技术使用、静态化设计方面的经验者；熟悉数据库，分布式数据存储，以及高流量访问、大用户量级平台系统设计与开发；有数据库优化，大型互联网设计、开发经验者优先。"
			}
		},
		{
			"position":"Android开发工程师",
			"pay":"6K-9K",
			"info":{
				"work":"无",
				"need":"计算机相关专业本科毕业；熟悉Android软件开发和手机开发的优先；要求熟悉Android应用开发平台，有网络应用开发经验的优先；了解HTTP、TCP/IP等协议，会使用SQL数据库编程；具备团队精神，并富有工作激情、创新力和责任感。"
			}
		},
		{
			"position":"C#开发工程师",
			"pay":"6K-8K",
			"info":{
				"work":"负责手机生产测试软件工具的开发、保证工具在产线运行的正确和稳定，以保证产品质量；维护工厂MES系统、生产流程管理系统；负责MTK及高通测试工具（包括下载写号，校准，耦合等工具）进行二次开发，提升产线通用、易用性，提升产线测试效率；负责产线测试工具开发（如线损自动测试工具，SN号检测工具等）。",
				"need":"熟悉一种主流数据库的使用，了解SQLserver数据库；熟悉VC++、C#编程；有自动化测试经验优先；熟悉工厂MES系统、生产流程管理系统或ERP软件开发者优先；了解adb、有开发手机助手或者刷机工具PC端相关经验的优先，有高通平台工具开发经验的更佳。"
			}
		},
		{
			"position":"web前端开发工程师",
			"pay":"7K-9K",
			"info":{
				"work":"无",
				"need":"精通Photoshop，Illustrator，Dreamweaver，flash等绘图及切图制作软件；熟练html5+css3.0，熟悉html的DOM结构，可快速制作html页面；熟悉原生javascript，熟悉jQuery框架，熟悉mvvm框架或其他流行的开源js框架并且对于建立js框架，有自己的想法优先；熟悉常见的浏览器的特点和限制，熟悉W3C相关标准和Web常用协议、图片文件格式等；有进行过APP内嵌web开发的优先。"
			}
		}
	]
	};
	//生成相应的界面
	var l=data["detailIfo"].length;
	var html = template('tem', data);
	$('#content-area').html(html);
	$("#callus").addClass("sec"+(8+l));
	$("#sec").addClass("sec"+(9+l));

	//判断是否播放
	var ifplay=1;
	$("#play").on("touchend",function(){
		if(ifplay==1){
			ifplay=-1;
			$("#play").css("background-image","url('../readboyFunny/img/noplay.png')");
			$("#play").css("animation","play 1s linear infinite");
			$("#play").css("-webkit-animation","play 1s linear infinite");
			document.getElementById("vi").pause();
		}else{
			ifplay=1;
			$("#play").css("background-image","url('../readboyFunny/img/play.png')");
			$("#play").css("animation","playrotate 1s linear infinite");
			$("#play").css("-webkit-animation","playrotate 1s linear infinite");
			document.getElementById("vi").play();
		}
	})
	$("#name").on("touchend",function(e){
		e.preventDefault();
		$("#name").focus();
	});
	$("#tel").on("touchend",function(e){
		e.preventDefault();
		$("#tel").focus();
	});
	$("#position").on("touchend",function(e){
		e.preventDefault();
		$("#position").focus();
	});
	$("#introduce").on("touchend",function(e){
		e.preventDefault();
		$("#introduce").focus();
	});
	$("#sec .content").on("touchend",function(e){
		e.preventDefault();
		if(e.srcElement.id!="name"&&e.srcElement.id!="position"&&e.srcElement.id!="tel"&&e.srcElement.id!="introduce"){
			$("#name,#tel,#position,#introduce").blur();
		}
	})
	var showTimer=null;
	$("#tellus").on("touchend",function(e){
		e.preventDefault();
		if($("#name").val().length==0||$("#tel").val().length==0||$("#position").val().length==0){
			$(".tip").text("必填信息没有完全输入！");
			$(".tip").addClass("show");
			showTimer=setTimeout(function(){
				$(".tip").removeClass("show");
				clearTimeout(showTimer);
			},1500);
		}else{
			if($("#name").val().length>5){
				$(".tip").text("联系信息最多只能输入5个字符！");
				$(".tip").addClass("show");
				showTimer=setTimeout(function(){
					$(".tip").removeClass("show");
					clearTimeout(showTimer);
				},1500);
			}else if($("#position").val().length>20){
				$(".tip").text("职位最多只能输入20个字符！");
				$(".tip").addClass("show");
				showTimer=setTimeout(function(){
					$(".tip").removeClass("show");
					clearTimeout(showTimer);
				},1500);
			}else if($("#tel").val().length>11){
				$(".tip").text("手机号最多只能输入11个字符！");
				$(".tip").addClass("show");
				showTimer=setTimeout(function(){
					$(".tip").removeClass("show");
					clearTimeout(showTimer);
				},1500);
			}else if($("#tel").val().length<=11&&!/^1[3|4|5|7|8][0-9]{9}$/.test($("#tel").val())){
				$(".tip").text("请输入正确格式的手机号码！");
				$(".tip").addClass("show");
				showTimer=setTimeout(function(){
					$(".tip").removeClass("show");
					clearTimeout(showTimer);
				},1500);
			}else if($("#introduce").val().length>11){
				$(".tip").text("最多只能输入300个字符！");
				$(".tip").addClass("show");
				showTimer=setTimeout(function(){
					$(".tip").removeClass("show");
					clearTimeout(showTimer);
				},1500);
			}else{
				$(".tip").text("提交成功");
				$(".tip").addClass("show");
				showTimer=setTimeout(function(){
					$(".tip").removeClass("show");
					clearTimeout(showTimer);
				},1500);
			}
		}
	})
	// 第一个页面所有定时器
	var timer1two=null;
	var timer1zp=null;
	var timer1last=null;
	// 第二个页面所有定时器
	var timer2line=null;
	var timer2title=null;
	var timer3content=null;
	//第三个页面所有的定时器
	var timer3border=null;
	var timer3mouse=null;
	var timer3line=null;
	//第四个页面所有的定时器
	var timer4bike=null;
	var timer4kuan=null;
	var timer4title=null;
	PageSlider.prototype.showSec = function(index, direction) {
		if ($('.current').length) $('.current,.next,.prev').css({
			'-webkit-transition': null,
			'-webkit-transform': null
		}).removeClass('current prev next');
		var cur, next, prev;
		var totalSec = $('.section').length;
		if (direction == 'next') {
			$("#name,#tel,#position,#introduce").blur();//当不在最后一页的时候，手机的软键盘收起
			cur = index == totalSec ? 1 : (index + 1);
			next = cur == totalSec ? (this.opt.loop ? 1 : 0) : (cur + 1);
			prev = index;
		} else if (direction == 'prev') {
			$("#name,#tel,#position,#introduce").blur();//当不在最后一页的时候，手机的软键盘收起
			cur = index == 1 ? totalSec : (index - 1);
			next = index;
			prev = cur == 1 ? (this.opt.loop ? totalSec : 0) : (cur - 1);
		} else {
			$("#name,#tel,#position,#introduce").blur();
			cur = index;
			next = index == totalSec ? (this.opt.loop ? 1 : 0) : (index + 1);
			prev = index == 1 ? (this.opt.loop ? totalSec : 0) : (index - 1);
			
		}
		var $curSec = $('.sec' + cur);
		var $nextSec = $('.sec' + next);
		var $prevSec = $('.sec' + prev);

		$curSec.addClass('current');
		this.pageHeight = $('.current').height();

		$nextSec.addClass('next').css('-webkit-transform', this.motion(this.pageHeight));
		$prevSec.addClass('prev').css('-webkit-transform', this.motion(-this.pageHeight));

		$curSec.addClass('ani').siblings('.section').removeClass('ani');
		//执行回调
		typeof(this.opt.callback[cur])=='function' && this.opt.callback[cur]();
	};

	/**
	 * Touch start event handler
	 */
	PageSlider.prototype.touchStartHandler = function(event) {
		var that = event.data.that;
		if(that.timer){
			event.preventDefault();
			return;
		}

		that.index = $('.section').index($(this)) + 1;
		var touch = event.touches[0];
		that.distance = 0;
		that.startY = touch.clientY;
		that.curPagePos = $(this).offset().top;
		that.nextPagePos = $('.next').length && $('.next').offset().top;
		that.prevPagePos = $('.prev').length && $('.prev').offset().top;
		$(this).off('touchmove').on('touchmove', {
			'that': that
		}, that.touchMoveHandler);
		$(this).off('touchend').on('touchend', {
			'that': that
		}, that.touchEndHandler);
		event.preventDefault();
	};

	/**
	 * Touch move event handler
	 */
	PageSlider.prototype.touchMoveHandler = function(event) {
		var that = event.data.that;
		if(that.timer){
			event.preventDefault();
			return;
		}
		var touch = event.touches[0];
		that.distance = touch.clientY - that.startY;
		if (Math.abs(that.distance) < 5) {
			event.preventDefault();
			return;
		};
		if (!that.opt.elastic && ((that.index === 1 && that.distance > 0) || (that.index === $('.section').length && that.distance < 0))) {
			event.preventDefault();
			return;
		}
		that.curPageTop = that.curPagePos + that.distance;
		that.nextPageTop = that.nextPagePos + that.distance;
		that.prevPageTop = that.prevPagePos + that.distance;

		$(this).css('-webkit-transform', that.motion(that.curPageTop));
		$('.next').css('-webkit-transform', that.motion(that.nextPageTop));
		$('.prev').css('-webkit-transform', that.motion(that.prevPageTop));
		event.preventDefault();
	};

	/**
	 * Touch end event handler
	 */
	PageSlider.prototype.touchEndHandler = function(event) {
		var that = event.data.that;
		if(that.timer){
			event.preventDefault();
			return;
		}
		$('.current,.next,.prev').css('-webkit-transition', '-webkit-transform ' + that.opt.duration + 'ms linear');
		if ((that.distance < -that.opt.range && $('.next').length) || (that.distance > that.opt.range && $('.prev').length)) {
			var next = !!(that.distance < -that.opt.range);
			$(this).css('-webkit-transform', that.motion((next ? (-$(this).height()) : $(this).height())));
			$(next ? '.next' : '.prev').css('-webkit-transform', that.motion(0));
			that.timer = setTimeout(function() {
				that.showSec(that.index, next ? 'next' : 'prev');
				clearTimeout(that.timer);
				that.timer = null;
			}, that.opt.duration + 5);
		} else {
			$(this).css('-webkit-transform', that.motion(0));
			$('.prev').css('-webkit-transform', that.motion(-that.pageHeight));
			$('.next').css('-webkit-transform', that.motion(that.pageHeight));
			that.timer = setTimeout(function() {
				$('.current,.next,.prev').css({
					'-webkit-transition': null
				});
				clearTimeout(that.timer);
				that.timer = null;
			}, that.opt.duration + 5);
		}
		event.preventDefault();
	};

	/**
	 * Sliding to the target page
	 *
	 * @param {Number} index  The target page number
	 */
	PageSlider.prototype.go = function(index){
			this.init(index);
	};

	/**
	 * PageSlider initializer
	 *
	 * @param {Object|Number} optOrIndex  Settings or page number
	 */
	PageSlider.prototype.init = function(optOrIndex){
			var that = this;
			if (typeof(optOrIndex) == 'object') {
				$.extend(true, that.opt, optOrIndex);
				that.inited = false;
			} else {
				optOrIndex && (that.opt.startPage = optOrIndex);
			}

			if (!that.inited) {
				$('.section').off('touchstart').on('touchstart', {
					'that': that
				}, that.touchStartHandler);
				that.showSec(that.opt.startPage);
				that.inited = true;
			} else {
				that.showSec(that.opt.startPage)
			}

			$(window).on('onorientationchange' in window ? 'orientationchange':'resize',function(){
				that.go(that.index+1);
			});
	};

	/**
	 * To generate an instance of object
	 *
	 * @param {Object|Number} optOrIndex  Settings or page number
	 */
	PageSlider.case = function(optOrIndex) {
		return new PageSlider(optOrIndex);
	};


	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		define(function() {
			return PageSlider;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = PageSlider.case;
		module.exports.PageSlider = PageSlider;
	} else {
		window.PageSlider = PageSlider;
	}

})(window.Zepto, window, document);