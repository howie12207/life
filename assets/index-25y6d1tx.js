import{d as m,j as e}from"./index-BLArQMGd.js";const b=({label:r,value:s,id:n,setValue:d,children:f,disabled:a,placeholder:o,rows:u,cols:l,autoHeight:c,blurHandle:h,style:i})=>{const t=m.useRef(null);m.useEffect(()=>{(()=>{c&&t.current&&(t.current.style.height="auto",t.current.style.height=`${t.current.scrollHeight+2}px`)})()},[s,c]);const p=x=>{const g=x.target.value;d(g)};return e.jsxs("div",{className:"max-w-full",children:[r&&e.jsx("label",{htmlFor:n,className:"mb-1 inline-block text-sm text-gray-700",children:r}),e.jsx("textarea",{ref:t,className:["max-h-[50dvh] w-full rounded border px-3 py-2 transition-colors outline-none focus:border-blue-700 disabled:bg-gray-300"].join(" "),id:n,value:s,...a?{disabled:a}:{},...o?{placeholder:o}:{},...u?{rows:u}:{},...l?{cols:l}:{},...i?{style:i}:{},onInput:p,onBlur:h}),f]})};export{b as B};
