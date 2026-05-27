/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// helpers.js — Constantes, paletas, componentes UI simples y funciones puras
// Este archivo se extrajo de App.js como primer paso de modularización.
// Contiene SOLO código que no depende del estado de los componentes grandes
// (Almacenero, Planner, Aprobador, Gerente).
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useState } from "react";

const CSS_GLOBAL = `*{box-sizing:border-box}input::placeholder{color:rgba(255,255,255,.4)}@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`;
const CSS_DRAWER = `@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideIn{from{transform:translateX(60px);opacity:0}to{transform:none;opacity:1}}`;
const CSS_DASH = `*{box-sizing:border-box}::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:#ccc;border-radius:2px}select{-webkit-appearance:none}`;
// Estilos base reutilizables
const BS={ff:"inherit",cur:"pointer"};
const inp_s={boxSizing:"border-box"};
const LOGO_SRC = "data:image/png;base64,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";
const PRODUCTOS_POR_TIPO = {
  TRACTOR:    ["Petróleo D2"],
  CAMION:     ["Petróleo D2"],
  CISTERNA:   ["Petróleo D2"],
  MONTACARGAS:["Gas GLP","Petróleo D2"],
};
const TODOS_PRODUCTOS = ["Petróleo D2","Gasolina 84 Oct.","Gasolina 90 Oct.","Gasolina 95 Oct.","Gas GLP"];
const TIPOS_EQUIPO = ["TRACTOR","CAMION","CISTERNA","MONTACARGAS"];
const TIPO_ICO_MAP = {TRACTOR:"🚜", CAMION:"🚛", CISTERNA:"🚒", MONTACARGAS:"🛺"};
function actividadesPorTipo(actividades, tipo) {
  if (!tipo || !actividades) return actividades||[];
  return actividades.filter(a => (a.tipos||[]).includes(tipo));
}
const RATIOS_ACT = {
  "Aplicacion Mecanizada - Fitosanidad":              {ratio:1.6, unit:"Gl/Hr", tipos:["TRACTOR"]},
  "Aporque - Aporcador de Aletas":                    {ratio:2.5, unit:"Gl/Hr", tipos:["TRACTOR"]},
  "Aporque - Aporcador de Disco":                     {ratio:2.2, unit:"Gl/Hr", tipos:["TRACTOR"]},
  "Arado de Reja":                                    {ratio:3.8, unit:"Gl/Hr", tipos:["TRACTOR"]},
  "Chapodo Mecanizado - Desbrozadora (Arbusto Alto)": {ratio:2.8, unit:"Gl/Hr", tipos:["TRACTOR"]},
  "Chapodo Mecanizado - Desbrozadora (Regular)":      {ratio:2.5, unit:"Gl/Hr", tipos:["TRACTOR"]},
  "Chapodo Mecanizado - Repique":                     {ratio:2.0, unit:"Gl/Hr", tipos:["TRACTOR"]},
  "Chapodo Mecanizado - Rotativa":                    {ratio:2.2, unit:"Gl/Hr", tipos:["TRACTOR"]},
  "Chatin":                                           {ratio:2.8, unit:"Gl/Hr", tipos:["TRACTOR"]},
  "Cultivado - 12 Brazos":                            {ratio:2.5, unit:"Gl/Hr", tipos:["TRACTOR"]},
  "Cultivado - 6 Brazos":                             {ratio:2.0, unit:"Gl/Hr", tipos:["TRACTOR"]},
  "Cultivado Mecanizado - Cultivador":                {ratio:1.8, unit:"Gl/Hr", tipos:["TRACTOR"]},
  "Grada Mediana":                                    {ratio:2.5, unit:"Gl/Hr", tipos:["TRACTOR"]},
  "Grada Pesada":                                     {ratio:3.8, unit:"Gl/Hr", tipos:["TRACTOR"]},
  "Planchado":                                        {ratio:2.0, unit:"Gl/Hr", tipos:["TRACTOR"]},
  "Rastrillo Mecanizado - Arandano":                  {ratio:2.0, unit:"Gl/Hr", tipos:["TRACTOR"]},
  "Rastrillo Mecanizado - Esparrago":                 {ratio:2.2, unit:"Gl/Hr", tipos:["TRACTOR"]},
  "Siembra":                                          {ratio:1.5, unit:"Gl/Hr", tipos:["TRACTOR"]},
  "Subsolado (3 Puntas)":                             {ratio:3.2, unit:"Gl/Hr", tipos:["TRACTOR"]},
  "Traslado/Carreteo":                                {ratio:1.5, unit:"Gl/Hr", tipos:["TRACTOR"]},
  "Camion - Traslados dentro de fundo":               {ratio:10,  unit:"Km/Gl", tipos:["CAMION"]},
  "Camion - Traslados fuera de fundo":                {ratio:16,  unit:"Km/Gl", tipos:["CAMION"]},
  "Camion - Traslados mixtos":                        {ratio:12,  unit:"Km/Gl", tipos:["CAMION"]},
  "Cisterna - Traslados dentro de fundo":             {ratio:5,   unit:"Km/Gl", tipos:["CISTERNA"]},
  "Cisterna - Traslados fuera de fundo":              {ratio:12,  unit:"Km/Gl", tipos:["CISTERNA"]},
  "Cisterna - Traslados mixtos":                      {ratio:10,  unit:"Km/Gl", tipos:["CISTERNA"]},
  "Agrimac 4x4 - Traslado de MMPP":                  {ratio:1.3, unit:"Gl/Hr", tipos:["MONTACARGAS"]},
  "Hangcha 4x4 - Traslado de MMPP":                  {ratio:1.5, unit:"Gl/Hr", tipos:["MONTACARGAS"]},
};
function getRatio(actividad) {
  return RATIOS_ACT[actividad] || null;
}
const INIT_MAESTROS = {
  fundos:      ["AGROMORIN","CASA VERDE","CAYALTI","COMPOSITAN","EL PALMAR","JAYANCA","MARIA DEL ROSARIO","MUCHIK","SANTO DOMINGO","VICTORIA"],
  cultivos:    ["ALCACHOFA","ARANDANO","ESPARRAGO","OTROS","PALTA","PALTO","PIMIENTO"],
  actividades: Object.entries(RATIOS_ACT).map(([nombre, v]) => ({nombre, ratio:v.ratio, unit:v.unit, tipos:v.tipos})),
  precioPorGalon: 18.5,
  almaceneros: ["ADM_CP","ADM_AGROMOR","ADM_CASMA","ADM_JAYANCA","ADM_MUCHIK","ADM_VICTORIA"],
  choferes: [
    {nombre:"Gerry Mares",     tipo:"VEHICULO"},
    {nombre:"Luis Quispe",     tipo:"TRACTOR"},
    {nombre:"Juan Pérez",      tipo:"VEHICULO"},
    {nombre:"Carlos Díaz",     tipo:"TRACTOR"},
    {nombre:"Pedro Luján",     tipo:"VEHICULO"},
    {nombre:"Marco Salinas",   tipo:"TRACTOR"},
    {nombre:"Antonio Vera",    tipo:"VEHICULO"},
    {nombre:"Roberto Narro",   tipo:"TRACTOR"},
    {nombre:"Eduardo Paz",     tipo:"VEHICULO"},
    {nombre:"Félix Mora",      tipo:"TRACTOR"},
    {nombre:"Raúl Soto",       tipo:"VEHICULO"},
  ],
  equipos: [
    {id:"10004219",den:"TRACTOR JOHN DEERE N°27",tipo:"TRACTOR",placa:""},
    {id:"10004221",den:"TRACTOR JOHN DEERE N°29",tipo:"TRACTOR",placa:""},
    {id:"10004223",den:"TRACTOR JOHN DEERE N°31",tipo:"TRACTOR",placa:""},
    {id:"10009387",den:"TRACTOR JOHN DEERE N°33",tipo:"TRACTOR",placa:""},
    {id:"10009400",den:"TRACTOR JOHN DEERE N°34",tipo:"TRACTOR",placa:""},
    {id:"10009950",den:"TRACTOR JOHN DEERE N°35",tipo:"TRACTOR",placa:""},
    {id:"10009951",den:"TRACTOR JOHN DEERE N°36",tipo:"TRACTOR",placa:""},
    {id:"10010003",den:"TRACTOR JOHN DEERE N°37",tipo:"TRACTOR",placa:""},
    {id:"10010304",den:"TRACTOR JOHN DEERE N°38",tipo:"TRACTOR",placa:""},
    {id:"10010352",den:"TRACTOR JOHN DEERE N°39",tipo:"TRACTOR",placa:""},
    {id:"10010353",den:"TRACTOR JOHN DEERE N°40",tipo:"TRACTOR",placa:""},
    {id:"10010587",den:"TRACTOR JOHN DEERE N°41",tipo:"TRACTOR",placa:""},
    {id:"10010588",den:"TRACTOR JOHN DEERE N°42",tipo:"TRACTOR",placa:""},
    {id:"10010736",den:"TRACTOR JOHN DEERE N°43",tipo:"TRACTOR",placa:""},
    {id:"10010968",den:"TRACTOR JOHN DEERE N°44",tipo:"TRACTOR",placa:""},
    {id:"10011646",den:"TRACTOR JOHN DEERE N°45",tipo:"TRACTOR",placa:""},
    {id:"10011647",den:"TRACTOR JOHN DEERE N°46",tipo:"TRACTOR",placa:""},
    {id:"10012566",den:"TRACTOR JOHN DEERE N°47",tipo:"TRACTOR",placa:""},
    {id:"10015088",den:"TRACTOR JOHN DEERE N°48",tipo:"TRACTOR",placa:""},
    {id:"10015089",den:"TRACTOR JOHN DEERE N°49",tipo:"TRACTOR",placa:""},
    {id:"10015215",den:"TRACTOR JOHN DEERE N°50",tipo:"TRACTOR",placa:""},
    {id:"10015216",den:"TRACTOR JOHN DEERE N°51",tipo:"TRACTOR",placa:""},
    {id:"10015371",den:"TRACTOR JOHN DEERE N°52",tipo:"TRACTOR",placa:""},
    {id:"10015372",den:"TRACTOR JOHN DEERE N°53",tipo:"TRACTOR",placa:""},
    {id:"10004236",den:"CAMION N°13 / T7Z-804",tipo:"CAMION",placa:"T7Z-804"},
    {id:"10004237",den:"CAMION N°14 / T8C-947",tipo:"CAMION",placa:"T8C-947"},
    {id:"10004239",den:"CAMION N°15 / T8C-944",tipo:"CAMION",placa:"T8C-944"},
    {id:"10007961",den:"CAMION N°16 / T9S-815",tipo:"CAMION",placa:"T9S-815"},
    {id:"10007962",den:"CAMION N°17 / T9S-825",tipo:"CAMION",placa:"T9S-825"},
    {id:"10008288",den:"CAMION N°19 / T0C-802",tipo:"CAMION",placa:"T0C-802"},
    {id:"10009209",den:"CAMION N°20 / T0W-813",tipo:"CAMION",placa:"T0W-813"},
    {id:"10009210",den:"CAMION N°21 / T0T-831",tipo:"CAMION",placa:"T0T-831"},
    {id:"10009218",den:"CAMION N°22 / T0S-941",tipo:"CAMION",placa:"T0S-941"},
    {id:"10009591",den:"CAMION N°24 / TAD-921",tipo:"CAMION",placa:"TAD-921"},
    {id:"10009592",den:"CAMION N°25 / TAD-935",tipo:"CAMION",placa:"TAD-935"},
    {id:"10010577",den:"CAMION N°27 / TBM-858",tipo:"CAMION",placa:"TBM-858"},
    {id:"10010679",den:"CAMION N°28 / TCL-847",tipo:"CAMION",placa:"TCL-847"},
    {id:"10010950",den:"CAMION N°29 / TCL-901",tipo:"CAMION",placa:"TCL-901"},
    {id:"10014662",den:"CAMION N°30 / TER-914",tipo:"CAMION",placa:"TER-914"},
    {id:"10015070",den:"CAMION N°32 / TFJ-889",tipo:"CAMION",placa:"TFJ-889"},
    {id:"10015071",den:"CAMION N°33 / TFJ-906",tipo:"CAMION",placa:"TFJ-906"},
    {id:"10015230",den:"CAMION N°34 / TFP-828",tipo:"CAMION",placa:"TFP-828"},
    {id:"10015245",den:"CAMION N°35 / TFP-836",tipo:"CAMION",placa:"TFP-836"},
    {id:"10007889",den:"CISTERNA N°18 / T9S-821",tipo:"CISTERNA",placa:"T9S-821"},
    {id:"10009219",den:"CISTERNA N°23 / T0T-916",tipo:"CISTERNA",placa:"T0T-916"},
    {id:"10009993",den:"CISTERNA N°26 / TAM-944",tipo:"CISTERNA",placa:"TAM-944"},
    {id:"10015010",den:"CISTERNA N°31 / TFE-863",tipo:"CISTERNA",placa:"TFE-863"},
    {id:"10015248",den:"CISTERNA N°36 / TFR-803",tipo:"CISTERNA",placa:"TFR-803"},
    {id:"10015247",den:"CISTERNA N°37 / TFQ-868",tipo:"CISTERNA",placa:"TFQ-868"},
    {id:"10015246",den:"CISTERNA N°38 / TFQ-877",tipo:"CISTERNA",placa:"TFQ-877"},
  ],
};
const INIT_USERS = [
  {id:"u1",usuario:"almacenero",pass:"1234",   rol:"alm",  nombre:"Almacenero Demo",      activo:true, cultivos:[]},
  {id:"u2",usuario:"planner",   pass:"admin",  rol:"plan", nombre:"Planner / Jefe",        activo:true, cultivos:[]},
  {id:"u3",usuario:"grifero1",  pass:"1234",   rol:"alm",  nombre:"Grifero Compositan",    activo:true, cultivos:[]},
  {id:"u4",usuario:"jhashimoto",pass:"1234",   rol:"apro", nombre:"Juan Hashimoto",        activo:true, cultivos:["ESPARRAGO"]},
  {id:"u5",usuario:"supervisor",pass:"1234",   rol:"apro", nombre:"Supervisor Arándano",   activo:true, cultivos:["ARANDANO"]},
  {id:"u6",usuario:"renallop",  pass:"Danper2026!",rol:"ger",nombre:"Renato Llop",          activo:true, cultivos:[]},
];
const HIST_KPIS = {total_gl:0,total_reg:0,total_exc:0,total_def:0,equipos:0};
const HIST_EXCESOS = [];
const HIST_DEFICITS = [];
// ─── FIREBASE STORAGE ────────────────────────────────────────────────────────
// La persistencia se gestiona directamente desde el App root mediante los
// helpers importados de './firebase' (guardar, escuchar, guardarMaestros, etc.)
const C = {
  navy:"#0B2748",blue:"#1D6FD8",bg:"#F0EEE9",surf:"#fff",surf2:"#F7F5F1",
  bdr:"rgba(0,0,0,.08)",bdr2:"rgba(0,0,0,.14)",txt:"#111",txt2:"#555",txt3:"#999",
  exc:"#6D28D9",excBg:"#EDE9FE",def_:"#0369A1",defBg:"#E0F2FE",
  ok:"#166534",okBg:"#DCFCE7",warn:"#B45309",warnBg:"#FEF3C7",
  crit:"#B91C1C",critBg:"#FEE2E2",
};
const S = {
  card: {background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16,marginBottom:12,boxShadow:"0 1px 3px rgba(0,0,0,.06)"},
  sec:  {fontSize:10,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.7,marginBottom:12},
  lbl:  {fontSize:11,fontWeight:600,color:C.txt2,marginBottom:5,display:"block"},
  inp:  {width:"100%",padding:"9px 11px",border:`1.5px solid ${C.bdr2}`,borderRadius:8,fontSize:13,background:"#fff",fontFamily:"inherit",color:C.txt,outline:"none",boxSizing:"border-box",WebkitAppearance:"none"},
  ro:   {background:"#f5f5f3",color:C.txt3},
};
function Badge({type,children}){
  const m={exc:{bg:C.excBg,c:C.exc},def_:{bg:C.defBg,c:C.def_},ok:{bg:C.okBg,c:C.ok},
    warn:{bg:C.warnBg,c:C.warn},T:{bg:"#DBEAFE",c:"#1e3a8a"},C:{bg:"#D1FAE5",c:"#064e3b"},
    I:{bg:"#FEE2E2",c:"#7f1d1d"}};
  const s=m[type]||{bg:"#F3F4F6",c:"#6B7280"};
  return <span style={{background:s.bg,color:s.c,fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:5,whiteSpace:"nowrap",display:"inline-block"}}>{children}</span>;
}
function KCard({label,value,sub,color,accent}){
  return(
    <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:12,padding:"14px 16px",borderTop:accent?`3px solid ${accent}`:undefined}}>
      <div style={{fontSize:10,fontWeight:600,color:C.txt3,textTransform:"uppercase",letterSpacing:.5,marginBottom:8}}>{label}</div>
      <div style={{fontSize:22,fontWeight:700,color:color||C.txt,lineHeight:1,marginBottom:3}}>{value}</div>
      {sub&&<div style={{fontSize:10,color:C.txt3}}>{sub}</div>}
    </div>
  );
}
function Toast({msg,type,onClose}){
  // Errores requieren más tiempo (8s vs 3.2s) para que el usuario los lea
  useEffect(()=>{
    if(!msg)return;
    const ms = type==="err" ? 8000 : 3200;
    const t=setTimeout(onClose,ms);
    return()=>clearTimeout(t);
  },[msg,type]);
  if(!msg)return null;
  const bg=type==="ok"?C.ok:type==="err"?C.crit:type==="warn"?C.warn:C.navy;
  return(
    <div onClick={onClose} title="Clic para cerrar"
      style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",
      background:bg,color:"#fff",padding:"11px 20px",borderRadius:12,fontSize:13,
      fontWeight:500,zIndex:9999,boxShadow:"0 4px 20px rgba(0,0,0,.25)",
      maxWidth:"90vw",textAlign:"center",lineHeight:1.4,cursor:"pointer"}}>
      {msg}
    </div>
  );
}

