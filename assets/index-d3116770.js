import{r as E,b as L,S as T,e as t,j as e,h as re,C as ae,d as ie,u as Ve,c as Ce,M as ye,F as Pe,B as v,f as R,i as w,o as Re,g as te}from"./index-3e3c7de3.js";import{S as V}from"./Skeleton-0500d03d.js";import{E as Ee}from"./Edit-c909462f.js";import{B as Le}from"./BaseTextarea-e181a187.js";import{R as ke,a as oe}from"./RadioGroup-3f23a2ee.js";import{F as le}from"./FormControlLabel-635d6fb3.js";import{A as Ae}from"./Add-1f8d758a.js";import"./formControlState-a1fb9590.js";const Oe=async o=>{const l=await E(`${L}/portfolio`,{method:"POST",body:JSON.stringify(o)});return(l==null?void 0:l.code)===200?(T.success("新增成功"),!0):!1},Te=async o=>{const l=new URLSearchParams;o&&Object.entries(o).forEach(([a,n])=>{n!==void 0&&l.append(a,String(n))});const r=l.toString()?`?${l.toString()}`:"",s=await E(`${L}/portfolio/list${r}`);return(s==null?void 0:s.code)===200?s.data:!1},$e=async o=>{const l=await E(`${L}/portfolio?_id=${o._id}`,{method:"PATCH",body:JSON.stringify(o)});return(l==null?void 0:l.code)===200?(T.success("編輯成功"),!0):!1},Be=async o=>{const l=await E(`${L}/portfolio?_id=${o}`,{method:"DELETE"});return(l==null?void 0:l.code)===200?(T.success("刪除成功"),!0):!1};function _e(o,{threshold:l=0,root:r=null,rootMargin:s="0%",freezeOnceVisible:a=!1}={}){const[n,i]=t.useState(),u=n==null?void 0:n.isIntersecting,m=u&&a,f=([c])=>{i(c)};return t.useEffect(()=>{const c=o==null?void 0:o.current;if(!!!window.IntersectionObserver||m||!c)return;const h={threshold:l,root:r,rootMargin:s},j=new IntersectionObserver(f,h);return j.observe(c),()=>j.disconnect()},[o,r,s,m,l]),{entry:n,inView:u}}const Fe=({src:o,alt:l,height:r})=>{const s=t.useRef(null),[a,n]=t.useState(!0),i=()=>{n(!1)};return e.jsx(re,{children:e.jsx(ae,{nodeRef:s,classNames:"page",unmountOnExit:!0,timeout:500,children:e.jsxs("div",{ref:s,children:[e.jsx("img",{src:o,alt:l,className:`${a?"!absolute !opacity-0":""} aspect-video w-full object-cover transition`,loading:"lazy",onLoad:i}),e.jsx(V,{...r?{height:r}:{},className:`${a?"":"!absolute !hidden"} skeleton-custom`})]})},a?"loading":"data")})},ne=({data:o,isLoadingData:l,setPopup:r,setEditData:s})=>{const a=ie(u=>u.base.token),n=t.useRef(null),i=()=>{r&&s&&(r(),s())};return e.jsxs("article",{className:"relative h-full overflow-hidden rounded border border-red-50 bg-red-50 shadow transition hover:shadow-xl",children:[e.jsx(Fe,{src:o.img,alt:o.name,height:280}),e.jsx(re,{children:e.jsx(ae,{nodeRef:n,classNames:"page",unmountOnExit:!0,timeout:500,children:e.jsx(e.Fragment,{children:e.jsx("div",{ref:n,className:" p-4",children:l?e.jsxs(e.Fragment,{children:[e.jsx(V,{width:"60%"}),e.jsx(V,{width:"30%"}),e.jsx(V,{width:"30%"}),e.jsx(V,{width:"30%"})]}):e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"mb-2 flex items-center justify-between",children:[e.jsx("h2",{className:"text-xl font-bold text-red-700",children:o.name}),a&&e.jsx(Ee,{className:"cursor-pointer text-blue-500",onClick:i})]}),e.jsx("div",{className:"whitespace-pre-wrap",children:o.content}),e.jsxs("div",{className:"mt-2 flex gap-4 ",children:[o.pathDemo&&e.jsx("a",{href:o.pathDemo,className:"text-blue-500 hover:underline",title:"demo",target:"_blank",children:"Demo"}),o.pathCode&&e.jsx("a",{href:o.pathCode,className:"text-blue-500 hover:underline",title:"code",target:"_blank",children:"Code"}),o.url&&e.jsx("a",{href:o.url,className:"text-blue-500 hover:underline",title:"article",target:"_blank",children:"Article"})]})]})})})},l?"loading":"data")})]})},ze=({popup:o,setPopup:l,getPortfolioList:r,editData:s,setEditData:a})=>{const n=Ve(),{enqueueSnackbar:i}=Ce(),[u,m]=t.useState(!1),f=t.useRef(null),[c,g]=t.useState(""),[h,j]=t.useState(!1),S=[{validate:w,message:"請輸入名稱"}],[C,b]=t.useState(""),y=t.useRef(null),[N,d]=t.useState(""),[I,$]=t.useState(!1),x=[{validate:w,message:"請輸入圖片網址"}],B=t.useRef(null),[_,F]=t.useState(""),[ce,de]=t.useState(!1),ue=[{validate:w,message:"請輸入程式碼網址"}],z=t.useRef(null),[q,H]=t.useState(""),[me,fe]=t.useState(!1),he=[{validate:w,message:"請輸入Demo網址"}],[G,J]=t.useState(""),[xe,pe]=t.useState(!1),ge=[{validate:w,message:"請輸入文章網址"}],U=t.useRef(null),[M,K]=t.useState(""),[je,be]=t.useState(!1),ve=[{validate:w,message:"請輸入順序"},{validate:Re,message:"僅接受數字"}],[Q,W]=t.useState(!0);t.useEffect(()=>{g((s==null?void 0:s.name)||""),b((s==null?void 0:s.content)||""),d((s==null?void 0:s.img)||""),F((s==null?void 0:s.pathCode)||""),H((s==null?void 0:s.pathDemo)||""),J((s==null?void 0:s.url)||""),K(String((s==null?void 0:s.order)||"")),W(!!((s==null?void 0:s.recommend)??!0))},[s]);const p=async()=>{var Y,Z,D,ee,se;if(![(Y=f.current)==null?void 0:Y.validateNow(),(Z=y.current)==null?void 0:Z.validateNow(),(D=B.current)==null?void 0:D.validateNow(),(ee=z.current)==null?void 0:ee.validateNow(),(se=U.current)==null?void 0:se.validateNow()].every(Ie=>Ie))return i("請確認紅框處內容");n(te(!0));const O={name:c,content:C,img:N,pathCode:_,pathDemo:q,url:G,order:Number(M),status:1,recommend:Q},Ne=o==="add"?await Oe(O):await $e({...O,_id:s==null?void 0:s._id});n(te(!1)),Ne&&(r(),k())},we=async()=>{if(!window.confirm(`請確認是否刪除 ${s==null?void 0:s.name}`))return;m(!0),await Be(s==null?void 0:s._id)&&(r(),k()),m(!1)},[P,X]=t.useState("");t.useEffect(()=>{P||X(o)},[o,P]);const k=()=>{l(""),setTimeout(()=>{a({}),X("")},500)},Se=A=>{W(A.target.value==="true")};return e.jsx(ye,{open:o==="add"||o==="edit",closeAfterTransition:!0,children:e.jsx(Pe,{in:o==="add"||o==="edit",timeout:{enter:500,exit:500},children:e.jsxs("form",{className:"fixed left-1/2 top-1/2 flex max-h-[80%] w-[90%] max-w-[24rem] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded bg-white px-4 py-8 text-sm sm:w-96",children:[e.jsx("h1",{className:"mb-4 h-auto text-center text-2xl font-bold text-blue-800",children:`${P==="add"?"新增":"編輯"}作品項目`}),e.jsxs("div",{className:"overflow-y-auto",children:[e.jsx(v,{ref:f,id:"life-name",label:"作品名稱",value:c,setValue:g,isValid:h,setIsValid:j,rules:S,placeholder:"請輸入作品名稱",enter:p}),e.jsx(Le,{id:"life-content",label:"描述",value:C,setValue:b,isValid:!0,setIsValid:()=>({}),placeholder:"請輸入描述"}),e.jsx(v,{ref:y,id:"life-img",label:"圖片網址",value:N,setValue:d,isValid:I,setIsValid:$,rules:x,placeholder:"請輸入圖片網址",enter:p}),e.jsx(v,{ref:B,id:"life-pathCode",label:"程式碼網址",value:_,setValue:F,isValid:ce,setIsValid:de,rules:ue,placeholder:"請輸入程式碼網址",enter:p}),e.jsx(v,{ref:z,id:"life-pathDemo",label:"Demo網址",value:q,setValue:H,isValid:me,setIsValid:fe,rules:he,placeholder:"請輸入Demo網址",enter:p}),e.jsx(v,{id:"life-pathArticle",label:"文章網址",value:G,setValue:J,isValid:xe,setIsValid:pe,rules:ge,placeholder:"請輸入文章網址",enter:p}),e.jsx(v,{ref:U,id:"life-order",label:"排序",value:M,setValue:K,isValid:je,setIsValid:be,rules:ve,placeholder:"請輸入排序",enter:p,inputmode:"numeric"}),e.jsx("label",{children:"是否推薦"}),e.jsxs(ke,{className:"!flex-row",value:Q,onChange:Se,children:[e.jsx(le,{value:!0,control:e.jsx(oe,{size:"small"}),label:"是"}),e.jsx(le,{value:!1,control:e.jsx(oe,{size:"small"}),label:"否"})]})]}),e.jsxs("div",{className:"flex h-auto justify-evenly pt-2",children:[e.jsx(R,{variant:"contained",onClick:p,disabled:u,children:"送出"}),P==="edit"&&e.jsx(R,{variant:"contained",color:"error",onClick:we,disabled:u,children:"刪除"}),e.jsx(R,{color:"info",variant:"contained",onClick:k,children:"取消"})]})]})})})},We=()=>{const o=ie(d=>d.base.token),[l,r]=t.useState(!0),[s,a]=t.useState(0),[n,i]=t.useState(0),[u,m]=t.useState(0),f=10,c=t.useRef(null),{inView:g}=_e(c);t.useEffect(()=>{g&&u>n+1&&i(n+1)},[g]);const[h,j]=t.useState(Array.from({length:12},()=>({}))),S=t.useCallback(async({page:d,size:I}={})=>{d===0&&(window.scroll(0,0),i(0)),n===0&&r(!0);const x=await Te({page:d??n,size:I??f});x&&(j(n===0?x.list:[...h,...x.list]),a(x.totalCount),m(x.totalPage)),n===0&&r(!1)},[n,f]);t.useEffect(()=>{S()},[S]);const[C,b]=t.useState(""),[y,N]=t.useState({});return e.jsxs("section",{className:"p-6",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h1",{className:"text-2xl font-bold",children:"作品清單"}),o&&e.jsx("div",{className:"text-right",children:e.jsxs(R,{variant:"contained",color:"secondary",onClick:()=>b("add"),children:[e.jsx(Ae,{className:"!text-base"}),"新增"]})})]}),e.jsxs("section",{className:"grid gap-4 md:grid-cols-2 lg:grid-cols-3",children:[h.map((d,I)=>e.jsx(ne,{data:d,isLoadingData:l,setPopup:()=>b("edit"),setEditData:()=>N(d)},I)),e.jsx("div",{ref:c,className:"last-portfolio-card",children:s>h.length&&e.jsx(ne,{data:{},isLoadingData:!0})})]}),e.jsx(ze,{popup:C,setPopup:b,getPortfolioList:()=>S({page:0}),editData:y,setEditData:N})]})};export{We as default};