let tooltip = document.createElement("div")
tooltip.classList.add("tooltip")

document.querySelector("body").appendChild(tooltip)

document.onmousemove = function(e){

	tooltip.style.left = e.pageX+"px"
	tooltip.style.top = e.pageY+"px"
}

document.onmouseover = function(event) {
    const element = event.target;
    if(element.hasAttribute("tooltip") != ""){
    	tooltip.style.display = "block"
    	tooltip.textContent = element.getAttribute("tooltip")
    }else{
    	tooltip.style.display = "none"
    }
}
