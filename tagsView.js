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


var datatypehash={3043:"推荐单曲",1025:"上传照片",1026:"相册推荐",1013:"推荐小组话题",1018:"我说",1015:"推荐/新日记",1022:"推荐网址",1012:"推荐书评",1002:"看过电影",3049:"读书笔记",1011:"活动兴趣",3065:"东西",1001:"想读/读过",1003:"想听/听过"};
//加载初期就读入硬盘上的两个索引，以便快速处理页面
var KindIndxer	= JSON.parse(localStorage["KindIndxer"]) 	|| {};
var KindCounter	= JSON.parse(localStorage["KindCounter"]) 	|| {};

var	renderTagstemplete=function(type){		
		var type	 = type || "我说";
		//console.log("入口参数："+type);
		var items	 = [];
		var templete = "";
		var ids		 = JSON.parse(KindIndxer[type]);

		_.each(ids, function(id){ 
			//console.log(id);
			var status= JSON.parse(localStorage[id]);
			var btn_delete = "&nbsp;&nbsp;<a class='btn_delete' data-tobedelete-id='"+id+"'>x</a>";
	        items.push(status.user_quote+btn_delete);
		});
	    templete=items.join("<br><br>");
	    return templete;
	},
	byclass_temple=function(){
		var Weigt="";
		var content	 = "<div class='hd'><h2>分类。。。。。</h2></div>";
		var byclass =[];
		Object.keys(KindCounter)
				.forEach(function(key){
          			var counter= KindCounter[key];
		  			var temp="<a class='render-byclass' data-byclass='*kind*'>*kind*("+counter+")</a>";
		  			byclass.push(temp.replace("*kind*",key).replace("*kind*",key));

       			});
		var byclass_string=byclass.join("&nbsp;&nbsp;");
		var byclass_final = "<div>"+byclass_string+"</div>";
		Weigt=content+byclass_final;
		return Weigt;
	},
	search_temple=function(){
		var Weigt 	 = "";
		var content	 = "<div class='hd'><h2>搜索。。。。。</h2></div>";
		var label 	 = "<label for='thing-side-search-inp' style='display: block;'>所有的东西</label>";
		var input    = "<input id='thing-side-search-inp' name='q' size='50' class='inp' value='' autocomplete='off' goog_input_chext='chext'>";
		var span_btn = "<span class='bn-flat'><input id='lemon_search' type='submit' value='搜索'></span>";
		var search_final = "<div>"+label+input+span_btn+"</div>";
		Weigt=content+search_final;
		return Weigt;
	},
	date_temple=function(){
		var Weigt 	 = "";
		var content	 = "<div class='hd'><h2>日期。。。。。</h2></div>";
		var date_final = "<div><ul><li><a>一月份</a></ul></div>";
		Weigt=content+date_final;
		return Weigt;
	},
	render_asideWeigt=function(){        
    		var aside    		= 	"<div class='aside'>";
    		var end_div  		= 	"</div>";
    		var byclass			=	byclass_temple();
    		var search			=	search_temple();
    		var date 			=   date_temple();
			$(".aside").html("");			
			$(".aside").html(aside+byclass+"<br/>"+search+"<br/>"+date+end_div);
			//以后可以建立数组并动态绑定事件到对应的事件
			$(".render-byclass").bind("click",function(){
				var type=$(this).attr("data-byclass");
				RenderArticleWeigt(type);
			});
	},
	renderTitle=function(){
			var objtitle=$(".info:first h1:first");
			var title=objtitle.html();
			objtitle.html(title.replace("东西","收藏"));
	},
	RenderArticleWeigt= function(type){
		//console.log("入口参数："+type);
		$(".article").html("");
			var templete = renderTagstemplete(type);
		$(".article").html(templete);
		$(".btn_delete").bind("click",function(){
				var id=$(this).attr("data-tobedelete-id");
				alert("Are you sure to delete "+id+" ??");
		});
	},
	renderTagView=function(){
		//<div id="db-usr-profile">
		//<div class="clear">
		//<div class="grid-16-8 clearfix">
		//<div class="article">
		//<div class='paginator'>
		//<div class="aside">
		//<div class="extra">
		renderTitle();
		render_asideWeigt();
		RenderArticleWeigt();		

	},
	router = function (){
		if(urlParams["renderTagView"]==="true"){
				renderTagView();
		}
	}

	router();
 
} )();