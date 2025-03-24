import{d as o,R as x,K as M,o as E,y as F,q as P,L as I}from"./index-nAwbjeji.js";import{a as S}from"./focus-management-BTIQmBQE.js";let y=o.createContext(void 0);function j(){return o.useContext(y)}function O({id:t,children:n}){return x.createElement(y.Provider,{value:t},n)}let b=o.createContext(null);b.displayName="LabelContext";function L(){let t=o.useContext(b);if(t===null){let n=new Error("You used a <Label /> component, but it is not inside a relevant parent.");throw Error.captureStackTrace&&Error.captureStackTrace(n,L),n}return t}function w(t){var n,i,a;let e=(i=(n=o.useContext(b))==null?void 0:n.value)!=null?i:void 0;return((a=t==null?void 0:t.length)!=null?a:0)>0?[e,...t].filter(Boolean).join(" "):e}function R({inherit:t=!1}={}){let n=w(),[i,a]=o.useState([]),e=t?[n,...i].filter(Boolean):i;return[e.length>0?e.join(" "):void 0,o.useMemo(()=>function(l){let p=E(c=>(a(d=>[...d,c]),()=>a(d=>{let u=d.slice(),f=u.indexOf(c);return f!==-1&&u.splice(f,1),u}))),s=o.useMemo(()=>({register:p,slot:l.slot,name:l.name,props:l.props,value:l.value}),[p,l.slot,l.name,l.props,l.value]);return x.createElement(b.Provider,{value:s},l.children)},[a])]}let B="label";function H(t,n){var i;let a=o.useId(),e=L(),l=j(),p=S(),{id:s=`headlessui-label-${a}`,htmlFor:c=l??((i=e.props)==null?void 0:i.htmlFor),passive:d=!1,...u}=t,f=F(n);P(()=>e.register(s),[s,e.register]);let T=E(h=>{let v=h.currentTarget;if(v instanceof HTMLLabelElement&&h.preventDefault(),e.props&&"onClick"in e.props&&typeof e.props.onClick=="function"&&e.props.onClick(h),v instanceof HTMLLabelElement){let r=document.getElementById(v.htmlFor);if(r){let k=r.getAttribute("disabled");if(k==="true"||k==="")return;let g=r.getAttribute("aria-disabled");if(g==="true"||g==="")return;(r instanceof HTMLInputElement&&(r.type==="radio"||r.type==="checkbox")||r.role==="radio"||r.role==="checkbox"||r.role==="switch")&&r.click(),r.focus({preventScroll:!0})}}}),C=p||!1,$=o.useMemo(()=>({...e.slot,disabled:C}),[e.slot,C]),m={ref:f,...e.props,id:s,htmlFor:c,onClick:T};return d&&("onClick"in m&&(delete m.htmlFor,delete m.onClick),"onClick"in u&&delete u.onClick),I()({ourProps:m,theirProps:u,slot:$,defaultTag:c?B:"div",name:e.name||"Label"})}let K=M(H),q=Object.assign(K,{});export{w as I,R as K,q as Q,O as f,j as u};
