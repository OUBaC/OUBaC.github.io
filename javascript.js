$(function() {
    $(window).scroll(function() {
        var scroll = $(window).scrollTop();

        if (scroll >= 50) {
            	$("header").addClass('smaller');
				      $("#side-nav-trigger").addClass('smaller');
              $("#social-links").addClass('smaller');
				      $("#top-nav-container").addClass('smaller-top-nav-container');
        } else {
              $("header").removeClass("smaller");
				      $("#side-nav-trigger").removeClass('smaller');
              $("#social-links").addClass('smaller');
				      $("#top-nav-container").removeClass('smaller-top-nav-container');
        }
    });
});


function expandSideNav(){
		document.getElementById('navigation-drawer').classList.add('show');
		document.getElementById('small-grey-out').style.width="100%";
		document.getElementsByTagName('body')[0].style.overflow="hidden";
}
function hideSideNav(){
		document.getElementById('navigation-drawer').classList.remove('show');
		document.getElementById('small-grey-out').style.width="0%";
		document.getElementsByTagName('body')[0].style.overflow="initial";
}
