import{$ as R,a as x}from"./bugs-DwjOCybL.js";import{K as E,d as e,_ as F,L as P}from"./index-nAwbjeji.js";import{w as y}from"./use-active-press-Boc8kJjl.js";import{a as C,U as L}from"./focus-management-BTIQmBQE.js";import{u as j,I as B}from"./label-CuTpfjPQ.js";let M="select";function H(a,r){let o=e.useId(),l=j(),f=C(),{id:u=l||`headlessui-select-${o}`,disabled:t=f||!1,invalid:d=!1,autoFocus:s=!1,...p}=a,m=B(),b=L(),{isFocusVisible:i,focusProps:v}=R({autoFocus:s}),{isHovered:n,hoverProps:w}=x({isDisabled:t}),{pressed:c,pressProps:h}=y({disabled:t}),g=F({ref:r,id:u,"aria-labelledby":m,"aria-describedby":b,"aria-invalid":d?"":void 0,disabled:t||void 0,autoFocus:s},v,w,h),$=e.useMemo(()=>({disabled:t,invalid:d,hover:n,focus:i,active:c,autofocus:s}),[t,d,n,i,c,s]);return P()({ourProps:g,theirProps:p,slot:$,defaultTag:M,name:"Select"})}let U=E(H);function I({title:a,titleId:r,...o},l){return e.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon",ref:l,"aria-labelledby":r},o),a?e.createElement("title",{id:r},a):null,e.createElement("path",{fillRule:"evenodd",d:"M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z",clipRule:"evenodd"}))}const V=e.forwardRef(I);function O({title:a,titleId:r,...o},l){return e.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon",ref:l,"aria-labelledby":r},o),a?e.createElement("title",{id:r},a):null,e.createElement("path",{fillRule:"evenodd",d:"M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z",clipRule:"evenodd"}))}const _=e.forwardRef(O);export{V as F,_ as a,U as j};
