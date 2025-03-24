import{d as o,q as T,G as W,I as ce,o as oe,C as fe}from"./index-nAwbjeji.js";import{u as ae,i as A,e as de,o as le,d as N,m as Y,a as ge,r as me,s as pe,f as he,b as xe,c as Re}from"./floating-ui.react-dom-B_aAqK_L.js";function ve(e){if(e===null)return{width:0,height:0};let{width:t,height:r}=e.getBoundingClientRect();return{width:t,height:r}}function je(e,t=!1){let[r,n]=o.useReducer(()=>({}),{}),l=o.useMemo(()=>ve(e),[e,r]);return T(()=>{if(!e)return;let c=new ResizeObserver(n);return c.observe(e),()=>{c.disconnect()}},[e]),t?{width:`${l.width}px`,height:`${l.height}px`}:l}function Ce(){const e=navigator.userAgentData;return e&&Array.isArray(e.brands)?e.brands.map(t=>{let{brand:r,version:n}=t;return r+"/"+n}).join(" "):navigator.userAgent}const se={...ce},be=se.useInsertionEffect,we=be||(e=>e());function ie(e){const t=o.useRef(()=>{});return we(()=>{t.current=e}),o.useCallback(function(){for(var r=arguments.length,n=new Array(r),l=0;l<r;l++)n[l]=arguments[l];return t.current==null?void 0:t.current(...n)},[])}var j=typeof document<"u"?o.useLayoutEffect:o.useEffect;let Q=!1,ye=0;const X=()=>"floating-ui-"+Math.random().toString(36).slice(2,6)+ye++;function Ee(){const[e,t]=o.useState(()=>Q?X():void 0);return j(()=>{e==null&&t(X())},[]),o.useEffect(()=>{Q=!0},[]),e}const Fe=se.useId,Se=Fe||Ee;function Me(){const e=new Map;return{emit(t,r){var n;(n=e.get(t))==null||n.forEach(l=>l(r))},on(t,r){e.set(t,[...e.get(t)||[],r])},off(t,r){var n;e.set(t,((n=e.get(t))==null?void 0:n.filter(l=>l!==r))||[])}}}const Te=o.createContext(null),Pe=o.createContext(null),Ie=()=>{var e;return((e=o.useContext(Te))==null?void 0:e.id)||null},He=()=>o.useContext(Pe),Oe="data-floating-ui-focusable";function Ae(e){const{open:t=!1,onOpenChange:r,elements:n}=e,l=Se(),c=o.useRef({}),[f]=o.useState(()=>Me()),u=Ie()!=null,[m,a]=o.useState(n.reference),p=ie((i,s,d)=>{c.current.openEvent=i?s:void 0,f.emit("openchange",{open:i,event:s,reason:d,nested:u}),r==null||r(i,s,d)}),R=o.useMemo(()=>({setPositionReference:a}),[]),x=o.useMemo(()=>({reference:m||n.reference||null,floating:n.floating||null,domReference:n.reference}),[m,n.reference,n.floating]);return o.useMemo(()=>({dataRef:c,open:t,onOpenChange:p,elements:x,events:f,floatingId:l,refs:R}),[t,p,x,f,l,R])}function $e(e){e===void 0&&(e={});const{nodeId:t}=e,r=Ae({...e,elements:{reference:null,floating:null,...e.elements}}),n=e.rootContext||r,l=n.elements,[c,f]=o.useState(null),[u,m]=o.useState(null),p=(l==null?void 0:l.domReference)||c,R=o.useRef(null),x=He();j(()=>{p&&(R.current=p)},[p]);const i=ae({...e,elements:{...l,...u&&{reference:u}}}),s=o.useCallback(g=>{const C=A(g)?{getBoundingClientRect:()=>g.getBoundingClientRect(),contextElement:g}:g;m(C),i.refs.setReference(C)},[i.refs]),d=o.useCallback(g=>{(A(g)||g===null)&&(R.current=g,f(g)),(A(i.refs.reference.current)||i.refs.reference.current===null||g!==null&&!A(g))&&i.refs.setReference(g)},[i.refs]),h=o.useMemo(()=>({...i.refs,setReference:d,setPositionReference:s,domReference:R}),[i.refs,d,s]),v=o.useMemo(()=>({...i.elements,domReference:p}),[i.elements,p]),b=o.useMemo(()=>({...i,...n,refs:h,elements:v,nodeId:t}),[i,h,v,t,n]);return j(()=>{n.dataRef.current.floatingContext=b;const g=x==null?void 0:x.nodesRef.current.find(C=>C.id===t);g&&(g.context=b)}),o.useMemo(()=>({...i,context:b,refs:h,elements:v}),[i,h,v,b])}const Z="active",ee="selected";function U(e,t,r){const n=new Map,l=r==="item";let c=e;if(l&&e){const{[Z]:f,[ee]:u,...m}=e;c=m}return{...r==="floating"&&{tabIndex:-1,[Oe]:""},...c,...t.map(f=>{const u=f?f[r]:null;return typeof u=="function"?e?u(e):null:u}).concat(e).reduce((f,u)=>(u&&Object.entries(u).forEach(m=>{let[a,p]=m;if(!(l&&[Z,ee].includes(a)))if(a.indexOf("on")===0){if(n.has(a)||n.set(a,[]),typeof p=="function"){var R;(R=n.get(a))==null||R.push(p),f[a]=function(){for(var x,i=arguments.length,s=new Array(i),d=0;d<i;d++)s[d]=arguments[d];return(x=n.get(a))==null?void 0:x.map(h=>h(...s)).find(h=>h!==void 0)}}}else f[a]=p}),f),{})}}function De(e){e===void 0&&(e=[]);const t=e.map(u=>u==null?void 0:u.reference),r=e.map(u=>u==null?void 0:u.floating),n=e.map(u=>u==null?void 0:u.item),l=o.useCallback(u=>U(u,e,"reference"),t),c=o.useCallback(u=>U(u,e,"floating"),r),f=o.useCallback(u=>U(u,e,"item"),n);return o.useMemo(()=>({getReferenceProps:l,getFloatingProps:c,getItemProps:f}),[l,c,f])}function te(e,t){return{...e,rects:{...e.rects,floating:{...e.rects.floating,height:t}}}}const Be=e=>({name:"inner",options:e,async fn(t){const{listRef:r,overflowRef:n,onFallbackChange:l,offset:c=0,index:f=0,minItemsVisible:u=4,referenceOverflowThreshold:m=0,scrollRef:a,...p}=de(e,t),{rects:R,elements:{floating:x}}=t,i=r.current[f],s=(a==null?void 0:a.current)||x,d=x.clientTop||s.clientTop,h=x.clientTop!==0,v=s.clientTop!==0,b=x===s;if(!i)return{};const g={...t,...await le(-i.offsetTop-x.clientTop-R.reference.height/2-i.offsetHeight/2-c).fn(t)},C=await N(te(g,s.scrollHeight+d+x.clientTop),p),y=await N(g,{...p,elementContext:"reference"}),E=Y(0,C.top),I=g.y+E,$=(s.scrollHeight>s.clientHeight?w=>w:me)(Y(0,s.scrollHeight+(h&&b||v?d*2:0)-E-Y(0,C.bottom)));if(s.style.maxHeight=$+"px",s.scrollTop=E,l){const w=s.offsetHeight<i.offsetHeight*ge(u,r.current.length)-1||y.top>=-m||y.bottom>=-m;W.flushSync(()=>l(w))}return n&&(n.current=await N(te({...g,y:I},s.offsetHeight+d+x.clientTop),p)),{y:I}}});function Ne(e,t){const{open:r,elements:n}=e,{enabled:l=!0,overflowRef:c,scrollRef:f,onChange:u}=t,m=ie(u),a=o.useRef(!1),p=o.useRef(null),R=o.useRef(null);o.useEffect(()=>{if(!l)return;function i(d){if(d.ctrlKey||!s||c.current==null)return;const h=d.deltaY,v=c.current.top>=-.5,b=c.current.bottom>=-.5,g=s.scrollHeight-s.clientHeight,C=h<0?-1:1,y=h<0?"max":"min";s.scrollHeight<=s.clientHeight||(!v&&h>0||!b&&h<0?(d.preventDefault(),W.flushSync(()=>{m(E=>E+Math[y](h,g*C))})):/firefox/i.test(Ce())&&(s.scrollTop+=h))}const s=(f==null?void 0:f.current)||n.floating;if(r&&s)return s.addEventListener("wheel",i),requestAnimationFrame(()=>{p.current=s.scrollTop,c.current!=null&&(R.current={...c.current})}),()=>{p.current=null,R.current=null,s.removeEventListener("wheel",i)}},[l,r,n.floating,c,f,m]);const x=o.useMemo(()=>({onKeyDown(){a.current=!0},onWheel(){a.current=!1},onPointerMove(){a.current=!1},onScroll(){const i=(f==null?void 0:f.current)||n.floating;if(!(!c.current||!i||!a.current)){if(p.current!==null){const s=i.scrollTop-p.current;(c.current.bottom<-.5&&s<-1||c.current.top<-.5&&s>1)&&W.flushSync(()=>m(d=>d+s))}requestAnimationFrame(()=>{p.current=i.scrollTop})}}}),[n.floating,m,c,f]);return o.useMemo(()=>l?{floating:x}:{},[l,x])}let P=o.createContext({styles:void 0,setReference:()=>{},setFloating:()=>{},getReferenceProps:()=>({}),getFloatingProps:()=>({}),slot:{}});P.displayName="FloatingContext";let k=o.createContext(null);k.displayName="PlacementContext";function ke(e){return o.useMemo(()=>e?typeof e=="string"?{to:e}:e:null,[e])}function qe(){return o.useContext(P).setReference}function _e(){let{getFloatingProps:e,slot:t}=o.useContext(P);return o.useCallback((...r)=>Object.assign({},e(...r),{"data-anchor":t.anchor}),[e,t])}function Ge(e=null){e===!1&&(e=null),typeof e=="string"&&(e={to:e});let t=o.useContext(k),r=o.useMemo(()=>e,[JSON.stringify(e,(l,c)=>{var f;return(f=c==null?void 0:c.outerHTML)!=null?f:c})]);T(()=>{t==null||t(r??null)},[t,r]);let n=o.useContext(P);return o.useMemo(()=>[n.setFloating,e?n.styles:{}],[n.setFloating,e,n.styles])}let ne=4;function Ke({children:e,enabled:t=!0}){let[r,n]=o.useState(null),[l,c]=o.useState(0),f=o.useRef(null),[u,m]=o.useState(null);Ye(u);let a=t&&r!==null&&u!==null,{to:p="bottom",gap:R=0,offset:x=0,padding:i=0,inner:s}=Ue(r,u),[d,h="center"]=p.split(" ");T(()=>{a&&c(0)},[a]);let{refs:v,floatingStyles:b,context:g}=$e({open:a,placement:d==="selection"?h==="center"?"bottom":`bottom-${h}`:h==="center"?`${d}`:`${d}-${h}`,strategy:"absolute",transform:!1,middleware:[le({mainAxis:d==="selection"?0:R,crossAxis:x}),pe({padding:i}),d!=="selection"&&he({padding:i}),d==="selection"&&s?Be({...s,padding:i,overflowRef:f,offset:l,minItemsVisible:ne,referenceOverflowThreshold:i,onFallbackChange(w){var H,O;if(!w)return;let M=g.elements.floating;if(!M)return;let G=parseFloat(getComputedStyle(M).scrollPaddingBottom)||0,D=Math.min(ne,M.childElementCount),K=0,z=0;for(let F of(O=(H=g.elements.floating)==null?void 0:H.childNodes)!=null?O:[])if(F instanceof HTMLElement){let S=F.offsetTop,J=S+F.clientHeight+G,B=M.scrollTop,L=B+M.clientHeight;if(S>=B&&J<=L)D--;else{z=Math.max(0,Math.min(J,L)-Math.max(S,B)),K=F.clientHeight;break}}D>=1&&c(F=>{let S=K*D-z+G;return F>=S?F:S})}}):null,xe({padding:i,apply({availableWidth:w,availableHeight:H,elements:O}){Object.assign(O.floating.style,{overflow:"auto",maxWidth:`${w}px`,maxHeight:`min(var(--anchor-max-height, 100vh), ${H}px)`})}})].filter(Boolean),whileElementsMounted:Re}),[C=d,y=h]=g.placement.split("-");d==="selection"&&(C="selection");let E=o.useMemo(()=>({anchor:[C,y].filter(Boolean).join(" ")}),[C,y]),I=Ne(g,{overflowRef:f,onChange:c}),{getReferenceProps:q,getFloatingProps:_}=De([I]),$=oe(w=>{m(w),v.setFloating(w)});return o.createElement(k.Provider,{value:n},o.createElement(P.Provider,{value:{setFloating:$,setReference:v.setReference,styles:b,getReferenceProps:q,getFloatingProps:_,slot:E}},e))}function Ye(e){T(()=>{if(!e)return;let t=new MutationObserver(()=>{let r=window.getComputedStyle(e).maxHeight,n=parseFloat(r);if(isNaN(n))return;let l=parseInt(r);isNaN(l)||n!==l&&(e.style.maxHeight=`${Math.ceil(n)}px`)});return t.observe(e,{attributes:!0,attributeFilter:["style"]}),()=>{t.disconnect()}},[e])}function Ue(e,t){var r,n,l;let c=V((r=e==null?void 0:e.gap)!=null?r:"var(--anchor-gap, 0)",t),f=V((n=e==null?void 0:e.offset)!=null?n:"var(--anchor-offset, 0)",t),u=V((l=e==null?void 0:e.padding)!=null?l:"var(--anchor-padding, 0)",t);return{...e,gap:c,offset:f,padding:u}}function V(e,t,r=void 0){let n=fe(),l=oe((m,a)=>{if(m==null)return[r,null];if(typeof m=="number")return[m,null];if(typeof m=="string"){if(!a)return[r,null];let p=re(m,a);return[p,R=>{let x=ue(m);{let i=x.map(s=>window.getComputedStyle(a).getPropertyValue(s));n.requestAnimationFrame(function s(){n.nextFrame(s);let d=!1;for(let[v,b]of x.entries()){let g=window.getComputedStyle(a).getPropertyValue(b);if(i[v]!==g){i[v]=g,d=!0;break}}if(!d)return;let h=re(m,a);p!==h&&(R(h),p=h)})}return n.dispose}]}return[r,null]}),c=o.useMemo(()=>l(e,t)[0],[e,t]),[f=c,u]=o.useState();return T(()=>{let[m,a]=l(e,t);if(u(m),!!a)return a(u)},[e,t]),f}function ue(e){let t=/var\((.*)\)/.exec(e);if(t){let r=t[1].indexOf(",");if(r===-1)return[t[1]];let n=t[1].slice(0,r).trim(),l=t[1].slice(r+1).trim();return l?[n,...ue(l)]:[n]}return[]}function re(e,t){let r=document.createElement("div");t.appendChild(r),r.style.setProperty("margin-top","0px","important"),r.style.setProperty("margin-top",e,"important");let n=parseFloat(window.getComputedStyle(r).marginTop)||0;return t.removeChild(r),n}export{Ke as M,Ge as R,_e as b,je as d,ke as x,qe as y};
