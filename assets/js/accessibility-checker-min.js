class AccessibilityCheckerDisableHTML{constructor(){this.disableStylesButton=document.querySelector("#edac-highlight-disable-styles"),this.closePanel=document.querySelector("#edac-highlight-panel-close"),this.stylesDisabled=!1,this.originalCss=[],this.init()}init(){this.disableStylesButton.addEventListener("click",(()=>{this.stylesDisabled?this.enableStyles():this.disableStyles()})),this.closePanel.addEventListener("click",(()=>this.enableStyles()))}disableStyles(){this.originalCss=Array.from(document.head.querySelectorAll('style[type="text/css"], style, link[rel="stylesheet"]')),document.querySelectorAll('*[style]:not([class^="edac"])').forEach((function(t){t.removeAttribute("style")})),this.originalCss=this.originalCss.filter((function(t){return"edac-css"!==t.id&&"dashicons-css"!==t.id})),document.head.dataset.css=this.originalCss,this.originalCss.forEach((function(t){t.remove()})),this.stylesDisabled=!0,this.disableStylesButton.textContent="Enable Styles"}enableStyles(){this.originalCss.forEach((function(t){if("STYLE"===t.tagName)document.head.appendChild(t.cloneNode(!0));else{const e=document.createElement("link");e.rel="stylesheet",e.href=t.href,document.head.appendChild(e)}})),this.stylesDisabled=!1,this.disableStylesButton.textContent="Disable Styles"}}class AccessibilityCheckerHighlight{constructor(){this.addHighlightPanel(),this.nextButton=document.querySelector("#edac-highlight-next"),this.previousButton=document.querySelector("#edac-highlight-previous"),this.panelToggle=document.querySelector("#edac-highlight-panel-toggle"),this.closePanel=document.querySelector("#edac-highlight-panel-close"),this.panelDescription=document.querySelector("#edac-highlight-panel-description"),this.panelControls=document.querySelector("#edac-highlight-panel-controls"),this.descriptionCloseButton=document.querySelector(".edac-highlight-panel-description-close"),this.issues=null,this.currentButtonIndex=0,this.descriptionTimeout,this.urlParameter=this.get_url_parameter("edac"),this.currentIssueStatus=null,this.init()}init(){this.highlightButtonFocus(),this.highlightButtonFocusOut(),this.nextButton.addEventListener("click",(t=>this.highlightFocusNext())),this.previousButton.addEventListener("click",(t=>this.highlightFocusPrevious())),this.panelToggle.addEventListener("click",(()=>this.panelOpen())),this.closePanel.addEventListener("click",(()=>this.panelClose())),this.descriptionCloseButton.addEventListener("click",(()=>this.descriptionClose())),this.urlParameter&&this.panelOpen()}findElement(t,e){const i=t.object,s=(new DOMParser).parseFromString(i,"text/html");console.log(s);const n=s.body.firstElementChild;if(!n)return null;const l=document.body.querySelectorAll("*");for(const i of l)if(i.outerHTML===n.outerHTML)return this.wrapElement(i,t),this.addTooltip(i,t,e),this.isElementFocusable(i),i;return null}highlightAjax(){const t=new XMLHttpRequest,e=edac_script_vars.ajaxurl+"?action=edac_frontend_highlight_ajax&post_id="+edac_script_vars.postID+"&nonce="+edac_script_vars.nonce;t.open("GET",e),t.onload=function(){if(200===t.status){const e=JSON.parse(t.responseText);if(!0===e.success){let t=JSON.parse(e.data);console.log(t),this.issues=t,t.forEach(function(t,e){const i=this.findElement(t,e);console.log(i)}.bind(this))}else console.log(e)}else console.log("Request failed.  Returned status of "+t.status)}.bind(this),t.send()}wrapElement(t,e){const i=t.parentNode,s=document.createElement("div");s.className=`edac-highlight edac-highlight-${e.rule_type}`,i.insertBefore(s,t),s.appendChild(t)}unwrapElements(){const t=document.querySelectorAll(".edac-highlight");for(let e=0;e<t.length;e++){const i=t[e],s=i.parentNode,n=s.parentNode;"DIV"===n.tagName&&n.classList.contains("edac-highlight")&&(s.removeChild(i),n.parentNode.insertBefore(i,n),n.parentNode.removeChild(n))}}removeHighlightButtons(){const t=document.querySelectorAll(".edac-highlight-btn");for(let e=0;e<t.length;e++)t[e].remove()}addTooltip(t,e,i){const s=`\n\t\t\t<button class="edac-highlight-btn edac-highlight-btn-${e.rule_type}"\n\t\t\t\t\taria-label="${e.rule_title}"\n\t\t\t\t\taria-expanded="false"\n\t\t\t\t\tdata-id="${e.id}"\n\t\t\t\t\taria-controls="edac-highlight-tooltip-${e.id}"></button>\n\t\t`;t.insertAdjacentHTML("beforebegin",s)}addHighlightPanel(){document.body.insertAdjacentHTML("afterbegin",'\n\t\t\t<div class="edac-highlight-panel">\n\t\t\t<button id="edac-highlight-panel-toggle" class="edac-highlight-panel-toggle" title="Toggle accessibility tools"></button>\n\t\t\t<div id="edac-highlight-panel-description" class="edac-highlight-panel-description">\n\t\t\t\t<button class="edac-highlight-panel-description-close" aria-label="Close">×</button>\n\t\t\t\t<div class="edac-highlight-panel-description-title"></div>\n\t\t\t\t<div class="edac-highlight-panel-description-content"></div>\n\t\t\t\t<div id="edac-highlight-panel-description-code" class="edac-highlight-panel-description-code"><code></code></div>\t\t\t\n\t\t\t</div>\n\t\t\t<div id="edac-highlight-panel-controls" class="edac-highlight-panel-controls">\t\t\t\t\t\n\t\t\t\t<button id="edac-highlight-panel-close" class="edac-highlight-panel-close" aria-label="Close accessibility highlights panel" aria-label="Close">×</button><br />\n\t\t\t\t<button id="edac-highlight-previous"><span aria-hidden="true">« </span>previous</button>\n\t\t\t\t<button id="edac-highlight-next">Next<span aria-hidden="true"> »</span></button><br />\n\t\t\t\t<button id="edac-highlight-disable-styles">Disable Styles</button>\n\t\t\t</div>\n\t\t\t</div>\n\t\t')}highlightFocusNext=()=>{event.preventDefault();const t=this.issues[this.currentButtonIndex].id,e=document.querySelector(`[data-id="${t}"]`);e?this.isElementFocusable(e)?(e.focus(),this.currentIssueStatus=null):(this.currentIssueStatus="The element is not focusable. Try disabling styles.",console.log(`Element with id ${t} is not focusable!`)):(this.currentIssueStatus="The element was not found on the page.",console.log(`Element with id ${t} not found in the document!`)),this.description(t),this.currentButtonIndex=(this.currentButtonIndex+1)%this.issues.length};highlightFocusPrevious(){const t=this.issues[this.currentButtonIndex].id,e=document.querySelector(`[data-id="${t}"]`);e&&e.focus(),this.currentButtonIndex=(this.currentButtonIndex-1+this.issues.length)%this.issues.length,this.description(t)}isElementFocusable=t=>{if(t.parentElement&&t.parentElement.parentElement){const e=t.parentElement.parentElement,i=window.getComputedStyle(e);return e.style.display="block",e.style.visibility="visible","none"!==i.display&&"hidden"!==i.visibility}return!1};isElementVisible(t){const e=t.getBoundingClientRect(),i=window.innerHeight||document.documentElement.clientHeight,s=window.innerWidth||document.documentElement.clientWidth;return e.top>=0&&e.left>=0&&e.bottom<=i&&e.right<=s}isElementHidden(t){return"none"===window.getComputedStyle(t).display}panelOpen(){this.panelControls.style.display="block",this.panelToggle.style.display="none",this.highlightAjax()}panelClose(){this.panelControls.style.display="none",this.panelDescription.style.display="none",this.panelToggle.style.display="block",this.unwrapElements(),this.removeHighlightButtons()}highlightButtonFocus(){document.addEventListener("focusin",(t=>{const e=t.target;if(e.classList.contains("edac-highlight-btn")){const t=e.closest(".edac-highlight");if(t){t.classList.add("active");const i=e.getAttribute("data-id");this.description(i),this.cancelDescriptionTimeout()}}}))}highlightButtonFocusOut(){document.addEventListener("focusout",(t=>{const e=t.target;if(e.classList.contains("edac-highlight-btn")){const t=e.closest(".edac-highlight");if(t){t.classList.remove("active");document.querySelector("#edac-highlight-panel-description")}}}))}cancelDescriptionTimeout(){clearTimeout(this.descriptionTimeout)}description(t){const e=t,i=this.issues.find((t=>t.id===e));if(i){const t=document.querySelector(".edac-highlight-panel-description-title"),e=document.querySelector(".edac-highlight-panel-description-content"),s=document.querySelector(".edac-highlight-panel-description-code code");let n="";this.currentIssueStatus&&(n+=` <div class="edac-highlight-panel-description-status">${this.currentIssueStatus}</div>`),n+=i.summary,n+=` <br /><a class="edac-highlight-panel-description-reference" href="${i.link}">Full Documentation</a>`,n+='<button class="edac-highlight-panel-description-code-button" aria-expanded="false" aria-controls="edac-highlight-panel-description-code">Affected Code</button>',t.innerHTML=i.rule_title,e.innerHTML=n;let l=document.createTextNode(i.object);s.innerText=l.nodeValue,this.codeContainer=document.querySelector(".edac-highlight-panel-description-code"),this.codeButton=document.querySelector(".edac-highlight-panel-description-code-button"),this.codeButton.addEventListener("click",(()=>this.codeToggle())),this.codeContainer.style.display="none",this.panelDescription.style.display="block"}}get_url_parameter(t){var e,i,s=window.location.search.substring(1).split("&");for(i=0;i<s.length;i++)if((e=s[i].split("="))[0]===t)return void 0===e[1]||decodeURIComponent(e[1]);return!1}codeToggle(){this.cancelDescriptionTimeout(),"none"===this.codeContainer.style.display||""===this.codeContainer.style.display?(this.codeContainer.style.display="block",this.codeButton.setAttribute("aria-expanded","true")):(this.codeContainer.style.display="none",this.codeButton.setAttribute("aria-expanded","false"))}descriptionClose(){this.panelDescription.style.display="none"}}window.addEventListener("DOMContentLoaded",(()=>{1==edac_script_vars.active&&(new AccessibilityCheckerHighlight,new AccessibilityCheckerDisableHTML)}));