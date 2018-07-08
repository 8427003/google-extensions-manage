window.version_m= "1.3.3";
if(localStorage["version_m"] != window.version_m){
    //chrome.tabs.create({selected:true,url:"ad.html"})
    localStorage["version_m"] = window.version_m;
    localStorage["enabled"] = 1;
    localStorage["first_run"] = 1;
    localStorage["ex_list"] = [];
}

var enabled = !!parseInt(localStorage["enabled"]);
var ex_list = [];
var el = document.getElementById('extensions_list');
var width = 240;
var icons = {};
_list();

el.oncontextmenu = function (e){
    e.preventDefault();
	if(e.target.nodeName == 'LI' && e.target.id != 'onekey'){
        chrome.management.uninstall(e.srcElement.id, {showConfirmDialog: !0}, _list);
	}
    return false;
}
el.addEventListener('click', function (e){
    if(!e.target) {
        return;
    }
    var curDom = e.target;

    if(curDom.id === "onekey") {
        enabled ? disable_all() : enable_all();
        return;
    }

    if(-1 !== curDom.className.indexOf('js-item')) {
        enable_item(curDom.id);
    }

})
function _list(){
	chrome.management.getAll(function (result){
        var len = result.length, i = 0, html = '';
        el.style.display = "none";
        //一键禁用|启用按钮
        html += '<li id="onekey">';
        html += (enabled ? chrome.i18n.getMessage("onekeydisable") : chrome.i18n.getMessage("onekeyenable"))+'</li>';
        var Apps = [];
        for(i; i < len; i++){
            if(result[i].name === chrome.i18n.getMessage("extname")) continue;
            if(result[i].isApp){
                Apps.push(result[i]);
                continue;
            }
            var class_name = result[i].enabled ? 'enabled':'disabled',
                icon = result[i].icons ? result[i].icons[0].url:'default_icon.png',
                title = result[i].enabled ? chrome.i18n.getMessage("leftclicktodisablethis") : chrome.i18n.getMessage("leftclicktoenablethis"),
                hover_icon = result[i].enabled ? 'disabled.png' : 'enabled.png';
            html += '<li class="js-item '+ class_name + '" id="'+ result[i].id +'"';
            html += ' title="'+ title + chrome.i18n.getMessage("rightclicktouninstallthis") +'"';
            html += ' style="background-image:url('+ icon +')"';
            html += ' onclick="enable_item(this.id)"';
            html += '>'+ result[i].name+'</li>';
        }
        el.innerHTML = html;
        el.style.display = "block";
	});
	
	//不再是第一次运行
	localStorage["first_run"] = false;
}
function disable_all(){
	chrome.management.getAll(function (result){
		var t1 = new Date().getTime(),
            t = '',
            len = result.length;
		for (var i = 0; i < len; i++){
            if(result[i].isApp){
                continue;
            }
			if(result[i].enabled && result[i].name != chrome.i18n.getMessage("extname")) {
				//ex_list.push(result[i].id);
				t += (result[i].id + '|||');
				//_list每次回调反而会快 不知道为什么
				chrome.management.setEnabled(result[i].id, false);
			}
		}
        _list();
		enabled = false;
		localStorage["enabled"] = 0;
		//_list();
		
		t = t.substr(0, t.length-3);
		localStorage["ex_list"] = t;
		//alert(localStorage["ex_list"])
		console.log(new Date().getTime() - t1);
	});
	
}
function enable_all(){
	var t1 = new Date().getTime();
	ex_list = localStorage["ex_list"].split('|||');
    var len = ex_list.length;
	for (var i = 0; i < len; i++){
		chrome.management.setEnabled(ex_list[i], true);
		enabled = true;
		localStorage["enabled"] = 1;
	}
	_list();
	console.log(new Date().getTime() - t1);
}
function enable_item(id){
	chrome.management.get(id, function (result){
		chrome.management.setEnabled(result.id, !result.enabled, _list);
		//如果开启了某扩展 则允许“一键关闭所有扩展”
		//if(result.enabled == false){
		//	enabled = true;
		//	localStorage["enabled"] = 1;
		//}
	});
}

