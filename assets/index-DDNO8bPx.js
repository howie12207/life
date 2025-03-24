import{u as Y,a as Se,b as k,r as w,A as U,s as L,d as l,j as e,Q as Ve,U as Ie,V as ye,g as we,B as b,c as Ue,T as Pe}from"./index-nAwbjeji.js";import{B as Ce}from"./BaseSkeleton-C944cOzj.js";import{M as Re}from"./MutiSkeleton-D0R6avN2.js";import{F as Ee}from"./PencilSquareIcon-BvMfwgY3.js";import{i as De,a as y,o as Ae}from"./validate-C1sTg8Ed.js";import{B as Be}from"./index-CSXeqvxo.js";import{B as v}from"./index-Bwk7L8X2.js";import{B as ke}from"./index-BT-q511s.js";import{B as Le}from"./index--i2bGboe.js";import"./focus-management-BTIQmBQE.js";import"./bugs-DwjOCybL.js";import"./field-MvVtdOt6.js";import"./label-CuTpfjPQ.js";const _e=()=>k({mutationKey:["addPortfolio"],mutationFn:async s=>{var o;const r=await w({method:"post",url:`${U}/portfolio`,data:s});return((o=r==null?void 0:r.data)==null?void 0:o.code)===200?(L.success("新增成功"),!0):!1},scope:{id:"addPortfolio"}}),$e=s=>{const r=Y();return Se({queryKey:["portfolioList",s==null?void 0:s.page,s==null?void 0:s.size],queryFn:async({signal:o,queryKey:t})=>{var i,u;const d=r.getQueryData(t);if(d)return d;const n=new URLSearchParams;Object.entries(s).forEach(([m,a])=>{a!==void 0&&a!==-1&&n.append(m,String(a))});const h=n.toString()?`?${n.toString()}`:"",c=await w(`${U}/portfolio/list${h}`,{signal:o});return(i=c==null?void 0:c.data)!=null&&i.data?(u=c==null?void 0:c.data)==null?void 0:u.data:null},staleTime:1e3*60*60,gcTime:1e3*60*60})},Te=()=>k({mutationKey:["editPortfolio"],mutationFn:async s=>{var o;const r=await w({method:"patch",url:`${U}/portfolio?_id=${s._id}`,data:s});return((o=r==null?void 0:r.data)==null?void 0:o.code)===200?(L.success("編輯成功"),!0):!1},scope:{id:"editPortfolio"}}),qe=()=>k({mutationKey:["deletePortfolio"],mutationFn:async s=>{var o;const r=await w({method:"delete",url:`${U}/portfolio?_id=${s}`});return((o=r==null?void 0:r.data)==null?void 0:o.code)===200?(L.success("刪除成功"),!0):!1},scope:{id:"deletePortfolio"}});function Oe(s,{threshold:r=0,root:o=null,rootMargin:t="0%",freezeOnceVisible:d=!1}={}){const[n,h]=l.useState(),c=n==null?void 0:n.isIntersecting,i=c&&d,u=([m])=>{h(m)};return l.useEffect(()=>{const m=s==null?void 0:s.current;if(!!!window.IntersectionObserver||i||!m)return;const g={threshold:r,root:o,rootMargin:t},x=new IntersectionObserver(u,g);return x.observe(m),()=>x.disconnect()},[s,o,t,i,r]),{entry:n,inView:c}}const Me=({src:s,alt:r})=>{const[o,t]=l.useState(!0),d=()=>{t(!1)};return e.jsx("div",{className:"relative",children:e.jsx(Ve,{mode:"wait",children:e.jsxs(Ie.div,{...ye,children:[e.jsx("img",{src:s,alt:r,className:`${o?"!absolute !opacity-0":""} aspect-video w-full object-cover transition`,loading:"lazy",onLoad:d}),e.jsx(Ce,{className:`${o?"":"!absolute !hidden"} !h-[280px]`})]},String(o))})})},X=({data:s,handleEdit:r})=>{const o=we(t=>t.accessToken);return e.jsxs("article",{className:"relative h-full overflow-hidden rounded border border-red-50 bg-red-50 shadow transition hover:shadow-xl",children:[e.jsx(Me,{src:s.img,alt:s.name}),e.jsx("div",{className:"p-4",children:e.jsxs(Re,{isLoading:!s.img,children:[e.jsxs("div",{className:"mb-2 flex items-center justify-between",children:[e.jsx("h2",{className:"text-xl font-bold text-red-700",children:s.name}),o&&e.jsx(b,{type:"icon",className:"text-blue-700",onClick:r,children:e.jsx(Ee,{className:"size-4"})})]}),e.jsx("div",{className:"whitespace-pre-wrap",children:s.content}),e.jsxs("div",{className:"mt-2 flex gap-4",children:[s.pathDemo&&e.jsx("a",{href:s.pathDemo,className:"text-blue-500 hover:underline",title:"demo",target:"_blank",children:"Demo"}),s.pathCode&&e.jsx("a",{href:s.pathCode,className:"text-blue-500 hover:underline",title:"code",target:"_blank",children:"Code"}),s.url&&e.jsx("a",{href:s.url,className:"text-blue-500 hover:underline",title:"article",target:"_blank",children:"Article"})]})]})})]})},Fe=[{name:"是",value:"true"},{name:"否",value:"false"}],Ke=({isOpen:s,close:r,type:o,data:t,apiGetData:d})=>{const{enqueueSnackbar:n}=Ue(),h=Y(),c=l.useRef(null),[i,u]=l.useState(""),[m,a]=l.useState(!1),g=[{validate:De,message:"請輸入作品名稱"}],[x,j]=l.useState(""),f=l.useRef(null),[p,P]=l.useState(""),[ee,se]=l.useState(!1),te=[{validate:y,message:"請輸入圖片連結"}],_=l.useRef(null),[$,C]=l.useState(""),[le,oe]=l.useState(!1),re=[{validate:y,message:"請輸入程式碼連結"}],T=l.useRef(null),[q,R]=l.useState(""),[ie,ae]=l.useState(!1),ne=[{validate:y,message:"請輸入Demo連結"}],O=l.useRef(null),[M,E]=l.useState(""),[ce,de]=l.useState(!1),ue=[{validate:y,message:"請輸入文章連結"}],F=l.useRef(null),[K,D]=l.useState(""),[me,fe]=l.useState(!1),he=[{validate:Ae,message:"請輸入排序"}],[Q,A]=l.useState("true"),{mutateAsync:xe,isPending:N}=_e(),{mutateAsync:pe,isPending:S}=Te(),ge=async()=>{var z,G,Z,H,J,W;if(![(z=c.current)==null?void 0:z.validateNow(),(G=f.current)==null?void 0:G.validateNow(),(Z=_.current)==null?void 0:Z.validateNow(),(H=T.current)==null?void 0:H.validateNow(),(J=O.current)==null?void 0:J.validateNow(),(W=F.current)==null?void 0:W.validateNow()].every(Ne=>Ne))return n("請確認紅框處內容");const B={name:i,content:x,img:p,pathCode:$,pathDemo:q,url:M,order:Number(K),recommend:Q==="true",status:1};(o==="add"?await xe(B):await pe({...B,_id:t==null?void 0:t._id}))&&(h.removeQueries({queryKey:["portfolioList"],exact:!1}),d(),I())},{mutateAsync:je,isPending:V}=qe(),ve=async()=>{if(!window.confirm(`確定要刪除『${t==null?void 0:t.name}』嗎?`)||!(t!=null&&t._id))return;await je(t==null?void 0:t._id)&&(h.removeQueries({queryKey:["portfolioList"],exact:!1}),d(),I())};l.useEffect(()=>{!t||!s||o==="add"||(u(t.name),j(t.content),P(t.img),C(t.pathCode),R(t.pathDemo),E(t.url),D(String(t.order)),A(String(t.recommend)))},[s,t,o]);const I=()=>{r(),u(""),j(""),P(""),C(""),R(""),E(""),D(""),A("true")};return e.jsx(Be,{isOpen:s,close:I,children:e.jsxs("form",{className:"flex max-h-[80dvh] flex-col",children:[e.jsx("div",{className:"mb-4 h-auto text-center text-2xl font-bold text-blue-800",children:`${Pe[o]||""}作品`}),e.jsxs("section",{className:"overflow-auto",children:[e.jsx(v,{ref:c,id:"life-name",label:"作品名稱",value:i,setValue:u,isValid:m,setIsValid:a,rules:g,placeholder:"請輸入作品名稱"}),e.jsx(ke,{id:"life-content",label:"描述",value:x,setValue:j,placeholder:"請輸入描述"}),e.jsx(v,{className:"mt-5",ref:f,id:"life-imgUrl",label:"圖片網址",value:p,setValue:P,isValid:ee,setIsValid:se,rules:te,placeholder:"請輸入圖片網址"}),e.jsx(v,{ref:_,id:"life-codeUrl",label:"程式碼網址",value:$,setValue:C,isValid:le,setIsValid:oe,rules:re,placeholder:"請輸入程式碼網址"}),e.jsx(v,{ref:T,id:"life-demoUrl",label:"Demo網址",value:q,setValue:R,isValid:ie,setIsValid:ae,rules:ne,placeholder:"請輸入Demo網址"}),e.jsx(v,{ref:O,id:"life-articleUrl",label:"文章網址",value:M,setValue:E,isValid:ce,setIsValid:de,rules:ue,placeholder:"請輸入文章網址"}),e.jsx(v,{ref:F,id:"life-order",label:"排序",value:K,setValue:D,isValid:me,setIsValid:fe,rules:he,placeholder:"請輸入排序"}),e.jsx("label",{className:"base-label",children:"是否推薦"}),e.jsx(Le,{radioList:Fe,value:Q,setValue:A})]}),e.jsxs("div",{className:"mt-8 flex h-auto justify-evenly",children:[e.jsx(b,{isLoading:N||S||V,disabled:N||S||V,onClick:ge,children:"送出"}),o==="edit"&&e.jsx(b,{type:"danger",isLoading:N||S||V,disabled:N||S||V,onClick:ve,children:"刪除"}),e.jsx(b,{type:"info",onClick:I,children:"取消"})]})]})})},rs=()=>{const[s,r]=l.useState(""),[o,t]=l.useState(null),d=(f,p)=>{r(f),t(a?a==null?void 0:a[p]:null)},[n,h]=l.useState(1),c=9,{data:i,refetch:u}=$e({page:n-1,size:c}),m=()=>{g([]),h(1),u()},[a,g]=l.useState([]);l.useEffect(()=>{i!=null&&i.list&&g(f=>[...f,...i.list])},[i]);const x=l.useRef(null),{inView:j}=Oe(x);return l.useEffect(()=>{j&&Number(i==null?void 0:i.totalPage)>n&&h(f=>f+1)},[j]),e.jsxs("main",{className:"p-4 pb-16",children:[e.jsxs("div",{className:"mb-4 flex items-center justify-between",children:[e.jsx("h2",{className:"page-title",children:"作品集"}),e.jsx(b,{onClick:()=>r("add"),children:"新增"})]}),e.jsxs("section",{className:"grid gap-4 md:grid-cols-2 lg:grid-cols-3",children:[a==null?void 0:a.map((f,p)=>e.jsx(X,{data:f,handleEdit:()=>d("edit",p)},p)),e.jsx("div",{ref:x,children:a.length!==(i==null?void 0:i.totalCount)&&e.jsx(X,{data:{},handleEdit:()=>d("edit",0)})})]}),e.jsx(Ke,{isOpen:s==="add"||s==="edit",close:()=>r(""),type:s,data:o,apiGetData:m})]})};export{rs as default};
