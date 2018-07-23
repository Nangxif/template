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
	//生成相应的界面
	var l=data["pagecontent"].length;
	// 抓取模板数据  
	var theTemplateScript = $("#address-template").html();  
	// 编译模板  
	Handlebars.registerHelper('formatnumber', function(page, options){
		var page = page + 7;
		return page;
	});
	var theTemplate = Handlebars.compile(theTemplateScript);  
	// 把数据传送到模板  
	var theCompiledHtml = theTemplate(data);  
	// 更新到模板  
	$('#content-area').html(theCompiledHtml);  
	$("#callus").addClass("sec"+(7+l));
	$("#sec").addClass("sec"+(8+l));

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
			$(".sec1 .black-opacity").removeClass("black-opacity-move");
			if(cur==2){
				$(".sec2 .q1").addClass("q1-move");
				$(".sec2 .q2").addClass("q2-move");
				$(".sec2 .q3").addClass("q3-move");
				$(".sec2 .goodbye").addClass("goodbye-move");
				$(".sec2 .comeon").addClass("comeon-move");
			}else{
				$(".sec2 .q1").removeClass("q1-move");
				$(".sec2 .q2").removeClass("q2-move");
				$(".sec2 .q3").removeClass("q3-move");
				$(".sec2 .goodbye").removeClass("goodbye-move");
				$(".sec2 .comeon").removeClass("comeon-move");
			}
			if(cur==3){
				$(".sec3 .book .book1").addClass("book1-move");
				$(".sec3 .book .book2").addClass("book2-move");
				$(".sec3 .book .book3").addClass("book3-move");
				$(".sec3 .book .book4").addClass("book4-move");
				$(".sec3 .book .book5").addClass("book5-move");
				$(".sec3 .book .book6").addClass("book6-move");
				$(".sec3 .book .book7").addClass("book7-move");
				$(".sec3 .book .book8").addClass("book8-move");
				$(".sec3 .book .books1").addClass("books1-move");
				$(".sec3 .book .books2").addClass("books2-move");
				$(".sec3 .book .books3").addClass("books3-move");
				$(".sec3 .book .books4").addClass("books4-move");
			}else{
				$(".sec3 .book .book1").removeClass("book1-move");
				$(".sec3 .book .book2").removeClass("book2-move");
				$(".sec3 .book .book3").removeClass("book3-move");
				$(".sec3 .book .book4").removeClass("book4-move");
				$(".sec3 .book .book5").removeClass("book5-move");
				$(".sec3 .book .book6").removeClass("book6-move");
				$(".sec3 .book .book7").removeClass("book7-move");
				$(".sec3 .book .book8").removeClass("book8-move");
				$(".sec3 .book .books1").removeClass("books1-move");
				$(".sec3 .book .books2").removeClass("books2-move");
				$(".sec3 .book .books3").removeClass("books3-move");
				$(".sec3 .book .books4").removeClass("books4-move");
			}
			if(cur==4){
				$(".sec4 .title p").addClass("p-move");
				$(".sec4 .content").addClass("content-move");
				$(".sec4 .content-wrapper").addClass("content-wrapper-move");
				$("#masterslider").addClass("masterslider-move");
			}else{
				$(".sec4 .title p").removeClass("p-move");
				$(".sec4 .content").removeClass("content-move");
				$(".sec4 .content-wrapper").removeClass("content-wrapper-move");
				$("#masterslider").removeClass("masterslider-move");
			}
			for(var i=0;i<l;i++){
				if(cur==(7+i)){
					$(".sec"+(7+i)+" .title p").addClass("p-move");
					$(".sec"+(7+i)+" .content").addClass("content-move");
					$(".sec"+(7+i)+" .content-wrapper").addClass("content-wrap-move");
					$(".sec"+(7+i)+" .content-wrapper p").addClass("content-wrapperp-move");
				}else{
					$(".sec"+(7+i)+" .title p").removeClass("p-move");
					$(".sec"+(7+i)+" .content").removeClass("content-move");
					$(".sec"+(7+i)+" .content-wrapper").removeClass("content-wrap-move");
					$(".sec"+(7+i)+" .content-wrapper p").removeClass("content-wrapperp-move");
				}
			}
			if(cur==(8+l)){
				$(".sec"+(8+l)+" .title p").addClass("p-move");
				$(".sec"+(8+l)+" .content").addClass("content-move");
			}else{
				$(".sec"+(8+l)+" .title p").removeClass("p-move");
				$(".sec"+(8+l)+" .content").removeClass("content-move");
			}
		} else if (direction == 'prev') {
			$("#name,#tel,#position,#introduce").blur();//当不在最后一页的时候，手机的软键盘收起
			$(".sec1 .black-opacity").addClass("black-opacity-move");
			cur = index == 1 ? totalSec : (index - 1);
			next = index;
			prev = cur == 1 ? (this.opt.loop ? totalSec : 0) : (cur - 1);
			if(cur==2){
				$(".sec2 .q1").addClass("q1-move");
				$(".sec2 .q2").addClass("q2-move");
				$(".sec2 .q3").addClass("q3-move");
				$(".sec2 .goodbye").addClass("goodbye-move");
				$(".sec2 .comeon").addClass("comeon-move");
			}else{
				$(".sec2 .q1").removeClass("q1-move");
				$(".sec2 .q2").removeClass("q2-move");
				$(".sec2 .q3").removeClass("q3-move");
				$(".sec2 .goodbye").removeClass("goodbye-move");
				$(".sec2 .comeon").removeClass("comeon-move");
			}
			if(cur==3){
				$(".sec3 .book .book1").addClass("book1-move");
				$(".sec3 .book .book2").addClass("book2-move");
				$(".sec3 .book .book3").addClass("book3-move");
				$(".sec3 .book .book4").addClass("book4-move");
				$(".sec3 .book .book5").addClass("book5-move");
				$(".sec3 .book .book6").addClass("book6-move");
				$(".sec3 .book .book7").addClass("book7-move");
				$(".sec3 .book .book8").addClass("book8-move");
				$(".sec3 .book .books1").addClass("books1-move");
				$(".sec3 .book .books2").addClass("books2-move");
				$(".sec3 .book .books3").addClass("books3-move");
				$(".sec3 .book .books4").addClass("books4-move");
			}else{
				$(".sec3 .book .book1").removeClass("book1-move");
				$(".sec3 .book .book2").removeClass("book2-move");
				$(".sec3 .book .book3").removeClass("book3-move");
				$(".sec3 .book .book4").removeClass("book4-move");
				$(".sec3 .book .book5").removeClass("book5-move");
				$(".sec3 .book .book6").removeClass("book6-move");
				$(".sec3 .book .book7").removeClass("book7-move");
				$(".sec3 .book .book8").removeClass("book8-move");
				$(".sec3 .book .books1").removeClass("books1-move");
				$(".sec3 .book .books2").removeClass("books2-move");
				$(".sec3 .book .books3").removeClass("books3-move");
				$(".sec3 .book .books4").removeClass("books4-move");
			}
			if(cur==4){
				$(".sec4 .title p").addClass("p-move");
				$(".sec4 .content").addClass("content-move");
				$(".sec4 .content-wrapper").addClass("content-wrapper-move");
				$("#masterslider").addClass("masterslider-move");
			}else{
				$(".sec4 .title p").removeClass("p-move");
				$(".sec4 .content").removeClass("content-move");
				$(".sec4 .content-wrapper").removeClass("content-wrapper-move");
				$("#masterslider").removeClass("masterslider-move");
			}
			for(var i=0;i<l;i++){
				if(cur==(7+i)){
					$(".sec"+(7+i)+" .title p").addClass("p-move");
					$(".sec"+(7+i)+" .content").addClass("content-move");
					$(".sec"+(7+i)+" .content-wrapper").addClass("content-wrap-move");
					$(".sec"+(7+i)+" .content-wrapper p").addClass("content-wrapperp-move");
				}else{
					$(".sec"+(7+i)+" .title p").removeClass("p-move");
					$(".sec"+(7+i)+" .content").removeClass("content-move");
					$(".sec"+(7+i)+" .content-wrapper").removeClass("content-wrap-move");
					$(".sec"+(7+i)+" .content-wrapper p").removeClass("content-wrapperp-move");
				}
			}
			if(cur==(8+l)){
				$(".sec"+(8+l)+" .title p").addClass("p-move");
				$(".sec"+(8+l)+" .content").addClass("content-move");
			}else{
				$(".sec"+(8+l)+" .title p").removeClass("p-move");
				$(".sec"+(8+l)+" .content").removeClass("content-move");
			}
		} else {
			$("#name,#tel,#position,#introduce").blur();
			$(".sec1 .black-opacity").addClass("black-opacity-move");
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