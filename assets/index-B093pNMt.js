import{I as d,d as a,j as s}from"./index-BLArQMGd.js";import{b as h,p as f,M as j}from"./ModalEdit-BcZSb1ed.js";import{a as u}from"./format-Btenk6eh.js";import{M as N}from"./MutiSkeleton-Czx6RlZX.js";import{S as r}from"./index-Bt9nh2ve.js";import{F as b}from"./PencilSquareIcon-B49O3vVc.js";import"./validate-DGtL22NN.js";import"./constant-RaoDFmaB.js";import"./index-CgMiA0CP.js";import"./focus-management-daiDacl4.js";import"./field-HJjlGurK.js";import"./index-dU6rSGNN.js";import"./BaseSkeleton-Camewocg.js";const F=()=>{var l;const c=d(),{data:e,isLoading:t,refetch:o}=h(c.id),n=()=>{m("edit")};a.useEffect(()=>{e!=null&&e.name&&(document.title=`${e==null?void 0:e.name} | Howie`)},[e]);const[i,m]=a.useState("");return s.jsxs("main",{className:"p-4 pb-16",children:[s.jsxs("article",{className:"min-h-[calc(100dvh-8.5rem)] rounded bg-red-50 p-4 shadow",children:[s.jsxs("div",{className:"mb-4 flex justify-between",children:[s.jsx(r,{className:"!h-6 !w-40 sm:!h-8",isLoading:t,children:s.jsxs("div",{className:"flex items-center gap-2",children:[s.jsx("h2",{className:"font-black text-red-700 sm:text-2xl",children:e==null?void 0:e.name}),s.jsx(b,{className:"size-6 cursor-pointer",onClick:n})]})}),s.jsx(r,{className:"!w-20",isLoading:t,children:s.jsx("time",{className:"flex-shrink-0 text-right text-sm sm:text-base",children:u(e==null?void 0:e.createTime,{onlyDate:!0})})})]}),s.jsx(N,{className:"mt-4",isLoading:t,children:s.jsx("div",{dangerouslySetInnerHTML:{__html:f.sanitize(e==null?void 0:e.content)}})}),s.jsx(r,{className:"mt-4 !w-80",isLoading:t,children:s.jsx("div",{className:"mt-4 flex flex-wrap gap-4",children:(l=e==null?void 0:e.sorts)==null?void 0:l.map((p,x)=>s.jsxs("span",{className:"text-blue-800",children:["#",p]},x))})})]}),s.jsx(j,{isOpen:i==="edit",close:()=>m(""),type:i,data:e,apiGetArticle:o})]})};export{F as default};
