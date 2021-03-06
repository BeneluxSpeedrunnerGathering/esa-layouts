(()=>{var t={8879:function(t){t.exports=function(){"use strict";var t="millisecond",e="second",n="minute",i="hour",r="day",s="week",o="month",a="quarter",u="year",c="date",l=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,d=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,f={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},h=function(t,e,n){var i=String(t);return!i||i.length>=e?t:""+Array(e+1-i.length).join(n)+t},p={s:h,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),i=Math.floor(n/60),r=n%60;return(e<=0?"+":"-")+h(i,2,"0")+":"+h(r,2,"0")},m:function t(e,n){if(e.date()<n.date())return-t(n,e);var i=12*(n.year()-e.year())+(n.month()-e.month()),r=e.clone().add(i,o),s=n-r<0,a=e.clone().add(i+(s?-1:1),o);return+(-(i+(n-r)/(s?r-a:a-r))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(l){return{M:o,y:u,w:s,d:r,D:c,h:i,m:n,s:e,ms:t,Q:a}[l]||String(l||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},m="en",v={};v[m]=f;var y=function(t){return t instanceof w},g=function(t,e,n){var i;if(!t)return m;if("string"==typeof t)v[t]&&(i=t),e&&(v[t]=e,i=t);else{var r=t.name;v[r]=t,i=r}return!n&&i&&(m=i),i||!n&&m},x=function(t,e){if(y(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new w(n)},$=p;$.l=g,$.i=y,$.w=function(t,e){return x(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var w=function(){function f(t){this.$L=g(t.locale,null,!0),this.parse(t)}var h=f.prototype;return h.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if($.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var i=e.match(l);if(i){var r=i[2]-1||0,s=(i[7]||"0").substring(0,3);return n?new Date(Date.UTC(i[1],r,i[3]||1,i[4]||0,i[5]||0,i[6]||0,s)):new Date(i[1],r,i[3]||1,i[4]||0,i[5]||0,i[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init()},h.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},h.$utils=function(){return $},h.isValid=function(){return!("Invalid Date"===this.$d.toString())},h.isSame=function(t,e){var n=x(t);return this.startOf(e)<=n&&n<=this.endOf(e)},h.isAfter=function(t,e){return x(t)<this.startOf(e)},h.isBefore=function(t,e){return this.endOf(e)<x(t)},h.$g=function(t,e,n){return $.u(t)?this[e]:this.set(n,t)},h.unix=function(){return Math.floor(this.valueOf()/1e3)},h.valueOf=function(){return this.$d.getTime()},h.startOf=function(t,a){var l=this,d=!!$.u(a)||a,f=$.p(t),h=function(t,e){var n=$.w(l.$u?Date.UTC(l.$y,e,t):new Date(l.$y,e,t),l);return d?n:n.endOf(r)},p=function(t,e){return $.w(l.toDate()[t].apply(l.toDate("s"),(d?[0,0,0,0]:[23,59,59,999]).slice(e)),l)},m=this.$W,v=this.$M,y=this.$D,g="set"+(this.$u?"UTC":"");switch(f){case u:return d?h(1,0):h(31,11);case o:return d?h(1,v):h(0,v+1);case s:var x=this.$locale().weekStart||0,w=(m<x?m+7:m)-x;return h(d?y-w:y+(6-w),v);case r:case c:return p(g+"Hours",0);case i:return p(g+"Minutes",1);case n:return p(g+"Seconds",2);case e:return p(g+"Milliseconds",3);default:return this.clone()}},h.endOf=function(t){return this.startOf(t,!1)},h.$set=function(s,a){var l,d=$.p(s),f="set"+(this.$u?"UTC":""),h=(l={},l[r]=f+"Date",l[c]=f+"Date",l[o]=f+"Month",l[u]=f+"FullYear",l[i]=f+"Hours",l[n]=f+"Minutes",l[e]=f+"Seconds",l[t]=f+"Milliseconds",l)[d],p=d===r?this.$D+(a-this.$W):a;if(d===o||d===u){var m=this.clone().set(c,1);m.$d[h](p),m.init(),this.$d=m.set(c,Math.min(this.$D,m.daysInMonth())).$d}else h&&this.$d[h](p);return this.init(),this},h.set=function(t,e){return this.clone().$set(t,e)},h.get=function(t){return this[$.p(t)]()},h.add=function(t,a){var c,l=this;t=Number(t);var d=$.p(a),f=function(e){var n=x(l);return $.w(n.date(n.date()+Math.round(e*t)),l)};if(d===o)return this.set(o,this.$M+t);if(d===u)return this.set(u,this.$y+t);if(d===r)return f(1);if(d===s)return f(7);var h=(c={},c[n]=6e4,c[i]=36e5,c[e]=1e3,c)[d]||1,p=this.$d.getTime()+t*h;return $.w(p,this)},h.subtract=function(t,e){return this.add(-1*t,e)},h.format=function(t){var e=this;if(!this.isValid())return"Invalid Date";var n=t||"YYYY-MM-DDTHH:mm:ssZ",i=$.z(this),r=this.$locale(),s=this.$H,o=this.$m,a=this.$M,u=r.weekdays,c=r.months,l=function(t,i,r,s){return t&&(t[i]||t(e,n))||r[i].substr(0,s)},f=function(t){return $.s(s%12||12,t,"0")},h=r.meridiem||function(t,e,n){var i=t<12?"AM":"PM";return n?i.toLowerCase():i},p={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:$.s(a+1,2,"0"),MMM:l(r.monthsShort,a,c,3),MMMM:l(c,a),D:this.$D,DD:$.s(this.$D,2,"0"),d:String(this.$W),dd:l(r.weekdaysMin,this.$W,u,2),ddd:l(r.weekdaysShort,this.$W,u,3),dddd:u[this.$W],H:String(s),HH:$.s(s,2,"0"),h:f(1),hh:f(2),a:h(s,o,!0),A:h(s,o,!1),m:String(o),mm:$.s(o,2,"0"),s:String(this.$s),ss:$.s(this.$s,2,"0"),SSS:$.s(this.$ms,3,"0"),Z:i};return n.replace(d,(function(t,e){return e||p[t]||i.replace(":","")}))},h.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},h.diff=function(t,c,l){var d,f=$.p(c),h=x(t),p=6e4*(h.utcOffset()-this.utcOffset()),m=this-h,v=$.m(this,h);return v=(d={},d[u]=v/12,d[o]=v,d[a]=v/3,d[s]=(m-p)/6048e5,d[r]=(m-p)/864e5,d[i]=m/36e5,d[n]=m/6e4,d[e]=m/1e3,d)[f]||m,l?v:$.a(v)},h.daysInMonth=function(){return this.endOf(o).$D},h.$locale=function(){return v[this.$L]},h.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),i=g(t,e,!0);return i&&(n.$L=i),n},h.clone=function(){return $.w(this.$d,this)},h.toDate=function(){return new Date(this.valueOf())},h.toJSON=function(){return this.isValid()?this.toISOString():null},h.toISOString=function(){return this.$d.toISOString()},h.toString=function(){return this.$d.toUTCString()},f}(),_=w.prototype;return x.prototype=_,[["$ms",t],["$s",e],["$m",n],["$H",i],["$W",r],["$M",o],["$y",u],["$D",c]].forEach((function(t){_[t[1]]=function(e){return this.$g(e,t[0],t[1])}})),x.extend=function(t,e){return t.$i||(t(e,w,x),t.$i=!0),x},x.locale=g,x.isDayjs=y,x.unix=function(t){return x(1e3*t)},x.en=v[m],x.Ls=v,x.p={},x}()},7491:function(t){t.exports=function(){"use strict";return function(t,e,n){t=t||{};var i=e.prototype,r={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};function s(t,e,n,r){return i.fromToBase(t,e,n,r)}n.en.relativeTime=r,i.fromToBase=function(e,i,s,o,a){for(var u,c,l,d=s.$locale().relativeTime||r,f=t.thresholds||[{l:"s",r:44,d:"second"},{l:"m",r:89},{l:"mm",r:44,d:"minute"},{l:"h",r:89},{l:"hh",r:21,d:"hour"},{l:"d",r:35},{l:"dd",r:25,d:"day"},{l:"M",r:45},{l:"MM",r:10,d:"month"},{l:"y",r:17},{l:"yy",d:"year"}],h=f.length,p=0;p<h;p+=1){var m=f[p];m.d&&(u=o?n(e).diff(s,m.d,!0):s.diff(e,m.d,!0));var v=(t.rounding||Math.round)(Math.abs(u));if(l=u>0,v<=m.r||!m.r){v<=1&&p>0&&(m=f[p-1]);var y=d[m.l];a&&(v=a(""+v)),c="string"==typeof y?y.replace("%d",v):y(v,i,m.l,l);break}}if(i)return c;var g=l?d.future:d.past;return"function"==typeof g?g(c):g.replace("%s",c)},i.to=function(t,e){return s(t,e,this,!0)},i.from=function(t,e){return s(t,e,this)};var o=function(t){return t.$u?n.utc():n()};i.toNow=function(t){return this.to(o(this),t)},i.fromNow=function(t){return this.from(o(this),t)}}}()},3193:function(t){t.exports=function(){"use strict";return function(t,e,n){n.updateLocale=function(t,e){var i=n.Ls[t];if(i)return(e?Object.keys(e):[]).forEach((function(t){i[t]=e[t]})),i}}}()},8172:function(t){t.exports=function(){"use strict";return function(t,e,n){var i=e.prototype;n.utc=function(t){return new e({date:t,utc:!0,args:arguments})},i.utc=function(t){var e=n(this.toDate(),{locale:this.$L,utc:!0});return t?e.add(this.utcOffset(),"minute"):e},i.local=function(){return n(this.toDate(),{locale:this.$L,utc:!1})};var r=i.parse;i.parse=function(t){t.utc&&(this.$u=!0),this.$utils().u(t.$offset)||(this.$offset=t.$offset),r.call(this,t)};var s=i.init;i.init=function(){if(this.$u){var t=this.$d;this.$y=t.getUTCFullYear(),this.$M=t.getUTCMonth(),this.$D=t.getUTCDate(),this.$W=t.getUTCDay(),this.$H=t.getUTCHours(),this.$m=t.getUTCMinutes(),this.$s=t.getUTCSeconds(),this.$ms=t.getUTCMilliseconds()}else s.call(this)};var o=i.utcOffset;i.utcOffset=function(t,e){var n=this.$utils().u;if(n(t))return this.$u?0:n(this.$offset)?o.call(this):this.$offset;var i=Math.abs(t)<=16?60*t:t,r=this;if(e)return r.$offset=i,r.$u=0===t,r;if(0!==t){var s=this.$u?this.toDate().getTimezoneOffset():-1*this.utcOffset();(r=this.local().add(i+s,"minute")).$offset=i,r.$x.$localOffset=s}else r=this.utc();return r};var a=i.format;i.format=function(t){var e=t||(this.$u?"YYYY-MM-DDTHH:mm:ss[Z]":"");return a.call(this,e)},i.valueOf=function(){var t=this.$utils().u(this.$offset)?0:this.$offset+(this.$x.$localOffset||(new Date).getTimezoneOffset());return this.$d.valueOf()-6e4*t},i.isUTC=function(){return!!this.$u},i.toISOString=function(){return this.toDate().toISOString()},i.toString=function(){return this.toDate().toUTCString()};var u=i.toDate;i.toDate=function(t){return"s"===t&&this.$offset?n(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate():u.call(this)};var c=i.diff;i.diff=function(t,e,i){if(t&&this.$u===t.$u)return c.call(this,t,e,i);var r=this.local(),s=n(t).local();return c.call(r,s,e,i)}}}()},1829:(t,e,n)=>{"use strict";function i(t){return t.toString().padStart(2,"0")}function r(t){return`$${t.toFixed(2)}`}n.d(e,{Pl:()=>i,ZP:()=>r}),nodecg.bundleConfig},358:(t,e,n)=>{"use strict";var i=n(1594),r=n.n(i),s=n(5803),o=(n(6479),n(2659)),a=n(708),u=n(6331),c=n(1829),l=function(t,e,n,i){var r,s=arguments.length,o=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,n,i);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(s<3?r(o):s>3?r(e,n,o):r(e,n))||o);return s>3&&o&&Object.defineProperty(e,n,o),o};let d=class extends o.w3{formatSeconds(t){const e=Math.floor(t/60),n=Math.floor(t-60*e);return`${e}:${(0,c.Pl)(n)}`}get commercialTimeRemaining(){return this.formatSeconds(this.twitchCommercialTimer.secondsRemaining)}};l([a.ZM],d.prototype,"twitchCommercialTimer",void 0),d=l([o.wA],d);const f=d;var h=n(5440);const p=(0,h.Z)(f,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.twitchCommercialTimer.secondsRemaining>0?n("div",{staticClass:"CommercialTimer Fixed Flex",style:{"font-size":"20px"}},[t._v("\n  Twitch Commercials Running: "+t._s(t.commercialTimeRemaining)+"\n")]):t._e()}),[],!1,null,null,null).exports;var m=n(8879),v=n.n(m),y=n(7491),g=n.n(y),x=n(8172),$=n.n(x);let w=class extends o.w3{};w=function(t,e,n,i){var r,s=arguments.length,o=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,n,i);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(s<3?r(o):s>3?r(e,n,o):r(e,n))||o);return s>3&&o&&Object.defineProperty(e,n,o),o}([o.wA],w);const _=w,b=(0,h.Z)(_,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"FlexColumn",style:{"font-size":"41px","text-align":"center"}},[n("div",{staticClass:"Header Flex",style:{width:"100%",height:"60px","font-weight":500,"text-transform":"uppercase"}},[t._t("header")],2),t._v(" "),n("div",{staticClass:"Content FlexColumn",style:{width:"100%",flex:1}},[t._t("content")],2)])}),[],!1,null,null,null).exports;var D=function(t,e,n,i){var r,s=arguments.length,o=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,n,i);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(s<3?r(o):s>3?r(e,n,o):r(e,n))||o);return s>3&&o&&Object.defineProperty(e,n,o),o};v().extend(g()),v().extend($());let M=class extends o.w3{constructor(){super(...arguments),this.getRunTotalPlayers=r().getRunTotalPlayers,this.formPlayerNamesStr=r().formPlayerNamesStr}get etaUntil(){if(0===this.slotNo)return"Coming Up Next";const t=this.nextRuns.slice(0,this.slotNo).reduce(((t,e)=>t+(e.estimateS||0)+(e.setupTimeS||0)),0);return`Coming Up In About ${v()().to(v().unix(Date.now()/1e3+t),!0)}`}};D([a.ZM],M.prototype,"nextRuns",void 0),D([(0,o.fI)({default:void 0})],M.prototype,"runData",void 0),D([(0,o.fI)({default:0})],M.prototype,"slotNo",void 0),M=D([(0,o.wA)({components:{Container:b}})],M);const S=M,R=(0,h.Z)(S,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.runData?n("container",{style:{width:"100%",height:"199px"},scopedSlots:t._u([{key:"header",fn:function(){return[t._v("\n    "+t._s(t.etaUntil)+"\n  ")]},proxy:!0},{key:"content",fn:function(){return[n("div",[t._v("\n      "+t._s(t.runData.game)+"\n    ")]),t._v(" "),n("div",{staticClass:"RunInfoExtra",style:{"font-size":"30px"}},[t.runData.category?n("span",[t._v("\n        "+t._s(t.runData.category)+"\n      ")]):t._e(),t._v(" "),t.runData.system?n("span",[t._v("\n        "+t._s(t.runData.system)+"\n      ")]):t._e(),t._v(" "),t.getRunTotalPlayers(t.runData)>0?n("span",[t._v("\n        "+t._s(t.formPlayerNamesStr(t.runData))+"\n      ")]):t._e(),t._v(" "),t.runData.estimate?n("span",[t._v("\n        "+t._s(t.runData.estimate)+"\n      ")]):t._e()])]},proxy:!0}],null,!1,3668242044)}):t._e()}),[],!1,null,"26648a8d",null).exports;var O=function(t,e,n,i){var r,s=arguments.length,o=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,n,i);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(s<3?r(o):s>3?r(e,n,o):r(e,n))||o);return s>3&&o&&Object.defineProperty(e,n,o),o};let C=class extends o.w3{mounted(){window.setTimeout((()=>this.$emit("end")),2e4)}};O([a.ZM],C.prototype,"nextRuns",void 0),C=O([(0,o.wA)({components:{UpcomingRun:R,Container:b}})],C);const T=C,P=(0,h.Z)(T,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return t.nextRuns.slice(1).length?i("div",{staticClass:"Flex",style:{"flex-direction":"column","justify-content":"space-around"}},t._l(t.nextRuns.slice(1),(function(t,e){return i("upcoming-run",{key:t.id,attrs:{"run-data":t,"slot-no":e+1}})})),1):i("container",{scopedSlots:t._u([{key:"header",fn:function(){return[t._v("\n    ...And that's the end!\n  ")]},proxy:!0},{key:"content",fn:function(){return[i("span",{style:{"font-size":"120px"}},[t._v("\n      No More Runs\n      "),i("img",{style:{height:"1em"},attrs:{src:n(7707)}})])]},proxy:!0}])})}),[],!1,null,null,null).exports;var j=function(t,e,n,i){var r,s=arguments.length,o=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,n,i);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(s<3?r(o):s>3?r(e,n,o):r(e,n))||o);return s>3&&o&&Object.defineProperty(e,n,o),o};let Z=class extends o.w3{constructor(){super(...arguments),this.formatUSD=c.ZP}get runTitle(){return this.bid?[this.bid.game||"?",this.bid.category].filter(Boolean).join(" - "):"?"}mounted(){this.bid?window.setTimeout((()=>this.$emit("end")),2e4):this.$emit("end")}};j([(0,a.ZM)("currentBid")],Z.prototype,"bid",void 0),Z=j([(0,o.wA)({components:{Container:b}})],Z);const z=Z,k=(0,h.Z)(z,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.bid?n("container",{scopedSlots:t._u([{key:"header",fn:function(){return[t.bid.war?[t._v("\n      Upcoming Bid War\n    ")]:[t._v("\n      Upcoming Goal\n    ")]]},proxy:!0},{key:"content",fn:function(){return[t.runTitle?n("div",{style:{"font-size":"45px"}},[t._v("\n      "+t._s(t.runTitle)+"\n    ")]):t._e(),t._v(" "),n("div",{style:{"font-size":"32px"}},[t._v("\n      "+t._s(t.bid.name)+"\n    ")]),t._v(" "),n("div",{style:{"font-size":"40px"}},[t.bid.war?[t.bid.options.length?n("div",[t._l(t.bid.options.slice(0,5),(function(e){return n("div",{key:""+e.name+e.total},[t._v("\n            "+t._s(e.name)+" ("+t._s(t.formatUSD(e.total))+")\n          ")])})),t._v(" "),t.bid.allowUserOptions?n("div",[t._v("\n            ...or you could submit your own idea!\n          ")]):t._e()],2):t.bid.allowUserOptions?n("div",[t._v("\n          No options submitted yet, be the first!\n        ")]):t._e()]:[t._v("\n        "+t._s(t.formatUSD(t.bid.total))+"/"+t._s(t.formatUSD(t.bid.goal))+"\n      ")]],2)]},proxy:!0}],null,!1,2314867735)}):t._e()}),[],!1,null,"618b8420",null).exports;var U=n(3193),N=n.n(U),A=function(t,e,n,i){var r,s=arguments.length,o=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,n,i);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(s<3?r(o):s>3?r(e,n,o):r(e,n))||o);return s>3&&o&&Object.defineProperty(e,n,o),o};v().extend(g()),v().extend($()),v().extend(N()),v().updateLocale("en",{relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"}});let I=class extends o.w3{constructor(){super(...arguments),this.formatUSD=c.ZP}get etaUntil(){var t;return(null===(t=this.prize)||void 0===t?void 0:t.endTime)?v().unix(this.prize.endTime/1e3).fromNow(!0):void 0}mounted(){this.prize?window.setTimeout((()=>this.$emit("end")),2e4):this.$emit("end")}};A([(0,a.ZM)("currentPrize")],I.prototype,"prize",void 0),I=A([(0,o.wA)({components:{Container:b}})],I);const F=I,Y=(0,h.Z)(F,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.prize?n("container",{scopedSlots:t._u([{key:"header",fn:function(){return[t._v("\n    Prize Available\n  ")]},proxy:!0},{key:"content",fn:function(){return[t.prize.image?n("img",{style:{height:"400px","object-fit":"contain"},attrs:{src:t.prize.image}}):t._e(),t._v(" "),n("div",{style:{"font-size":"40px"}},[t._v("\n      "+t._s(t.prize.name)+"\n      "),t.prize.provided?[t._v("\n        provided by "+t._s(t.prize.provided)+"\n      ")]:t._e()],2),t._v(" "),n("div",{style:{"font-size":"30px"}},[t._v("\n      Minimum donation amount: "+t._s(t.formatUSD(t.prize.minimumBid))+"\n    ")]),t._v(" "),t.etaUntil?n("div",{style:{"font-size":"30px"}},[t._v("\n      Donate in the next "+t._s(t.etaUntil)+"\n    ")]):t._e()]},proxy:!0}],null,!1,2856962802)}):t._e()}),[],!1,null,null,null).exports;var B=function(t,e,n,i){var r,s=arguments.length,o=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,n,i);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(s<3?r(o):s>3?r(e,n,o):r(e,n))||o);return s>3&&o&&Object.defineProperty(e,n,o),o};let E=class extends o.w3{mounted(){if(this.media)if([".mp4",".webm"].includes(this.media.ext.toLowerCase())){const t=this.$refs.Video;t.load(),t.play(),t.addEventListener("ended",(()=>this.$emit("end")),{once:!0})}else window.setTimeout((()=>this.$emit("end")),2e4);else this.$emit("end")}};B([(0,a.ZM)("currentMedia")],E.prototype,"media",void 0),E=B([o.wA],E);const H=E,L=(0,h.Z)(H,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.media?n("div",{staticClass:"Flex"},[[".mp4",".webm"].includes(t.media.ext.toLowerCase())?[n("video",{ref:"Video",style:{width:"100%",height:"100%"},attrs:{muted:""},domProps:{muted:!0}},[n("source",{attrs:{src:t.media.url,type:"video/"+t.media.ext.toLowerCase().replace(".","")}})])]:[n("img",{style:{width:"100%",height:"100%","object-fit":"contain"},attrs:{src:t.media.url}})]],2):t._e()}),[],!1,null,null,null).exports;var W=n(8138),V=n.n(W),J=n(8586);const G=new(r())(nodecg);s.Z.use(J.ZP);const q={upcomingRunID:nodecg.Replicant("upcomingRunID"),musicData:nodecg.Replicant("musicData"),donationReader:nodecg.Replicant("donationReader"),mediaBoxImages:nodecg.Replicant("assets:media-box-images"),mediaBox:nodecg.Replicant("mediaBox"),bids:nodecg.Replicant("bids"),prizes:nodecg.Replicant("prizes"),intermissionSlides:nodecg.Replicant("assets:intermission-slides"),runDataArray:G.runDataArray,twitchCommercialTimer:G.twitchCommercialTimer},Q=new J.ZP.Store({state:{nextRuns:[],upcomingRunID:null,bids:[],prizes:[],intermissionSlides:[]},mutations:{setState(t,{name:e,val:n}){s.Z.set(t,e,n)},setCurrentBid(t,e){s.Z.set(t,"currentBid",e)},setCurrentPrize(t,e){s.Z.set(t,"currentPrize",e)},setCurrentMedia(t,e){s.Z.set(t,"currentMedia",e)},setNextRuns(t,e){s.Z.set(t,"nextRuns",e)}}});function K(t){var e;return(null===(e=Q.state.currentBid)||void 0===e?void 0:e.id)===t.id?0:Math.pow(Math.max(Math.min(6e5/((t.endTime||0)-Date.now()),1),0),2)}Object.keys(q).forEach((t=>{q[t].on("change",(e=>{Q.commit("setState",{name:t,val:V()(e)})}))}));let X=0;let tt=class extends o.w3{constructor(){super(...arguments),this.currentSlide=0,this.next=0}showNextSlide(){this.next=this.next<3?this.next+1:0,0!==this.next?1===this.next&&function(){const t=Q.state.bids.map((t=>({bid:t,weight:K(t)}))),e=t.reduce(((t,e)=>t+e.weight),0);let n=Math.random();const i=t.find((t=>{const i=t.weight/e;return i>=n||(n-=i,!1)}));return Q.commit("setCurrentBid",(null==i?void 0:i.bid)||void 0),!!(null==i?void 0:i.bid)}()?this.currentSlide=1:2===this.next&&function(){const t=Q.state.prizes.filter((t=>!!t.startTime&&!!t.endTime&&Date.now()>t.startTime&&Date.now()<t.endTime));let e;if(1===t.length)[e]=t;else if(t.length>1){const n=t.filter((t=>{var e;return t.id!==(null===(e=Q.state.currentPrize)||void 0===e?void 0:e.id)}));e=n[Math.floor(Math.random()*n.length)]}return Q.commit("setCurrentPrize",e),!!e}()?this.currentSlide=2:3!==this.next||!Q.state.intermissionSlides.length||(Q.commit("setCurrentMedia",Q.state.intermissionSlides[X]),X>=Q.state.intermissionSlides.length-1?X=0:X+=1,0)?this.showNextSlide():this.currentSlide=3:this.currentSlide=0}};tt=function(t,e,n,i){var r,s=arguments.length,o=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,n,i);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(s<3?r(o):s>3?r(e,n,o):r(e,n))||o);return s>3&&o&&Object.defineProperty(e,n,o),o}([(0,o.wA)({components:{UpcomingRuns:P,Bid:k,Prize:Y,Media:L}})],tt);const et=tt,nt=(0,h.Z)(et,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"Fixed"},[n("div",{style:{position:"relative",width:"100%",height:"100%"}},[n("transition",{attrs:{name:"fade"}},[0===t.currentSlide?n("upcoming-runs",{key:0,staticClass:"Slide",on:{end:function(e){return t.showNextSlide()}}}):1===t.currentSlide?n("bid",{key:1,staticClass:"Slide",on:{end:function(e){return t.showNextSlide()}}}):2===t.currentSlide?n("prize",{key:2,staticClass:"Slide",on:{end:function(e){return t.showNextSlide()}}}):3===t.currentSlide?n("media",{key:3,staticClass:"Slide",on:{end:function(e){return t.showNextSlide()}}}):t._e()],1)],1)])}),[],!1,null,"1bf768b0",null).exports;var it=function(t,e,n,i){var r,s=arguments.length,o=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,n,i);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(s<3?r(o):s>3?r(e,n,o):r(e,n))||o);return s>3&&o&&Object.defineProperty(e,n,o),o};let rt=class extends o.w3{get name(){if(this.donationReader)return this.donationReader.replace(/\((.*?)\)/g,"").trim()}get pronouns(){var t;if(this.donationReader)return null===(t=(this.donationReader.match(/\((.*?)\)/g)||[])[0])||void 0===t?void 0:t.replace(/[()]/g,"")}};it([a.ZM],rt.prototype,"donationReader",void 0),rt=it([o.wA],rt);const st=rt,ot=(0,h.Z)(st,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return t.donationReader?i("div",{staticClass:"Flex DonationReader",style:{height:"100%"}},[i("div",{staticClass:"Flex Mic",style:{"box-sizing":"border-box",height:"100%",padding:"5px"}},[i("img",{style:{height:"100%"},attrs:{src:n(6178)}})]),t._v(" "),i("div",{style:{display:"flex",padding:"0 15px"}},[t._v("\n    "+t._s(t.name)+"\n    "),t.pronouns?i("div",{staticClass:"Pronouns",style:{padding:"3px 5px","margin-left":"10px"}},[t._v("\n      "+t._s(t.pronouns)+"\n    ")]):t._e()])]):t._e()}),[],!1,null,null,null).exports;var at=function(t,e,n,i){var r,s=arguments.length,o=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,n,i);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(s<3?r(o):s>3?r(e,n,o):r(e,n))||o);return s>3&&o&&Object.defineProperty(e,n,o),o};let ut=class extends o.w3{get trackInformation(){var t,e;const n=[null===(t=this.musicData.track)||void 0===t?void 0:t.title,null===(e=this.musicData.track)||void 0===e?void 0:e.artist].filter(Boolean);return n.length?n.join(" - "):void 0}};at([a.ZM],ut.prototype,"musicData",void 0),ut=at([o.wA],ut);const ct=ut,lt=(0,h.Z)(ct,(function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"Flex MusicTrack",style:{height:"100%"}},[i("div",{staticClass:"Flex MCat",style:{"box-sizing":"border-box",height:"100%",padding:"5px"}},[i("img",{style:{height:"85%",padding:"0 5px"},attrs:{src:n(6146)}})]),t._v(" "),t.trackInformation?i("div",{style:{padding:"0 15px"}},[t._v("\n    "+t._s(t.trackInformation)+"\n  ")]):t._e()])}),[],!1,null,null,null).exports;var dt=function(t,e,n,i){var r,s=arguments.length,o=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,n,i);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(o=(s<3?r(o):s>3?r(e,n,o):r(e,n))||o);return s>3&&o&&Object.defineProperty(e,n,o),o};let ft=class extends o.w3{constructor(){super(...arguments),this.clipPath="unset"}mounted(){}};dt([a.ZM],ft.prototype,"nextRuns",void 0),ft=dt([(0,o.wA)({components:{MediaBox:u.Z,CommercialTimer:p,UpcomingRun:R,Rotation:nt,DonationReader:ot,MusicTrack:lt}})],ft);const ht=ft,pt=(0,h.Z)(ht,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"Intermission"}},[n("div",{style:{"clip-path":t.clipPath},attrs:{id:"Background"}}),t._v(" "),n("div",{attrs:{id:"Layout"}},[n("div",{staticClass:"Logo Fixed",style:{left:"53px",top:"43px",width:"609px",height:"276px"}},[n("img",{style:{width:"100%",height:"100%","object-fit":"contain"}})]),t._v(" "),n("commercial-timer",{style:{left:"30px",top:"370px",width:"655px",height:"35px"}}),t._v(" "),n("media-box",{style:{left:"26px",top:"450px",width:"662px",height:"520px"},attrs:{vertical:"","font-size":50}}),t._v(" "),n("upcoming-run",{staticClass:"Fixed",style:{left:"718px",top:"31px",width:"1172px",height:"199px"},attrs:{"run-data":t.nextRuns[0]}}),t._v(" "),n("rotation",{style:{left:"718px",top:"240px",width:"1172px",height:"660px"}}),t._v(" "),n("div",{staticClass:"BottomBox Fixed Flex",style:{left:"718px",top:"910px",width:"1172px",height:"60px","justify-content":"flex-start","font-size":"30px"}},[n("donation-reader"),t._v(" "),n("music-track")],1)],1)])}),[],!1,null,null,null).exports,mt=new(r())(nodecg);var vt,yt,gt,xt;(vt=void 0,yt=void 0,gt=void 0,xt=function*(){return yield NodeCG.waitForReplicants(...Object.keys(q).map((t=>q[t]))),Q},new(gt||(gt=Promise))((function(t,e){function n(t){try{r(xt.next(t))}catch(t){e(t)}}function i(t){try{r(xt.throw(t))}catch(t){e(t)}}function r(e){var r;e.done?t(e.value):(r=e.value,r instanceof gt?r:new gt((function(t){t(r)}))).then(n,i)}r((xt=xt.apply(vt,yt||[])).next())}))).then((t=>{t.watch((()=>t.state.upcomingRunID),(e=>{t.commit("setNextRuns",function(t){const e=mt.findRunIndex(t);return e>=0?mt.getRunDataArray().slice(e,e+4):[]}(e))}),{immediate:!0}),new s.Z({store:t,el:"#App",render:t=>t(pt)})}))},2659:(t,e,n)=>{"use strict";n.d(e,{wA:()=>r.ZP,w3:()=>i.Z,fI:()=>s.f});var i=n(5803),r=n(5925),s=(n(4807),n(7023),n(5654),n(6070));n(8793)},5243:(t,e,n)=>{"use strict";n.d(e,{ZM:()=>s});var i=n(5925),r=n(8586),s=o("computed",r.rn);function o(t,e){function n(n,r){return(0,i.yh)((function(i,s){i[t]||(i[t]={});var o,a=((o={})[s]=n,o);i[t][s]=void 0!==r?e(r,a)[s]:e(a)[s]}))}return function(t,e){if("string"==typeof e){var i=e,r=t;return n(i,void 0)(r,i)}return n(t,function(t){var e=t&&t.namespace;if("string"==typeof e)return"/"!==e[e.length-1]?e+"/":e}(e))}}o("computed",r.Se),o("methods",r.nv),o("methods",r.OI)},708:(t,e,n)=>{"use strict";n.d(e,{ZM:()=>i.ZM});var i=n(5243)},6178:(t,e,n)=>{"use strict";t.exports=n.p+"img/Mic-b7d53b758f04f73984d4.png"},6146:(t,e,n)=>{"use strict";t.exports=n.p+"img/Music-47bc46e8cac0fcffe121.png"},7707:(t,e,n)=>{"use strict";t.exports=n.p+"img/esaOhNo-9591ab044d41ec3de73d.png"}},e={};function n(i){if(e[i])return e[i].exports;var r=e[i]={id:i,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.exports}n.m=t,n.x=t=>{},n.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return n.d(e,{a:e}),e},n.d=(t,e)=>{for(var i in e)n.o(e,i)&&!n.o(t,i)&&Object.defineProperty(t,i,{enumerable:!0,get:e[i]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),n.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},(()=>{var t;n.g.importScripts&&(t=n.g.location+"");var e=n.g.document;if(!t&&e&&(e.currentScript&&(t=e.currentScript.src),!t)){var i=e.getElementsByTagName("script");i.length&&(t=i[i.length-1].src)}if(!t)throw new Error("Automatic publicPath is not supported in this browser");t=t.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),n.p=t+"../"})(),(()=>{var t={908:0},e=[[358,947,539,479,957]],i=t=>{},r=(r,s)=>{for(var o,a,[u,c,l,d]=s,f=0,h=[];f<u.length;f++)a=u[f],n.o(t,a)&&t[a]&&h.push(t[a][0]),t[a]=0;for(o in c)n.o(c,o)&&(n.m[o]=c[o]);for(l&&l(n),r&&r(s);h.length;)h.shift()();return d&&e.push.apply(e,d),i()},s=self.webpackChunk=self.webpackChunk||[];function o(){for(var i,r=0;r<e.length;r++){for(var s=e[r],o=!0,a=1;a<s.length;a++){var u=s[a];0!==t[u]&&(o=!1)}o&&(e.splice(r--,1),i=n(n.s=s[0]))}return 0===e.length&&(n.x(),n.x=t=>{}),i}s.forEach(r.bind(null,0)),s.push=r.bind(null,s.push.bind(s));var a=n.x;n.x=()=>(n.x=a||(t=>{}),(i=o)())})(),n.x()})();