// Abre una imagen (incluso data URLs) en un lightbox modal a pantalla completa.
// Reemplaza window.open() que está bloqueado por seguridad anti-phishing
// en navegadores modernos cuando la URL es data:image.
function verImagenAmpliada(src){
  if(!src) return;
  const existente = document.getElementById("__lightbox_foto__");
  if(existente) existente.remove();
  const overlay = document.createElement("div");
  overlay.id = "__lightbox_foto__";
  Object.assign(overlay.style, {
    position:"fixed", inset:"0", background:"rgba(0,0,0,0.92)",
    display:"flex", alignItems:"center", justifyContent:"center",
    zIndex:"99999", cursor:"zoom-out", padding:"20px",
  });
  const img = document.createElement("img");
  img.src = src;
  Object.assign(img.style, {
    maxWidth:"100%", maxHeight:"100%", objectFit:"contain",
    boxShadow:"0 10px 40px rgba(0,0,0,.6)", borderRadius:"8px",
  });
  const close = document.createElement("button");
  close.innerHTML = "✕";
  Object.assign(close.style, {
    position:"absolute", top:"16px", right:"16px",
    background:"rgba(255,255,255,.15)", color:"#fff",
    border:"1px solid rgba(255,255,255,.3)", borderRadius:"50%",
    width:"40px", height:"40px", fontSize:"18px", cursor:"pointer",
  });
  const cerrar = () => { overlay.remove(); document.removeEventListener("keydown", onKey); };
  const onKey = (e) => { if(e.key==="Escape") cerrar(); };
  overlay.addEventListener("click", cerrar);
  close.addEventListener("click", e => { e.stopPropagation(); cerrar(); });
  img.addEventListener("click", e => e.stopPropagation());
  document.addEventListener("keydown", onKey);
  overlay.appendChild(img);
  overlay.appendChild(close);
  document.body.appendChild(overlay);
}

