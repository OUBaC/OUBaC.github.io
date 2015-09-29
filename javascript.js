var startHeight;
var changeHeight = 100;
var stopHeight = 70;


function scrollAdjuster(){
  if(!startHeight){
    startHeight = document.getElementById('header').offsetHeight;
  }
  var scrollDistance = document.body.scrollTop;
  if(scrollDistance>=startHeight-changeHeight){
    document.getElementById('header').classList.add('smaller');
    document.getElementById('top-nav-container').classList.add('smaller-top-nav-container');
  }else{
    document.getElementById('header').classList.remove('smaller');
    document.getElementById('top-nav-container').classList.remove('smaller-top-nav-container');
  }
  if(scrollDistance>=startHeight-stopHeight){
    document.getElementById('header').classList.add('box-shadow');
    document.getElementById('header').style.height = stopHeight+"px";
  }else{
    document.getElementById('header').classList.remove('box-shadow');
    document.getElementById('header').style.height = startHeight - scrollDistance + "px";
  }

}



function expandSideNav(){
		document.getElementById('navigation-drawer').classList.add('show');
		document.getElementById('small-grey-out').style.width="100%";
    document.getElementById('small-grey-out').style.opacity="1";
		document.getElementsByTagName('body')[0].style.overflow="hidden";
}
function hideSideNav(){
		document.getElementById('navigation-drawer').classList.remove('show');
		document.getElementById('small-grey-out').style.width="0%";
    document.getElementById('small-grey-out').style.opacity="0";
		document.getElementsByTagName('body')[0].style.overflow="initial";
}
