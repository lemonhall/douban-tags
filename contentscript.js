﻿/*
 * Copyright (c) 2010 The Chromium Authors. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */
 
(function(){
	var urlParams = {};
	var debug=1;
	(function () {
	    var match,
	        pl     = /\+/g,  // Regex for replacing addition symbol with a space
	        search = /([^&=]+)=?([^&]*)/g,
	        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
	        query  = window.location.search.substring(1);

	    while (match = search.exec(query))
	       urlParams[decode(match[1])] = decode(match[2]);
	})();
	//console.log(urlParams);
	function dayDiffFromNow(thePast){
			var millisBetween=Date.now()-thePast;
			var millisecondsPerDay = 1000 * 60 * 60 * 24;
			return	Math.floor(millisBetween / millisecondsPerDay);
	}	
	//判断是否是第一次运行
	var banfirstRun = (localStorage['douban_first'] == 'true');
		if (!banfirstRun) {
		//是第一次，则设置标记,初始化一个空数组，并设置给localStorage
  		localStorage['douban_first'] = 'true';
  		var empty_array=new Array();
  		localStorage.setItem('douban_banlist', JSON.stringify(empty_array));
		}

	//判断是否是第一次运行
	var firstRun = (localStorage['douban_collpse_timeout_mark'] == undefined);
	if(debug==3){console.log("firstRun："+firstRun);}
		if (!firstRun) {
			//不是第一次则比较时间
			var marktime=localStorage['douban_collpse_timeout_mark'];			
    		var days = dayDiffFromNow(marktime);
			//清除所有的缓存？
			if(debug==3){console.log("运行插件的日期差："+days);}
			//这是最简单粗暴的清理原则，但说实话，的确太暴力了
			if(days>3){
				localStorage.clear();
				localStorage['douban_collpse_timeout_mark'] = Date.now();
			}
		}else{
			//是第一次，则设置标记,记录当前时间
			localStorage['douban_collpse_timeout_mark'] = Date.now();
		}


var datatypehash={3043:"推荐单曲",1025:"上传照片",1026:"相册推荐",1013:"推荐小组话题",1018:"我说",1015:"推荐/新日记",1022:"推荐网址",1012:"推荐书评",1002:"看过电影",3049:"读书笔记",1011:"活动兴趣",3065:"东西",1001:"想读/读过",1003:"想听/听过"};

	var cur_location=location.href;
	var ifupdate_url=cur_location.slice(0,29)=="http://www.douban.com/update/";
	var people=cur_location.slice(29,-1);

var	getUserName = function(){
			if(ifupdate_url){
				var login_user=$(".pl:last a").attr("href").replace("/people/","").replace("/statuses","");
				return login_user;
			}
		},
	//如果转到了自己给自己写邮件的页面则
	//可以插入一个遮罩层，然后让用户察觉不到存储的过程，待搞定后再转回
	//主界面，然后可以用spin.js来搞定AJAX效果什么的
	redirecttoDouMail = function(){
			var username=getUserName();
				if(debug===1){console.log("username:"+username);}
			location.href="http://www.douban.com/doumail/write?to="+username+"&savebyme=true";

	},stringify_database = function(){
			var database=[];
			var database_string="";
				Object.keys(localStorage)
			      .forEach(function(key){
			          var status=JSON.parse(localStorage[key]);
			              database.push(JSON.stringify(status));
			       });

			    database_string=database.join(",");
			    return database_string;
			    
	},savetoDouMail= function(){
		//不能大于2万字，这个必须搞定
			var title=$("#mt");
			var data=$("[name='m_text']");
			var submit=$("[name='m_submit']");
				title.val("database");				
			data.val(stringify_database());
						setTimeout(function(){
								submit.click();
						},5000);
	},
	initUpdateView = function (){
			var doumail=$("a[href*='http://www.douban.com/doumail/']");
			doumail.after("<a id='douban-tags-report'>收藏报告</a>");
			var reshare_btn=$("div.actions a.btn-reshare");
				reshare_btn.each(function(){
						$(this).after("&nbsp;&nbsp;<a class='btn-tag-it'>收藏该条目</a>");
				});
	},
	addFavBtn = function (){
		//在Action条下运行的，收藏按钮
		btn_tag_it=$("a.btn-tag-it");
		btn_tag_it.bind("click",function(event){
				redirecttoDouMail();
				var myself=$(this).parent().parent().parent().parent();
				//优先判断是否为值得存取的类型
				//【存入数据库】类型
				var data_kind=myself.attr("data-object-kind");
				//【存入数据库】数据行为
				var data_action=myself.attr("data-action");
					if(debug==1){console.log("Action:"+data_action);}
			//============================================
				//打印人性化的提示信息
				var action=datatypehash[data_kind]===undefined?data_kind:datatypehash[data_kind];
					if(debug==1){console.log("Kind:"+action);}		
				//【数据库KEY】SID
				var data_sid=myself.attr("data-sid");
					if(debug==1){console.log("ID:"+data_sid);}
				//用户地址
				var user_url=myself.find("div.bd p.text a:first").attr("href");
					if(debug==1){console.log("user_url:"+user_url);}		
				//用户的昵称
				var user_name=myself.find("div.bd p.text a:first").html();
					if(debug==1){console.log("user_name:"+user_name);}
				//用户的发言
				var user_quote=myself.find("div.bd blockquote p").html();
					if(debug==1){console.log("user_quote:"+user_quote);}
				//【存入数据库】用户的唯一ID
				var user_uid=user_url.slice(29,-1);
					if(debug==1){console.log("user_uid:"+user_uid);}
				//【存入数据库】行为对象，div.bd p.text下的第二个a连接的href一般来说就是行为
				var data_object=myself.find("div.bd p.text a:eq(1)").attr("href");
					if(debug==1){console.log("行为对象:"+data_object);}
				//【存入数据库】行为对象的描述
				var data_description=myself.find("div.bd p.text a:eq(1)").html();
					if(debug==1){console.log("行为对象:"+data_description);}
				//【存入数据库？】时间对象？
				var time=myself.find("div.actions span.created_at").attr("title");
					if(debug==1){console.log("Time:"+time);}
				//生成一个全局对象ID的URL并存入数据库
				var uid_url=user_url+"status/"+data_sid;

				});//End of 收藏 LocalStorage
	},
	router = function (){
		if(urlParams["savebyme"]==="true"){
				savetoDouMail();
		}
		if(location.href==="http://www.douban.com/doumail/"){

		}
		if(ifupdate_url){
			initUpdateView();
			addFavBtn();
		}	
	}

	router();
 
} )();