// Botón de refrescar reutilizable
function BotonRefrescar({onRecargar, onToast, dark=false}){
  const [cargando, setCargando] = useState(false);
  const handleClick = async () => {
    if(cargando) return;
    setCargando(true);
    try{
      await onRecargar();
      if(onToast) onToast({msg:"✓ Datos actualizados",type:"ok"});
    }catch(e){
      if(onToast) onToast({msg:"Error al recargar: "+(e?.message||"red"),type:"err"});
    }finally{
      setTimeout(()=>setCargando(false), 300);
    }
  };
  const style = dark
    ? {background:"rgba(255,255,255,.15)",color:"#fff",border:"none"}
    : {background:"#fff",color:C.txt2,border:`1px solid ${C.bdr}`};
  return(
    <>
      <style>{"@keyframes spinR{to{transform:rotate(360deg)}}"}</style>
      <button onClick={handleClick} disabled={cargando}
        title="Recargar datos desde Firebase"
        style={{...style,borderRadius:8,padding:"6px 12px",fontSize:11,
          cursor:cargando?"wait":"pointer",fontFamily:"inherit",
          display:"flex",alignItems:"center",gap:6,opacity:cargando?.7:1,fontWeight:500}}>
        <span style={{display:"inline-block",
          animation: cargando ? "spinR 0.8s linear infinite" : "none"}}>↻</span>
        {cargando?"Actualizando...":"Refrescar"}
      </button>
    </>
  );
}

