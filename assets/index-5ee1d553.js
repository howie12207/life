import{r as E,b as A,S as J,u as ce,c as ie,d as Z,e as a,j as e,M as de,F as ue,B as S,f as b,i as z,o as fe,g as C,h as xe,C as he}from"./index-3e3c7de3.js";import{t as M,f as D,c as Y}from"./format-a048e60d.js";import{B as ee}from"./BaseDatePicker-2825338f.js";import{A as me,a as pe,E as je,b as ge}from"./ExpandMore-80d91dea.js";import{A as Se}from"./Add-1f8d758a.js";import{T as be,a as we,b as k,c as r,d as ye}from"./TableRow-8e03c18c.js";import{E as ve}from"./Edit-c909462f.js";import{T as Ve,a as Pe}from"./TablePagination-f7a7f3e9.js";import"./react-is.production.min-a192e302.js";import"./KeyboardArrowRight-19e95348.js";import"./LastPage-9aabbc17.js";import"./Select-3842c52b.js";import"./formControlState-a1fb9590.js";import"./MenuItem-e6495acc.js";const Re=async t=>{const l=await E(`${A}/salary`,{method:"POST",body:JSON.stringify(t)});return(l==null?void 0:l.code)===200?(J.success("新增成功"),!0):!1},Te=async t=>{const l=new URLSearchParams;t&&Object.entries(t).forEach(([d,c])=>{c!==void 0&&l.append(d,String(c))});const i=l.toString()?`?${l.toString()}`:"",s=await E(`${A}/salary/list${i}`);return(s==null?void 0:s.code)===200?s.data:!1},Ie=async t=>{const l=await E(`${A}/salary?_id=${t._id}`,{method:"PATCH",body:JSON.stringify(t)});return(l==null?void 0:l.code)===200?(J.success("編輯成功"),!0):!1},Ne=async t=>{const l=await E(`${A}/salary?_id=${t}`,{method:"DELETE"});return(l==null?void 0:l.code)===200?(J.success("刪除成功"),!0):!1},Ce=({popup:t,setPopup:l,getSalaryList:i,editData:s,setEditData:d})=>{const c=ce(),{enqueueSnackbar:f}=ie(),$=Z(H=>H.base.autoReload),w=a.useRef(null),[y,x]=a.useState(new Date),[L,h]=a.useState(!1),B=[{validate:z,message:"請選擇日期"}],v=a.useRef(null),[V,m]=a.useState(""),[O,_]=a.useState(!1),P=[{validate:z,message:"請輸入地方"}],j=a.useRef(null),[R,p]=a.useState(""),[q,T]=a.useState(!1),F=[{validate:z,message:"請輸入工作內容"}],n=a.useRef(null),[o,u]=a.useState(""),[g,se]=a.useState(!1),ae=[{validate:fe,message:"請輸入正確金額"}],te=a.useRef(null),[U,K]=a.useState("");a.useEffect(()=>{x(new Date((s==null?void 0:s.getDate)||new Date)),m((s==null?void 0:s.place)||""),p((s==null?void 0:s.content)||""),u(String((s==null?void 0:s.dollar)||"")),K((s==null?void 0:s.remark)||"")},[s]);const le=async()=>{var W,X;if(![(W=w.current)==null?void 0:W.validateNow()].every(oe=>oe))return f("請確認紅框處內容");c(C(!0));const N={getDate:(X=M(y))==null?void 0:X.valueOf(),place:V,content:R,dollar:Number(o),remark:U},re=t==="add"?await Re(N):await Ie({...N,_id:s==null?void 0:s._id});c(C(!1)),re&&(i(),G())},ne=async()=>{if(!window.confirm(`確定要刪除 ${D((s==null?void 0:s.getDate)||new Date)} 嗎?`))return;c(C(!0));const N=await Ne(s==null?void 0:s._id);c(C(!1)),N&&($&&i(),G())},G=()=>{l(""),setTimeout(()=>{d({}),Q("")},500)},[I,Q]=a.useState("");return a.useEffect(()=>{I||Q(t)},[t,I]),e.jsx(de,{open:t==="add"||t==="edit",closeAfterTransition:!0,children:e.jsx(ue,{in:t==="add"||t==="edit",timeout:{enter:500,exit:500},children:e.jsxs("form",{className:"fixed left-1/2 top-1/2 flex max-h-[80%] w-[90%] max-w-[24rem] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded bg-white px-4 py-8 text-sm sm:w-96",children:[e.jsx("h1",{className:"mb-4 h-auto text-center text-2xl font-bold text-blue-800",children:`${I==="add"?"新增":"編輯"}薪水`}),e.jsxs("div",{className:"overflow-y-auto",children:[e.jsx(ee,{ref:w,id:"life-getDate",label:"取得日期",value:y,setValue:x,isValid:L,setIsValid:h,rules:B,placeholder:"請選擇取得日期"}),e.jsx(S,{ref:v,id:"life-place",label:"地方",value:V,setValue:m,isValid:O,setIsValid:_,rules:P,placeholder:"請輸入地方"}),e.jsx(S,{ref:j,id:"life-place",label:"工作內容",value:R,setValue:p,isValid:q,setIsValid:T,rules:F,placeholder:"請輸入工作內容"}),e.jsx(S,{ref:n,id:"life-dollar",label:"金額",value:o,setValue:u,isValid:g,setIsValid:se,rules:ae,placeholder:"請輸入金額"}),e.jsx(S,{ref:te,id:"life-place",label:"備註",value:U,setValue:K,isValid:!0,setIsValid:()=>!0,placeholder:"請輸入備註"})]}),e.jsxs("div",{className:"flex h-auto justify-evenly pt-2",children:[e.jsx(b,{variant:"contained",onClick:le,children:"送出"}),I==="edit"&&e.jsx(b,{color:"error",variant:"contained",onClick:ne,children:"刪除"}),e.jsx(b,{color:"info",variant:"contained",onClick:G,children:"取消"})]})]})})})},ke=({getStartDate:t,setGetStartDate:l,place:i,setPlace:s,searchSwitch:d,setSearchSwitch:c})=>{const f=()=>{c(!d)};return e.jsxs(me,{className:"mt-1",children:[e.jsx(pe,{expandIcon:e.jsx(je,{}),children:"搜尋"}),e.jsxs(ge,{children:[e.jsx("label",{className:"mb-1 inline-block text-gray-700",children:"取得日期開始"}),e.jsx("div",{className:"mb-6 flex items-center gap-2",children:e.jsx(ee,{id:"life-search-get-start-date",value:t,setValue:l,isValid:!0,setIsValid:()=>({}),placeholder:"取得日期起始",wFull:!1})}),e.jsx(S,{label:"地點",id:"life-search-place",value:i,setValue:s,isValid:!0,setIsValid:()=>({}),placeholder:"請輸入地點",className:"w-[15rem] flex-none"}),e.jsx(b,{variant:"contained",size:"small",onClick:f,children:"搜尋"})]})]})},Ue=()=>{const t=a.useRef(null),l=Z(n=>n.base.token),[i,s]=a.useState(M(new Date(Date.now()-1e3*60*60*24*30*3))),[d,c]=a.useState(""),[f,$]=a.useState(!1),[w,y]=a.useState(0),[x,L]=a.useState(0),[h,B]=a.useState(20),v=(n,o)=>{L(o),window.scrollTo(0,0)},V=n=>{B(parseInt(n.target.value,10)),v(null,0)},[m,O]=a.useState([]),[_,P]=a.useState(!1),j=a.useCallback(async({page:n,size:o}={})=>{P(!0);const u={page:n??x,size:o??h};h===-1&&(delete u.page,delete u.size),i&&(u.startTime=M(i).valueOf()),d&&(u.place=d);const g=await Te(u);g&&(O(g.list),y(g.totalCount)),P(!1)},[x,h,f]);a.useEffect(()=>{j()},[j]);const[R,p]=a.useState(""),[q,T]=a.useState({}),F=(n,o)=>{T(n),p(o)};return e.jsxs("section",{className:"p-4",children:[l&&e.jsx("div",{className:"text-right",children:e.jsxs(b,{variant:"contained",color:"secondary",onClick:()=>p("add"),children:[e.jsx(Se,{className:"!text-base"}),"新增"]})}),e.jsx(ke,{getStartDate:i,setGetStartDate:s,place:d,setPlace:c,searchSwitch:f,setSearchSwitch:$}),e.jsx("div",{className:"overflow-x-auto",children:e.jsx(xe,{children:e.jsx(he,{nodeRef:t,timeout:300,classNames:"page",children:e.jsxs(be,{ref:t,children:[e.jsx(we,{children:e.jsxs(k,{children:[e.jsx(r,{children:"日期"}),e.jsx(r,{children:"地方"}),e.jsx(r,{children:"工作內容"}),e.jsx(r,{className:"w-20",children:"金額"}),e.jsx(r,{children:"備註"}),e.jsx(r,{children:"操作"})]})}),e.jsx(ye,{children:m.map((n,o)=>e.jsxs(k,{children:[e.jsx(r,{children:D(n.getDate)}),e.jsx(r,{children:n.place}),e.jsx(r,{children:n.content}),e.jsx(r,{align:"right",children:Y(n.dollar)}),e.jsx(r,{children:n.remark}),e.jsx(r,{children:e.jsx(ve,{className:"cursor-pointer",color:"primary",onClick:()=>F(n,"edit")})})]},o))}),m.length>0&&e.jsxs(Ve,{children:[e.jsxs(k,{children:[e.jsx(r,{children:"總計："}),e.jsx(r,{colSpan:3,align:"right",children:Y(m.reduce((n,o)=>n+o.dollar,0))}),e.jsx(r,{}),e.jsx(r,{})]}),e.jsx(k,{children:e.jsx(Pe,{rowsPerPageOptions:[10,20,50,{label:"All",value:-1}],colSpan:6,count:w,rowsPerPage:h,page:x,SelectProps:{inputProps:{"aria-label":"rows per page"},native:!0},onPageChange:v,onRowsPerPageChange:V})})]})]})},_?"loading":"data")})}),e.jsx(Ce,{popup:R,setPopup:p,getSalaryList:j,editData:q,setEditData:T})]})};export{Ue as default};