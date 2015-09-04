$(function() {
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();
 
        if (scroll >= 50) {
            	$("header").addClass('smaller');
				$("#side-nav-trigger").addClass('smaller');
				$("#top-nav").addClass('smaller');
        } else {
            	$("header").removeClass("smaller");
				$("#side-nav-trigger").removeClass('smaller');
				$("#top-nav").removeClass('smaller');
        }
    });
});


function expandSideNav(){
		document.getElementById('navigation-drawer').style.left="0px";
		document.getElementById('small-grey-out').style.width="100%";
		document.getElementsByTagName('body')[0].style.overflow="hidden";
}
function hideSideNav(){
		document.getElementById('navigation-drawer').style.left="-300px";
		document.getElementById('small-grey-out').style.width="0%";
		document.getElementsByTagName('body')[0].style.overflow="initial";
}