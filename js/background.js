$('#get_popup_title').click(e => {
	var views = chrome.extension.getViews({type:'popup'});
	if(views.length > 0) {
		alert(views[0].document.title);
	} else {
		alert('popup未打开！');
	}
});