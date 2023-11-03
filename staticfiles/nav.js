var navlinks = document.getElementById("sidebar-nav")
var menu_ico = document.getElementById("menu-ico")
var close_ico = document.getElementById("close-ico")

function showMenu() {
	navlinks.style.right = "0"
	close_ico.style.display = "block"
	menu_ico.style.display = "none"
	
}

function HideMenu() {
	navlinks.style.right = "-260px"
	close_ico.style.display = "none"
	menu_ico.style.display = "block"
}