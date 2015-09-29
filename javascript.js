var startHeight;
var changeHeight = 100;
var stopHeight = 70;

function getSupportedPropertyName(properties) {
    for (var i = 0; i < properties.length; i++) {
        if (typeof document.body.style[properties[i]] != "undefined") {
            return properties[i];
        }
    }
    return null;
}

var transform = ["transform", "msTransform", "webkitTransform", "mozTransform", "oTransform"];

var transformProperty;

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

var dragMarginSize;
var width;
var navigationDrawer;
var smallGreyOut;

function initialiseSideNav(){
  transformProperty = getSupportedPropertyName(transform);

  navigationDrawer = document.getElementById('navigation-drawer');
  dragMarginSize = navigationDrawer.getBoundingClientRect().right;
  width = navigationDrawer.getBoundingClientRect().width;
  smallGreyOut = document.getElementById('small-grey-out');
  //
  navigationDrawer.addEventListener("touchstart",startDragSideNav,false);
  navigationDrawer.addEventListener("touchmove",dragSideNav, false);
  navigationDrawer.addEventListener("touchend",endDragSideNav,false);
  navigationDrawer.addEventListener("touchcancel",endDragSideNav,false);
  smallGreyOut.addEventListener("touchstart",startDragSideNav,false);
  smallGreyOut.addEventListener("touchmove",dragSideNav, false);
  smallGreyOut.addEventListener("touchend",endDragSideNav,false)
  smallGreyOut.addEventListener("touchcancel",endDragSideNav,false);
}


function expandSideNav(){
		navigationDrawer.style[transformProperty] = "translateX(0px)" ;;
    navigationDrawer.style.paddingRight = "0";
		document.getElementById('small-grey-out').style.width="100%";
    document.getElementById('small-grey-out').style.opacity="1";
		document.getElementsByTagName('body')[0].style.overflow="hidden";
    navigationDrawer.removeEventListener("touchstart",startDragSideNav,false);
    navigationDrawer.removeEventListener("touchmove",dragSideNav, false);
    navigationDrawer.removeEventListener("touchend",endDragSideNav,false);
    navigationDrawer.removeEventListener("touchcancel",endDragSideNav,false);
}
function hideSideNav(){
    navigationDrawer.style[transformProperty] = "translateX("+(-width + dragMarginSize)+"px)";
    navigationDrawer.style.paddingRight = dragMarginSize + "px";
		document.getElementById('navigation-drawer').classList.remove('show');
		document.getElementById('small-grey-out').style.width="0%";
    document.getElementById('small-grey-out').style.opacity="0";
		document.getElementsByTagName('body')[0].style.overflow="initial";
    navigationDrawer.addEventListener("touchstart",startDragSideNav,false);
    navigationDrawer.addEventListener("touchmove",dragSideNav, false);
    navigationDrawer.addEventListener("touchend",endDragSideNav,false);
    navigationDrawer.addEventListener("touchcancel",endDragSideNav,false);

}

function startDragSideNav(evt){
  navigationDrawer.classList.remove("transition");
  smallGreyOut.classList.remove("transition");
  smallGreyOut.style.width="100%";
}

function dragSideNav(evt){
  evt.preventDefault();
  var touches = evt.changedTouches;
  var touch = touches[0];
  if(touch.pageX > width - dragMarginSize){
    navigationDrawer.style[transformProperty] = "translateX(0px)";
    smallGreyOut.style.opacity = "1";
  }else{
    navigationDrawer.style[transformProperty]= "translateX("+(-width + touch.pageX +dragMarginSize) +"px)";
    smallGreyOut.style.opacity = touch.pageX/(width - dragMarginSize);
  }
}

  function endDragSideNav(evt){
      navigationDrawer.classList.add("transition");
      smallGreyOut.classList.add("transition");
      var touch = evt.changedTouches[0];
      if(touch.pageX/(width-dragMarginSize)>0.7){
        expandSideNav();
      }else{
        hideSideNav();
      }

  }
