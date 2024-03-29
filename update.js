/*
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
				setTimeout(function(){
					location.href="http://www.douban.com/doumail/write?to="+username+"&savebyme=true";
				},1000);

	},
	clear_NeedbeSyncedCounter=function(){
			localStorage["NeedbeSyncedCounter"]=0;
	},
	clear_NeedbeSyncedDataArray=function(){
			var NeedbeSyncedDataArray=[];
			localStorage["NeedbeSyncedDataArray"]=JSON.stringify(NeedbeSyncedDataArray);
	},
	getNeedbeSyncedDataArray=function(){
		var NeedbeSyncedDataArray=[];
		if(localStorage.hasOwnProperty("NeedbeSyncedDataArray")){
			NeedbeSyncedDataArray=JSON.parse(localStorage["NeedbeSyncedDataArray"]);
		}else{
			//first blood
			localStorage["NeedbeSyncedDataArray"]=JSON.stringify(NeedbeSyncedDataArray);
		}
		return NeedbeSyncedDataArray;
	}
	,stringify_database = function(){
			var database=[];
			var database_string="";
			var NeedbeSyncedDataArray=[];
			NeedbeSyncedDataArray=getNeedbeSyncedDataArray();
				NeedbeSyncedDataArray
			      .forEach(function(key){
			          var status=JSON.parse(localStorage[key]);
			          console.log(key);
			          	if(status.hasSync == "true"){
			          		//DO nothing
			          	}else{
			          		status.hasSync="true";
			          		var newStatus=JSON.stringify(status);
			          		localStorage[key]=newStatus;
			              database.push(newStatus);
			          	}
			       });

			    database_string=database.join(",");
			    clear_NeedbeSyncedCounter();
			    clear_NeedbeSyncedDataArray();
			    return database_string;
			    
	},savetoDouMail= function(){
		//不能大于2万字，这个必须搞定
			var title=$("#mt");
			var data=$("[name='m_text']");
			var submit=$("[name='m_submit']");
				title.val("database");
			var datatoSave=stringify_database();
			data.val(datatoSave);

						setTimeout(function(){
								//get this in timeout to wait for sync localstorage read and write
									
								//submit.click();
						},1000);
	},
	getNeedbeSyncedCounter=function(){
		var counter=0;
		if(localStorage.hasOwnProperty("NeedbeSyncedCounter")){
			counter=JSON.parse(localStorage["NeedbeSyncedCounter"]);
		}else{
			//first blood
			localStorage["NeedbeSyncedCounter"]=counter;
		}
		return counter;
	},	
	redirecttoTagView=function(){
		setTimeout(function(){
			location.href="http://www.douban.com/people/lemonhall2012/things?renderTagView=true";
		},300);
	},
	initUpdateView = function (){
			var doumail=$("a[href*='http://www.douban.com/doumail/']");

			doumail.after("<a id='douban-tags-report'>我的收藏</a>");
			var reshare_btn=$("div.actions a.btn-reshare");
				reshare_btn.each(function(){
						$(this).after("&nbsp;&nbsp;<a class='btn-tag-it'>收藏该条目</a>");
				});
			var douban_tags_report=$("#douban-tags-report");
			douban_tags_report.bind("click",function(event){
				redirecttoTagView();
			});			
	},
	getStatuData = function(objStatu){
				//优先判断是否为值得存取的类型
				//【存入数据库】类型
				var data_kind=objStatu.attr("data-object-kind");
				//【存入数据库】数据行为
				var data_action=objStatu.attr("data-action");
					if(debug==1){console.log("Action:"+data_action);}
			//============================================
				//打印人性化的提示信息
				var action=datatypehash[data_kind]===undefined?data_kind:datatypehash[data_kind];
					if(debug==1){console.log("Kind:"+action);}		
				//【数据库KEY】SID
				var data_sid=objStatu.attr("data-sid");
					if(debug==1){console.log("ID:"+data_sid);}
				//用户地址
				var user_url=objStatu.find("div.bd p.text a:first").attr("href");
					if(debug==1){console.log("user_url:"+user_url);}		
				//用户的昵称
				var user_name=objStatu.find("div.bd p.text a:first").html();
					if(debug==1){console.log("user_name:"+user_name);}
				//用户的发言
				var user_quote=objStatu.find("div.bd blockquote p").html();
					if(debug==1){console.log("user_quote:"+user_quote);}
				//【存入数据库】用户的唯一ID
				var user_uid=user_url.slice(29,-1);
					if(debug==1){console.log("user_uid:"+user_uid);}
				//【存入数据库】行为对象，div.bd p.text下的第二个a连接的href一般来说就是行为
				var data_object=objStatu.find("div.bd p.text a:eq(1)").attr("href");
					if(debug==1){console.log("行为对象:"+data_object);}
				//【存入数据库】行为对象的描述
				var data_description=objStatu.find("div.bd p.text a:eq(1)").html();
					if(debug==1){console.log("行为对象:"+data_description);}
				//【存入数据库？】时间对象？
				var time=objStatu.find("div.actions span.created_at").attr("title");
					if(debug==1){console.log("Time:"+time);}
				//生成一个全局对象ID的URL并存入数据库
				var uid_url=user_url+"status/"+data_sid;

				var Statue={};
					Statue.action=action;
					Statue.data_sid=data_sid;
					Statue.user_url=user_url;
					Statue.user_name=user_name;
					Statue.user_quote=user_quote;
					Statue.user_uid=user_uid;
					Statue.data_object=data_object;
					Statue.data_description=data_description;
					Statue.time=time;
					Statue.uid_url=uid_url;

				return Statue;

	},
	addNeedbeSyncedCounter=function(){
		var counter=0;
		if(localStorage.hasOwnProperty("NeedbeSyncedCounter")){
			counter=JSON.parse(localStorage["NeedbeSyncedCounter"]);
		}else{
			//first blood
			localStorage["NeedbeSyncedCounter"]=counter;
		}

		counter++;
		localStorage["NeedbeSyncedCounter"]=counter;
	},
	addNeedbeSyncedDataID=function(NeedbeSyncedDataID){
		var NeedbeSyncedDataArray=[];
		if(localStorage.hasOwnProperty("NeedbeSyncedDataArray")){
			NeedbeSyncedDataArray=JSON.parse(localStorage["NeedbeSyncedDataArray"]);
		}else{
			//first blood
			localStorage["NeedbeSyncedDataArray"]=JSON.stringify(NeedbeSyncedDataArray);
		}
		NeedbeSyncedDataArray.push(NeedbeSyncedDataID);
		localStorage["NeedbeSyncedDataArray"]=JSON.stringify(NeedbeSyncedDataArray);
	},
	addGenericCounter=function(Generic,key){
		var CounterName=Generic+"Counter";
		var key=key || "我说";
		var keyCounter={};
		var counter=0;		
		if(localStorage.hasOwnProperty(CounterName)){
			keyCounter=JSON.parse(localStorage[CounterName]);
			if(keyCounter.hasOwnProperty(key)){
				counter=keyCounter[key];
				counter++;
				keyCounter[key]=counter;
				localStorage[CounterName]=JSON.stringify(keyCounter);
			}else{	
				//first blood
				keyCounter[key]=1;
				localStorage[CounterName]=JSON.stringify(keyCounter);
			}
		}else{
			//first blood			
			var onekeyCounter={};
			onekeyCounter[key]=1;
			localStorage[CounterName]=JSON.stringify(onekeyCounter);
		}
	},
	addGenericIndexer=function(Generic,key,id){
		var IndxerName	=	Generic+"Indxer";
		var key			=	key || "我说";
		var id 			=	id || "11";
		var keyIndexer 	=	{};
		var ids 		=	[];		
		if(localStorage.hasOwnProperty(IndxerName)){
			keyIndexer=JSON.parse(localStorage[IndxerName]);
			if(keyIndexer.hasOwnProperty(key)){
				ids=JSON.parse(keyIndexer[key]);
				ids.push(id);
				keyIndexer[key]=JSON.stringify(ids);
				localStorage[IndxerName]=JSON.stringify(keyIndexer);
			}else{
				//first blood
				ids.push(id);
				keyIndexer[key]=JSON.stringify(ids);
				localStorage[IndxerName]=JSON.stringify(keyIndexer);
			}
		}else{
			//first blood			
				ids.push(id);
				keyIndexer[key]=JSON.stringify(ids);
				localStorage[IndxerName]=JSON.stringify(keyIndexer);
		}
	},
	savetoDB = function (_Statue){
		if(localStorage.hasOwnProperty(_Statue.data_sid)){
			_Statue=JSON.parse(localStorage[_Statue.data_sid]);
		}else{
			addNeedbeSyncedCounter();
			addNeedbeSyncedDataID(_Statue.data_sid);
			addGenericCounter("Kind",_Statue.action);
			addGenericIndexer("Kind",_Statue.action,_Statue.data_sid);
			addGenericCounter("User",_Statue.user_uid);
			addGenericIndexer("User",_Statue.user_uid,_Statue.data_sid);
		}
		if (_Statue.hasSync=="true") {
				//DO nothing
		}else{
			_Statue.hasSync="false";
			
			localStorage[_Statue.data_sid]=JSON.stringify(_Statue);
		}		
	},
	addFavBtn = function (){
		//在Action条下运行的，收藏按钮
		btn_tag_it=$("a.btn-tag-it");

		btn_tag_it.bind("click",function(event){
				
				var myself=$(this).parent().parent().parent().parent();
				var oneStatue=getStatuData(myself);
					if(debug==1){console.log("用户发言:"+oneStatue.user_quote);}
				savetoDB(oneStatue);			
				
		});//End of 收藏 LocalStorage				
	},
	router = function (){
		if(urlParams["savebyme"]==="true"){
				savetoDouMail();
		}
		if(ifupdate_url){
			initUpdateView();
			addFavBtn();
		}	
	}

	router();
 
} )();