// Comprime una imagen data URL para no superar el límite de 1MB de Firestore
function comprimirImagen(dataUrl, maxLado=900, calidad=0.7){
  return new Promise((resolve,reject)=>{
    if(!dataUrl){ resolve(null); return; }
    const img = new Image();
    img.onload = () => {
      try{
        let w = img.width, h = img.height;
        if(w > maxLado || h > maxLado){
          const r = w > h ? maxLado/w : maxLado/h;
          w = Math.round(w*r); h = Math.round(h*r);
        }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", calidad));
      }catch(e){ reject(e); }
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

// Elimina recursivamente claves con valor undefined (Firestore las rechaza)
function limpiarUndefined(v){
  if(Array.isArray(v)) return v.map(limpiarUndefined);
  if(v && typeof v==="object"){
    const o={};
    for(const [k,val] of Object.entries(v)){
      if(val===undefined) continue;
      o[k] = limpiarUndefined(val);
    }
    return o;
  }
  return v;
}

// ─── buildUnified — combina histórico + vales app en una sola lista ─────────
const buildUnified=(vales)=>{
  const hist=[
    ...HIST_EXCESOS.map(r=>({...r,fuente:"hist",aprobado:null,rechazado:null,gl_real:r.gl,gl_esp:r.es,diff:r.df,nVale:"—"})),
    ...HIST_DEFICITS.map(r=>({...r,fuente:"hist",aprobado:null,rechazado:null,gl_real:r.gl,gl_esp:r.es,diff:r.df,nVale:"—"})),
  ];
  const nuevos=vales.map(v=>{
    const tienePrevio = v.kmAnterior && v.kmAnterior > 0;
    const dif = (tienePrevio && v.diferencia && v.diferencia>0) ? v.diferencia : 0;
    const glEsp = (v.teoRatio && dif > 0) ? (v.teoUnit==="Km/Gl"?dif/v.teoRatio:dif*v.teoRatio) : null;
    const diff=glEsp?v.gl-glEsp:null;
    const af=diff==null?null:diff>5?"exceso":diff<-5?"deficit":null;
    return{id:v.equipoId,ef:v.equipoDen,
    t:v.tipo==="TRACTOR"?"T":v.tipo==="CISTERNA"?"I":"C",
    fe:v.fecha,gl:v.gl,gl_real:v.gl,
    gl_esp:glEsp?Math.round(glEsp*10)/10:null,
    diff:diff?Math.round(diff*10)/10:null,
    af,fu:v.fundo,ac:[v.actividad],chofer:v.chofer,
    fuente:"app",nVale:v.nVale||"V-"+String(v.id).padStart(6,"0"),
    aprobado:v.aprobado||false,rechazado:v.rechazado||false,
    };
  });
  return[...hist,...nuevos];
  };


// ─── Exports ────────────────────────────────────────────────────────────────
export {
  CSS_GLOBAL, CSS_DRAWER, CSS_DASH,
  BS, inp_s, LOGO_SRC,
  PRODUCTOS_POR_TIPO, TODOS_PRODUCTOS, TIPOS_EQUIPO, TIPO_ICO_MAP,
  RATIOS_ACT, INIT_MAESTROS, INIT_USERS,
  HIST_KPIS, HIST_EXCESOS, HIST_DEFICITS,
  C, S,
  actividadesPorTipo, getRatio, buildUnified,
  Badge, KCard, Toast,
  verImagenAmpliada, BotonRefrescar, comprimirImagen, limpiarUndefined,
};
