// ==UserScript==
// @name         hlpugs.tf needed player indicator
// @namespace    Netroscript
// @version      0.1
// @description  Displays with an icon and a color if a specific class still needs players to add up. I want to add here, that the algorithm of HLPugs.tf is more lenient - meaning with the current algorithm (23.05.2018) of HLPugs not all classes have to be fulfilled (to be more specific seems like 2 are allowed to be missing)- This algorithm assumes worst case, meaning that no matter how the captains pick, it is always possible to start a game with the current draft.
// @author       Netroscript
// @match        https://eu.hlpugs.tf/
// @match        https://na.hlpugs.tf/
// @match        https://hlpugs.tf/
// @downloadURL  https://github.com/NetroScript/hlpugs.tf-needed-player-indicator/raw/master/hlpugs.tf-needed-player-indicator.user.js
// @updateURL    https://github.com/NetroScript/hlpugs.tf-needed-player-indicator/raw/master/hlpugs.tf-needed-player-indicator.meta.js
// @grant        none
// ==/UserScript==

(function() {
	'use strict';
	let style=`<style>.indicator {height: 100%;width: auto;position: relative;border: 1px white;border-radius: 100%;transform: scale(0.75);margin-left: -5px;} .indicator .details {position: absolute;transform: translateY(-100%);} .indicator img {height: 100%!important;position: relative;visibility: hidden;}.header.classHeader h1 {margin: 0px;} .tfclass.headerclass {transform: scale(0.75);margin-left: -5px;}</style>`
	$("head").append(style)
	$('<div class="indicator"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="><div class="details"><i class="fa fa-2x fa-ban"></i></div></div>').insertAfter(".tfclass.headerclass");
	let colors = ["#00aa00","#44ed21","#66ed21","#89ed22","#abec22","#ceec22","#f0ec22","#f3dd1c","#f5ce17","#f8bf11","#faaf0b","#fda006","#ff9100","#f68007","#ed6f0e","#e45e15","#db4c1c","#d23b23","#c92a2a"];
	function checkroles(){
		let players = {};
		$("#onlineUserList a").each(function() {
			players[$(this).attr("href")] = {};
		});
		for (let p in players) {
			players[p]["entered"] = $(".class a[href='" + p + "']").length;
		}

		let needed = {};
		let out = [];
		$("#classes .class .listholder").each(function() {
			needed[$(this).attr("data-class")] = 18;
			$(this).find(".playerLink").each(function() {
				if (players[$(this).attr("href")]["entered"] > 0) {
					needed[$(this).parent().parent().attr("data-class")] -= 9 / players[$(this).attr("href")]["entered"];
				}
			});
			out.push(Math.ceil(needed[$(this).attr("data-class")]));
		});

		let s = 0
		$(".indicator").each(function(){
			let e = $(this);
			let col = (out[s] <= 0) ? colors[0] : colors[out[s]]

			e.css("background-color", col)

			if(out[s] <= 0)
				e.find(".details").html('<i class="fa fa-2x fa-check-circle-o"></i>')
			else
				e.find(".details").html('<i class="fa fa-2x fa-ban"></i>')

			s++;
		})
	}

	let playnum = 0;

	setInterval(function(){
		if(document.getElementsByClassName("player").length != playnum){
			playnum = document.getElementsByClassName("player").length;
			checkroles()
		}
	}, 50);
	checkroles();
})();
