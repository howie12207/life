import{u as o,a as c,j as s,B as u,b as d}from"./index-ZmCP8L0s.js";const l=()=>{const r=o(e=>e.accessToken),{mutateAsync:i,isPending:a}=c(),t=async()=>{const n=await(await navigator.serviceWorker.register("/life/sw.js")).pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:d("BHHkgFHbmZDLJddEeeaA8Bdfz0p1AhXMrS0riDr2vXl5odqtlMW2eBMwppao04oW18eEgF7N36IevHGuv1HiTow")});await i(n)};return s.jsxs("section",{className:"h-[500vh] bg-blue-200",children:[s.jsx("div",{children:"Home"}),r&&s.jsx(u,{onClick:t,isLoading:a,children:"訂閱"})]})};export{l as default};
