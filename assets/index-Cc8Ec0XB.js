var v=function(){return!!(window.location.hostname==="localhost"||window.location.hostname==="[::1]"||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/))},c;typeof window<"u"&&(typeof Promise<"u"?c=new Promise(function(t){return window.addEventListener("load",t)}):c={then:function(t){return window.addEventListener("load",t)}});function s(t,n){n===void 0&&(n={});var i=n.registrationOptions;i===void 0&&(i={}),delete n.registrationOptions;var e=function(r){for(var f=[],o=arguments.length-1;o-- >0;)f[o]=arguments[o+1];n&&n[r]&&n[r].apply(n,f)};"serviceWorker"in navigator&&c.then(function(){v()?(l(t,e,i),navigator.serviceWorker.ready.then(function(r){e("ready",r)}).catch(function(r){return a(e,r)})):(u(t,e,i),navigator.serviceWorker.ready.then(function(r){e("ready",r)}).catch(function(r){return a(e,r)}))})}function a(t,n){navigator.onLine||t("offline"),t("error",n)}function u(t,n,i){navigator.serviceWorker.register(t,i).then(function(e){if(n("registered",e),e.waiting){n("updated",e);return}e.onupdatefound=function(){n("updatefound",e);var r=e.installing;r.onstatechange=function(){r.state==="installed"&&(navigator.serviceWorker.controller?n("updated",e):n("cached",e))}}}).catch(function(e){return a(n,e)})}function l(t,n,i){fetch(t).then(function(e){e.status===404?(n("error",new Error("Service worker not found at "+t)),d()):e.headers.get("content-type").indexOf("javascript")===-1?(n("error",new Error("Expected "+t+" to have javascript content-type, but received "+e.headers.get("content-type"))),d()):u(t,n,i)}).catch(function(e){return a(n,e)})}function d(){"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()}).catch(function(t){return a(emit,t)})}export{s as register,d as unregister};