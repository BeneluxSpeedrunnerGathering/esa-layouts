(()=>{"use strict";var t={1712:(t,e,n)=>{var o=n(5803),i=n(9459),s=n(5925);n(4807),n(7023),n(5654),n(779),n(8793);var r=n(8586),a=l("computed",r.rn);function l(t,e){function n(n,o){return(0,s.createDecorator)((function(i,s){i[t]||(i[t]={});var r,a=((r={})[s]=n,r);i[t][s]=void 0!==o?e(o,a)[s]:e(a)[s]}))}return function(t,e){if("string"==typeof e){var o=e,i=t;return n(o,void 0)(i,o)}return n(t,function(t){var e=t&&t.namespace;if("string"==typeof e)return"/"!==e[e.length-1]?e+"/":e}(e))}}l("computed",r.Se),l("methods",r.nv),l("methods",r.OI);var c=function(t,e,n,o){var i,s=arguments.length,r=s<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,n):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,n,o);else for(var a=t.length-1;a>=0;a--)(i=t[a])&&(r=(s<3?i(r):s>3?i(e,n,r):i(e,n))||r);return s>3&&r&&Object.defineProperty(e,n,r),r};let u=class extends o.default{constructor(){super(...arguments),this.obsConfig=nodecg.bundleConfig.obs,this.gameLayoutPreviewToggle=!0,this.currentTime=Date.now()}created(){window.setInterval((()=>{this.currentTime=Date.now()}),100)}disableButton(t){return this.obsData.transitioning||t===this.obsData.scene||this.obsData.disableTransitioning}changeScene(t){nodecg.sendMessage("obsChangeScene",t)}};c([a],u.prototype,"obsData",void 0),c([a],u.prototype,"currentRunDelay",void 0),u=c([s.default],u);const d=u;var h=n(5440),p=n(7618),f=n.n(p),v=n(2311),g=n(6255),y=n(2244),m=n(2377);const b=(0,m.Ji)("spacer","div","v-spacer");var w=n(9050),_=n(7202);const C=o.default.extend({name:"rippleable",directives:{ripple:_.Z},props:{ripple:{type:[Boolean,Object],default:!0}},methods:{genRipple(t={}){return this.ripple?(t.staticClass="v-input--selection-controls__ripple",t.directives=t.directives||[],t.directives.push({name:"ripple",value:{center:!0}}),this.$createElement("div",t)):null}}}),S=o.default.extend({name:"comparable",props:{valueComparator:{type:Function,default:m.vZ}}});function $(t){t.preventDefault()}const x=(0,n(6248).Z)(w.Z,C,S).extend({name:"selectable",model:{prop:"inputValue",event:"change"},props:{id:String,inputValue:null,falseValue:null,trueValue:null,multiple:{type:Boolean,default:null},label:String},data(){return{hasColor:this.inputValue,lazyValue:this.inputValue}},computed:{computedColor(){if(this.isActive)return this.color?this.color:this.isDark&&!this.appIsDark?"white":"primary"},isMultiple(){return!0===this.multiple||null===this.multiple&&Array.isArray(this.internalValue)},isActive(){const t=this.value,e=this.internalValue;return this.isMultiple?!!Array.isArray(e)&&e.some((e=>this.valueComparator(e,t))):void 0===this.trueValue||void 0===this.falseValue?t?this.valueComparator(t,e):Boolean(e):this.valueComparator(e,this.trueValue)},isDirty(){return this.isActive},rippleState(){return this.isDisabled||this.validationState?this.validationState:void 0}},watch:{inputValue(t){this.lazyValue=t,this.hasColor=t}},methods:{genLabel(){const t=w.Z.options.methods.genLabel.call(this);return t?(t.data.on={click:$},t):t},genInput(t,e){return this.$createElement("input",{attrs:Object.assign({"aria-checked":this.isActive.toString(),disabled:this.isDisabled,id:this.computedId,role:t,type:t},e),domProps:{value:this.value,checked:this.isActive},on:{blur:this.onBlur,change:this.onChange,focus:this.onFocus,keydown:this.onKeydown,click:$},ref:"input"})},onBlur(){this.isFocused=!1},onClick(t){this.onChange(),this.$emit("click",t)},onChange(){if(!this.isInteractive)return;const t=this.value;let e=this.internalValue;if(this.isMultiple){Array.isArray(e)||(e=[]);const n=e.length;e=e.filter((e=>!this.valueComparator(e,t))),e.length===n&&e.push(t)}else e=void 0!==this.trueValue&&void 0!==this.falseValue?this.valueComparator(e,this.trueValue)?this.falseValue:this.trueValue:t?this.valueComparator(e,t)?null:t:!e;this.validate(!0,e),this.internalValue=e,this.hasColor=e},onFocus(){this.isFocused=!0},onKeydown(t){}}});function D(t){const e={touchstartX:0,touchstartY:0,touchendX:0,touchendY:0,touchmoveX:0,touchmoveY:0,offsetX:0,offsetY:0,left:t.left,right:t.right,up:t.up,down:t.down,start:t.start,move:t.move,end:t.end};return{touchstart:t=>function(t,e){const n=t.changedTouches[0];e.touchstartX=n.clientX,e.touchstartY=n.clientY,e.start&&e.start(Object.assign(t,e))}(t,e),touchend:t=>function(t,e){const n=t.changedTouches[0];e.touchendX=n.clientX,e.touchendY=n.clientY,e.end&&e.end(Object.assign(t,e)),(t=>{const{touchstartX:e,touchendX:n,touchstartY:o,touchendY:i}=t;t.offsetX=n-e,t.offsetY=i-o,Math.abs(t.offsetY)<.5*Math.abs(t.offsetX)&&(t.left&&n<e-16&&t.left(t),t.right&&n>e+16&&t.right(t)),Math.abs(t.offsetX)<.5*Math.abs(t.offsetY)&&(t.up&&i<o-16&&t.up(t),t.down&&i>o+16&&t.down(t))})(e)}(t,e),touchmove:t=>function(t,e){const n=t.changedTouches[0];e.touchmoveX=n.clientX,e.touchmoveY=n.clientY,e.move&&e.move(Object.assign(t,e))}(t,e)}}const k={inserted:function(t,e,n){const o=e.value,i=o.parent?t.parentElement:t,s=o.options||{passive:!0};if(!i)return;const r=D(e.value);i._touchHandlers=Object(i._touchHandlers),i._touchHandlers[n.context._uid]=r,(0,m.XP)(r).forEach((t=>{i.addEventListener(t,r[t],s)}))},unbind:function(t,e,n){const o=e.value.parent?t.parentElement:t;if(!o||!o._touchHandlers)return;const i=o._touchHandlers[n.context._uid];(0,m.XP)(i).forEach((t=>{o.removeEventListener(t,i[t])})),delete o._touchHandlers[n.context._uid]}};var A=n(2138);function j(t=[],...e){return Array().concat(t,...e)}function O(t,e="top center 0",n){return{name:t,functional:!0,props:{group:{type:Boolean,default:!1},hideOnLeave:{type:Boolean,default:!1},leaveAbsolute:{type:Boolean,default:!1},mode:{type:String,default:n},origin:{type:String,default:e}},render(e,n){const o="transition"+(n.props.group?"-group":""),i={props:{name:t,mode:n.props.mode},on:{beforeEnter(t){t.style.transformOrigin=n.props.origin,t.style.webkitTransformOrigin=n.props.origin}}};return n.props.leaveAbsolute&&(i.on.leave=j(i.on.leave,(t=>t.style.position="absolute"))),n.props.hideOnLeave&&(i.on.leave=j(i.on.leave,(t=>t.style.display="none"))),e(o,(0,A.ZP)(n.data,i),n.children)}}}function T(t,e,n="in-out"){return{name:t,functional:!0,props:{mode:{type:String,default:n}},render:(n,o)=>n("transition",(0,A.ZP)(o.data,{props:{name:t},on:e}),o.children)}}function L(t="",e=!1){const n=e?"width":"height",o=`offset${(0,m.jC)(n)}`;return{beforeEnter(t){t._parent=t.parentNode,t._initialStyle={transition:t.style.transition,overflow:t.style.overflow,[n]:t.style[n]}},enter(e){const i=e._initialStyle;e.style.setProperty("transition","none","important"),e.style.overflow="hidden";const s=`${e[o]}px`;e.style[n]="0",e.offsetHeight,e.style.transition=i.transition,t&&e._parent&&e._parent.classList.add(t),requestAnimationFrame((()=>{e.style[n]=s}))},afterEnter:s,enterCancelled:s,leave(t){t._initialStyle={transition:"",overflow:t.style.overflow,[n]:t.style[n]},t.style.overflow="hidden",t.style[n]=`${t[o]}px`,t.offsetHeight,requestAnimationFrame((()=>t.style[n]="0"))},afterLeave:i,leaveCancelled:i};function i(e){t&&e._parent&&e._parent.classList.remove(t),s(e)}function s(t){const e=t._initialStyle[n];t.style.overflow=t._initialStyle.overflow,null!=e&&(t.style[n]=e),delete t._initialStyle}}O("carousel-transition"),O("carousel-reverse-transition"),O("tab-transition"),O("tab-reverse-transition"),O("menu-transition");const V=O("fab-transition","center center","out-in");O("dialog-transition"),O("dialog-bottom-transition"),O("dialog-top-transition"),O("fade-transition"),O("scale-transition"),O("scroll-x-transition"),O("scroll-x-reverse-transition"),O("scroll-y-transition"),O("scroll-y-reverse-transition"),O("slide-x-transition"),O("slide-x-reverse-transition"),O("slide-y-transition"),O("slide-y-reverse-transition"),T("expand-transition",L()),T("expand-x-transition",L("",!0));var P=n(2506);const E=x.extend({name:"v-switch",directives:{Touch:k},props:{inset:Boolean,loading:{type:[Boolean,String],default:!1},flat:{type:Boolean,default:!1}},computed:{classes(){return{...w.Z.options.computed.classes.call(this),"v-input--selection-controls v-input--switch":!0,"v-input--switch--flat":this.flat,"v-input--switch--inset":this.inset}},attrs(){return{"aria-checked":String(this.isActive),"aria-disabled":String(this.isDisabled),role:"switch"}},validationState(){return this.hasError&&this.shouldValidate?"error":this.hasSuccess?"success":null!==this.hasColor?this.computedColor:void 0},switchData(){return this.setTextColor(this.loading?void 0:this.validationState,{class:this.themeClasses})}},methods:{genDefaultSlot(){return[this.genSwitch(),this.genLabel()]},genSwitch(){return this.$createElement("div",{staticClass:"v-input--selection-controls__input"},[this.genInput("checkbox",{...this.attrs,...this.attrs$}),this.genRipple(this.setTextColor(this.validationState,{directives:[{name:"touch",value:{left:this.onSwipeLeft,right:this.onSwipeRight}}]})),this.$createElement("div",{staticClass:"v-input--switch__track",...this.switchData}),this.$createElement("div",{staticClass:"v-input--switch__thumb",...this.switchData},[this.genProgress()])])},genProgress(){return this.$createElement(V,{},[!1===this.loading?null:this.$slots.progress||this.$createElement(P.Z,{props:{color:!0===this.loading||""===this.loading?this.color||"primary":this.loading,size:16,width:2,indeterminate:!0}})])},onSwipeLeft(){this.isActive&&this.onChange()},onSwipeRight(){this.isActive||this.onChange()},onKeydown(t){(t.keyCode===m.Do.left&&this.isActive||t.keyCode===m.Do.right&&!this.isActive)&&this.onChange()}}});var B=(0,h.Z)(d,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-app",[t.obsConfig.enable?t.obsData.connected?[n("div",{style:{"margin-bottom":"5px"}},[t._v("\n      Streaming Status:\n      "),t.obsData.streaming?n("span",{style:{"font-weight":"bold",color:"#58CF00"}},[t._v("\n        Connected\n      ")]):n("span",{style:{"font-weight":"bold",color:"#FF5F5C"}},[t._v("\n        Disconnected\n      ")])]),t._v(" "),n("div",{staticClass:"d-flex"},[n("div",{style:{"font-style":"italic","margin-bottom":"5px"}},[t._v("\n        Change Scene:\n      ")]),t._v(" "),n("v-spacer"),t._v(" "),t.obsData.transitionTimestamp>t.currentTime?n("div",{staticClass:"red--text font-weight-bold"},[t._v("\n        Transitioning in "+t._s(((t.obsData.transitionTimestamp-t.currentTime)/1e3).toFixed(1))+"s\n        "),n("v-icon",{attrs:{color:"red"}},[t._v("\n          mdi-alert\n        ")])],1):t._e()],1),t._v(" "),t._l(t.obsData.sceneList,(function(e,o){return n("v-btn",{key:o,style:{"margin-top":0!==o?"10px":"0"},attrs:{disabled:t.disableButton(e)},on:{click:function(n){return t.changeScene(e)}}},[t._v("\n      "+t._s(e)+"\n      "),e!==t.obsData.scene&&t.currentRunDelay.audio&&(e===t.obsConfig.names.scenes.gameLayout||e!==t.obsConfig.names.scenes.gameLayout&&t.obsData.scene===t.obsConfig.names.scenes.gameLayout)?[t._v("\n        ("+t._s((t.currentRunDelay.audio/1e3).toFixed(1))+"s delay)\n      ")]:t._e()],2)})),t._v(" "),t.obsData.gameLayoutScreenshot&&t.gameLayoutPreviewToggle?[n("div",{style:{"font-style":"italic",margin:"15px 0 5px 0"}},[t._v('\n        "Game Layout" Preview (refreshes every second):\n      ')]),t._v(" "),n("img",{style:{width:"100%"},attrs:{src:t.obsData.gameLayoutScreenshot}})]:t._e(),t._v(" "),n("v-switch",{style:{"margin-top":"10px"},attrs:{"hide-details":"",label:'Toggle "Game Layout" Preview'},model:{value:t.gameLayoutPreviewToggle,callback:function(e){t.gameLayoutPreviewToggle=e},expression:"gameLayoutPreviewToggle"}})]:n("div",{style:{"font-style":"italic"}},[t._v("\n    OBS connection currently disconnected.\n  ")]):n("div",{style:{"font-style":"italic"}},[t._v("\n    This feature is not enabled.\n  ")])],2)}),[],!1,null,null,null);const Z=B.exports;f()(B,{VApp:v.Z,VBtn:g.Z,VIcon:y.Z,VSpacer:b,VSwitch:E});var R=n(8138),X=n.n(R);o.default.use(r.ZP);const F={currentRunDelay:nodecg.Replicant("currentRunDelay"),obsData:nodecg.Replicant("obsData")},Y=new r.ZP.Store({state:{},mutations:{setState(t,{name:e,val:n}){o.default.set(t,e,n)}}});var M,I,H,N;Object.keys(F).forEach((t=>{F[t].on("change",(e=>{Y.commit("setState",{name:t,val:X()(e)})}))})),(M=void 0,I=void 0,H=void 0,N=function*(){return yield NodeCG.waitForReplicants(...Object.keys(F).map((t=>F[t]))),Y},new(H||(H=Promise))((function(t,e){function n(t){try{i(N.next(t))}catch(t){e(t)}}function o(t){try{i(N.throw(t))}catch(t){e(t)}}function i(e){var i;e.done?t(e.value):(i=e.value,i instanceof H?i:new H((function(t){t(i)}))).then(n,o)}i((N=N.apply(M,I||[])).next())}))).then((t=>{new o.default({vuetify:i.Z,store:t,el:"#App",render:t=>t(Z)})}))},779:(t,e,n)=>{"undefined"!=typeof Reflect&&Reflect.getMetadata},2027:(t,e,n)=>{n.d(e,{Z:()=>r});var o=n(5803),i=n(2377);const s={absolute:Boolean,bottom:Boolean,fixed:Boolean,left:Boolean,right:Boolean,top:Boolean},r=function(t=[]){return o.default.extend({name:"positionable",props:t.length?(0,i.ji)(s,t):s})}()},8298:(t,e,n)=>{n.d(e,{Kd:()=>s,N6:()=>r,fK:()=>a});var o=n(1823);function i(t,e,n){if(!o.Z.config.silent){if(n&&(e={_isVue:!0,$parent:n,$options:e}),e){if(e.$_alreadyWarned=e.$_alreadyWarned||[],e.$_alreadyWarned.includes(t))return;e.$_alreadyWarned.push(t)}return`[Vuetify] ${t}`+(e?function(t){if(t._isVue&&t.$parent){const e=[];let n=0;for(;t;){if(e.length>0){const o=e[e.length-1];if(o.constructor===t.constructor){n++,t=t.$parent;continue}n>0&&(e[e.length-1]=[o,n],n=0)}e.push(t),t=t.$parent}return"\n\nfound in\n\n"+e.map(((t,e)=>`${0===e?"---\x3e ":" ".repeat(5+2*e)}${Array.isArray(t)?`${c(t[0])}... (${t[1]} recursive calls)`:c(t)}`)).join("\n")}return`\n\n(found in ${c(t)})`}(e):"")}}function s(t,e,n){const o=i(t,e,n);null!=o&&console.warn(o)}function r(t,e,n){const o=i(t,e,n);null!=o&&console.error(o)}function a(t,e,n,o){r(`[BREAKING] '${t}' has been removed, use '${e}' instead. For more information, see the upgrade guide https://github.com/vuetifyjs/vuetify/releases/tag/v2.0.0#user-content-upgrade-guide`,n,o)}const l=/(?:^|[-_])(\w)/g;function c(t,e){if(t.$root===t)return"<Root>";const n="function"==typeof t&&null!=t.cid?t.options:t._isVue?t.$options||t.constructor.options:t||{};let o=n.name||n._componentTag;const i=n.__file;if(!o&&i){const t=i.match(/([^/\\]+)\.vue$/);o=t&&t[1]}return(o?`<${s=o,s.replace(l,(t=>t.toUpperCase())).replace(/[-_]/g,"")}>`:"<Anonymous>")+(i&&!1!==e?` at ${i}`:"");var s}},2377:(t,e,n)=>{n.d(e,{Ji:()=>i,qw:()=>r,vZ:()=>a,vO:()=>l,ji:()=>c,kb:()=>u,GL:()=>d,Do:()=>p,RB:()=>f,XP:()=>v,_A:()=>y,jC:()=>m,TI:()=>b,z9:()=>w,uZ:()=>_,Ee:()=>C});var o=n(5803);function i(t,e="div",n){return o.default.extend({name:n||t.replace(/__/g,"-"),functional:!0,render:(n,{data:o,children:i})=>(o.staticClass=`${t} ${o.staticClass||""}`.trim(),n(e,o,i))})}let s=!1;try{if("undefined"!=typeof window){const t=Object.defineProperty({},"passive",{get:()=>{s=!0}});window.addEventListener("testListener",t,t),window.removeEventListener("testListener",t,t)}}catch(t){console.warn(t)}function r(t,e,n){const o=e.length-1;if(o<0)return void 0===t?n:t;for(let i=0;i<o;i++){if(null==t)return n;t=t[e[i]]}return null==t||void 0===t[e[o]]?n:t[e[o]]}function a(t,e){if(t===e)return!0;if(t instanceof Date&&e instanceof Date&&t.getTime()!==e.getTime())return!1;if(t!==Object(t)||e!==Object(e))return!1;const n=Object.keys(t);return n.length===Object.keys(e).length&&n.every((n=>a(t[n],e[n])))}function l(t,e,n){return null!=t&&e&&"string"==typeof e?void 0!==t[e]?t[e]:r(t,(e=(e=e.replace(/\[(\w+)\]/g,".$1")).replace(/^\./,"")).split("."),n):n}function c(t,e){const n={};for(let o=0;o<e.length;o++){const i=e[o];void 0!==t[i]&&(n[i]=t[i])}return n}function u(t,e="px"){return null==t||""===t?void 0:isNaN(+t)?String(t):`${Number(t)}${e}`}function d(t){return(t||"").replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}function h(t){return null!==t&&"object"==typeof t}const p=Object.freeze({enter:13,tab:9,delete:46,esc:27,space:32,up:38,down:40,left:37,right:39,end:35,home:36,del:46,backspace:8,insert:45,pageup:33,pagedown:34});function f(t,e){const n=t.$vuetify.icons.component;if(e.startsWith("$")){const n=l(t,`$vuetify.icons.values.${e.split("$").pop().split(".").pop()}`,e);if("string"!=typeof n)return n;e=n}return null==n?e:{component:n,props:{icon:e}}}function v(t){return Object.keys(t)}const g=/-(\w)/g,y=t=>t.replace(g,((t,e)=>e?e.toUpperCase():""));function m(t){return t.charAt(0).toUpperCase()+t.slice(1)}function b(t){return null!=t?Array.isArray(t)?t:[t]:[]}function w(t,e="default",n,o=!1){return t.$scopedSlots[e]?t.$scopedSlots[e](n instanceof Function?n():n):!t.$slots[e]||n&&!o?void 0:t.$slots[e]}function _(t,e=0,n=1){return Math.max(e,Math.min(n,t))}function C(t={},e={}){for(const n in e){const o=t[n],i=e[n];h(o)&&h(i)?t[n]=C(o,i):t[n]=i}return t}},2138:(t,e,n)=>{n.d(e,{ZP:()=>a});var o=n(2377);const i=/;(?![^(]*\))/g,s=/:(.*)/;function r(t){const e={};for(const n of t.split(i)){let[t,i]=n.split(s);t=t.trim(),t&&("string"==typeof i&&(i=i.trim()),e[(0,o._A)(t)]=i)}return e}function a(){const t={};let e,n=arguments.length;for(;n--;)for(e of Object.keys(arguments[n]))switch(e){case"class":case"directives":arguments[n][e]&&(t[e]=c(t[e],arguments[n][e]));break;case"style":arguments[n][e]&&(t[e]=l(t[e],arguments[n][e]));break;case"staticClass":if(!arguments[n][e])break;void 0===t[e]&&(t[e]=""),t[e]&&(t[e]+=" "),t[e]+=arguments[n][e].trim();break;case"on":case"nativeOn":arguments[n][e]&&(t[e]=u(t[e],arguments[n][e]));break;case"attrs":case"props":case"domProps":case"scopedSlots":case"staticStyle":case"hook":case"transition":if(!arguments[n][e])break;t[e]||(t[e]={}),t[e]={...arguments[n][e],...t[e]};break;default:t[e]||(t[e]=arguments[n][e])}return t}function l(t,e){return t?e?(t=(0,o.TI)("string"==typeof t?r(t):t)).concat("string"==typeof e?r(e):e):t:e}function c(t,e){return e?t&&t?(0,o.TI)(t).concat(e):e:t}function u(...t){if(!t[0])return t[1];if(!t[1])return t[0];const e={};for(let n=2;n--;){const o=t[n];for(const t in o)o[t]&&(e[t]?e[t]=[].concat(o[t],e[t]):e[t]=o[t])}return e}}},e={};function n(o){if(e[o])return e[o].exports;var i=e[o]={exports:{}};return t[o](i,i.exports,n),i.exports}n.m=t,n.x=t=>{},n.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return n.d(e,{a:e}),e},n.d=(t,e)=>{for(var o in e)n.o(e,o)&&!n.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:e[o]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},(()=>{var t={800:0},e=[[1712,459,730,50,2]],o=t=>{},i=(i,s)=>{for(var r,a,[l,c,u,d]=s,h=0,p=[];h<l.length;h++)a=l[h],n.o(t,a)&&t[a]&&p.push(t[a][0]),t[a]=0;for(r in c)n.o(c,r)&&(n.m[r]=c[r]);for(u&&u(n),i&&i(s);p.length;)p.shift()();return d&&e.push.apply(e,d),o()},s=self.webpackChunk=self.webpackChunk||[];function r(){for(var o,i=0;i<e.length;i++){for(var s=e[i],r=!0,a=1;a<s.length;a++){var l=s[a];0!==t[l]&&(r=!1)}r&&(e.splice(i--,1),o=n(n.s=s[0]))}return 0===e.length&&(n.x(),n.x=t=>{}),o}s.forEach(i.bind(null,0)),s.push=i.bind(null,s.push.bind(s));var a=n.x;n.x=()=>(n.x=a||(t=>{}),(o=r)())})(),n.x()})();