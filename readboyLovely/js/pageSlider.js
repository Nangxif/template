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
		var page = page + 5;
		return page;
	});
	var theTemplate = Handlebars.compile(theTemplateScript);  
	// 把数据传送到模板  
	var theCompiledHtml = theTemplate(data);  
	// 更新到模板  
	$('#content-area').html(theCompiledHtml);  

	$("#callus").addClass("sec"+(5+l));
	$("#sec").addClass("sec"+(6+l));

	//判断是否播放
	var ifplay=1;
	$("#play").on("touchend",function(){
		if(ifplay==1){
			ifplay=-1;
			$("#play").css("background-image","url('data:image/png;base64,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')");
			$("#play").css("animation","play 1s linear infinite");
			$("#play").css("-webkit-animation","play 1s linear infinite");
			document.getElementById("vi").pause();
		}else{
			ifplay=1;
			$("#play").css("background-image","url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGwAAABsCAMAAAC4uKf/AAAAilBMVEUAAABeXl44NzU4ODY5OTk4NzU4NzU5NzZAQDk4NzY8Ojo5ODU5NzU4NzVAQEA4NzU5ODY4NzY6Ojc5ODY4ODY5NzU4NzU5NzU7Ozs5ODY7OzY6ODU5ODY4ODVAQEA4NzU4ODc5ODU5NzU5ODY6OjU5NzY5NzU5ODU5OTY7ODg5OTk4NzU5ODY4NzWnnKnGAAAALXRSTlMABft/N+zGpRPfHZzL8gn1arcrs3Hvv4UVlC98Y1YNrETTj3U+sIuyT04k414Kc7w6AAAEWUlEQVRo3rSX65aqMAyFU6ZABUauXgBBVHTUGd7/9c5aJ0WQhbTlsn/NGpSvSXbSCCqyCi8OjdNK1zR9dTLC2CssWECEplu36pG7TSmZk8Q8/7sa0LfvsZliuh+1SijteJ8e336nV5LSd/tJKOvsVgpyz9b4qGKtUxvHTDMaWIwQZgU0S02nU0stHhmdt3kDhVECPUqi8A248UagqNN+g12SAQuVdvtcDlW14K2VwTBbg0DrLGzl8kaUjGE03zQDkFJgNuczFIzy0F8o+wnSetovnP4ASe2aEyagpKTJyE6uXPbreAdQ1uGVFFuicOufiuvKYITYteL6EdoqN+pqRTBSkVYXIRfEVbNWFEaLrmraYGykzqHDYIKYU2dyqG61N/wcJin3a5eIPW8SmChiijrgUbNgBtW0D91t6TyHZA4Y4ZnUrd6nBvdGDrMod7gl+85+455nMJP2vANuPc2hYS/TcS8u0uuv/Ct50JF6UxWXI8YAXUW8MNCRx+ehWlnKi4mcfhjwOel10rBB60gXbE0j84RpGoAxNPhm3zc6DnIcz+YcEQwO+CR+azH8riFsnuRgOw1HDAMDPWJBozP+KxniBH+xgyurCizBo51bFXMFU5OeDYnVeGC2u/vOANY+7zZfFWoE7Km9D2Si8/k7O6yZyDoB1B0/GwjuuZGwAB/eAXXEvRc+azsBBrgrH3nnYVazpWAZOoK1JtVmvRRsvWnNLJ/7fhFYU3H/vxfx51U5GqZvzwd7CFbiDzwCAJT/OQKmncxLscfeGIDxcCgApNyLarBf//aX4AGFMO7H9PWiSBrmOnZUMECJYc0lugUAHHqJDGwV7rIAw1GCJXhKAAtLBmJYmQNKGQZYNAuKZk0QrMoAo2G44BTgySzBXxNhJm/rGJ2yLAwdH/P5kS0Ly/gMMbDhloVRvuKc8C5bFoZ32glW6MplYRa2KeBKwJaFMZzYgDcnWRZGcG7/q9ZsVhiEgSBcSi6hbaT+0AqCB4/1/Z+vJxlZyqzrzzb6AH5oks3uzLjCXH+j6wZx3fq+h7ryK1eVayF2vWJweR4Gw+U5tQXrYKnrY1HEvnstawvQ8Nhh0GiLJQ0PWjkTDMobHr2VQ5Nqh7WCpTepaL+tsCBZevuNwcIKkz9RHyzoyMRh0ToyqcNgOQ7DWP6EFZJ1VYZBPuam4TONLEu+LCpjLh3gw+x1dM2ItIxl6qk0EYTDqO7GwKUJJrok8V3qOWsvXHRhclItUKSCwAsgchIVyu4chtoI94sKZVQCbASKV32cG00ChLjJYM1Ffbi4KRe7I7/xbidBtlUE6VrCajsKgrQitcutH5OdBamdmwjyUD+CmQQTgdsjKFcmV5K/khs/KMRDWrNgMH50SwtXzEZLy9Os+78NeYzBmod1fIApnovdv3eQIaeIxp7hk9xiNTsFhvKMQm0PeeUbX/MK5uF539ZEDs8QprTHRM8UgF0c7T1naHkex35uiGN/AXV+BrwcYLNoAAAAAElFTkSuQmCC')");
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
				$.ajax({
					url:"",
					data:{
						name:$("#name").val(),
						position:$("#position").val(),
						tel:$("#tel").val(),
						introduce:$("#introduce").val()
					},
					success:function(){
						$(".tip").text("提交成功");
						$(".tip").addClass("show");
						showTimer=setTimeout(function(){
							$(".tip").removeClass("show");
							clearTimeout(showTimer);
						},1500);
					},
					error:function(){
						$(".tip").text("提交失败");
						$(".tip").addClass("show");
						showTimer=setTimeout(function(){
							$(".tip").removeClass("show");
							clearTimeout(showTimer);
						},1500);
					}
				})
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
			$(".yellow").removeClass("yellowmove");
			$(".company-text").removeClass("company-text-move");
			$(".tuzi").removeClass("tuzi-move");
			$(".join").removeClass("join-move");
			$(".xin").removeClass("xin-move");
			$(".paopao").removeClass("paopao-move");
			cur = index == totalSec ? 1 : (index + 1);
			next = cur == totalSec ? (this.opt.loop ? 1 : 0) : (cur + 1);
			prev = index;
			if(cur==2){
				$(".blue").addClass("bluemove");
				timer2line=setTimeout(function(){
					$(".sec2 .left-line").addClass("left-line-move");
					$(".sec2 .right-line").addClass("right-line-move");
					clearTimeout(timer2line);
				},1200);
				timer2title=setTimeout(function(){
					$(".title_1").addClass("mouse-move");
					clearTimeout(timer2title);
				},2100);
				timer3content=setTimeout(function(){
					$(".cw_1").addClass("cw_1_move");
					$(".sec2 .title-content").addClass("fadein-swing");
					clearTimeout(timer3content);
				},2800);
			}else{
				$(".blue").removeClass("bluemove");
				$(".sec2 .left-line").removeClass("left-line-move");
				$(".sec2 .right-line").removeClass("right-line-move");
				$(".title_1").removeClass("mouse-move");
				$(".cw_1").removeClass("cw_1_move");
				$(".sec2 .title-content").removeClass("fadein-swing");
			}
			if(cur==3){
				timer3border=setTimeout(function(){
					$(".cw_2").addClass("cw_2-move");
					clearTimeout(timer3border);
				},500);
				timer3mouse=setTimeout(function(){
					$(".mouse").addClass("mouse-move");
					$(".title_2").addClass("mouse-move");
					clearTimeout(timer3mouse);
				},1200);
				timer3line=setTimeout(function(){
					$(".sec3 .left-line").addClass("left-line-move");
					$(".sec3 .right-line").addClass("right-line-move");
					$(".sec3 .title-content").addClass("fadein-swing");
					$(".pingban").addClass("pingban-move");
					$(".coffee").addClass("coffee-move");
					$(".glass").addClass("glass-move");
					clearTimeout(timer3line);
				},1900);
			}else{
				$(".cw_2").removeClass("cw_2-move");
				$(".mouse").removeClass("mouse-move");
				$(".title_2").removeClass("mouse-move");
				$(".sec3 .left-line").removeClass("left-line-move");
				$(".sec3 .right-line").removeClass("right-line-move");
				$(".sec3 .title-content").removeClass("fadein-swing");
				$(".pingban").removeClass("pingban-move");
				$(".coffee").removeClass("coffee-move");
				$(".glass").removeClass("glass-move");
			}
			if(cur==4){
				$("#l1").addClass("l1");
				$("#l2").addClass("l2");
				$("#l3").addClass("l3");
				$("#l4").addClass("l4");
				$("#l5").addClass("l5");
				$("#l6").addClass("l6");
				$("#s1").addClass("s1");
				$("#s2").addClass("s2");
				$("#s3").addClass("s3");
				$("#s4").addClass("s4");
				$("#s5").addClass("s5");
				$("#s6").addClass("s6");
				$("#p1").addClass("p1");
				$("#p2").addClass("p2");
				$("#p3").addClass("p3");
				$("#p4").addClass("p4");
				$("#p5").addClass("p5");
				$("#p6").addClass("p6");
				timer4bike=setTimeout(function(){
					$(".bike").addClass("bike-move");
					clearTimeout(timer4bike);
				},200);
				timer4kuan=setTimeout(function(){
					$(".title_3").addClass("mouse-move");
					clearTimeout(timer4kuan);
				},1200);
				timer4title=setTimeout(function(){
					$(".sec4 .left-line").addClass("left-line-move");
					$(".sec4 .right-line").addClass("right-line-move");
					$(".sec4 .title-content").addClass("fadein-swing");
					clearTimeout(timer4title);
				},1900);
			}else{
				$("#l1").removeClass("l1");
				$("#l2").removeClass("l2");
				$("#l3").removeClass("l3");
				$("#l4").removeClass("l4");
				$("#l5").removeClass("l5");
				$("#l6").removeClass("l6");
				$("#s1").removeClass("s1");
				$("#s2").removeClass("s2");
				$("#s3").removeClass("s3");
				$("#s4").removeClass("s4");
				$("#s5").removeClass("s5");
				$("#s6").removeClass("s6");
				$("#p1").removeClass("p1");
				$("#p2").removeClass("p2");
				$("#p3").removeClass("p3");
				$("#p4").removeClass("p4");
				$("#p5").removeClass("p5");
				$("#p6").removeClass("p6");
				$(".bike").removeClass("bike-move");
				$(".title_3").removeClass("mouse-move");
				$(".sec4 .left-line").removeClass("left-line-move");
				$(".sec4 .right-line").removeClass("right-line-move");
				$(".sec4 .title-content").removeClass("fadein-swing");
			}
			for(var i=0;i<l;i++){
				if(cur==(5+i)){
					$(".sec"+(5+i)+" .positionbg").addClass("bglarge");
					$(".sec"+(5+i)+" .titles").addClass("kuanlarge");
					$(".sec"+(5+i)+" .titles-content").addClass("textlarge");
					$(".sec"+(5+i)+" .cws").addClass("cws_move");
					$(".sec"+(5+i)+" .computer").addClass("computer_move");
				}else{
					$(".sec"+(5+i)+" .positionbg").removeClass("bglarge");
					$(".sec"+(5+i)+" .titles").removeClass("kuanlarge");
					$(".sec"+(5+i)+" .titles-content").removeClass("textlarge");
					$(".sec"+(5+i)+" .cws").removeClass("cws_move");
					$(".sec"+(5+i)+" .computer").removeClass("computer_move");
				}
			}
			if(cur==(5+l)){
				$(".ship").addClass("ship-move");
				$("#callus .content").addClass("bg-fadein-swing");
				$(".mail").addClass("mail_move");
			}else{
				$(".ship").removeClass("ship-move");
				$("#callus .content").removeClass("bg-fadein-swing");
				$(".mail").removeClass("mail_move");
			}
			if(cur==(6+l)){
				$(".upload").addClass("fadeIn");
				$(".lu").addClass("fadeIn");
				$(".sec"+(6+l)+" .left-line").addClass("left-line-move");
				$(".sec"+(6+l)+" .right-line").addClass("right-line-move");
				$(".sec"+(6+l)+" .sectitles").addClass("mouse-move");
				$(".sec"+(6+l)+" .sec-content").addClass("fadein-swing");
			}else{
				$(".upload").removeClass("fadeIn");
				$(".lu").removeClass("fadeIn");
				$(".sec"+(6+l)+" .left-line").removeClass("left-line-move");
				$(".sec"+(6+l)+" .right-line").removeClass("right-line-move");
				$(".sec"+(6+l)+" .sectitles").removeClass("mouse-move");
				$(".sec"+(6+l)+" .sec-content").removeClass("fadein-swing");
			}
		} else if (direction == 'prev') {
			$("#name,#tel,#position,#introduce").blur();//当不在最后一页的时候，手机的软键盘收起
			cur = index == 1 ? totalSec : (index - 1);
			next = index;
			prev = cur == 1 ? (this.opt.loop ? totalSec : 0) : (cur - 1);
			if(cur==1){
				$(".yellow").addClass("yellowmove");
				timer1two=setTimeout(function(){
					$(".company-text").addClass("company-text-move");
					$(".tuzi").addClass("tuzi-move");
					clearTimeout(timer1two);
				},1000);
				timer1zp=setTimeout(function(){
					$(".join").addClass("join-move");
					clearTimeout(timer1zp);
				},2100);
				timer1last=setTimeout(function(){
					$(".xin").addClass("xin-move");
					$(".paopao").addClass("paopao-move");
					clearTimeout(timer1last);
				},3200);
			}
			if(cur==2){
				$(".blue").addClass("bluemove");
				timer2line=setTimeout(function(){
					$(".sec2 .left-line").addClass("left-line-move");
					$(".sec2 .right-line").addClass("right-line-move");
					clearTimeout(timer2line);
				},1200);
				timer2title=setTimeout(function(){
					$(".title_1").addClass("mouse-move");
					clearTimeout(timer2title);
				},2100);
				timer3content=setTimeout(function(){
					$(".cw_1").addClass("cw_1_move");
					$(".sec2 .title-content").addClass("fadein-swing");
					clearTimeout(timer3content);
				},2800);
			}else{
				$(".blue").removeClass("bluemove");
				$(".sec2 .left-line").removeClass("left-line-move");
				$(".sec2 .right-line").removeClass("right-line-move");
				$(".title_1").removeClass("mouse-move");
				$(".cw_1").removeClass("cw_1_move");
				$(".sec2 .title-content").removeClass("fadein-swing");
			}
			if(cur==3){
				timer3border=setTimeout(function(){
					$(".cw_2").addClass("cw_2-move");
					clearTimeout(timer3border);
				},500);
				timer3mouse=setTimeout(function(){
					$(".mouse").addClass("mouse-move");
					$(".title_2").addClass("mouse-move");
					clearTimeout(timer3mouse);
				},1200);
				timer3line=setTimeout(function(){
					$(".sec3 .left-line").addClass("left-line-move");
					$(".sec3 .right-line").addClass("right-line-move");
					$(".sec3 .title-content").addClass("fadein-swing");
					$(".pingban").addClass("pingban-move");
					$(".coffee").addClass("coffee-move");
					$(".glass").addClass("glass-move");
					clearTimeout(timer3line);
				},1900);
			}else{
				$(".cw_2").removeClass("cw_2-move");
				$(".mouse").removeClass("mouse-move");
				$(".title_2").removeClass("mouse-move");
				$(".sec3 .left-line").removeClass("left-line-move");
				$(".sec3 .right-line").removeClass("right-line-move");
				$(".sec3 .title-content").removeClass("fadein-swing");
				$(".pingban").removeClass("pingban-move");
				$(".coffee").removeClass("coffee-move");
				$(".glass").removeClass("glass-move");
			}
			if(cur==4){
				$("#l1").addClass("l1");
				$("#l2").addClass("l2");
				$("#l3").addClass("l3");
				$("#l4").addClass("l4");
				$("#l5").addClass("l5");
				$("#l6").addClass("l6");
				$("#s1").addClass("s1");
				$("#s2").addClass("s2");
				$("#s3").addClass("s3");
				$("#s4").addClass("s4");
				$("#s5").addClass("s5");
				$("#s6").addClass("s6");
				$("#p1").addClass("p1");
				$("#p2").addClass("p2");
				$("#p3").addClass("p3");
				$("#p4").addClass("p4");
				$("#p5").addClass("p5");
				$("#p6").addClass("p6");
				timer4bike=setTimeout(function(){
					$(".bike").addClass("bike-move");
					clearTimeout(timer4bike);
				},200);
				timer4kuan=setTimeout(function(){
					$(".title_3").addClass("mouse-move");
					clearTimeout(timer4kuan);
				},1200);
				timer4title=setTimeout(function(){
					$(".sec4 .left-line").addClass("left-line-move");
					$(".sec4 .right-line").addClass("right-line-move");
					$(".sec4 .title-content").addClass("fadein-swing");
					clearTimeout(timer4title);
				},1900);
			}else{
				$("#l1").removeClass("l1");
				$("#l2").removeClass("l2");
				$("#l3").removeClass("l3");
				$("#l4").removeClass("l4");
				$("#l5").removeClass("l5");
				$("#l6").removeClass("l6");
				$("#s1").removeClass("s1");
				$("#s2").removeClass("s2");
				$("#s3").removeClass("s3");
				$("#s4").removeClass("s4");
				$("#s5").removeClass("s5");
				$("#s6").removeClass("s6");
				$("#p1").removeClass("p1");
				$("#p2").removeClass("p2");
				$("#p3").removeClass("p3");
				$("#p4").removeClass("p4");
				$("#p5").removeClass("p5");
				$("#p6").removeClass("p6");
				$(".bike").removeClass("bike-move");
				$(".title_3").removeClass("mouse-move");
				$(".sec4 .left-line").removeClass("left-line-move");
				$(".sec4 .right-line").removeClass("right-line-move");
				$(".sec4 .title-content").removeClass("fadein-swing");
			}
			for(var i=0;i<l;i++){
				if(cur==(5+i)){
					$(".sec"+(5+i)+" .positionbg").addClass("bglarge");
					$(".sec"+(5+i)+" .titles").addClass("kuanlarge");
					$(".sec"+(5+i)+" .titles-content").addClass("textlarge");
					$(".sec"+(5+i)+" .cws").addClass("cws_move");
					$(".sec"+(5+i)+" .computer").addClass("computer_move");
				}else{
					$(".sec"+(5+i)+" .positionbg").removeClass("bglarge");
					$(".sec"+(5+i)+" .titles").removeClass("kuanlarge");
					$(".sec"+(5+i)+" .titles-content").removeClass("textlarge");
					$(".sec"+(5+i)+" .cws").removeClass("cws_move");
					$(".sec"+(5+i)+" .computer").removeClass("computer_move");
				}
			}
			if(cur==(5+l)){
				$(".ship").addClass("ship-move");
				$("#callus .content").addClass("bg-fadein-swing");
				$(".mail").addClass("mail_move");
			}else{
				$(".ship").removeClass("ship-move");
				$("#callus .content").removeClass("bg-fadein-swing");
				$(".mail").removeClass("mail_move");
			}
			if(cur==(6+l)){
				$(".upload").addClass("fadeIn");
				$(".lu").addClass("fadeIn");
				$(".sec"+(6+l)+" .left-line").addClass("left-line-move");
				$(".sec"+(6+l)+" .right-line").addClass("right-line-move");
				$(".sec"+(6+l)+" .sectitles").addClass("mouse-move");
				$(".sec"+(6+l)+" .sec-content").addClass("fadein-swing");
			}else{
				$(".upload").removeClass("fadeIn");
				$(".lu").removeClass("fadeIn");
				$(".sec"+(6+l)+" .left-line").removeClass("left-line-move");
				$(".sec"+(6+l)+" .right-line").removeClass("right-line-move");
				$(".sec"+(6+l)+" .sectitles").removeClass("mouse-move");
				$(".sec"+(6+l)+" .sec-content").removeClass("fadein-swing");
			}
		} else {
			$("#name,#tel,#position,#introduce").blur();
			$(".yellow").addClass("yellowmove");
			timer1two=setTimeout(function(){
				$(".company-text").addClass("company-text-move");
				$(".tuzi").addClass("tuzi-move");
				clearTimeout(timer1two);
			},1000);
			timer1zp=setTimeout(function(){
				$(".join").addClass("join-move");
				clearTimeout(timer1zp);
			},2100);
			timer1last=setTimeout(function(){
				$(".xin").addClass("xin-move");
				$(".paopao").addClass("paopao-move");
				clearTimeout(timer1last);
			},3200);
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