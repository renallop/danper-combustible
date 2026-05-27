/* eslint-disable */
import { useState, useEffect, useCallback, useRef } from "react";
import * as XLSX from "xlsx";
import { guardar, obtenerTodos, escuchar, guardarMaestros, obtenerMaestros, guardarUsuarios, obtenerUsuarios, guardarCounter, obtenerCounter, reservarSiguienteVale, liberarVale } from "./firebase";
// Constantes, paletas, componentes UI simples y funciones puras extraídas a helpers.js
import {
  CSS_GLOBAL, CSS_DRAWER, CSS_DASH,
  BS, inp_s, LOGO_SRC,
  PRODUCTOS_POR_TIPO, TODOS_PRODUCTOS, TIPOS_EQUIPO, TIPO_ICO_MAP,
  RATIOS_ACT, INIT_MAESTROS, INIT_USERS,
  HIST_KPIS, HIST_EXCESOS, HIST_DEFICITS,
  C, S,
  actividadesPorTipo, getRatio, buildUnified,
  Badge, KCard, Toast,
  verImagenAmpliada, BotonRefrescar, comprimirImagen, limpiarUndefined,
} from "./helpers";

function Login({onLogin,users}){
  const [u,setU]=useState(""); const [p,setP]=useState(""); const [err,setErr]=useState("");
  const attempt=(usr,pw)=>{
    const found=(users&&users.length>0?users:INIT_USERS).find(x=>x.usuario===usr?.trim().toLowerCase()&&x.activo!==false);
    if(!found||found.pass!==pw){setErr("Usuario o contraseña incorrectos");return;}
    setErr(""); onLogin(found);
  };
  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",fontFamily:"inherit"}}>
      <style>{CSS_GLOBAL}</style>
      
      <div style={{background:"#E20613",padding:"16px 32px",display:"flex",alignItems:"center",
        justifyContent:"space-between",boxShadow:"0 2px 12px rgba(226,6,19,.3)"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          
          <img src={LOGO_SRC} alt="Danper" style={{width:36,height:36,borderRadius:"50%",objectFit:"cover",flexShrink:0,border:"2px solid rgba(255,255,255,.25)"}}/>
          <div>
            <div style={{color:"#fff",fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,
              fontStyle:"italic",letterSpacing:1}}>Danper</div>
            <div style={{color:"rgba(255,255,255,.8)",fontSize:10,letterSpacing:1.5,
              textTransform:"uppercase",marginTop:1}}>Trujillo S.A.C.</div>
          </div>
        </div>
        <div style={{color:"rgba(255,255,255,.7)",fontSize:11,textAlign:"right",letterSpacing:.5}}>
          Mantenimiento y Maquinaria Agrícola<br/>
          <span style={{color:"#fff",fontWeight:700,fontSize:14}}>2026</span>
        </div>
      </div>
      
      <div style={{flex:1,background:"#fff",
        display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 20px",position:"relative",overflow:"hidden"}}>
        
        {/* Curva roja decorativa estilo portal Danper */}
        <div style={{position:"absolute",top:0,left:0,bottom:0,width:"55%",
          background:"#E20613",
          clipPath:"ellipse(85% 100% at 0% 50%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:-100,right:-100,width:300,height:300,
          borderRadius:"50%",background:"rgba(226,6,19,.04)",pointerEvents:"none"}}/>
        <div style={{display:"flex",gap:48,alignItems:"center",maxWidth:900,width:"100%",
          animation:"fadeUp .5s ease",position:"relative",zIndex:1}}>
          
          {/* Panel izquierdo — logo Danper sobre fondo rojo */}
          <div style={{flex:1,color:"#fff",display:"none",paddingLeft:20}} className="desktop-info">
            {/* Logo grande Danper — SVG inline para fidelidad al original */}
            <svg viewBox="0 0 320 100" style={{width:320,height:100,marginBottom:18,filter:"drop-shadow(0 4px 16px rgba(0,0,0,.2))"}} xmlns="http://www.w3.org/2000/svg">
              <text x="160" y="76"
                fontFamily="'Lucida Handwriting','Brush Script MT','Segoe Script',cursive"
                fontSize="92"
                fontStyle="italic"
                fontWeight="700"
                fill="#fff"
                textAnchor="middle">Danper</text>
            </svg>
            <div style={{fontSize:24,fontWeight:600,lineHeight:1.2,marginBottom:14,opacity:.95}}>
              Bienvenido
            </div>
            <div style={{fontSize:11,letterSpacing:2.5,
              textTransform:"uppercase",opacity:.85,marginBottom:32}}>
              Portal de Mantenimiento y Maquinaria
            </div>
            <div style={{height:1,width:60,background:"rgba(255,255,255,.5)",marginBottom:24}}/>
            <div style={{display:"flex",gap:18,flexWrap:"wrap"}}>
              {[["⛽","Control de vales"],["📊","Dashboard en tiempo real"],["✅","Aprobaciones por cultivo"]].map(([ico,txt])=>(
                <div key={txt} style={{display:"flex",alignItems:"center",gap:7,fontSize:12,color:"rgba(255,255,255,.85)"}}>
                  <span>{ico}</span>{txt}
                </div>
              ))}
            </div>
          </div>
          
          {/* Card de login — fondo blanco sólido */}
          <div style={{width:380,maxWidth:"100%",flexShrink:0,marginLeft:"auto"}}>
            <div style={{background:"#fff",border:"1px solid rgba(0,0,0,.08)",
              borderRadius:20,padding:36,boxShadow:"0 20px 50px rgba(226,6,19,.18), 0 8px 16px rgba(0,0,0,.08)"}}>
              
              <div style={{textAlign:"center",marginBottom:28}}>
                <img src={LOGO_SRC} alt="Danper" style={{width:52,height:52,borderRadius:"50%",objectFit:"cover",border:"3px solid #E20613",marginBottom:14}}/>
                <div style={{color:"#0B2748",fontSize:20,fontWeight:700}}>Iniciar Sesión</div>
                <div style={{color:"#999",fontSize:11,marginTop:4}}>
                  Mantenimiento y Maquinaria Agrícola — 2026
                </div>
              </div>
              <div style={{marginBottom:16}}>
                <div style={{color:"#555",fontSize:10,fontWeight:700,
                  textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>Usuario</div>
                <input style={{width:"100%",padding:"12px 14px",background:"#FAFAF8",
                  border:"1.5px solid rgba(0,0,0,.1)",borderRadius:10,color:"#111",fontSize:13,
                  outline:"none",fontFamily:"inherit",transition:"border .2s"}}
                  placeholder="nombre de usuario" value={u}
                  onFocus={e=>e.target.style.borderColor="#E20613"}
                  onBlur={e=>e.target.style.borderColor="rgba(0,0,0,.1)"}
                  onChange={e=>setU(e.target.value)} onKeyDown={e=>e.key==="Enter"&&attempt(u,p)}/>
              </div>
              <div style={{marginBottom:4}}>
                <div style={{color:"#555",fontSize:10,fontWeight:700,
                  textTransform:"uppercase",letterSpacing:.8,marginBottom:6}}>Contraseña</div>
                <input style={{width:"100%",padding:"12px 14px",background:"#FAFAF8",
                  border:"1.5px solid rgba(0,0,0,.1)",borderRadius:10,color:"#111",fontSize:13,
                  outline:"none",fontFamily:"inherit",transition:"border .2s"}}
                  type="password" placeholder="••••••••" value={p}
                  onFocus={e=>e.target.style.borderColor="#E20613"}
                  onBlur={e=>e.target.style.borderColor="rgba(0,0,0,.1)"}
                  onChange={e=>setP(e.target.value)} onKeyDown={e=>e.key==="Enter"&&attempt(u,p)}/>
              </div>
              {err&&<div style={{color:"#B91C1C",fontSize:12,textAlign:"center",
                margin:"12px 0",padding:"9px",background:"#FEE2E2",
                borderRadius:8,border:"1px solid #FCA5A5"}}>{err}</div>}
              <button onClick={()=>attempt(u,p)}
                onMouseEnter={e=>e.currentTarget.style.background="#B30410"}
                onMouseLeave={e=>e.currentTarget.style.background="#E20613"}
                style={{width:"100%",padding:"14px",background:"#E20613",color:"#fff",
                  border:"none",borderRadius:30,fontSize:14,fontWeight:700,cursor:"pointer",
                  marginTop:20,fontFamily:"inherit",letterSpacing:.5,
                  boxShadow:"0 6px 16px rgba(226,6,19,.35)",transition:"background .15s"}}>
                Ingresar →
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{background:"#E20613",padding:"10px 32px",display:"flex",
        alignItems:"center",justifyContent:"space-between"}}>
        <span style={{color:"rgba(255,255,255,.7)",fontSize:10}}>
          © 2026 Danper Trujillo S.A.C. · Todos los derechos reservados
        </span>
        <span style={{color:"rgba(255,255,255,.5)",fontSize:10}}>
          Mantenimiento y Maquinaria Agrícola
        </span>
      </div>
    </div>
  );
}
function FirmaCanvas({label, value, onChange}){
  const canvasRef = useRef(null);
  const drawing   = useRef(false);
  const lastPos   = useRef({x:0,y:0});
  const hasStroke = useRef(false);
  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    if(!value){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      hasStroke.current = false;
    }
  },[value]);
  const getPos = (e, canvas) => {
    const r = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  };
  const startDraw = (e) => {
    e.preventDefault();
    drawing.current = true;
    const canvas = canvasRef.current;
    const pos = getPos(e, canvas);
    lastPos.current = pos;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 1, 0, Math.PI*2);
    ctx.fillStyle = "#0B2748";
    ctx.fill();
  };
  const draw = (e) => {
    if(!drawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#0B2748";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
    hasStroke.current = true;
    onChange(canvas.toDataURL("image/png"));
  };
  const stopDraw = () => { drawing.current = false; };
  const clear = (e) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height);
    hasStroke.current = false;
    onChange(null);
  };
  return(
    <div style={{marginBottom:6}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5}}>
        <label style={{fontSize:11,fontWeight:600,color:C.txt2}}>{label}</label>
        {value&&(
          <button onClick={clear}
            style={{fontSize:10,color:C.txt3,background:"none",border:`1px solid ${C.bdr}`,
              borderRadius:5,padding:"2px 8px",cursor:"pointer",fontFamily:"inherit"}}>
            Limpiar
          </button>
        )}
      </div>
      <div style={{border:`2px dashed ${value?"#1D6FD8":C.bdr2}`,borderRadius:10,
        background:value?"#F0F7FF":"#FAFAFA",overflow:"hidden",position:"relative",
        transition:"border-color .2s,background .2s"}}>
        <canvas
          ref={canvasRef}
          width={340}
          height={90}
          style={{display:"block",width:"100%",height:90,touchAction:"none",cursor:"crosshair"}}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
        {!value&&(
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",
            justifyContent:"center",pointerEvents:"none"}}>
            <span style={{fontSize:11,color:C.txt3}}>✍ Firme aquí</span>
          </div>
        )}
      </div>
      <div style={{fontSize:9,color:C.txt3,marginTop:3,textAlign:"center"}}>
        {value?"✓ Firma capturada":"Trace su firma con el dedo o el mouse"}
      </div>
    </div>
  );
}
function AppAlmacenero({user,onLogout,maestros,vales,setVales}){
  const [tab,setTab]=useState("nuevo");
  const [toast,setToast]=useState({msg:""});
  const [candadoOk,setCandadoOk]=useState(null);       // null=sin verificar, true=OK, false=problema
  const [showCandadoModal,setShowCandadoModal]=useState(false);
  const [incidenteFoto,setIncidenteFoto]=useState(null);
  const [enviandoIncidente,setEnviandoIncidente]=useState(false);
  const [incidenteNota,setIncidenteNota]=useState("");
  const [incidenteEnviado,setIncidenteEnviado]=useState(false);
  const [tipoFiltro,setTipoFiltro]=useState("");
  const [form,setForm]=useState({
    fundo:"",equipoId:"",km:"",actividad:"",cultivo:"",
    almacenero:user.nombre||user.usuario,chofer:"",obs:"",
    producto:"",galones:"",
  });
  const [fotoMedidor,setFotoMedidor]=useState(null);
  const [showAlerta,setShowAlerta]=useState(false);
  const [alertaMsg,setAlertaMsg]=useState("");
  const [valeNum,setValeNum]=useState(1);

  const handleTipo=(t)=>{
    setTipoFiltro(t);
    setForm(f=>({...f,equipoId:"",producto:""}));
  };
  // Cargar el número de vale desde Firebase al iniciar
  useEffect(()=>{
    obtenerCounter().then(n=>{ if(n && n>0) setValeNum(n); }).catch(()=>{});
  },[]);

  const equipo=(maestros.equipos||[]).find(e=>e.id===form.equipoId);
  const ultimoKm = form.equipoId
    ? [...vales].reverse().find(v=>v.equipoId===form.equipoId&&v.km>0)?.km || null
    : null;
  const gl=parseFloat(form.galones)||0;
  const productosDisp=tipoFiltro
    ?(PRODUCTOS_POR_TIPO[tipoFiltro]||TODOS_PRODUCTOS)
    :TODOS_PRODUCTOS;
  const equiposFiltrados=tipoFiltro
    ?(maestros.equipos||[]).filter(e=>e.tipo===tipoFiltro)
    :(maestros.equipos||[]);
  const actObj = (maestros.actividades||[]).find(a=>a.nombre===form.actividad);
  const teoRatio = actObj?.ratio || null;
  const teoUnit  = actObj?.unit  || "Gl/Hr";
  const teoLabel = teoRatio ? `${teoRatio} ${teoUnit}` : "Sin referencia";
  useEffect(()=>{
    if(!teoRatio||!gl||!equipo){setShowAlerta(false);return;}
    const umbral=equipo.tipo==="TRACTOR"?teoRatio*10:teoRatio*5;
    if(gl>umbral*1.2){
      setShowAlerta(true);
      setAlertaMsg(`${gl.toFixed(1)} gl supera el umbral estimado de ${(umbral*1.2).toFixed(1)} gl · Ratio teórico: ${teoLabel}`);
    }else setShowAlerta(false);
  },[gl,teoRatio,equipo]);
  // Si cambia fundo o equipo, resetear candado (es otro contexto)
  useEffect(()=>{
    if(candadoOk !== null){
      setCandadoOk(null);
      setIncidenteNota("");
      setIncidenteFoto(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[form.fundo, form.equipoId]);
  const handleValeNumChange = async(n)=>{
    setValeNum(n);
    try{ await guardarCounter(n); }catch(e){ console.warn(e); }
  };
    const handleSubmit=async()=>{
    if(candadoOk===null){
      setToast({msg:"Debe verificar el estado del candado antes de despachar",type:"err"});return;
    }
    if(!form.fundo||!form.equipoId||!form.actividad||!form.chofer){
      setToast({msg:"Complete todos los campos obligatorios (*)",type:"err"});return;
    }
    if(!form.cultivo){
      setToast({msg:"Seleccione el cultivo (obligatorio)",type:"err"});return;
    }
    if(!form.producto){setToast({msg:"Seleccione un tipo de combustible",type:"err"});return;}
    if(gl<=0){setToast({msg:"Ingrese los galones despachados",type:"err"});return;}

    // Reservar N° de vale atómicamente
    let numeroReservado;
    try{
      numeroReservado = await reservarSiguienteVale();
    }catch(e){
      console.warn("Fallo reservarSiguienteVale:",e);
      numeroReservado = valeNum;
    }
    setValeNum(numeroReservado + 1);

    // Comprimir fotos (Firestore límite 1MB por documento)
    let fotoComprimida = fotoMedidor;
    if(fotoMedidor){
      try{ fotoComprimida = await comprimirImagen(fotoMedidor, 900, 0.7); }
      catch(e){ console.warn("No se pudo comprimir foto medidor:",e); }
    }
    let incidenteFotoComp = incidenteFoto;
    if(incidenteFoto){
      try{ incidenteFotoComp = await comprimirImagen(incidenteFoto, 900, 0.7); }
      catch(e){ console.warn("No se pudo comprimir foto incidente:",e); }
    }

    const now=new Date();
    const vale={
      id:numeroReservado,
      nVale:"V-"+String(numeroReservado).padStart(6,"0"),
      fecha:now.toISOString().slice(0,10),
      hora:now.toLocaleTimeString("es-PE",{hour:"2-digit",minute:"2-digit"}),
      fundo:form.fundo,
      equipoId:form.equipoId,
      equipoDen:equipo?.den||"",
      tipo:equipo?.tipo||tipoFiltro||"",
      placa:equipo?.placa||"",
      km:parseFloat(form.km)||0,
      actividad:form.actividad,
      cultivo:form.cultivo,
      producto:form.producto,
      gl,
      // Saneo: nunca undefined — Firestore rechaza doc completo si encuentra undefined
      teoRatio: teoRatio||null,
      teoUnit:  teoUnit||"Gl/Hr",
      actividadObj: actObj||null,
      kmAnterior: ultimoKm||null,
      diferencia: (()=>{
        const kma=parseFloat(form.km)||0;
        if(!ultimoKm || kma<=ultimoKm) return null;
        return kma-ultimoKm;
      })(),
      obs:form.obs||"",
      almacenero:form.almacenero||"",
      chofer:form.chofer,
      registradoPor:user.nombre||user.usuario||"",
      alertaEnviada:!!showAlerta,
      fotoMedidor:fotoComprimida||null,
      candadoOk:candadoOk,
      incidenteNota:candadoOk===false?(incidenteNota||""):"",
      incidenteFoto:candadoOk===false?(incidenteFotoComp||null):null,
    };
    const nuevos=[...vales,vale];
    try{
      await setVales(nuevos);
    }catch(e){
      // Rollback del contador para evitar huecos
      const liberado = await liberarVale(numeroReservado);
      if(liberado){
        setValeNum(numeroReservado);
        setToast({msg:"❌ Error al guardar: "+(e?.message||"red")+". N° "+("V-"+String(numeroReservado).padStart(6,"0"))+" liberado, reintente.",type:"err"});
      }else{
        setToast({msg:"❌ Error al guardar el vale "+("V-"+String(numeroReservado).padStart(6,"0"))+": "+(e?.message||"red"),type:"err"});
      }
      return;
    }
    setForm({fundo:"",equipoId:"",km:"",actividad:"",cultivo:"",almacenero:user.nombre||user.usuario,chofer:"",obs:"",producto:"",galones:""});
    setFotoMedidor(null);
    setTipoFiltro("");
    setCandadoOk(null);
    setIncidenteNota("");
    setIncidenteFoto(null);
    setIncidenteEnviado(false);
    setShowAlerta(false);
    setToast({msg:showAlerta?"✓ Vale registrado · ⚠ Alerta de exceso":"✓ Vale registrado",type:showAlerta?"warn":"ok"});
  };
  const sel={...S.inp,cursor:"pointer"};
  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"system-ui,sans-serif"}}>
      <style>{`*{box-sizing:border-box}select{-webkit-appearance:none}`}</style>
      
      <div style={{background:`linear-gradient(135deg,${C.navy},#163A78)`,padding:"10px 16px",
        display:"flex",alignItems:"center",gap:10,position:"sticky",top:0,zIndex:10}}>
        <img src={LOGO_SRC} alt="Danper" style={{width:36,height:36,borderRadius:"50%",objectFit:"cover",flexShrink:0,border:"2px solid rgba(255,255,255,.25)"}}/>
        <div>
          <div style={{color:"#fff",fontSize:14,fontWeight:600}}>Vale de Combustible</div>
          <div style={{color:"rgba(255,255,255,.55)",fontSize:11}}>{user.nombre||user.usuario}</div>
        </div>
        <button onClick={onLogout} style={{marginLeft:"auto",background:"rgba(255,255,255,.12)",
          border:"none",borderRadius:7,color:"#fff",padding:"6px 12px",fontSize:12,
          cursor:"pointer",fontFamily:"inherit"}}>Salir</button>
      </div>
      
      <div style={{display:"flex",gap:6,padding:"12px 14px 0"}}>
        {[["nuevo","+ Nuevo Vale"],["historial","Mis Registros"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{flex:1,padding:9,borderRadius:8,border:`1px solid ${C.bdr}`,
              background:tab===t?C.navy:C.surf,color:tab===t?"#fff":C.txt2,
              fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>
        ))}
      </div>
      <div style={{padding:14}}>
      {tab==="nuevo"?(
        <>
          {/* Modal de incidente */}
          {showCandadoModal&&(
            <>
              <div onClick={()=>setShowCandadoModal(false)}
                style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:300}}/>
              <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
                width:"min(420px,95vw)",background:"#fff",borderRadius:16,zIndex:301,
                boxShadow:"0 8px 40px rgba(0,0,0,.2)",overflow:"hidden"}}>
                <div style={{background:"#DC2626",padding:"14px 18px",display:"flex",
                  justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{color:"#fff",fontWeight:700,fontSize:14}}>⚠️ Reporte de incidente</div>
                  <button onClick={()=>setShowCandadoModal(false)}
                    style={{background:"none",border:"none",color:"#fff",fontSize:22,cursor:"pointer"}}>×</button>
                </div>
                <div style={{padding:18}}>
                  <div style={{background:"#FEF2F2",border:"1px solid #FCA5A5",borderRadius:8,
                    padding:"10px 12px",marginBottom:14,fontSize:12,color:"#7F1D1D"}}>
                    El tanque NO está correctamente protegido. Esto quedará registrado.
                  </div>
                  <div style={{marginBottom:12}}>
                    <label style={{fontSize:11,fontWeight:600,color:"#374151",display:"block",marginBottom:5}}>
                      Describe el problema
                    </label>
                    <textarea value={incidenteNota} onChange={e=>setIncidenteNota(e.target.value)}
                      placeholder="Ej: Candado roto, falta el candado, tapa no cierra..."
                      style={{width:"100%",padding:"8px 10px",border:"1.5px solid #E5E7EB",
                        borderRadius:8,fontSize:12,fontFamily:"inherit",resize:"none",
                        minHeight:72,outline:"none",boxSizing:"border-box"}}/>
                  </div>
                  <div style={{marginBottom:14}}>
                    <label style={{fontSize:11,fontWeight:600,color:"#374151",display:"block",marginBottom:5}}>
                      📸 Foto del problema (recomendado)
                    </label>
                    <div style={{border:`2px dashed ${incidenteFoto?"#DC2626":"#E5E7EB"}`,
                      borderRadius:10,overflow:"hidden",background:incidenteFoto?"#FEF2F2":"#FAFAFA"}}>
                      {incidenteFoto?(
                        <div style={{position:"relative"}}>
                          <img src={incidenteFoto} alt="incidente"
                            style={{width:"100%",maxHeight:150,objectFit:"cover",display:"block"}}/>
                          <button onClick={()=>setIncidenteFoto(null)}
                            style={{position:"absolute",top:6,right:6,background:"rgba(220,38,38,.9)",
                              color:"#fff",border:"none",borderRadius:6,padding:"3px 8px",
                              fontSize:10,cursor:"pointer",fontFamily:"inherit"}}>✕</button>
                        </div>
                      ):(
                        <label style={{display:"flex",flexDirection:"column",alignItems:"center",
                          justifyContent:"center",padding:"16px",cursor:"pointer",gap:6}}>
                          <span style={{fontSize:28}}>📷</span>
                          <span style={{fontSize:11,color:"#6B7280"}}>Tomar foto</span>
                          <input type="file" accept="image/*" capture="environment"
                            style={{display:"none"}}
                            onChange={e=>{
                              const file=e.target.files?.[0];
                              if(!file)return;
                              const reader=new FileReader();
                              reader.onload=ev=>setIncidenteFoto(ev.target.result);
                              reader.readAsDataURL(file);
                            }}/>
                        </label>
                      )}
                    </div>
                  </div>
                  <button
                    disabled={enviandoIncidente}
                    onClick={async()=>{
                    // Guarda anti-doble-clic: evita que un tap rápido o un re-render
                    // dispare la creación del incidente dos veces.
                    if(enviandoIncidente) return;
                    setEnviandoIncidente(true);
                    try{
                      let fotoComp = incidenteFoto;
                      if(incidenteFoto){
                        try{ fotoComp = await comprimirImagen(incidenteFoto, 900, 0.7); }
                        catch(e){ console.warn("No se pudo comprimir foto:",e); }
                      }
                      const inc={tipo:"CANDADO_PROBLEMA",
                        fecha:new Date().toISOString().slice(0,10),
                        hora:new Date().toLocaleTimeString("es-PE"),
                        almacenero:user.nombre||user.usuario||"",
                        fundo: form.fundo || "—",
                        equipoId: form.equipoId || "—",
                        equipoDen: equipo?.den || "—",
                        placa: equipo?.placa || "",
                        tipoEquipo: equipo?.tipo || tipoFiltro || "—",
                        nota:incidenteNota||"Sin descripción",
                        foto:fotoComp||null,
                        revisado:false,
                        timestamp:new Date().toISOString()};
                      await guardar("incidentes",Date.now().toString(),limpiarUndefined(inc));
                      setToast({msg:"⚠ Incidente reportado",type:"warn"});
                      setCandadoOk(false);
                      setShowCandadoModal(false);
                    }catch(e){
                      console.warn(e);
                      setToast({msg:"Error al reportar: "+e.message,type:"err"});
                    }finally{
                      setEnviandoIncidente(false);
                    }
                  }}
                  style={{width:"100%",padding:"12px",
                    background:enviandoIncidente?"#9CA3AF":"#DC2626",color:"#fff",
                    border:"none",borderRadius:10,fontSize:13,fontWeight:700,
                    cursor:enviandoIncidente?"wait":"pointer",fontFamily:"inherit",
                    opacity:enviandoIncidente?.7:1}}>
                    {enviandoIncidente?"Enviando...":"⚠️ Confirmar y reportar incidente"}
                  </button>
                  <div style={{fontSize:10,color:"#9CA3AF",textAlign:"center",marginTop:8}}>
                    Después de reportar podrás continuar con el despacho
                  </div>
                </div>
              </div>
            </>
          )}
          <div>
          <div style={S.card}>
            <div style={S.sec}>1 · Tipo de equipo</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>
              {TIPOS_EQUIPO.map(t=>(
                <button key={t} onClick={()=>handleTipo(tipoFiltro===t?"":t)}
                  style={{padding:"12px 8px",borderRadius:10,
                    border:`2px solid ${tipoFiltro===t?C.blue:C.bdr2}`,
                    background:tipoFiltro===t?"#EFF6FF":C.surf2,
                    color:tipoFiltro===t?C.blue:C.txt2,
                    fontWeight:tipoFiltro===t?700:400,fontSize:12,
                    cursor:"pointer",fontFamily:"inherit",textAlign:"center",
                    transition:"all .15s"}}>
                  <div style={{fontSize:22,marginBottom:4}}>{TIPO_ICO_MAP[t]}</div>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div style={S.card}>
            <div style={S.sec}>2 · Cabecera</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <div>
                <label style={S.lbl}>Fecha</label>
                <input style={{...S.inp,...S.ro}} value={new Date().toLocaleDateString("es-PE",{day:"2-digit",month:"2-digit",year:"numeric"})} readOnly/>
              </div>
              <div>
                <label style={S.lbl}>Hora</label>
                <input style={{...S.inp,...S.ro}} value={new Date().toLocaleTimeString("es-PE",{hour:"2-digit",minute:"2-digit"})} readOnly/>
              </div>
            </div>
            <div style={{marginBottom:10}}>
              <label style={S.lbl}>Fundo <span style={{color:"red"}}>*</span></label>
              <select style={sel} value={form.fundo} onChange={e=>setForm(f=>({...f,fundo:e.target.value}))}>
                <option value="">— Seleccionar —</option>
                {(maestros.fundos||[]).map(f=><option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div style={{marginBottom:10}}>
              <label style={S.lbl}>
                Equipo / Unidad <span style={{color:"red"}}>*</span>
                {tipoFiltro&&<span style={{color:C.blue,fontWeight:400,marginLeft:6}}>(filtrado: {tipoFiltro})</span>}
              </label>
              <select style={sel} value={form.equipoId} onChange={e=>setForm(f=>({...f,equipoId:e.target.value}))}>
                <option value="">— Seleccionar{tipoFiltro?` ${tipoFiltro}`:""} —</option>
                {equiposFiltrados.map(e=><option key={e.id} value={e.id}>{e.den}</option>)}
              </select>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
              <div>
                <label style={S.lbl}>Placa</label>
                <input style={{...S.inp,...S.ro}} value={equipo?.placa||""} readOnly/>
              </div>
              <div>
                <label style={S.lbl}>Tipo</label>
                <input style={{...S.inp,...S.ro}} value={equipo?.tipo||tipoFiltro||""} readOnly/>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div>
                <label style={S.lbl}>Km / Horómetro <span style={{color:"red"}}>*</span></label>
                <input style={{...S.inp,fontFamily:"monospace",textAlign:"right"}}
                  type="number" min="0"
                  placeholder={ultimoKm?"Último: "+ultimoKm:"0"}
                  value={form.km} onChange={e=>setForm(f=>({...f,km:e.target.value}))}/>
                {ultimoKm&&!form.km&&(
                  <div style={{fontSize:10,color:C.blue,marginTop:3,display:"flex",
                    alignItems:"center",justifyContent:"space-between"}}>
                    <span>📌 Último registrado: <strong>{ultimoKm.toLocaleString()}</strong></span>
                    <button onClick={()=>setForm(f=>({...f,km:String(ultimoKm)}))}
                      style={{fontSize:10,color:C.blue,background:"none",border:`1px solid ${C.blue}`,
                        borderRadius:4,padding:"1px 7px",cursor:"pointer",fontFamily:"inherit"}}>
                      Usar
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label style={S.lbl}>N° Vale</label>
                <input style={{...S.inp,...S.ro,fontFamily:"monospace"}}
                  value={"V-"+String(valeNum).padStart(6,"0")} readOnly/>
              </div>
            </div>
          </div>
          <div style={S.card}>
            <div style={S.sec}>3 · Actividad</div>
            <div style={{marginBottom:10}}>
              <label style={S.lbl}>Actividad <span style={{color:"red"}}>*</span></label>
              <select style={sel} value={form.actividad} onChange={e=>setForm(f=>({...f,actividad:e.target.value}))}>
                <option value="">— Seleccionar actividad —</option>
                {actividadesPorTipo(maestros.actividades, tipoFiltro).map(a=><option key={a.nombre} value={a.nombre}>{a.nombre}</option>)}
              </select>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <div>
                <label style={S.lbl}>Cultivo <span style={{color:"red"}}>*</span></label>
                <select style={sel} value={form.cultivo} onChange={e=>setForm(f=>({...f,cultivo:e.target.value}))}>
                  <option value="">— Seleccionar —</option>
                  {(maestros.cultivos||[]).map(c=><option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={S.lbl}>Consumo teórico</label>
                <input style={{...S.inp,...S.ro,fontFamily:"monospace"}} value={teoLabel} readOnly/>
              </div>
            </div>
          </div>
          <div style={S.card}>
            <div style={S.sec}>4 · Combustible</div>
            {(!form.fundo || !form.equipoId) && candadoOk===null && (
              <div style={{background:"#FEF3C7",border:"1px solid #F59E0B",borderRadius:10,
                padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:20}}>👉</span>
                <div style={{fontSize:12,color:"#78350F"}}>
                  Primero seleccione <b>fundo y equipo</b> arriba. Luego se le pedirá verificar el candado.
                </div>
              </div>
            )}
          {/* VERIFICACIÓN DE CANDADO */}
          {form.fundo && form.equipoId && candadoOk===null&&(
            <div style={{background:"#fff",border:`2px solid ${C.navy}`,borderRadius:14,
              padding:20,marginBottom:16,boxShadow:"0 2px 12px rgba(0,0,0,.08)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
                <span style={{fontSize:36}}>🔒</span>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:C.navy}}>Verificación de seguridad</div>
                  <div style={{fontSize:12,color:C.txt3}}>Obligatoria antes de despachar combustible</div>
                </div>
              </div>
              <div style={{fontSize:13,fontWeight:600,color:C.txt2,marginBottom:16,
                background:"#F8FAFC",borderRadius:10,padding:14,border:`1px solid ${C.bdr}`}}>
                ¿El tanque de combustible tiene la tapa y el candado en buen estado?
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                <button onClick={()=>setCandadoOk(true)}
                  style={{padding:"16px 10px",borderRadius:12,border:"2px solid #16A34A",
                    background:"#F0FDF4",color:"#166534",fontSize:13,fontWeight:700,
                    cursor:"pointer",fontFamily:"inherit",display:"flex",
                    flexDirection:"column",alignItems:"center",gap:6}}>
                  <span style={{fontSize:32}}>✅</span>
                  <div>Sí, todo correcto</div>
                  <div style={{fontSize:10,fontWeight:400}}>Tapa y candado OK</div>
                </button>
                <button onClick={()=>setShowCandadoModal(true)}
                  style={{padding:"16px 10px",borderRadius:12,border:"2px solid #DC2626",
                    background:"#FEF2F2",color:"#991B1B",fontSize:13,fontWeight:700,
                    cursor:"pointer",fontFamily:"inherit",display:"flex",
                    flexDirection:"column",alignItems:"center",gap:6}}>
                  <span style={{fontSize:32}}>⚠️</span>
                  <div>No, hay problema</div>
                  <div style={{fontSize:10,fontWeight:400}}>Reportar incidente</div>
                </button>
              </div>
            </div>
          )}
          {candadoOk===true&&(
            <div style={{background:"#F0FDF4",border:"1px solid #16A34A",borderRadius:10,
              padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",
              justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:20}}>🔒✅</span>
                <div style={{fontSize:12,fontWeight:700,color:"#166534"}}>Candado verificado — puede despachar</div>
              </div>
              <button onClick={()=>setCandadoOk(null)}
                style={{fontSize:10,color:C.txt3,background:"none",border:`1px solid ${C.bdr}`,
                  borderRadius:6,padding:"2px 8px",cursor:"pointer",fontFamily:"inherit"}}>
                Cambiar
              </button>
            </div>
          )}
          {candadoOk===false&&(
            <div style={{background:"#FEF2F2",border:"1px solid #DC2626",borderRadius:10,
              padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",
              justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:20}}>⚠️</span>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:"#991B1B"}}>Incidente reportado</div>
                  <div style={{fontSize:10,color:"#991B1B"}}>{incidenteNota||"Sin descripción"}</div>
                </div>
              </div>
              <button onClick={()=>{setCandadoOk(null);setIncidenteNota("");setIncidenteFoto(null);}}
                style={{fontSize:10,color:C.txt3,background:"none",border:`1px solid ${C.bdr}`,
                  borderRadius:6,padding:"2px 8px",cursor:"pointer",fontFamily:"inherit"}}>
                Cambiar
              </button>
            </div>
          )}
            <div style={{marginBottom:10}}>
              <label style={S.lbl}>Tipo de combustible <span style={{color:"red"}}>*</span></label>
              <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>
                {productosDisp.map(p=>(
                  <button key={p} onClick={()=>setForm(f=>({...f,producto:p}))}
                    style={{padding:"10px 8px",borderRadius:9,
                      border:`2px solid ${form.producto===p?C.blue:C.bdr2}`,
                      background:form.producto===p?"#EFF6FF":C.surf2,
                      color:form.producto===p?C.blue:C.txt2,
                      fontWeight:form.producto===p?700:400,fontSize:12,
                      cursor:"pointer",fontFamily:"inherit",
                      transition:"all .15s"}}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            {form.producto&&(
              <div>
                <label style={S.lbl}>Galones de {form.producto} <span style={{color:"red"}}>*</span></label>
                <div style={{display:"flex",alignItems:"center",gap:10,background:C.surf2,
                  borderRadius:10,padding:"12px 14px"}}>
                  <span style={{flex:1,fontSize:12,color:C.txt2,fontWeight:500}}>{form.producto}</span>
                  <input type="number" min="0" step="0.1" placeholder="0.0"
                    style={{width:100,padding:"8px 10px",border:`2px solid ${C.blue}`,
                      borderRadius:8,fontFamily:"monospace",fontSize:16,fontWeight:700,
                      color:C.navy,textAlign:"right",background:"#fff",outline:"none"}}
                    value={form.galones}
                    onChange={e=>setForm(f=>({...f,galones:e.target.value}))}/>
                  <span style={{fontSize:12,color:C.txt3,fontWeight:600}}>gl</span>
                </div>
              </div>
            )}
          </div>
          <div style={S.card}>
            <div style={S.sec}>5 · Responsables y firmas</div>
            
            <div style={{marginBottom:8,background:"#F0FDF4",border:"1px solid #BBF7D0",
              borderRadius:8,padding:"8px 12px",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:18}}>🧑‍🔧</span>
              <div>
                <div style={{fontSize:10,color:"#166534",fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>Almacenero / Grifero</div>
                <div style={{fontSize:13,fontWeight:700,color:"#166534"}}>{user.nombre||user.usuario}</div>
              </div>
            </div>
            
            <div style={{height:1,background:C.bdr,margin:"14px 0"}}/>
            
            <div style={{marginBottom:14}}>
              <label style={S.lbl}>Chofer / Operador de maquinaria <span style={{color:"red"}}>*</span></label>
              <select style={sel} value={form.chofer} onChange={e=>setForm(f=>({...f,chofer:e.target.value}))}>
                <option value="">— Seleccionar —</option>
                {(maestros.choferes||[])
                  .filter(c=>{
                    const tipo = typeof c==="object" ? c.tipo : "VEHICULO";
                    if(!tipoFiltro) return true;
                    if(tipoFiltro==="TRACTOR") return tipo==="TRACTOR";
                    return tipo==="VEHICULO";
                  })
                  .map(c=>{
                    const nm=typeof c==="object"?c.nombre:c;
                    return <option key={nm} value={nm}>{nm}</option>;
                  })}
              </select>
            </div>
            
            <div style={{height:1,background:C.bdr,margin:"14px 0"}}/>
            
            <div>
              <label style={S.lbl}>📸 Fotografía del medidor de combustible</label>
              <div style={{border:`2px dashed ${fotoMedidor?"#16A34A":C.bdr2}`,borderRadius:10,
                overflow:"hidden",background:fotoMedidor?"#F0FDF4":"#FAFAFA",
                transition:"all .2s",position:"relative"}}>
                {fotoMedidor ? (
                  <div style={{position:"relative"}}>
                    <img src={fotoMedidor} alt="medidor"
                      style={{width:"100%",maxHeight:200,objectFit:"cover",display:"block"}}/>
                    <button onClick={()=>setFotoMedidor(null)}
                      style={{position:"absolute",top:8,right:8,background:"rgba(220,38,38,.9)",
                        color:"#fff",border:"none",borderRadius:6,padding:"4px 10px",
                        fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
                      ✕ Retomar foto
                    </button>
                    <div style={{position:"absolute",bottom:8,left:8,background:"rgba(22,163,74,.9)",
                      color:"#fff",fontSize:10,fontWeight:600,padding:"3px 8px",borderRadius:5}}>
                      ✓ Foto capturada
                    </div>
                  </div>
                ) : (
                  <label style={{display:"flex",flexDirection:"column",alignItems:"center",
                    justifyContent:"center",padding:"24px 16px",cursor:"pointer",gap:8}}>
                    <span style={{fontSize:36}}>📷</span>
                    <span style={{fontSize:12,fontWeight:600,color:C.txt2}}>Tomar foto del medidor</span>
                    <span style={{fontSize:10,color:C.txt3}}>Se abrirá la cámara del dispositivo</span>
                    <input type="file" accept="image/*" capture="environment"
                      style={{display:"none"}}
                      onChange={e=>{
                        const file=e.target.files?.[0];
                        if(!file)return;
                        const reader=new FileReader();
                        reader.onload=ev=>setFotoMedidor(ev.target.result);
                        reader.readAsDataURL(file);
                      }}/>
                  </label>
                )}
              </div>
              <div style={{fontSize:9,color:C.txt3,marginTop:3,textAlign:"center"}}>
                {fotoMedidor?"✓ Foto del medidor capturada":"Requerido: fotografíe el marcador del horómetro / odómetro"}
              </div>
            </div>
          </div>
          {gl>0&&teoRatio&&equipo&&(()=>{
            const kmActual  = parseFloat(form.km)||0;
            // Solo calcular diferencia si hay registro anterior
            const tieneDif = ultimoKm && kmActual > ultimoKm;
            const diferencia = tieneDif ? kmActual - ultimoKm : 0;
            let glEsp = null;
            if(tieneDif && diferencia>0){
              if(equipo.tipo==="TRACTOR") glEsp=diferencia*teoRatio;
              else if(equipo.tipo==="CAMION"||equipo.tipo==="CISTERNA") glEsp=diferencia/teoRatio;
              else if(equipo.tipo==="MONTACARGAS") glEsp=diferencia*teoRatio;
            }
            if(!glEsp||!kmActual) return(
              <div style={{background:!ultimoKm&&kmActual?"#FEF9C3":"#F3F4F6",
                border:`1px solid ${!ultimoKm&&kmActual?"#F59E0B":"#E5E7EB"}`,
                borderRadius:12,padding:"12px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:20}}>{!ultimoKm&&kmActual?"🆕":"📊"}</span>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:!ultimoKm&&kmActual?"#92400E":C.txt2}}>
                    {!ultimoKm&&kmActual?"Primer registro de este equipo":"Consumo ingresado: "+(gl.toFixed(1))+" gl"}
                  </div>
                  <div style={{fontSize:10,color:!ultimoKm&&kmActual?"#B45309":C.txt3}}>
                    {!kmActual
                      ?"Ingrese el Km/Horómetro actual para calcular el rango"
                      :!ultimoKm
                        ?"Sin historial previo — este vale será la referencia base"
                        :"Se usará el valor ingresado como referencia directa"}
                  </div>
                </div>
              </div>
            );
            const desv = ((gl-glEsp)/glEsp)*100;
            const absDesv = Math.abs(desv);
            let estado, bg, border, ico, msg;
            if(absDesv<=5){
              estado="Dentro del rango"; bg="#DCFCE7"; border="#16A34A"; ico="✅"; 
              msg=`Consumo dentro del rango (±5%). Real: ${gl.toFixed(1)} gl · Esperado: ${glEsp.toFixed(1)} gl (${diferencia.toFixed(1)} ${teoUnit==="Gl/Hr"?"h":"km"} × ${teoRatio} ${teoUnit}) · Desviación: ${desv>=0?"+":""}${desv.toFixed(1)}%`;
            } else if(absDesv<=10){
              estado="Fuera parcialmente"; bg="#FEF3C7"; border="#D97706"; ico="⚠";
              msg=`Fuera de rango parcial (±10%). Real: ${gl.toFixed(1)} gl · Esperado: ${glEsp.toFixed(1)} gl (${diferencia.toFixed(1)} ${teoUnit==="Gl/Hr"?"h":"km"} × ${teoRatio} ${teoUnit}) · Desviación: ${desv>=0?"+":""}${desv.toFixed(1)}%`;
            } else {
              estado="Fuera de rango"; bg="#FEE2E2"; border="#DC2626"; ico="🚨";
              msg=`FUERA DE RANGO. Real: ${gl.toFixed(1)} gl · Esperado: ${glEsp.toFixed(1)} gl (${diferencia.toFixed(1)} ${teoUnit==="Gl/Hr"?"h":"km"} × ${teoRatio} ${teoUnit}) · Desviación: ${desv>=0?"+":""}${desv.toFixed(1)}%`;
            }
            const pct = Math.min(Math.abs(desv)/20*100, 100);
            const barColor = absDesv<=5?"#16A34A":absDesv<=10?"#D97706":"#DC2626";
            return(
              <div style={{background:bg,border:`2px solid ${border}`,borderRadius:12,
                padding:"12px 14px",marginBottom:12}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <span style={{fontSize:18}}>{ico}</span>
                  <span style={{fontSize:13,fontWeight:700,color:border}}>{estado}</span>
                  <span style={{marginLeft:"auto",fontSize:11,color:border,fontWeight:600}}>
                    {desv>=0?"+":""}{desv.toFixed(1)}%
                  </span>
                </div>
                
                <div style={{background:"rgba(0,0,0,.1)",borderRadius:4,height:6,marginBottom:8,overflow:"hidden"}}>
                  <div style={{width:pct+"%",height:"100%",background:barColor,
                    borderRadius:4,transition:"width .3s"}}/>
                </div>
                <div style={{fontSize:11,color:"rgba(0,0,0,.6)"}}>{msg}</div>
                {tieneDif&&(
                  <div style={{fontSize:10,color:"rgba(0,0,0,.45)",marginTop:4}}>
                    📌 Diferencia usada: {diferencia.toFixed(1)} {teoUnit==="Gl/Hr"?"h":"km"}
                    {" ("}actual: {kmActual.toLocaleString()} − último: {ultimoKm.toLocaleString()}{")"} 
                  </div>
                )}
                <div style={{display:"flex",gap:16,marginTop:8,fontSize:10,color:"rgba(0,0,0,.5)"}}>
                  <span>🟢 ±5% Normal</span>
                  <span>🟡 ±10% Alerta</span>
                  <span>🔴 &gt;10% Fuera</span>
                </div>
              </div>
            );
          })()}
          <button onClick={handleSubmit}
            style={{width:"100%",padding:14,background:`linear-gradient(135deg,${C.navy},${C.blue})`,
              color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:700,
              cursor:"pointer",fontFamily:"inherit",marginBottom:24}}>
            ✓ Registrar Vale
          </button>
          </div>{/* fin bloqueo candado */}
        </>
      ):(
        <div>
          {vales.filter(v=>(v.registradoPor===user.nombre||v.registradoPor===user.usuario)).length===0
            ?<p style={{textAlign:"center",color:C.txt3,padding:32}}>Sin registros aún.</p>
            :[...vales].filter(v=>(v.registradoPor===user.nombre||v.registradoPor===user.usuario)).reverse().map(v=>(
              <div key={v.id} style={S.card}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontWeight:700,fontSize:13,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v.equipoDen}</span>
                  <span style={{fontSize:10,color:C.txt3,fontFamily:"monospace",flexShrink:0,marginLeft:8}}>{v.fecha}</span>
                </div>
                <div style={{display:"flex",gap:5,marginBottom:6,flexWrap:"wrap"}}>
                  <span style={{fontSize:9,padding:"2px 7px",background:"#DBEAFE",color:"#1e3a8a",borderRadius:4,fontWeight:600}}>{v.fundo}</span>
                  <span style={{fontSize:9,padding:"2px 7px",background:C.surf2,color:C.txt2,borderRadius:4}}>{v.actividad}</span>
                  {v.alertaEnviada&&<Badge type="warn">⚠ Alerta</Badge>}
                </div>
                <div style={{fontSize:12,color:C.txt2}}>
                  <span style={{color:C.blue,fontWeight:700}}>{(v.gl||0).toFixed(1)} gl</span>
                  {" "+v.producto+" · "}{v.chofer}{" · #"+String(v.id).padStart(6,"0")}
                </div>
                {v.fotoMedidor&&(
                  <div style={{marginTop:8}}>
                    <div style={{fontSize:9,color:C.txt3,marginBottom:3}}>📸 Foto del medidor</div>
                    <img src={v.fotoMedidor} alt="medidor"
                      style={{width:"100%",maxHeight:80,border:`1px solid ${C.bdr}`,
                        borderRadius:6,objectFit:"cover"}}/>
                  </div>
                )}
              </div>
            ))
          }
        </div>
      )}
      </div>
      <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast({msg:""})}/>
    </div>
  );
}
function MantActividadesCard({maestros, setMaestros, setToast}){
  const [newAct,setNewAct]=useState({nombre:"",ratio:"",unit:"Gl/Hr",tipos:[]});
  const [editIdx,setEditIdx]=useState(null);
  const [editVal,setEditVal]=useState({});
  const acts=maestros.actividades||[];
  const TIPO_OPTS=["TRACTOR","CAMION","CISTERNA","MONTACARGAS"];
  const UNIT_OPTS=["Gl/Hr","Km/Gl"];
  const toggleTipo=(arr,t)=>arr.includes(t)?arr.filter(x=>x!==t):[...arr,t];
  const addAct=async()=>{
    if(!newAct.nombre||!newAct.ratio||newAct.tipos.length===0){
      setToast({msg:"Complete nombre, ratio y al menos un tipo",type:"err"});return;
    }
    if(acts.find(a=>a.nombre===newAct.nombre)){
      setToast({msg:"Ya existe una actividad con ese nombre",type:"err"});return;
    }
    const a={nombre:newAct.nombre,ratio:parseFloat(newAct.ratio),unit:newAct.unit,tipos:newAct.tipos};
    await setMaestros({...maestros,actividades:[...acts,a]});
    setNewAct({nombre:"",ratio:"",unit:"Gl/Hr",tipos:[]});
    setToast({msg:"✓ Actividad agregada",type:"ok"});
  };
  const delAct=async(idx)=>{
    const arr=[...acts]; arr.splice(idx,1);
    await setMaestros({...maestros,actividades:arr});
    setToast({msg:"Actividad eliminada"});
  };
  const startEdit=(i)=>{setEditIdx(i);setEditVal({...acts[i],ratio:String(acts[i].ratio)});};
  const saveEdit=async()=>{
    const arr=[...acts];
    arr[editIdx]={...editVal,ratio:parseFloat(editVal.ratio)};
    await setMaestros({...maestros,actividades:arr});
    setEditIdx(null);
    setToast({msg:"✓ Actividad actualizada",type:"ok"});
  };
  const inp2={padding:"5px 8px",border:`1.5px solid ${C.bdr}`,borderRadius:7,fontSize:11,fontFamily:"inherit",outline:"none",background:"#fff"};
  const TIPO_COLOR_MAP={TRACTOR:"#DBEAFE",CAMION:"#D1FAE5",CISTERNA:"#FEE2E2",MONTACARGAS:"#FEF9C3"};
  const TIPO_TEXT_MAP={TRACTOR:"#1e3a8a",CAMION:"#064e3b",CISTERNA:"#7f1d1d",MONTACARGAS:"#713f12"};
  return(
    <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16,
      boxShadow:"0 1px 3px rgba(0,0,0,.06)",gridColumn:"1 / -1"}}>
      <div style={{fontSize:13,fontWeight:700,marginBottom:12}}>
        ⚙ Actividades y ratios de consumo
        <span style={{fontSize:11,color:C.txt3,fontWeight:400,marginLeft:8}}>({acts.length} actividades)</span>
      </div>
      
      <div style={{overflowX:"auto",maxHeight:300,overflowY:"auto",marginBottom:14,borderRadius:8,border:`1px solid ${C.bdr}`}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
          <thead style={{position:"sticky",top:0}}>
            <tr style={{background:C.surf2,borderBottom:`1px solid ${C.bdr}`}}>
              {["Actividad","Ratio","Unidad","Aplica a",""].map(h=>(
                <th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {acts.map((a,i)=>(
              <tr key={a.nombre} style={{borderBottom:`0.5px solid ${C.bdr}`,background:i%2===0?"#fff":C.surf2}}>
                {editIdx===i?(
                  <>
                    <td style={{padding:"6px 8px"}}>
                      <input value={editVal.nombre} onChange={e=>setEditVal(v=>({...v,nombre:e.target.value}))}
                        style={{...inp2,width:"100%"}}/>
                    </td>
                    <td style={{padding:"6px 8px"}}>
                      <input type="number" step="0.1" value={editVal.ratio} onChange={e=>setEditVal(v=>({...v,ratio:e.target.value}))}
                        style={{...inp2,width:65,textAlign:"right",fontFamily:"monospace",fontWeight:700}}/>
                    </td>
                    <td style={{padding:"6px 8px"}}>
                      <select value={editVal.unit} onChange={e=>setEditVal(v=>({...v,unit:e.target.value}))}
                        style={{...inp2,WebkitAppearance:"none"}}>
                        {UNIT_OPTS.map(u=><option key={u} value={u}>{u}</option>)}
                      </select>
                    </td>
                    <td style={{padding:"6px 8px"}}>
                      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                        {TIPO_OPTS.map(t=>(
                          <button key={t} onClick={()=>setEditVal(v=>({...v,tipos:toggleTipo(v.tipos||[],t)}))}
                            style={{fontSize:9,padding:"2px 6px",borderRadius:4,border:"none",cursor:"pointer",
                              background:(editVal.tipos||[]).includes(t)?TIPO_COLOR_MAP[t]:"#eee",
                              color:(editVal.tipos||[]).includes(t)?TIPO_TEXT_MAP[t]:"#999",fontWeight:700}}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td style={{padding:"6px 8px"}}>
                      <div style={{display:"flex",gap:4}}>
                        <button onClick={saveEdit} style={{fontSize:10,padding:"3px 8px",borderRadius:5,background:C.ok,color:"#fff",border:"none",cursor:"pointer"}}>✓</button>
                        <button onClick={()=>setEditIdx(null)} style={{fontSize:10,padding:"3px 8px",borderRadius:5,background:"#EDEAE4",color:C.txt2,border:"none",cursor:"pointer"}}>✕</button>
                      </div>
                    </td>
                  </>
                ):(
                  <>
                    <td style={{padding:"6px 10px",fontWeight:500,maxWidth:200}}>{a.nombre}</td>
                    <td style={{padding:"6px 10px",fontFamily:"monospace",fontWeight:700,color:C.navy,textAlign:"right"}}>{a.ratio}</td>
                    <td style={{padding:"6px 10px",color:C.txt3}}>{a.unit}</td>
                    <td style={{padding:"6px 10px"}}>
                      <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                        {(a.tipos||[]).map(t=>(
                          <span key={t} style={{fontSize:9,padding:"1px 5px",borderRadius:3,
                            background:TIPO_COLOR_MAP[t],color:TIPO_TEXT_MAP[t],fontWeight:700}}>{t}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{padding:"6px 8px"}}>
                      <div style={{display:"flex",gap:4}}>
                        <button onClick={()=>startEdit(i)} style={{fontSize:10,padding:"3px 8px",borderRadius:5,border:`1px solid ${C.bdr}`,background:C.surf2,color:C.txt2,cursor:"pointer"}}>✎</button>
                        <button onClick={()=>delAct(i)} style={{fontSize:10,padding:"3px 8px",borderRadius:5,border:"none",background:C.critBg,color:C.crit,cursor:"pointer"}}>✕</button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{background:C.surf2,borderRadius:10,padding:12}}>
        <div style={{fontSize:11,fontWeight:600,color:C.txt2,marginBottom:10}}>+ Nueva actividad</div>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:8,marginBottom:8}}>
          <div>
            <label style={{fontSize:10,color:C.txt3,display:"block",marginBottom:3}}>Nombre de la actividad</label>
            <input placeholder="ej. Chapodo Mecanizado - Rotativa" value={newAct.nombre}
              onChange={e=>setNewAct(a=>({...a,nombre:e.target.value}))}
              style={{...inp2,width:"100%"}}/>
          </div>
          <div>
            <label style={{fontSize:10,color:C.txt3,display:"block",marginBottom:3}}>Ratio</label>
            <input type="number" step="0.1" placeholder="2.5" value={newAct.ratio}
              onChange={e=>setNewAct(a=>({...a,ratio:e.target.value}))}
              style={{...inp2,width:"100%",textAlign:"right",fontFamily:"monospace",fontWeight:700}}/>
          </div>
          <div>
            <label style={{fontSize:10,color:C.txt3,display:"block",marginBottom:3}}>Unidad</label>
            <select value={newAct.unit} onChange={e=>setNewAct(a=>({...a,unit:e.target.value}))}
              style={{...inp2,width:"100%",WebkitAppearance:"none"}}>
              {UNIT_OPTS.map(u=><option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <div style={{marginBottom:10}}>
          <label style={{fontSize:10,color:C.txt3,display:"block",marginBottom:5}}>Aplica a (seleccionar al menos uno)</label>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {TIPO_OPTS.map(t=>(
              <button key={t} onClick={()=>setNewAct(a=>({...a,tipos:toggleTipo(a.tipos,t)}))}
                style={{padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:600,cursor:"pointer",
                  border:`2px solid ${newAct.tipos.includes(t)?TIPO_COLOR_MAP[t]:C.bdr}`,
                  background:newAct.tipos.includes(t)?TIPO_COLOR_MAP[t]:C.surf,
                  color:newAct.tipos.includes(t)?TIPO_TEXT_MAP[t]:C.txt3,
                  transition:"all .15s"}}>
                {TIPO_ICO_MAP[t]} {t}
              </button>
            ))}
          </div>
        </div>
        <button onClick={addAct}
          style={{padding:"7px 16px",background:`linear-gradient(135deg,${C.navy},${C.blue})`,
            color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:600,
            cursor:"pointer",fontFamily:"inherit"}}>
          + Agregar actividad
        </button>
      </div>
    </div>
  );
}
function MantChoferesCard({maestros, setMaestros, setToast}){
  const [newCh,setNewCh]=useState({nombre:"",tipo:"TRACTOR"});
  const choferes=maestros.choferes||[];
  const addCh=async()=>{
    if(!newCh.nombre.trim()){setToast({msg:"Ingrese el nombre",type:"err"});return;}
    const nm=newCh.nombre.trim();
    if(choferes.find(c=>(typeof c==="object"?c.nombre:c)===nm)){
      setToast({msg:"Ya existe",type:"err"});return;
    }
    const upd={...maestros,choferes:[...choferes,{nombre:nm,tipo:newCh.tipo}]};
    await setMaestros(upd);
    setNewCh({nombre:"",tipo:"TRACTOR"});
    setToast({msg:"✓ Agregado",type:"ok"});
  };
  const delCh=async(i)=>{
    const arr=[...choferes]; arr.splice(i,1);
    await setMaestros({...maestros,choferes:arr});
    setToast({msg:"Eliminado"});
  };
  const inp2={padding:"6px 9px",border:`1.5px solid ${C.bdr}`,borderRadius:7,
    fontSize:12,fontFamily:"inherit",outline:"none",background:"#fff"};
  return(
    <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:12,
      padding:16,boxShadow:"0 1px 3px rgba(0,0,0,.06)"}}>
      <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>
        👤 Choferes / Operadores
        <span style={{fontSize:11,color:C.txt3,fontWeight:400,marginLeft:8}}>({choferes.length})</span>
      </div>
      
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,
          background:"#DBEAFE",color:"#1e3a8a",fontWeight:600}}>🚜 Operador maquinaria</span>
        <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,
          background:"#D1FAE5",color:"#064e3b",fontWeight:600}}>🚛 Conductor vehículo</span>
      </div>
      <div style={{maxHeight:200,overflowY:"auto",marginBottom:10}}>
        {choferes.map((c,i)=>{
          const nm=typeof c==="object"?c.nombre:c;
          const tp=typeof c==="object"?c.tipo:"VEHICULO";
          return(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,
              padding:"5px 4px",borderRadius:6}}>
              <span style={{fontSize:10,padding:"1px 6px",borderRadius:10,flexShrink:0,
                background:tp==="TRACTOR"?"#DBEAFE":"#D1FAE5",
                color:tp==="TRACTOR"?"#1e3a8a":"#064e3b",fontWeight:600}}>
                {tp==="TRACTOR"?"🚜 Tractor":"🚛 Vehículo"}
              </span>
              <span style={{flex:1,fontSize:12}}>{nm}</span>
              <button onClick={()=>delCh(i)} style={{background:"none",border:"none",
                color:C.txt3,cursor:"pointer",fontSize:16,padding:"0 4px",lineHeight:1}}>×</button>
            </div>
          );
        })}
        {choferes.length===0&&<p style={{color:C.txt3,fontSize:11}}>Sin registros</p>}
      </div>
      <div style={{display:"flex",gap:6}}>
        <input placeholder="Nombre completo" value={newCh.nombre}
          onChange={e=>setNewCh(x=>({...x,nombre:e.target.value}))}
          onKeyDown={e=>e.key==="Enter"&&addCh()}
          style={{flex:2,...inp2}}/>
        <select value={newCh.tipo} onChange={e=>setNewCh(x=>({...x,tipo:e.target.value}))}
          style={{flex:1,...inp2,WebkitAppearance:"none"}}>
          <option value="TRACTOR">🚜 Tractor</option>
          <option value="VEHICULO">🚛 Vehículo</option>
        </select>
        <button onClick={addCh} style={{padding:"6px 12px",background:C.blue,color:"#fff",
          border:"none",borderRadius:7,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
          + Agregar
        </button>
      </div>
    </div>
  );
}

function DrawerDetalle({drawer,setDrawer,drawerTab,setDrawerTab,vales,maestros}){
  if(!drawer)return null;
  const allD=buildUnified(vales);
  const hist=allD.filter(r=>r.id===drawer.id).sort((a,b)=>(a.fe||"").localeCompare(b.fe||""));
  const appVales=vales.filter(v=>v.equipoId===drawer.id).sort((a,b)=>(a.fecha||"").localeCompare(b.fecha||""));
  const totGl=hist.reduce((s,r)=>s+(r.gl_real||0),0);
  const excRows=hist.filter(r=>r.af==="exceso");
  const defRows=hist.filter(r=>r.af==="deficit");
  const normRows=hist.filter(r=>!r.af);
  const TL={T:"TRACTOR",C:"CAMIÓN",I:"CISTERNA"};
  const grafData=hist.slice(-20);
  const maxGl=Math.max(...grafData.map(r=>Math.max(r.gl_real||0,r.gl_esp||0)),1);
  const barW=Math.max(8,Math.floor(560/Math.max(grafData.length,1))-3);
  return(
    <>
      
      <div onClick={()=>setDrawer(null)}
        style={{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",zIndex:200,
          backdropFilter:"blur(2px)",animation:"fadeIn .2s ease"}}/>
      
      <div style={{position:"fixed",top:0,right:0,bottom:0,width:"min(680px,95vw)",
        background:C.surf,zIndex:201,display:"flex",flexDirection:"column",
        boxShadow:"-4px 0 32px rgba(0,0,0,.18)",animation:"slideIn .25s ease"}}>
<style>{CSS_DRAWER}</style>
        
        <div style={{background:`linear-gradient(135deg,${C.navy},#163A78)`,
          padding:"16px 20px",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12}}>
            <div style={{flex:1,paddingRight:16}}>
              <div style={{color:"rgba(255,255,255,.5)",fontSize:10,textTransform:"uppercase",
                letterSpacing:1,marginBottom:4}}>{TL[drawer.tipo]||drawer.tipo}</div>
              <div style={{color:"#fff",fontSize:17,fontWeight:700,lineHeight:1.2}}>
                {drawer.den}
              </div>
            </div>
            <button onClick={()=>setDrawer(null)}
              style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",
                borderRadius:8,width:34,height:34,display:"grid",placeItems:"center",
                cursor:"pointer",fontSize:18,flexShrink:0}}>×</button>
          </div>
          
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
            {[
              {l:"Registros",v:hist.length,c:"#93C5FD"},
              {l:"Galones Σ",v:totGl.toFixed(1)+" gl",c:"#fff"},
              {l:"Excesos",v:excRows.length,c:"#FCA5A5"},
              {l:"Déficits",v:defRows.length,c:"#93C5FD"},
            ].map(s=>(
              <div key={s.l} style={{background:"rgba(255,255,255,.08)",borderRadius:8,padding:"8px 10px"}}>
                <div style={{fontSize:9,color:"rgba(255,255,255,.5)",textTransform:"uppercase",
                  letterSpacing:.5,marginBottom:3}}>{s.l}</div>
                <div style={{fontSize:16,fontWeight:700,color:s.c}}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{display:"flex",gap:4,padding:"10px 20px 0",borderBottom:`1px solid ${C.bdr}`,
          flexShrink:0,background:C.surf2}}>
          {[["hist","📋 Historial"],["grafico","📊 Gráfico"],["app","📱 Vales app"]].map(([k,l])=>(
            <button key={k} onClick={()=>setDrawerTab(k)}
              style={{padding:"7px 14px",borderRadius:"8px 8px 0 0",border:"none",
                background:drawerTab===k?C.surf:"transparent",
                color:drawerTab===k?C.navy:C.txt3,
                fontSize:12,fontWeight:drawerTab===k?700:400,
                cursor:"pointer",fontFamily:"inherit",
                borderBottom:drawerTab===k?`2px solid ${C.blue}`:"2px solid transparent",
                transition:"all .15s"}}>
              {l}
            </button>
          ))}
        </div>
        
        <div style={{flex:1,overflowY:"auto",padding:"16px 20px"}}>
          
          {drawerTab==="hist"&&(
            <>
              
              {excRows.length>0&&(
                <div style={{background:"#FEF3C7",border:"1px solid #F59E0B",borderRadius:10,
                  padding:"10px 14px",marginBottom:12,display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{fontSize:20}}>⚠</span>
                  <div>
                    <div style={{fontWeight:700,fontSize:12,color:"#92400E"}}>{excRows.length} registros con exceso de consumo</div>
                    <div style={{fontSize:11,color:"#B45309"}}>Mayor: +{Math.max(...excRows.map(r=>r.diff||0)).toFixed(1)} gl · Acumulado: +{excRows.reduce((s,r)=>s+(r.diff||0),0).toFixed(1)} gl</div>
                  </div>
                </div>
              )}
              {defRows.length>0&&(
                <div style={{background:"#E0F2FE",border:"1px solid #0369A1",borderRadius:10,
                  padding:"10px 14px",marginBottom:12,display:"flex",gap:10,alignItems:"center"}}>
                  <span style={{fontSize:20}}>⬇</span>
                  <div>
                    <div style={{fontWeight:700,fontSize:12,color:"#0369A1"}}>{defRows.length} registros con déficit de consumo</div>
                    <div style={{fontSize:11,color:"#0369A1"}}>Acumulado: {defRows.reduce((s,r)=>s+(r.diff||0),0).toFixed(1)} gl</div>
                  </div>
                </div>
              )}
              
              <div style={{fontSize:11,fontWeight:700,color:C.txt2,marginBottom:8}}>
                Registro cronológico — {hist.length} entradas (histórico + app)
              </div>
              {hist.map((r,i)=>{
                const afBg=r.af==="exceso"?"#FEF3C7":r.af==="deficit"?"#E0F2FE":"#fff";
                const afBdr=r.af==="exceso"?"#F59E0B":r.af==="deficit"?"#0369A1":"#E5E7EB";
                const afColor=r.af==="exceso"?C.warn:r.af==="deficit"?C.def_:C.ok;
                return(
                  <div key={i} style={{border:`1px solid ${afBdr}`,borderRadius:10,
                    background:afBg,padding:"10px 14px",marginBottom:8,
                    borderLeft:`4px solid ${afColor}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontFamily:"monospace",fontSize:11,color:C.txt3}}>{r.fe}</span>
                        <span style={{fontSize:9,padding:"1px 6px",borderRadius:10,fontWeight:700,
                          background:r.fuente==="app"?"#DBEAFE":"#F3F4F6",
                          color:r.fuente==="app"?"#1e40af":"#6B7280"}}>
                          {r.fuente==="app"?"App":"Histórico"}
                        </span>
                        {r.nVale&&r.nVale!=="—"&&<span style={{fontSize:9,color:C.txt3}}>{r.nVale}</span>}
                      </div>
                      <div style={{textAlign:"right"}}>
                        {r.af==="exceso"&&<span style={{fontSize:11,fontWeight:700,color:C.warn}}>⬆ Exceso</span>}
                        {r.af==="deficit"&&<span style={{fontSize:11,fontWeight:700,color:C.def_}}>⬇ Déficit</span>}
                        {!r.af&&<span style={{fontSize:11,fontWeight:600,color:C.ok}}>✓ Normal</span>}
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                      <div style={{background:"rgba(255,255,255,.7)",borderRadius:6,padding:"6px 8px"}}>
                        <div style={{fontSize:9,color:C.txt3,marginBottom:2}}>Galones reales</div>
                        <div style={{fontSize:14,fontWeight:700,color:C.blue}}>{(r.gl_real||r.gl)?.toFixed(1)} gl</div>
                      </div>
                      <div style={{background:"rgba(255,255,255,.7)",borderRadius:6,padding:"6px 8px"}}>
                        <div style={{fontSize:9,color:C.txt3,marginBottom:2}}>Galones esperados</div>
                        <div style={{fontSize:13,fontWeight:600,color:C.txt2}}>{r.gl_esp!=null?r.gl_esp.toFixed(1)+" gl":"—"}</div>
                      </div>
                      <div style={{background:"rgba(255,255,255,.7)",borderRadius:6,padding:"6px 8px"}}>
                        <div style={{fontSize:9,color:C.txt3,marginBottom:2}}>Diferencia</div>
                        <div style={{fontSize:13,fontWeight:700,color:afColor}}>{r.diff!=null?(r.diff>0?"+":"")+r.diff.toFixed(1)+" gl":"—"}</div>
                      </div>
                    </div>
                    {(r.fu||r.ac?.length)&&(
                      <div style={{marginTop:6,fontSize:10,color:C.txt3}}>
                        {r.fu&&<span>📍 {r.fu}</span>}
                        {r.ac?.length&&<span style={{marginLeft:8}}>⚙ {(r.ac||[]).join(", ")}</span>}
                        {r.chofer&&<span style={{marginLeft:8}}>👤 {r.chofer}</span>}
                        {(r.aprobado===true)&&<span style={{marginLeft:8,color:C.ok,fontWeight:600}}>✅ Aprobado</span>}
                        {(r.rechazado===true)&&<span style={{marginLeft:8,color:C.crit,fontWeight:600}}>✕ Rechazado</span>}
                        {(r.aprobado===false&&r.rechazado===false&&r.fuente==="app")&&<span style={{marginLeft:8,color:C.warn,fontWeight:600}}>⏳ Pendiente</span>}
                      </div>
                    )}
                  </div>
                );
              })}
              {hist.length===0&&<p style={{textAlign:"center",color:C.txt3,padding:32}}>Sin registros históricos para este equipo.</p>}
            </>
          )}
          
          {drawerTab==="grafico"&&(
            <>
              <div style={{fontSize:11,fontWeight:700,color:C.txt2,marginBottom:12}}>
                Consumo real vs esperado — últimos {grafData.length} registros
              </div>
              {grafData.length===0
                ?<p style={{textAlign:"center",color:C.txt3,padding:32}}>Sin datos para graficar.</p>
                :(()=>{
                  const svgH=160;
                  const svgW=Math.max(grafData.length*(barW+3)+40,400);
                  return(
                    <div style={{background:C.surf2,borderRadius:12,padding:"16px 12px",marginBottom:16,overflowX:"auto"}}>
                      <svg width={svgW} height={svgH+50} style={{display:"block"}}>
                        
                        {[0,.25,.5,.75,1].map(pct=>{
                          const y=Math.round(svgH-pct*svgH)+14;
                          const val=(pct*maxGl).toFixed(1);
                          return(<g key={pct}>
                            <line x1={30} y1={y} x2={svgW-8} y2={y} stroke={C.bdr} strokeWidth={1}/>
                            <text x={28} y={y+4} fontSize={8} fill={C.txt3} textAnchor="end">{val}</text>
                          </g>);
                        })}
                        
                        {grafData.map((r,i)=>{
                          const x=32+i*(barW+3);
                          const hReal=Math.round(((r.gl_real||r.gl||0)/maxGl)*svgH);
                          const hEsp=r.gl_esp?Math.round((r.gl_esp/maxGl)*svgH):0;
                          const barColor=r.af==="exceso"?"#F59E0B":r.af==="deficit"?"#60A5FA":"#34D399";
                          return(<g key={i}>
                            
                            {hEsp>0&&<rect x={x} y={svgH-hEsp+14} width={barW} height={hEsp}
                              fill="#E5E7EB" rx={2}/>}
                            
                            <rect x={x} y={svgH-hReal+14} width={barW} height={hReal}
                              fill={barColor} rx={2} opacity={.85}/>
                            
                            <text x={x+barW/2} y={svgH+22} fontSize={7} fill={C.txt3}
                              textAnchor="middle" transform={`rotate(-45,${x+barW/2},${svgH+22})`}>
                              {r.fe?.slice(5)}
                            </text>
                          </g>);
                        })}
                      </svg>
                      <div style={{display:"flex",gap:16,marginTop:4,flexWrap:"wrap"}}>
                        {[["#34D399","Normal"],["#F59E0B","Exceso"],["#60A5FA","Déficit"],["#E5E7EB","Esperado"]].map(([c,l])=>(
                          <div key={l} style={{display:"flex",alignItems:"center",gap:5,fontSize:10,color:C.txt3}}>
                            <div style={{width:10,height:10,background:c,borderRadius:2}}/>
                            {l}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()
              }
              
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[
                  {l:"Consumo promedio",v:(totGl/Math.max(hist.length,1)).toFixed(1)+" gl/día",bg:"#EFF6FF",c:C.blue},
                  {l:"Máximo en un día",v:Math.max(...hist.map(r=>r.gl_real||r.gl||0)).toFixed(1)+" gl",bg:"#FEF3C7",c:C.warn},
                  {l:"Exceso acumulado",v:"+"+excRows.reduce((s,r)=>s+(r.diff||0),0).toFixed(1)+" gl",bg:"#FEF3C7",c:C.warn},
                  {l:"Tasa de anomalías",v:Math.round((excRows.length+defRows.length)/Math.max(hist.length,1)*100)+"%",bg:"#F5F3FF",c:C.exc},
                ].map(s=>(
                  <div key={s.l} style={{background:s.bg,borderRadius:10,padding:"12px 14px"}}>
                    <div style={{fontSize:10,color:s.c,fontWeight:600,marginBottom:4}}>{s.l}</div>
                    <div style={{fontSize:20,fontWeight:700,color:s.c}}>{s.v}</div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {drawerTab==="app"&&(
            <>
              <div style={{fontSize:11,fontWeight:700,color:C.txt2,marginBottom:12}}>
                Vales registrados en la app — {appVales.length} registros
              </div>
              {appVales.length===0
                ?<p style={{textAlign:"center",color:C.txt3,padding:32}}>Sin vales de la app para este equipo.</p>
                :appVales.map((v,i)=>{
                  const tienePrevio = v.kmAnterior && v.kmAnterior > 0;
                  const dif = (tienePrevio && v.diferencia && v.diferencia>0) ? v.diferencia : 0;
                  const glEsp=v.teoRatio&&dif?(v.teoUnit==="Km/Gl"?dif/v.teoRatio:dif*v.teoRatio):null;
                  const diff=glEsp?v.gl-glEsp:null;
                  const desvPct=glEsp?((v.gl-glEsp)/glEsp*100):null;
                  const absDesv=desvPct!=null?Math.abs(desvPct):null;
                  const rc=absDesv==null?"#f9f9f9":absDesv<=5?"#F0FDF4":absDesv<=10?"#FEF9C3":"#FEF2F2";
                  const cc=absDesv==null?C.txt3:absDesv<=5?C.ok:absDesv<=10?C.warn:C.crit;
                  return(
                    <div key={i} style={{border:`1px solid ${C.bdr}`,borderRadius:10,
                      background:rc,padding:"12px 14px",marginBottom:8}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                        <div>
                          <span style={{fontFamily:"monospace",fontSize:11,fontWeight:600}}>{v.nVale}</span>
                          <span style={{color:C.txt3,fontSize:11,marginLeft:8}}>{v.fecha} {v.hora}</span>
                        </div>
                        <div>
                          {v.aprobado?<span style={{color:C.ok,fontSize:11,fontWeight:700}}>✅</span>:
                           v.rechazado?<span style={{color:C.crit,fontSize:11,fontWeight:700}}>✕</span>:
                           <span style={{color:C.warn,fontSize:11,fontWeight:700}}>⏳</span>}
                        </div>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:6}}>
                        <div style={{background:"rgba(255,255,255,.7)",borderRadius:6,padding:"5px 8px"}}>
                          <div style={{fontSize:9,color:C.txt3,marginBottom:1}}>Galones</div>
                          <div style={{fontSize:13,fontWeight:700,color:C.blue}}>{v.gl?.toFixed(1)} gl</div>
                        </div>
                        <div style={{background:"rgba(255,255,255,.7)",borderRadius:6,padding:"5px 8px"}}>
                          <div style={{fontSize:9,color:C.txt3,marginBottom:1}}>Esperado</div>
                          <div style={{fontSize:12,fontWeight:600,color:C.txt2}}>{glEsp?glEsp.toFixed(1)+" gl":"—"}</div>
                        </div>
                        <div style={{background:"rgba(255,255,255,.7)",borderRadius:6,padding:"5px 8px"}}>
                          <div style={{fontSize:9,color:C.txt3,marginBottom:1}}>Desviación</div>
                          <div style={{fontSize:12,fontWeight:700,color:cc}}>{desvPct!=null?(desvPct>=0?"+":"")+desvPct.toFixed(1)+"%":"—"}</div>
                        </div>
                      </div>
                      <div style={{fontSize:10,color:C.txt3}}>
                        ⚙ {v.actividad} · 📍 {v.fundo} · 👤 {v.chofer}
                      </div>
                      {v.obs&&<div style={{fontSize:10,color:C.txt2,marginTop:4,fontStyle:"italic"}}>"{v.obs}"</div>}
                      {v.fotoMedidor&&(
                      <div style={{marginTop:8}}>
                        <div style={{fontSize:9,color:C.txt3,marginBottom:3,display:"flex",justifyContent:"space-between"}}>
                          <span>📸 Foto del medidor</span>
                          <button onClick={e=>{e.stopPropagation();verImagenAmpliada(v.fotoMedidor);}}
                            style={{fontSize:9,color:C.blue,background:"none",border:`1px solid ${C.blue}`,borderRadius:4,padding:"1px 6px",cursor:"pointer",fontFamily:"inherit"}}>
                            🔍 Ampliar
                          </button>
                        </div>
                        <img src={v.fotoMedidor} alt="medidor"
                          onClick={e=>{e.stopPropagation();verImagenAmpliada(v.fotoMedidor);}}
                          style={{width:"100%",maxHeight:80,objectFit:"cover",borderRadius:6,
                            border:`1px solid ${C.bdr}`,cursor:"zoom-in"}}/>
                      </div>
                    )}
                    </div>
                  );
                })
              }
            </>
          )}
        </div>
      </div>
    </>
  );
};
function DashboardPlanner({user,onLogout,maestros,setMaestros,vales,users,setUsers,recargarDatos}){
  const [view,setView]=useState("resumen");
  const [toast,setToast]=useState({msg:""});
    const [eqInput,setEqInput]=useState({den:"",tipo:"TRACTOR",placa:""});
  const [newUser,setNewUser]=useState({usuario:"",pass:"",nombre:"",rol:"alm",cultivos:[]});
  const [drawer,setDrawer]=useState(null);
  const [drawerTab,setDrawerTab]=useState("hist");
  const [rFiltro,setRFiltro]=useState({tipo:"",fundo:"",cultivo:""});
  const [incidentes,setIncidentes]=useState([]);
  // Cargar incidentes desde Firebase
  useEffect(()=>{
    const unsub = escuchar("incidentes",(datos)=>{
      setIncidentes(datos.sort((a,b)=>(b.timestamp||"").localeCompare(a.timestamp||"")));
    });
    return ()=>unsub();
  },[]);
  const [sortCol,setSortCol]=useState("diff");
  const [sortDir,setSortDir]=useState(-1);
  const [showGraf,setShowGraf]=useState(true);
  const [normPeriodo,setNormPeriodo]=useState("semana");
  const [normSort,setNormSort]=useState({col:"fe",dir:-1});
  const [incMes,setIncMes]=useState(new Date().toISOString().slice(0,7));
  const [tFiltro,setTFiltro]=useState({tipo:"",fundo:"",cultivo:"",search:"",estado:"",mes:new Date().toISOString().slice(0,7)});
  const [tSort,setTSort]=useState({col:"fecha",dir:-1});
  const [tHover,setTHover]=useState(null);

  const kpis={...HIST_KPIS,
    total_reg:HIST_KPIS.total_reg+vales.length,
    total_exc:HIST_KPIS.total_exc+vales.filter(v=>v.alertaEnviada).length,
  };
  // MantList usa estado local — addMant ya no se necesita aquí
  // delMant ya no se necesita aquí
  const addEquipo=async()=>{
    if(!eqInput.den){setToast({msg:"Ingrese nombre del equipo",type:"err"});return;}
    const eq={id:"EQ-"+Date.now(),den:eqInput.den,tipo:eqInput.tipo,placa:eqInput.placa};
    await setMaestros({...maestros,equipos:[...(maestros.equipos||[]),eq]});
    setEqInput({den:"",tipo:"TRACTOR",placa:""});
    setToast({msg:"✓ Equipo agregado",type:"ok"});
  };
  const delEquipo=async(idx)=>{
    const arr=[...(maestros.equipos||[])]; arr.splice(idx,1);
    await setMaestros({...maestros,equipos:arr});
    setToast({msg:"Equipo eliminado"});
  };
  const addUser=async()=>{
    if(!newUser.usuario||!newUser.pass||!newUser.nombre){setToast({msg:"Complete todos los campos",type:"err"});return;}
    if((users||[]).find(u=>u.usuario===newUser.usuario)){setToast({msg:"Usuario ya existe",type:"err"});return;}
    const u={...newUser,id:"u"+Date.now(),activo:true,cultivos:newUser.cultivos||[]};
    await setUsers([...(users||[]),u]);
    setNewUser({usuario:"",pass:"",nombre:"",rol:"alm"});
    setToast({msg:"✓ Usuario creado",type:"ok"});
  };
  const toggleUser=async(id)=>{
    const upd=(users||[]).map(u=>u.id===id?{...u,activo:!u.activo}:u);
    await setUsers(upd);
  };
  const exportExcel = () => {
    const allRows = [
      ...HIST_EXCESOS.map(r=>({
        tipo:"Histórico", nVale:"—", fecha:r.fe, hora:"—",
        equipo:r.ef, tipoEq:{T:"TRACTOR",C:"CAMIÓN",I:"CISTERNA"}[r.t]||r.t,
        fundo:r.fu, cultivo:"—", actividad:(r.ac||[]).join(", "),
        combustible:"Petróleo D2",
        gl_real:r.gl, gl_esperado:r.es||"—", diferencia_gl:r.df||"—",
        km_horas:"—", km_anterior:"—", diferencia_km_h:"—",
        ratio_teorico:"—", desv_pct:"—",
        chofer:r.chofer||"—", almacenero:"—",
        estado:"Exceso", aprobado:"—", aprobadoPor:"—",
        nVale_SAP:"IK17", observaciones:"—",
      })),
      ...HIST_DEFICITS.map(r=>({
        tipo:"Histórico", nVale:"—", fecha:r.fe, hora:"—",
        equipo:r.ef, tipoEq:{T:"TRACTOR",C:"CAMIÓN",I:"CISTERNA"}[r.t]||r.t,
        fundo:r.fu, cultivo:"—", actividad:(r.ac||[]).join(", "),
        combustible:"Petróleo D2",
        gl_real:r.gl, gl_esperado:r.es||"—", diferencia_gl:r.df||"—",
        km_horas:"—", km_anterior:"—", diferencia_km_h:"—",
        ratio_teorico:"—", desv_pct:"—",
        chofer:r.chofer||"—", almacenero:"—",
        estado:"Déficit", aprobado:"—", aprobadoPor:"—",
        nVale_SAP:"IK17", observaciones:"—",
      })),
      ...vales.map(v=>{
        const dif = v.diferencia||v.km||0;
        const glEsp = v.teoRatio
          ? (v.teoUnit==="Km/Gl" ? dif/v.teoRatio : dif*v.teoRatio)
          : null;
        const desv = glEsp ? ((v.gl-glEsp)/glEsp*100) : null;
        const estado = !glEsp?"Sin ref":Math.abs(desv)<=5?"Normal":Math.abs(desv)<=10?"Alerta":"Fuera de rango";
        return {
          tipo:"App", nVale:v.nVale||"V-"+String(v.id).padStart(6,"0"),
          fecha:v.fecha, hora:v.hora,
          equipo:v.equipoDen, tipoEq:v.tipo,
          fundo:v.fundo, cultivo:v.cultivo||"—",
          actividad:v.actividad, combustible:v.producto,
          gl_real:v.gl,
          gl_esperado:glEsp?Math.round(glEsp*100)/100:"—",
          diferencia_gl:glEsp?Math.round((v.gl-glEsp)*100)/100:"—",
          km_horas:v.km||"—",
          km_anterior:v.kmAnterior||"—",
          diferencia_km_h:v.diferencia||"—",
          ratio_teorico:v.teoRatio?`${v.teoRatio} ${v.teoUnit}`:"—",
          desv_pct:desv!=null?Math.round(desv*10)/10+"%" :"—",
          chofer:v.chofer, almacenero:v.almacenero,
          estado,
          aprobado:v.aprobado?"Sí":v.rechazado?"Rechazado":"Pendiente",
          aprobadoPor:v.aprobadoPor||"—",
          nVale_SAP:"IK17",
          observaciones:v.obs||"—",
        };
      }),
    ];
    const headers = {
      tipo:"Tipo",nVale:"N° Vale",fecha:"Fecha",hora:"Hora",
      equipo:"Equipo / Unidad",tipoEq:"Tipo Equipo",
      fundo:"Fundo / Unidad Agrícola",cultivo:"Cultivo",
      actividad:"Actividad",combustible:"Combustible",
      gl_real:"Galones Reales",gl_esperado:"Galones Esperados",
      diferencia_gl:"Diferencia (gl)",
      km_horas:"Km / Horómetro Actual",km_anterior:"Km / Hr Anterior",
      diferencia_km_h:"Diferencia Km / Hr",
      ratio_teorico:"Ratio Teórico",desv_pct:"Desviación %",
      chofer:"Chofer / Operador",almacenero:"Almacenero",
      estado:"Estado Consumo",aprobado:"Aprobado",aprobadoPor:"Aprobado Por",
      nVale_SAP:"Sistema SAP",observaciones:"Observaciones",
    };
    const keys = Object.keys(headers);
    const wsData = [
      ["DANPER TRUJILLO S.A.C. — Reporte de Consumo de Combustible — Mantenimiento y Maquinaria Agrícola 2026"],
      [`Generado: ${new Date().toLocaleString("es-PE")}`],
      [],
      keys.map(k=>headers[k]),
      ...allRows.map(r=>keys.map(k=>r[k]??"")),
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    ws["!cols"] = keys.map(k=>{
      const maxLen = Math.max(
        (headers[k]||"").length,
        ...allRows.map(r=>String(r[k]||"").length)
      );
      return {wch: Math.min(Math.max(maxLen+2, 10), 40)};
    });
    ws["!merges"] = [
      {s:{r:0,c:0},e:{r:0,c:keys.length-1}},
      {s:{r:1,c:0},e:{r:1,c:keys.length-1}},
    ];
    XLSX.utils.book_append_sheet(wb, ws, "Consumo Combustible");
    const ik17Data = [
      ["DATOS PARA REGISTRO SAP — Consumo de Combustible"],
      ["Equipo (N° interno)","Fecha","Descripción","Cantidad (gl)","Unidad","Chofer"],
      ...vales.map(v=>[
        v.equipoId, v.fecha,
        `${v.actividad} - ${v.fundo}`,
        v.gl, "GAL", v.chofer,
      ]),
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(ik17Data);
    ws2["!cols"] = [{wch:15},{wch:12},{wch:40},{wch:14},{wch:8},{wch:20}];
    XLSX.utils.book_append_sheet(wb, ws2, "Para SAP");
    XLSX.writeFile(wb, `danper_combustible_${new Date().toISOString().slice(0,10)}.xlsx`);
  };
    const [pfiltro,setPfiltro]=useState({fundo:"",periodo:"todo",search:""});
  const [eqDetalle,setEqDetalle]=useState(null);
  const filterUnified=(rows)=>{
    const hoy=new Date().toISOString().slice(0,10);
    const semAgo=new Date(Date.now()-7*86400000).toISOString().slice(0,10);
    const mesAgo=new Date(Date.now()-30*86400000).toISOString().slice(0,10);
    return rows.filter(r=>{
      if(pfiltro.fundo&&(r.fu||"").trim()!==pfiltro.fundo.trim())return false;
      if(pfiltro.search&&!(r.ef||"").toLowerCase().includes(pfiltro.search.toLowerCase()))return false;
      if(pfiltro.periodo==="hoy")return r.fe===hoy;
      if(pfiltro.periodo==="semana")return r.fe>=semAgo;
      if(pfiltro.periodo==="mes")return r.fe>=mesAgo;
      return true;
    });
  };
  const navItems=[
    {id:"resumen",    label:"Resumen",    ico:"◉"},
    {id:"excesos",    label:"Excesos",    ico:"⬆"},
    {id:"deficits",   label:"Déficits",   ico:"⬇"},
    {id:"todos",      label:"Todos",      ico:"📋",badge:vales.length},
    {id:"incidentes", label:"Incidentes", ico:"⚠️",badge:incidentes.filter(i=>!i.revisado).length||0},
    {id:"mant",       label:"Parámetros", ico:"⚙"},
  ];
  const fsel={fontSize:11,padding:"5px 8px",borderRadius:8,border:`1px solid ${C.bdr}`,
    background:C.surf2,fontFamily:"inherit",color:C.txt,WebkitAppearance:"none"};
  const MantList=({k,label})=>{
    const [lv,setLv]=useState("");
    const items=maestros[k]||[];
    const add=async()=>{
      const v=lv.trim();if(!v)return;
      if(items.includes(v)){setToast({msg:"Ya existe",type:"err"});return;}
      const upd={...maestros,[k]:[...items,v]};
      await setMaestros(upd);setLv("");setToast({msg:"✓ Agregado",type:"ok"});
    };
    const del_=async(i)=>{
      const arr=[...items];arr.splice(i,1);
      await setMaestros({...maestros,[k]:arr});setToast({msg:"Eliminado"});
    };
    return(
      <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16,boxShadow:"0 1px 3px rgba(0,0,0,.06)"}}>
        <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>{label} <span style={{fontSize:11,color:C.txt3,fontWeight:400}}>({items.length})</span></div>
        <div style={{maxHeight:160,overflowY:"auto",marginBottom:10}}>
          {items.map((item,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 4px",borderRadius:6}}>
              <span style={{flex:1,fontSize:12}}>{item}</span>
              <button onClick={()=>del_(i)} style={{background:"none",border:"none",color:C.txt3,cursor:"pointer",fontSize:16,padding:"0 4px",lineHeight:1}}>×</button>
            </div>
          ))}
          {items.length===0&&<p style={{color:C.txt3,fontSize:11,padding:4}}>Sin registros</p>}
        </div>
        <div style={{display:"flex",gap:6}}>
          <input placeholder="Agregar nuevo..." value={lv}
            onChange={e=>setLv(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&add()}
            style={{flex:1,padding:"6px 9px",border:`1.5px solid ${C.bdr}`,borderRadius:7,fontSize:12,fontFamily:"inherit",outline:"none"}}
            autoComplete="off"/>
          <button onClick={add} style={{padding:"6px 12px",background:C.blue,color:"#fff",border:"none",borderRadius:7,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>+ Agregar</button>
        </div>
      </div>
    );
  };
  return(
    <div style={{display:"flex",height:"100vh",fontFamily:"system-ui,sans-serif",overflow:"hidden"}}>
      <style>{CSS_DASH}</style>
      
      <nav style={{width:200,flexShrink:0,background:C.navy,display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden"}}>
        <div style={{padding:"18px 16px",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <img src={LOGO_SRC} alt="Danper" style={{width:34,height:34,borderRadius:"50%",objectFit:"cover",flexShrink:0,border:"1px solid rgba(255,255,255,.2)"}}/>
            <div>
              <div style={{color:"#fff",fontSize:12,fontWeight:600}}>Danper</div>
              <div style={{color:"rgba(255,255,255,.4)",fontSize:10}}>Planner · {user.nombre||user.usuario}</div>
            </div>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"10px 0"}}>
          {navItems.map(n=>(
            <button key={n.id} onClick={()=>setView(n.id)}
              style={{display:"flex",alignItems:"center",gap:9,width:"100%",
                padding:"9px 16px",background:view===n.id?"rgba(255,255,255,.1)":"none",
                border:"none",borderLeft:view===n.id?"3px solid #4DA3FF":"3px solid transparent",
                color:view===n.id?"#fff":"rgba(255,255,255,.55)",
                fontSize:12,cursor:"pointer",fontFamily:"inherit",textAlign:"left",transition:"all .15s"}}>
              <span style={{fontSize:14,width:16,textAlign:"center"}}>{n.ico}</span>
              <span style={{flex:1}}>{n.label}</span>
              {n.badge>0&&<span style={{background:"#DC2626",color:"#fff",fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:10,minWidth:18,textAlign:"center"}}>{n.badge}</span>}
            </button>
          ))}
        </div>
        <div style={{padding:"12px 16px",borderTop:"1px solid rgba(255,255,255,.07)",fontSize:10,color:"rgba(255,255,255,.3)"}}>
          Danper · 2026
        </div>
      </nav>
      
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{background:C.surf,borderBottom:`1px solid ${C.bdr}`,padding:"0 20px",height:52,display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
          <span style={{fontSize:14,fontWeight:700}}>
            {{resumen:"Resumen general",excesos:"⬆ Excesos de consumo",deficits:"⬇ Déficits de consumo",
              todos:"📋 Todos los vales",usuarios:"👥 Gestión de usuarios",mant:"⚙ Parámetros",
              eq_detalle:"🔍 Detalle de equipo"}[view]}
          </span>
          <div style={{width:1,height:18,background:C.bdr}}/>
          <span style={{fontSize:11,color:C.txt2,background:C.surf2,border:`1px solid ${C.bdr}`,padding:"3px 10px",borderRadius:20}}>
            {kpis.total_reg} registros
          </span>
          <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
            {recargarDatos && <BotonRefrescar onRecargar={recargarDatos} onToast={setToast}/>}
            <button onClick={exportExcel}
              style={{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",
                background:"#166534",color:"#fff",border:"none",borderRadius:8,
                fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
              📊 Exportar Excel
            </button>
            <button onClick={onLogout}
              style={{padding:"6px 12px",background:C.surf2,color:C.txt2,
                border:`1px solid ${C.bdr}`,borderRadius:8,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
              Salir
            </button>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:20}}>
          
          {view==="resumen"&&(()=>{
            const allD=buildUnified(vales);
            const rRows=allD.filter(r=>{
              if(rFiltro.tipo&&r.t!==rFiltro.tipo)return false;
              if(rFiltro.fundo&&(r.fu||"").trim()!==rFiltro.fundo.trim())return false;
              if(rFiltro.cultivo){
                // cultivo viene de vales app (r.ac tiene actividades, no cultivos directo)
                // Para histórico no tenemos cultivo — mostrarlos siempre
                // Para vales app, comparar con el cultivo del vale
                const vale=vales.find(v=>v.nVale===r.nVale);
                if(vale&&vale.cultivo&&vale.cultivo!==rFiltro.cultivo)return false;
              }
              return true;
            });
            const excRows=rRows.filter(r=>r.af==="exceso");
            const defRows=rRows.filter(r=>r.af==="deficit");
            const normRows=rRows.filter(r=>r.diff!=null&&!r.af);
            const sinRef=rRows.filter(r=>r.diff==null);
            const pctExc=rRows.length?Math.round(excRows.length/rRows.length*100):0;
            const semaColor=pctExc<=5?"#16A34A":pctExc<=15?"#D97706":"#DC2626";
            const semaLabel=pctExc<=5?"NORMAL":pctExc<=15?"ALERTA":"CRÍTICO";
            const semaIco=pctExc<=5?"🟢":pctExc<=15?"🟡":"🔴";
            const anomRows=[...excRows,...defRows].sort((a,b)=>{
              const va=sortCol==="gl_real"?a.gl_real:sortCol==="gl_esp"?a.gl_esp:Math.abs(a.diff||0);
              const vb=sortCol==="gl_real"?b.gl_real:sortCol==="gl_esp"?b.gl_esp:Math.abs(b.diff||0);
              return sortDir*((vb||0)-(va||0));
            });
            const TL={T:"TRACTOR",C:"CAMIÓN",I:"CISTERNA"};
            const SortBtn=({col,label})=>(
              <th onClick={()=>{if(sortCol===col)setSortDir(d=>-d);else{setSortCol(col);setSortDir(-1);}}}
                style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:700,color:sortCol===col?C.blue:C.txt3,
                  textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap",cursor:"pointer",userSelect:"none"}}>
                {label} {sortCol===col?(sortDir===-1?"↓":"↑"):""}
              </th>
            );
            const hoy=new Date();
            const ultDias=Array.from({length:14},(_,i)=>{
              const d=new Date(hoy); d.setDate(d.getDate()-13+i);
              return d.toISOString().slice(0,10);
            });
            const grafDia=ultDias.map(fecha=>{
              const del_dia=vales.filter(v=>v.fecha===fecha);
              const glTotal=del_dia.reduce((s,v)=>s+v.gl,0);
              const alertas=del_dia.filter(v=>v.alertaEnviada).length;
              return{fecha,glTotal,alertas,n:del_dia.length};
            });
            const maxGlDia=Math.max(...grafDia.map(d=>d.glTotal),1);
            return(
              <>
                
                {/* ── Pestañas de cultivo ── */}
                <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
                  {["","ESPARRAGO","ARANDANO","PIMIENTO","PALTA","PALTO","ALCACHOFA","OTROS"].map(c=>{
                    const label=c||"Todos los cultivos";
                    const isActive=rFiltro.cultivo===c;
                    // Contar vales app de este cultivo
                    const cnt=c?vales.filter(v=>v.cultivo===c).length:vales.length;
                    return(
                      <button key={c} onClick={()=>setRFiltro(f=>({...f,cultivo:c}))}
                        style={{padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:isActive?700:400,
                          cursor:"pointer",fontFamily:"inherit",transition:"all .15s",
                          border:`1.5px solid ${isActive?"#16A34A":C.bdr}`,
                          background:isActive?"#DCFCE7":"#fff",
                          color:isActive?"#166534":C.txt2}}>
                        🌱 {label}
                        {c&&cnt>0&&<span style={{marginLeft:5,fontSize:9,background:isActive?"#16A34A":"#E5E7EB",
                          color:isActive?"#fff":"#6B7280",borderRadius:10,padding:"1px 5px",fontWeight:700}}>
                          {cnt}
                        </span>}
                      </button>
                    );
                  })}
                </div>

                {/* ── Filtros secundarios ── */}
                <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
                  <select value={rFiltro.tipo} onChange={e=>setRFiltro(f=>({...f,tipo:e.target.value}))}
                    style={{fontSize:11,padding:"5px 10px",borderRadius:8,border:`1px solid ${C.bdr}`,fontFamily:"inherit",background:rFiltro.tipo?"#EFF6FF":C.surf2,WebkitAppearance:"none"}}>
                    <option value="">— Tipo unidad —</option>
                    {[["T","TRACTOR"],["C","CAMIÓN"],["I","CISTERNA"]].map(([v,l])=><option key={v} value={v}>{l}</option>)}
                  </select>
                  <select value={rFiltro.fundo} onChange={e=>setRFiltro(f=>({...f,fundo:e.target.value}))}
                    style={{fontSize:11,padding:"5px 10px",borderRadius:8,border:`1px solid ${C.bdr}`,fontFamily:"inherit",background:rFiltro.fundo?"#EFF6FF":C.surf2,WebkitAppearance:"none"}}>
                    <option value="">— Fundo —</option>
                    {(maestros.fundos||[]).map(f=><option key={f} value={f}>{f}</option>)}
                  </select>
                  {(rFiltro.tipo||rFiltro.fundo||rFiltro.cultivo)&&(
                    <button onClick={()=>setRFiltro({tipo:"",fundo:"",cultivo:""})}
                      style={{fontSize:10,padding:"4px 10px",borderRadius:20,background:"#FEE2E2",color:"#B91C1C",border:"none",cursor:"pointer",fontFamily:"inherit"}}>
                      ✕ Limpiar filtros
                    </button>
                  )}
                  {rFiltro.cultivo&&(
                    <span style={{fontSize:11,color:"#166534",background:"#DCFCE7",padding:"4px 10px",borderRadius:20,fontWeight:600}}>
                      🌱 Filtrando: {rFiltro.cultivo}
                    </span>
                  )}
                  <button onClick={()=>setShowGraf(g=>!g)}
                    style={{marginLeft:"auto",fontSize:11,padding:"5px 12px",borderRadius:8,
                      background:showGraf?"#EFF6FF":"#fff",color:showGraf?C.blue:C.txt3,
                      border:`1px solid ${showGraf?C.blue:C.bdr}`,cursor:"pointer",fontFamily:"inherit"}}>
                    {showGraf?"📊 Ocultar gráfico":"📊 Ver gráfico"}
                  </button>
                </div>
                
                <div style={{display:"grid",gridTemplateColumns:"auto 1fr 1fr 1fr 1fr",gap:10,marginBottom:14,alignItems:"stretch"}}>
                  
                  <div style={{background:C.surf,border:`3px solid ${semaColor}`,borderRadius:14,
                    padding:"14px 16px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,minWidth:110}}>
                    <div style={{fontSize:32}}>{semaIco}</div>
                    <div style={{fontSize:12,fontWeight:800,color:semaColor}}>{semaLabel}</div>
                    <div style={{fontSize:9,color:C.txt3,textAlign:"center"}}>{pctExc}% con exceso</div>
                    {rFiltro.cultivo&&(
                      <div style={{fontSize:9,fontWeight:700,color:"#166534",background:"#DCFCE7",
                        borderRadius:8,padding:"2px 7px",marginTop:2}}>
                        🌱 {rFiltro.cultivo}
                      </div>
                    )}
                  </div>
                  <KCard label="Galones totales" value={kpis.total_gl.toLocaleString("es-PE")+" gl"} sub="período completo" color={C.blue} accent={C.blue}/>
                  <KCard label="Total registros" value={rRows.length} sub={kpis.equipos+" equipos"}/>
                  <KCard label="Excesos" value={excRows.length} sub={`+${excRows.reduce((s,r)=>s+(r.diff||0),0).toFixed(1)} gl acum.`} color={C.exc} accent={C.exc}/>
                  <KCard label="Déficits" value={defRows.length} sub={`${defRows.reduce((s,r)=>s+(r.diff||0),0).toFixed(1)} gl acum.`} color={C.def_} accent={C.def_}/>
                </div>
                
                {showGraf&&vales.length>0&&(
                  <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16,marginBottom:14}}>
                    <div style={{fontSize:12,fontWeight:700,marginBottom:12,display:"flex",justifyContent:"space-between"}}>
                      <span>📈 Tendencia últimos 14 días (galones despachados vía app)</span>
                      <span style={{fontSize:10,color:C.txt3}}>{vales.length} vales registrados</span>
                    </div>
                    <div style={{display:"flex",alignItems:"flex-end",gap:3,height:80,paddingBottom:20,position:"relative"}}>
                      {grafDia.map((d,i)=>{
                        const h=d.glTotal?Math.round((d.glTotal/maxGlDia)*72):0;
                        const hasAlert=d.alertas>0;
                        return(
                          <div key={d.fecha} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                            <div title={`${d.fecha}: ${d.glTotal.toFixed(1)} gl · ${d.n} vales`}
                              style={{width:"100%",height:h||2,background:hasAlert?"#F59E0B":d.n>0?"#3B82F6":"#E5E7EB",
                                borderRadius:"3px 3px 0 0",transition:"height .3s",cursor:"pointer",minHeight:2}}>
                            </div>
                            {i%3===0&&<div style={{fontSize:7,color:C.txt3,whiteSpace:"nowrap",transform:"rotate(-45deg)",marginTop:4}}>
                              {d.fecha.slice(5)}
                            </div>}
                          </div>
                        );
                      })}
                    </div>
                    <div style={{display:"flex",gap:12,marginTop:4}}>
                      <div style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:C.txt3}}><div style={{width:10,height:10,background:"#3B82F6",borderRadius:2}}/> Normal</div>
                      <div style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:C.txt3}}><div style={{width:10,height:10,background:"#F59E0B",borderRadius:2}}/> Con alerta</div>
                      <div style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:C.txt3}}><div style={{width:10,height:10,background:"#E5E7EB",borderRadius:2}}/> Sin registros</div>
                    </div>
                  </div>
                )}
                
                <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:12,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,.06)"}}>
                  <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.bdr}`,display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:13,fontWeight:700}}>Equipos con anomalías — clic columna para ordenar</span>
                    <span style={{marginLeft:"auto",fontSize:10,color:C.txt3}}>{anomRows.length} registros · Clic fila → detalle</span>
                  </div>
                  <div style={{overflowX:"auto",maxHeight:380,overflowY:"auto"}}>
                    <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                      <thead style={{position:"sticky",top:0,background:C.surf2}}>
                        <tr style={{borderBottom:`1px solid ${C.bdr}`}}>
                          <th style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap"}}>🚦</th>
                          <SortBtn col="fecha" label="Fecha"/>
                          <th style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap"}}>Equipo</th>
                          <th style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap"}}>Tipo</th>
                          <SortBtn col="gl_real" label="Gal. reales"/>
                          <SortBtn col="gl_esp" label="Gal. esp."/>
                          <SortBtn col="diff" label="Diferencia"/>
                          <th style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap"}}>Fundo</th>
                          <th style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap"}}>Fuente</th>
                          <th style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap"}}>Aprobación</th>
                        </tr>
                      </thead>
                      <tbody>
                        {anomRows.map((r,i)=>{
                          const absD=Math.abs(r.diff||0);
                          const sem=absD<=5?"🟢":absD<=15?"🟡":"🔴";
                          const rowBg=r.af==="exceso"?(i%2===0?"#F5F3FF":"#EDE9FE"):(i%2===0?"#F0F9FF":"#E0F2FE");
                          return(
                            <tr key={i} style={{borderBottom:`0.5px solid ${C.bdr}`,background:rowBg,cursor:"pointer"}}
                              onMouseEnter={e=>e.currentTarget.style.background="#E0E7FF"}
                              onMouseLeave={e=>e.currentTarget.style.background=rowBg}
                              onClick={()=>{setDrawer({id:r.id,den:r.ef,tipo:r.t});setDrawerTab("hist");}}>
                              <td style={{padding:"6px 10px",fontSize:16}}>{sem}</td>
                              <td style={{padding:"6px 10px",fontFamily:"monospace",color:C.txt3,whiteSpace:"nowrap"}}>{r.fe}</td>
                              <td style={{padding:"6px 10px",fontWeight:600,maxWidth:170,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.ef}</td>
                              <td style={{padding:"6px 10px"}}><Badge type={r.t}>{TL[r.t]||r.t}</Badge></td>
                              <td style={{padding:"6px 10px",fontFamily:"monospace",color:C.blue,fontWeight:700}}>{r.gl_real?.toFixed(1)} gl</td>
                              <td style={{padding:"6px 10px",fontFamily:"monospace",color:C.txt3}}>{r.gl_esp!=null?r.gl_esp.toFixed(1)+" gl":"—"}</td>
                              <td style={{padding:"6px 10px",fontFamily:"monospace",fontWeight:800,fontSize:13,color:r.af==="exceso"?C.exc:C.def_}}>{r.diff!=null?(r.diff>0?"+":"")+r.diff.toFixed(1)+" gl":"—"}</td>
                              <td style={{padding:"6px 10px"}}>{r.fu||"—"}</td>
                              <td style={{padding:"6px 10px"}}><span style={{fontSize:9,padding:"1px 5px",borderRadius:3,fontWeight:700,background:r.fuente==="app"?"#DBEAFE":"#F3F4F6",color:r.fuente==="app"?"#1e40af":"#6B7280"}}>{r.fuente==="app"?"App":"Hist."}</span></td>
                              <td style={{padding:"6px 10px"}}>{r.fuente==="hist"?<span style={{color:C.txt3,fontSize:10}}>—</span>:r.aprobado?<span style={{fontSize:10,fontWeight:700,color:C.ok}}>✅</span>:r.rechazado?<span style={{fontSize:10,fontWeight:700,color:C.crit}}>✕</span>:<span style={{fontSize:10,fontWeight:700,color:C.warn}}>⏳</span>}</td>
                            </tr>
                          );
                        })}
                        {anomRows.length===0&&<tr><td colSpan={10} style={{textAlign:"center",padding:"28px",color:C.txt3}}>Sin anomalías para los filtros seleccionados 🟢</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ── Tabla de consumos en rango (registros normales) ── */}
                {(()=>{
                  const hoy = new Date().toISOString().slice(0,10);
                  const semAgo = new Date(Date.now()-7*86400000).toISOString().slice(0,10);
                  const mesAgo = new Date(Date.now()-30*86400000).toISOString().slice(0,10);
                  let normRows = rRows.filter(r => r.fuente==="app" && !r.af);
                  if(normPeriodo==="hoy")    normRows = normRows.filter(r=>r.fe===hoy);
                  if(normPeriodo==="semana") normRows = normRows.filter(r=>r.fe>=semAgo);
                  if(normPeriodo==="mes")    normRows = normRows.filter(r=>r.fe>=mesAgo);
                  let enrich = normRows.map(r=>{
                    const v = vales.find(x=>x.nVale===r.nVale) || {};
                    return {...r, cultivo:v.cultivo||"—", hora:v.hora||""};
                  });
                  enrich.sort((a,b)=>{
                    const c=normSort.col, d=normSort.dir;
                    let va, vb;
                    if(c==="fe"){ va=(a.fe||"")+" "+(a.hora||""); vb=(b.fe||"")+" "+(b.hora||""); }
                    else if(c==="gl_real"){ va=a.gl_real||0; vb=b.gl_real||0; }
                    else if(c==="gl_esp") { va=a.gl_esp==null?-Infinity:a.gl_esp; vb=b.gl_esp==null?-Infinity:b.gl_esp; }
                    else if(c==="diff")   { va=a.diff==null?-Infinity:a.diff; vb=b.diff==null?-Infinity:b.diff; }
                    else { va=a[c]||""; vb=b[c]||""; }
                    if(typeof va==="number") return d*(vb-va);
                    return d*String(vb).localeCompare(String(va));
                  });
                  const totalGl = enrich.reduce((s,r)=>s+(r.gl_real||0), 0);
                  const SortHead = ({col,label,right})=>(
                    <th onClick={()=>setNormSort(s=>({col,dir:s.col===col?-s.dir:-1}))}
                      style={{padding:"7px 10px",textAlign:right?"right":"left",fontSize:10,fontWeight:700,
                        color:normSort.col===col?C.ok:C.txt3,textTransform:"uppercase",letterSpacing:.4,
                        whiteSpace:"nowrap",cursor:"pointer",userSelect:"none"}}>
                      {label} {normSort.col===col?(normSort.dir===-1?"↓":"↑"):""}
                    </th>
                  );
                  return(
                    <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:12,
                      overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,.06)",marginTop:14}}>
                      <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.bdr}`,
                        display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                        <span style={{fontSize:13,fontWeight:700,color:C.ok}}>✓ Consumos en rango</span>
                        <div style={{display:"flex",gap:5,marginLeft:8}}>
                          {[["hoy","Hoy"],["semana","Semana"],["mes","Mes"],["todo","Todo"]].map(([k,l])=>(
                            <button key={k} onClick={()=>setNormPeriodo(k)}
                              style={{padding:"3px 10px",borderRadius:14,fontSize:10,fontWeight:600,cursor:"pointer",
                                border:`1.5px solid ${normPeriodo===k?C.ok:C.bdr}`,
                                background:normPeriodo===k?"#DCFCE7":"#fff",
                                color:normPeriodo===k?"#166534":C.txt2,fontFamily:"inherit"}}>{l}</button>
                          ))}
                        </div>
                        <span style={{marginLeft:"auto",fontSize:10,color:C.txt3}}>
                          {enrich.length} registros · {totalGl.toFixed(1)} gl Σ · clic encabezado para ordenar
                        </span>
                      </div>
                      <div style={{overflowX:"auto",maxHeight:340,overflowY:"auto"}}>
                        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                          <thead style={{position:"sticky",top:0,background:C.surf2}}>
                            <tr style={{borderBottom:`1px solid ${C.bdr}`}}>
                              <SortHead col="fe" label="Fecha"/>
                              <SortHead col="ef" label="Equipo"/>
                              <SortHead col="t" label="Tipo"/>
                              <SortHead col="cultivo" label="Cultivo"/>
                              <SortHead col="fu" label="Fundo"/>
                              <SortHead col="gl_real" label="Gal. reales" right/>
                              <SortHead col="gl_esp" label="Gal. esp." right/>
                              <SortHead col="diff" label="Δ" right/>
                              <SortHead col="chofer" label="Chofer"/>
                              <th style={{padding:"7px 10px",fontSize:10,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.4}}>Aprobación</th>
                            </tr>
                          </thead>
                          <tbody>
                            {enrich.map((r,i)=>{
                              const rowBg = i%2===0 ? "#fff" : "#F8FAFC";
                              return(
                                <tr key={i} style={{borderBottom:`0.5px solid ${C.bdr}`,background:rowBg,cursor:"pointer"}}
                                  onClick={()=>{setDrawer({id:r.id,den:r.ef,tipo:r.t});setDrawerTab("app");}}>
                                  <td style={{padding:"6px 10px",fontFamily:"monospace",color:C.txt3,whiteSpace:"nowrap"}}>{r.fe}</td>
                                  <td style={{padding:"6px 10px",fontWeight:600,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.ef}</td>
                                  <td style={{padding:"6px 10px"}}><Badge type={r.t}>{r.t==="T"?"TRACTOR":r.t==="I"?"CISTERNA":"CAMIÓN"}</Badge></td>
                                  <td style={{padding:"6px 10px"}}>
                                    {r.cultivo&&r.cultivo!=="—"
                                      ?<span style={{fontSize:10,fontWeight:600,background:"#DCFCE7",color:"#166534",padding:"2px 7px",borderRadius:10}}>🌱 {r.cultivo}</span>
                                      :<span style={{color:C.txt3,fontSize:10}}>—</span>}
                                  </td>
                                  <td style={{padding:"6px 10px"}}>{r.fu||"—"}</td>
                                  <td style={{padding:"6px 10px",fontFamily:"monospace",color:C.blue,fontWeight:700,textAlign:"right"}}>{r.gl_real?.toFixed(1)} gl</td>
                                  <td style={{padding:"6px 10px",fontFamily:"monospace",color:C.txt3,textAlign:"right"}}>{r.gl_esp!=null?r.gl_esp.toFixed(1)+" gl":"—"}</td>
                                  <td style={{padding:"6px 10px",fontFamily:"monospace",color:C.ok,fontWeight:700,textAlign:"right"}}>{r.diff!=null?(r.diff>0?"+":"")+r.diff.toFixed(1):"—"}</td>
                                  <td style={{padding:"6px 10px",maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.chofer||"—"}</td>
                                  <td style={{padding:"6px 10px"}}>{r.aprobado?<span style={{fontSize:10,fontWeight:700,color:C.ok}}>✅</span>:r.rechazado?<span style={{fontSize:10,fontWeight:700,color:C.crit}}>✕</span>:<span style={{fontSize:10,fontWeight:700,color:C.warn}}>⏳</span>}</td>
                                </tr>
                              );
                            })}
                            {enrich.length===0 && (
                              <tr><td colSpan={10} style={{textAlign:"center",padding:"28px",color:C.txt3}}>
                                Sin consumos en rango para el período "{normPeriodo}"
                              </td></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()}
                {vales.length>0&&(
                  <div style={{background:"#EDE9FE",border:"1px solid #C4B5FD",borderRadius:12,padding:12,marginTop:12,display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:18}}>📱</span>
                    <div><div style={{color:C.exc,fontWeight:700,fontSize:12}}>{vales.length} vale{vales.length>1?"s":""} nuevos registrados en la app</div>
                    <div style={{fontSize:11,color:C.txt2}}>Ver "Excesos" o "Todos" para detalle completo.</div></div>
                  </div>
                )}
              </>
            );
          })()}
          
          {(view==="excesos"||view==="deficits")&&(()=>{
            const allD=buildUnified(vales);
            const filt=filterUnified(allD);
            const isExc=view==="excesos";
            const aRows=filt.filter(r=>r.af===(isExc?"exceso":"deficit")).sort((a,b)=>Math.abs(b.diff||0)-Math.abs(a.diff||0));
            const aCol=isExc?C.exc:C.def_;
            const TL={T:"TRACTOR",C:"CAMIÓN",I:"CISTERNA"};
            return(<>
              <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
                {[["todo","Todo"],["hoy","Hoy"],["semana","Última semana"],["mes","Último mes"]].map(([k,l])=>(
                  <button key={k} onClick={()=>setPfiltro(f=>({...f,periodo:k}))}
                    style={{padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:600,cursor:"pointer",
                      border:`1.5px solid ${pfiltro.periodo===k?aCol:C.bdr}`,
                      background:pfiltro.periodo===k?aCol:"#fff",
                      color:pfiltro.periodo===k?"#fff":C.txt2,fontFamily:"inherit"}}>{l}</button>
                ))}
                <select value={pfiltro.fundo} onChange={e=>setPfiltro(f=>({...f,fundo:e.target.value}))}
                  style={{fontSize:11,padding:"5px 8px",borderRadius:8,border:`1px solid ${C.bdr}`,fontFamily:"inherit",background:C.surf2,WebkitAppearance:"none"}}>
                  <option value="">— Fundo —</option>
                  {(maestros.fundos||[]).map(f=><option key={f} value={f}>{f}</option>)}
                </select>
                <input placeholder="🔍 Buscar equipo..." value={pfiltro.search}
                  onChange={e=>setPfiltro(f=>({...f,search:e.target.value}))}
                  style={{padding:"5px 10px",borderRadius:8,border:`1px solid ${C.bdr}`,fontSize:11,fontFamily:"inherit",outline:"none"}}/>
                <span style={{marginLeft:"auto",fontSize:11,color:C.txt3}}>{aRows.length} registros</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
                <KCard label={isExc?"Total excesos":"Total déficits"} value={aRows.length} sub="registros" color={aCol} accent={aCol}/>
                <KCard label="Galones Σ" value={(isExc?"+":"-")+Math.abs(aRows.reduce((s,r)=>s+(r.diff||0),0)).toFixed(1)+" gl"} sub="acumulado" color={aCol}/>
                <KCard label="Equipos" value={new Set(aRows.map(r=>r.id)).size} sub="involucrados"/>
                <KCard label="Pendientes" value={aRows.filter(r=>r.fuente==="app"&&!r.aprobado&&!r.rechazado).length} sub="sin aprobar" color={C.warn}/>
              </div>
              <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:12,overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,.06)"}}>
                <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.bdr}`,display:"flex",gap:8,alignItems:"center"}}>
                  <span style={{fontSize:13,fontWeight:700,color:aCol}}>{isExc?"⬆ Excesos — mayor diferencia primero":"⬇ Déficits — mayor diferencia primero"}</span>
                  <span style={{marginLeft:"auto",fontSize:10,color:C.txt3}}>Clic en fila → detalle</span>
                </div>
                <div style={{overflowX:"auto",maxHeight:420,overflowY:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                    <thead style={{position:"sticky",top:0}}>
                      <tr style={{background:C.surf2,borderBottom:`1px solid ${C.bdr}`}}>
                        {["Fecha","Equipo","Tipo","Gal. reales","Gal. esp.","Diferencia","Fundo","Actividad","Chofer","Fuente","Aprobación"].map(h=>(
                          <th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap"}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {aRows.map((r,i)=>(
                        <tr key={i} style={{borderBottom:`0.5px solid ${C.bdr}`,background:isExc?(i%2===0?"#F5F3FF":"#EDE9FE"):(i%2===0?"#F0F9FF":"#E0F2FE"),cursor:"pointer"}}
                          onClick={()=>{setDrawer({id:r.id,den:r.ef,tipo:r.t});setDrawerTab("hist");}}>
                          <td style={{padding:"6px 10px",fontFamily:"monospace",color:C.txt3,whiteSpace:"nowrap"}}>{r.fe}</td>
                          <td style={{padding:"6px 10px",fontWeight:600,maxWidth:170,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.ef}</td>
                          <td style={{padding:"6px 10px"}}><Badge type={r.t}>{TL[r.t]||r.t}</Badge></td>
                          <td style={{padding:"6px 10px",fontFamily:"monospace",color:C.blue,fontWeight:700}}>{r.gl_real?.toFixed(1)} gl</td>
                          <td style={{padding:"6px 10px",fontFamily:"monospace",color:C.txt3}}>{r.gl_esp!=null?r.gl_esp.toFixed(1)+" gl":"—"}</td>
                          <td style={{padding:"6px 10px",fontFamily:"monospace",fontWeight:800,fontSize:13,color:aCol}}>{r.diff!=null?(r.diff>0?"+":"")+r.diff.toFixed(1)+" gl":"—"}</td>
                          <td style={{padding:"6px 10px"}}>{r.fu||"—"}</td>
                          <td style={{padding:"6px 10px",color:C.txt3,maxWidth:130,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(r.ac||[]).join(",")||"—"}</td>
                          <td style={{padding:"6px 10px",fontWeight:600}}>{r.chofer||"—"}</td>
                          <td style={{padding:"6px 10px"}}><span style={{fontSize:9,padding:"1px 5px",borderRadius:3,fontWeight:700,background:r.fuente==="app"?"#DBEAFE":"#F3F4F6",color:r.fuente==="app"?"#1e40af":"#6B7280"}}>{r.fuente==="app"?"App":"Hist."}</span></td>
                          <td style={{padding:"6px 10px"}}>{r.fuente==="hist"?<span style={{color:C.txt3,fontSize:10}}>—</span>:r.aprobado?<span style={{fontSize:10,fontWeight:700,color:C.ok}}>✅ Aprobado</span>:r.rechazado?<span style={{fontSize:10,fontWeight:700,color:C.crit}}>✕ Rechazado</span>:<span style={{fontSize:10,fontWeight:700,color:C.warn}}>⏳ Pendiente</span>}</td>
                        </tr>
                      ))}
                      {aRows.length===0&&<tr><td colSpan={11} style={{textAlign:"center",padding:"28px",color:C.txt3}}>Sin registros para los filtros seleccionados</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </>);
          })()}
          
          {view==="eq_detalle"&&eqDetalle&&(()=>{
            const allD=buildUnified(vales);
            const eqRows=allD.filter(r=>r.id===eqDetalle).sort((a,b)=>(a.fe||"").localeCompare(b.fe||""));
            const den=eqRows[0]?.ef||eqDetalle;
            const totGl=eqRows.reduce((s,r)=>s+(r.gl_real||0),0);
            const excR=eqRows.filter(r=>r.af==="exceso");
            const defR=eqRows.filter(r=>r.af==="deficit");
            const TL={T:"TRACTOR",C:"CAMIÓN",I:"CISTERNA"};
            return(<>
              <div style={{background:"linear-gradient(125deg,#0B2748,#163A78)",borderRadius:12,padding:"18px 22px",color:"#fff",marginBottom:14}}>
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:12}}>
                  <div>
                    <button onClick={()=>setView("excesos")} style={{background:"rgba(255,255,255,.15)",border:"none",color:"#fff",borderRadius:6,padding:"4px 10px",fontSize:10,cursor:"pointer",fontFamily:"inherit",marginBottom:8}}>← Volver</button>
                    <div style={{fontSize:20,fontWeight:700}}>{den}</div>
                    <div style={{fontSize:11,opacity:.6}}>{eqRows.length} registros · hist. + app</div>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    {excR.length>0&&<span style={{background:"#EDE9FE",color:"#6D28D9",fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:6}}>⬆ {excR.length} excesos</span>}
                    {defR.length>0&&<span style={{background:"#E0F2FE",color:"#0369A1",fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:6}}>⬇ {defR.length} déficits</span>}
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                  {[{l:"Galones totales",v:totGl.toFixed(1)+" gl"},{l:"Exceso acum.",v:"+"+(excR.reduce((s,r)=>s+(r.diff||0),0)).toFixed(1)+" gl"},{l:"Déficit acum.",v:"-"+(defR.reduce((s,r)=>s+Math.abs(r.diff||0),0)).toFixed(1)+" gl"},{l:"Normales",v:eqRows.filter(r=>!r.af).length}].map(s=>(
                    <div key={s.l} style={{background:"rgba(255,255,255,.1)",borderRadius:8,padding:"8px 12px"}}>
                      <div style={{fontSize:9,opacity:.6,textTransform:"uppercase",marginBottom:3}}>{s.l}</div>
                      <div style={{fontSize:15,fontWeight:700}}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:12,overflow:"hidden"}}>
                <div style={{padding:"10px 16px",borderBottom:`1px solid ${C.bdr}`}}><span style={{fontSize:13,fontWeight:700}}>Registro diario — {den}</span></div>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                    <thead><tr style={{background:C.surf2,borderBottom:`1px solid ${C.bdr}`}}>{["Fecha","Gal. reales","Gal. esp.","Diferencia","Fundo","Actividad","Chofer","Fuente","Estado"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
                    <tbody>
                      {eqRows.map((r,i)=>{
                        const rc=r.af==="exceso"?"#F5F3FF":r.af==="deficit"?"#F0F9FF":i%2===0?"#fff":C.surf2;
                        return(<tr key={i} style={{borderBottom:`0.5px solid ${C.bdr}`,background:rc}}>
                          <td style={{padding:"6px 10px",fontFamily:"monospace",whiteSpace:"nowrap"}}>{r.fe}</td>
                          <td style={{padding:"6px 10px",fontFamily:"monospace",color:C.blue,fontWeight:700}}>{r.gl_real?.toFixed(1)} gl</td>
                          <td style={{padding:"6px 10px",fontFamily:"monospace",color:C.txt3}}>{r.gl_esp!=null?r.gl_esp.toFixed(1)+" gl":"—"}</td>
                          <td style={{padding:"6px 10px",fontFamily:"monospace",fontWeight:700,color:r.af==="exceso"?C.exc:r.af==="deficit"?C.def_:C.ok,fontSize:13}}>{r.diff!=null?(r.diff>0?"+":"")+r.diff.toFixed(1)+" gl":"—"}</td>
                          <td style={{padding:"6px 10px"}}>{r.fu||"—"}</td>
                          <td style={{padding:"6px 10px",color:C.txt3,maxWidth:150,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(r.ac||[]).join(",")||"—"}</td>
                          <td style={{padding:"6px 10px",fontWeight:600}}>{r.chofer||"—"}</td>
                          <td style={{padding:"6px 10px"}}><span style={{fontSize:9,padding:"1px 5px",borderRadius:3,fontWeight:700,background:r.fuente==="app"?"#DBEAFE":"#F3F4F6",color:r.fuente==="app"?"#1e40af":"#6B7280"}}>{r.fuente==="app"?"App":"Hist."}</span></td>
                          <td style={{padding:"6px 10px"}}>{r.af==="exceso"?<Badge type="exc">Exceso</Badge>:r.af==="deficit"?<Badge type="def_">Déficit</Badge>:<span style={{color:C.ok,fontSize:11,fontWeight:600}}>✓ Normal</span>}</td>
                        </tr>);
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>);
          })()}
          
          {view==="todos"&&(()=>{
            const rows=vales.filter(v=>{
              // Filtro por mes (YYYY-MM) — default mes actual. Reduce drásticamente
              // la carga de fotos: en vez de bajar todas las fotos de todos los
              // meses, solo carga el mes seleccionado.
              if(tFiltro.mes && tFiltro.mes!=="todo"){
                if(!(v.fecha||"").startsWith(tFiltro.mes)) return false;
              }
              if(tFiltro.tipo&&v.tipo!==tFiltro.tipo)return false;
              if(tFiltro.fundo&&v.fundo!==tFiltro.fundo)return false;
              if(tFiltro.cultivo&&v.cultivo!==tFiltro.cultivo)return false;
              if(tFiltro.estado==="aprobado"&&!v.aprobado)return false;
              if(tFiltro.estado==="rechazado"&&!v.rechazado)return false;
              if(tFiltro.estado==="pendiente"&&(v.aprobado||v.rechazado))return false;
              if(tFiltro.search){
                const q=tFiltro.search.toLowerCase();
                if(!(v.equipoDen+v.fundo+v.actividad+v.chofer).toLowerCase().includes(q))return false;
              }
              return true;
            }).sort((a,b)=>{
              const col=tSort.col;
              const va=col==="gl"?a.gl:col==="fecha"?a.fecha:col==="equipo"?a.equipoDen:col==="fundo"?a.fundo:a[col]||"";
              const vb=col==="gl"?b.gl:col==="fecha"?b.fecha:col==="equipo"?b.equipoDen:col==="fundo"?b.fundo:b[col]||"";
              if(typeof va==="number")return tSort.dir*(vb-va);
              return tSort.dir*String(va).localeCompare(String(vb));
            });
            const SortTh=({col,label,right})=>(
              <th onClick={()=>setTSort(s=>({col,dir:s.col===col?-s.dir:-1}))}
                style={{padding:"7px 10px",textAlign:right?"right":"left",fontSize:10,fontWeight:700,
                  color:tSort.col===col?C.blue:C.txt3,textTransform:"uppercase",letterSpacing:.4,
                  whiteSpace:"nowrap",cursor:"pointer",userSelect:"none",background:C.surf2}}>
                {label} {tSort.col===col?(tSort.dir===-1?"↓":"↑"):""}
              </th>
            );
            return(
              <div>
                
                <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
                  <input placeholder="🔍 Buscar equipo, fundo, actividad..." value={tFiltro.search}
                    onChange={e=>setTFiltro(f=>({...f,search:e.target.value}))}
                    style={{padding:"6px 11px",borderRadius:8,border:`1px solid ${C.bdr}`,fontSize:11,fontFamily:"inherit",outline:"none",minWidth:200}}/>
                  {/* Selector de mes — reduce drásticamente la carga de fotos */}
                  {(()=>{
                    // Generar opciones de mes a partir de los vales existentes
                    const mesesSet = new Set(vales.map(v=>(v.fecha||"").slice(0,7)).filter(Boolean));
                    const mesActual = new Date().toISOString().slice(0,7);
                    mesesSet.add(mesActual);
                    const meses = [...mesesSet].sort().reverse();
                    const fmtMes = (m)=>{
                      if(!m) return "";
                      const [y,mo] = m.split("-");
                      const nombres=["","Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
                      return `${nombres[parseInt(mo,10)]} ${y}`;
                    };
                    return(
                      <select value={tFiltro.mes} onChange={e=>setTFiltro(f=>({...f,mes:e.target.value}))}
                        title="Filtrar por mes (reduce carga de fotos)"
                        style={{fontSize:11,fontWeight:600,padding:"6px 10px",borderRadius:8,
                          border:`1.5px solid ${C.danper}`,fontFamily:"inherit",
                          background:tFiltro.mes==="todo"?"#FEE2E2":"#FFF5F6",
                          color:tFiltro.mes==="todo"?"#B91C1C":C.danper,WebkitAppearance:"none"}}>
                        {meses.map(m=><option key={m} value={m}>📅 {fmtMes(m)}</option>)}
                        <option value="todo">⚠ Todo el histórico</option>
                      </select>
                    );
                  })()}
                  {[["tipo","— Tipo —",[["TRACTOR","TRACTOR"],["CAMION","CAMIÓN"],["CISTERNA","CISTERNA"],["MONTACARGAS","MONTACARGAS"]]],
                    ["fundo","— Fundo —",(maestros.fundos||[]).map(f=>[f,f])],
                    ["cultivo","— Cultivo —",(maestros.cultivos||[]).map(c=>[c,c])],
                    ["estado","— Estado —",[["aprobado","✅ Aprobado"],["rechazado","✕ Rechazado"],["pendiente","⏳ Pendiente"]]],
                  ].map(([k,ph,opts])=>(
                    <select key={k} value={tFiltro[k]} onChange={e=>setTFiltro(f=>({...f,[k]:e.target.value}))}
                      style={{fontSize:11,padding:"6px 10px",borderRadius:8,border:`1px solid ${C.bdr}`,fontFamily:"inherit",background:tFiltro[k]?"#EFF6FF":C.surf2,WebkitAppearance:"none"}}>
                      <option value="">{ph}</option>
                      {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
                    </select>
                  ))}
                  {(tFiltro.tipo||tFiltro.fundo||tFiltro.cultivo||tFiltro.search||tFiltro.estado)&&(
                    <button onClick={()=>setTFiltro(f=>({tipo:"",fundo:"",cultivo:"",search:"",estado:"",mes:f.mes}))}
                      style={{fontSize:10,padding:"4px 10px",borderRadius:20,background:"#FEE2E2",color:"#B91C1C",border:"none",cursor:"pointer",fontFamily:"inherit"}}>
                      ✕ Limpiar
                    </button>
                  )}
                  <button onClick={exportExcel} style={{marginLeft:"auto",fontSize:11,fontWeight:600,padding:"5px 12px",background:"#166534",color:"#fff",border:"none",borderRadius:7,cursor:"pointer",fontFamily:"inherit"}}>📊 Exportar Excel</button>
                </div>
                
                <div style={{fontSize:11,color:C.txt3,marginBottom:8}}>
                  {rows.length} de {vales.length} vales · Clic en fila para ver detalle
                </div>
                
                {vales.length===0
                  ?<p style={{textAlign:"center",color:C.txt3,padding:48}}>Sin vales registrados aún.</p>
                  :<div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:12,overflow:"hidden"}}>
                    <div style={{overflowX:"auto",maxHeight:520,overflowY:"auto"}}>
                      <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                        <thead style={{position:"sticky",top:0}}>
                          <tr style={{background:C.surf2,borderBottom:`1px solid ${C.bdr}`}}>
                            <SortTh col="nVale" label="N° Vale"/>
                            <SortTh col="fecha" label="Fecha"/>
                            <th style={{padding:"7px 10px",fontSize:10,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap",background:C.surf2}}>Hora</th>
                            <SortTh col="equipo" label="Equipo"/>
                            <SortTh col="fundo" label="Fundo"/>
                            <th style={{padding:"7px 10px",fontSize:10,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap",background:C.surf2}}>Cultivo</th>
                            <th style={{padding:"7px 10px",fontSize:10,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap",background:C.surf2}}>Actividad</th>
                            <SortTh col="gl" label="Galones" right/>
                            <SortTh col="chofer" label="Chofer"/>
                            <th style={{padding:"7px 10px",fontSize:10,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap",background:C.surf2}}>Estado</th>
                            <th style={{padding:"7px 10px",fontSize:10,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap",background:C.surf2}}>🔒</th>
                            <th style={{padding:"7px 10px",fontSize:10,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap",background:C.surf2}}>📸 Medidor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((v,i)=>{
                            const isH=tHover===i;
                            const bg=v.alertaEnviada?"#FFF9C4":i%2===0?"#fff":C.surf2;
                            return(
                              <tr key={v.id}
                                style={{borderBottom:`0.5px solid ${C.bdr}`,background:isH?"#EFF6FF":bg,cursor:"pointer",transition:"background .1s"}}
                                onMouseEnter={()=>setTHover(i)} onMouseLeave={()=>setTHover(null)}
                                onClick={()=>{setDrawer({id:v.equipoId,den:v.equipoDen,tipo:v.tipo==="TRACTOR"?"T":v.tipo==="CISTERNA"?"I":"C"});setDrawerTab("app");}}>
                                <td style={{padding:"7px 10px",fontFamily:"monospace",color:C.txt3,fontSize:11}}>{v.nVale||"V-"+String(v.id).padStart(6,"0")}</td>
                                <td style={{padding:"7px 10px",fontFamily:"monospace"}}>{v.fecha}</td>
                                <td style={{padding:"7px 10px",fontFamily:"monospace",color:C.txt3}}>{v.hora}</td>
                                <td style={{padding:"7px 10px",fontWeight:600,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:isH?C.blue:C.txt}}>{v.equipoDen}</td>
                                <td style={{padding:"7px 10px"}}>{v.fundo}</td>
                                <td style={{padding:"7px 10px"}}>
                                  {v.cultivo?<span style={{fontSize:10,fontWeight:600,background:"#DCFCE7",color:"#166534",padding:"2px 7px",borderRadius:10}}>🌱 {v.cultivo}</span>:<span style={{color:C.txt3,fontSize:10}}>—</span>}
                                </td>
                                <td style={{padding:"7px 10px",color:C.txt3,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v.actividad}</td>
                                <td style={{padding:"7px 10px",fontFamily:"monospace",color:C.blue,fontWeight:700,textAlign:"right"}}>{(v.gl||0).toFixed(1)} gl</td>
                                <td style={{padding:"7px 10px",fontWeight:600}}>{v.chofer}</td>
                                <td style={{padding:"7px 10px"}}>{v.aprobado?<span style={{color:C.ok,fontSize:11,fontWeight:700}}>✅ Aprobado</span>:v.rechazado?<span style={{color:C.crit,fontSize:11,fontWeight:700}}>✕ Rechazado</span>:<span style={{color:C.warn,fontSize:11,fontWeight:700}}>⏳ Pendiente</span>}</td>
                                <td style={{padding:"7px 8px",textAlign:"center",fontSize:16}} title={v.candadoOk===true?"Candado OK":v.candadoOk===false?"⚠ Incidente reportado":"Sin verificar"}>
                                  {v.candadoOk===true?"🔒✅":v.candadoOk===false?"🔓⚠️":"—"}
                                </td>
                                <td style={{padding:"5px 8px",textAlign:"center"}}>
                                  {v.fotoMedidor
                                    ?<img
                                        src={v.fotoMedidor}
                                        alt="medidor"
                                        loading="lazy"
                                        title="Clic para ampliar"
                                        onClick={e=>{e.stopPropagation();verImagenAmpliada(v.fotoMedidor);}}
                                        style={{height:40,width:56,objectFit:"cover",borderRadius:5,
                                          border:`1px solid ${C.bdr}`,cursor:"zoom-in",display:"block"}}/>
                                    :<span style={{fontSize:10,color:C.txt3}}>—</span>}
                                </td>
                              </tr>
                            );
                          })}
                          {rows.length===0&&<tr><td colSpan={12} style={{textAlign:"center",padding:"28px",color:C.txt3}}>Sin registros para los filtros seleccionados</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </div>
                }
              </div>
            );
          })()}
          
          {view==="incidentes"&&(()=>{
            // Filtrar por mes (reduce carga de fotos del histórico)
            const incFiltrados = (incMes && incMes!=="todo")
              ? incidentes.filter(i => (i.fecha||"").startsWith(incMes))
              : incidentes;
            const incOrden = [...incFiltrados].sort((a,b)=>(b.timestamp||"").localeCompare(a.timestamp||""));
            const sinRevisar = incOrden.filter(i=>!i.revisado);
            const revisados  = incOrden.filter(i=>i.revisado);
            // Opciones de mes a partir de los incidentes existentes
            const mesesSet = new Set(incidentes.map(i=>(i.fecha||"").slice(0,7)).filter(Boolean));
            mesesSet.add(new Date().toISOString().slice(0,7));
            const meses = [...mesesSet].sort().reverse();
            const fmtMes = (m)=>{
              if(!m) return "";
              const [y,mo]=m.split("-");
              const nombres=["","Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
              return `${nombres[parseInt(mo,10)]} ${y}`;
            };
            const marcarRevisado = async(inc)=>{
              if(!inc._fireId){
                setToast({msg:"Error: incidente sin ID. Refresque la página.",type:"err"});
                return;
              }
              try{
                await guardar("incidentes", inc._fireId, limpiarUndefined({...inc, revisado:true, revisadoPor:user.nombre||user.usuario, revisadoEn:new Date().toISOString()}));
                setToast({msg:"✓ Incidente marcado como revisado",type:"ok"});
              }catch(e){ setToast({msg:"Error: "+e.message,type:"err"}); }
            };
            const IncidenteCard = ({inc, revisado=false}) => (
              <div style={{background:revisado?"#F9FAFB":"#FEF2F2",border:`1px solid ${revisado?C.bdr:"#FCA5A5"}`,
                borderRadius:10,padding:14,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:8}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                      <span style={{fontSize:18}}>{inc.tipo==="CANDADO_PROBLEMA"?"🔓":"⚠️"}</span>
                      <span style={{fontSize:13,fontWeight:700,color:revisado?C.txt2:"#991B1B"}}>
                        {inc.tipo==="CANDADO_PROBLEMA"?"Candado/tapa en mal estado":(inc.tipo||"Incidente")}
                      </span>
                      {revisado && <span style={{fontSize:9,fontWeight:700,color:C.ok,background:"#DCFCE7",borderRadius:8,padding:"2px 7px"}}>✓ REVISADO</span>}
                    </div>
                    <div style={{fontSize:11,color:C.txt3}}>
                      📅 {inc.fecha} · ⏰ {inc.hora} · 👤 {inc.almacenero||"—"}
                    </div>
                    {(inc.fundo || inc.equipoDen) && (inc.fundo!=="—" || inc.equipoDen!=="—") && (
                      <div style={{fontSize:11,color:C.txt2,marginTop:3,fontWeight:600}}>
                        {inc.fundo && inc.fundo!=="—" && <>📍 {inc.fundo}</>}
                        {inc.equipoDen && inc.equipoDen!=="—" && <> · 🚜 {inc.equipoDen}{inc.placa?` (${inc.placa})`:""}</>}
                      </div>
                    )}
                    <div style={{fontSize:12,color:C.txt2,marginTop:6,padding:"6px 10px",background:revisado?"#fff":"rgba(255,255,255,.7)",borderRadius:6,border:`1px solid ${C.bdr}`}}>
                      <span style={{fontWeight:600,fontSize:10,color:C.txt3,textTransform:"uppercase"}}>Descripción: </span>
                      {inc.nota||"Sin descripción"}
                    </div>
                    {revisado && inc.revisadoPor && (
                      <div style={{fontSize:10,color:C.txt3,marginTop:5,fontStyle:"italic"}}>
                        Revisado por {inc.revisadoPor} el {inc.revisadoEn?new Date(inc.revisadoEn).toLocaleString("es-PE"):"—"}
                      </div>
                    )}
                  </div>
                  {!revisado && (
                    <button onClick={()=>marcarRevisado(inc)}
                      style={{padding:"6px 12px",background:C.ok,color:"#fff",border:"none",borderRadius:8,
                        fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>
                      ✓ Marcar revisado
                    </button>
                  )}
                </div>
                {inc.foto && (
                  <div style={{marginTop:8}}>
                    <img src={inc.foto} alt="incidente"
                      loading="lazy"
                      onClick={()=>verImagenAmpliada(inc.foto)}
                      style={{maxWidth:200,maxHeight:140,objectFit:"cover",borderRadius:6,
                        border:`1px solid ${C.bdr}`,cursor:"zoom-in"}}/>
                  </div>
                )}
              </div>
            );
            return(
              <>
                {/* Selector de mes para limitar la carga */}
                <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:10,
                  padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  <span style={{fontSize:12,fontWeight:600,color:C.txt2}}>📅 Mes:</span>
                  <select value={incMes} onChange={e=>setIncMes(e.target.value)}
                    style={{fontSize:11,fontWeight:600,padding:"6px 12px",borderRadius:8,
                      border:`1.5px solid ${C.danper}`,fontFamily:"inherit",
                      background:incMes==="todo"?"#FEE2E2":"#FFF5F6",
                      color:incMes==="todo"?"#B91C1C":C.danper,WebkitAppearance:"none"}}>
                    {meses.map(m=><option key={m} value={m}>{fmtMes(m)}</option>)}
                    <option value="todo">⚠ Todo el histórico</option>
                  </select>
                  <span style={{fontSize:10,color:C.txt3,marginLeft:"auto"}}>
                    Mostrando {incOrden.length} de {incidentes.length} incidentes totales
                  </span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
                  <KCard label="Total mes" value={incOrden.length} sub="filtrados"/>
                  <KCard label="Sin revisar" value={sinRevisar.length} sub="requieren atención" color={C.crit} accent={C.crit}/>
                  <KCard label="Revisados" value={revisados.length} sub="cerrados" color={C.ok} accent={C.ok}/>
                </div>
                {sinRevisar.length>0 && (
                  <div style={{marginBottom:18}}>
                    <div style={{fontSize:12,fontWeight:700,marginBottom:10,color:"#991B1B"}}>
                      ⚠ Incidentes sin revisar ({sinRevisar.length})
                    </div>
                    {sinRevisar.map((inc,i)=><IncidenteCard key={inc._fireId||i} inc={inc}/>)}
                  </div>
                )}
                {revisados.length>0 && (
                  <div>
                    <div style={{fontSize:12,fontWeight:700,marginBottom:10,color:C.txt3}}>
                      ✓ Historial revisados ({revisados.length})
                    </div>
                    {revisados.map((inc,i)=><IncidenteCard key={inc._fireId||i} inc={inc} revisado/>)}
                  </div>
                )}
                {incOrden.length===0 && (
                  <div style={{textAlign:"center",padding:"60px 20px",color:C.txt3}}>
                    <div style={{fontSize:48,marginBottom:12}}>🟢</div>
                    <div style={{fontSize:14,fontWeight:600}}>
                      {incidentes.length===0 ? "No hay incidentes reportados" : `No hay incidentes en ${fmtMes(incMes)}`}
                    </div>
                  </div>
                )}
              </>
            );
          })()}

          {view==="usuarios"&&(
            <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <div style={{fontSize:13,fontWeight:700}}>👥 Usuarios del sistema</div>
                <div style={{fontSize:11,color:C.txt3,background:"#FEF3C7",border:"1px solid #F59E0B",borderRadius:8,padding:"5px 10px"}}>
                  ℹ La creación y modificación de usuarios es solo del Gerente
                </div>
              </div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead><tr style={{borderBottom:`1px solid ${C.bdr}`,background:C.surf2}}>
                  {["Usuario","Nombre","Rol","Cultivos","Estado"].map(h=><th key={h} style={{padding:"6px 10px",textAlign:"left",fontSize:10,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.4}}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {(users||[]).map((u,i)=>(
                    <tr key={u.id} style={{borderBottom:`0.5px solid ${C.bdr}`,background:!u.activo?"#f9f9f9":i%2===0?"#fff":C.surf2,opacity:u.activo?1:.6}}>
                      <td style={{padding:"7px 10px",fontFamily:"monospace",fontWeight:600}}>{u.usuario}</td>
                      <td style={{padding:"7px 10px"}}>{u.nombre}</td>
                      <td style={{padding:"7px 10px"}}><Badge type={u.rol==="plan"?"exc":u.rol==="apro"?"warn":u.rol==="ger"?"def_":"ok"}>{u.rol==="plan"?"Planner":u.rol==="apro"?"Aprobador":u.rol==="ger"?"Gerente":"Almacenero"}</Badge></td>
                      <td style={{padding:"7px 10px",fontSize:10,color:C.txt3}}>{(u.cultivos||[]).join(", ")||"—"}</td>
                      <td style={{padding:"7px 10px"}}><Badge type={u.activo?"ok":"warn"}>{u.activo?"Activo":"Inactivo"}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {view==="mant"&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
              <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16,gridColumn:"1 / -1"}}>
                <div style={{fontSize:13,fontWeight:700,marginBottom:4}}>⛽ Precio de combustible</div>
                <div style={{fontSize:11,color:C.txt3,marginBottom:12}}>Usado para calcular el costo aproximado en el panel del Aprobador.</div>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,background:"#F0FDF4",border:"2px solid #16A34A",borderRadius:10,padding:"10px 16px"}}>
                    <span style={{fontSize:18}}>S/</span>
                    <input type="number" step="0.1" min="0"
                      value={maestros.precioPorGalon||18.5}
                      onChange={e=>{const v=parseFloat(e.target.value)||0;setMaestros({...maestros,precioPorGalon:v});}}
                      style={{width:80,fontSize:20,fontWeight:700,color:"#166534",background:"none",border:"none",outline:"none",fontFamily:"inherit",textAlign:"right"}}/>
                    <span style={{fontSize:13,color:"#166534",fontWeight:600}}>/gal (Petróleo D2)</span>
                  </div>
                </div>
              </div>
              <MantList k="fundos" label="🌾 Fundos"/>
              <MantList k="cultivos" label="🌱 Cultivos"/>
              <MantList k="almaceneros" label="🧑‍🔧 Almaceneros"/>
              {/* Actividades — solo lectura para el Planner */}
              <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16,
                boxShadow:"0 1px 3px rgba(0,0,0,.06)",gridColumn:"1 / -1"}}>
                <div style={{fontSize:13,fontWeight:700,marginBottom:4,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span>⚙ Actividades y ratios de consumo</span>
                  <span style={{fontSize:10,color:C.txt3,background:"#FEF3C7",padding:"2px 8px",borderRadius:6,border:"1px solid #F59E0B"}}>
                    ✎ Solo el Gerente puede editar ratios
                  </span>
                </div>
                <div style={{fontSize:11,color:C.txt3,marginBottom:10}}>{(maestros.actividades||[]).length} actividades configuradas</div>
                <div style={{overflowX:"auto",maxHeight:280,overflowY:"auto",borderRadius:8,border:`1px solid ${C.bdr}`}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                    <thead style={{position:"sticky",top:0}}>
                      <tr style={{background:C.surf2,borderBottom:`1px solid ${C.bdr}`}}>
                        {["Actividad","Ratio","Unidad","Aplica a"].map(h=>(
                          <th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.4}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(maestros.actividades||[]).map((a,i)=>(
                        <tr key={a.nombre||i} style={{borderBottom:`0.5px solid ${C.bdr}`,background:i%2===0?"#fff":C.surf2}}>
                          <td style={{padding:"6px 10px",fontWeight:500}}>{a.nombre||a}</td>
                          <td style={{padding:"6px 10px",fontFamily:"monospace",fontWeight:700,color:C.navy,textAlign:"right"}}>{a.ratio||"—"}</td>
                          <td style={{padding:"6px 10px",color:C.txt3}}>{a.unit||"—"}</td>
                          <td style={{padding:"6px 10px"}}>
                            <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                              {(a.tipos||[]).map(t=>(
                                <span key={t} style={{fontSize:9,padding:"1px 5px",borderRadius:3,
                                  background:t==="TRACTOR"?"#DBEAFE":t==="CAMION"?"#D1FAE5":t==="CISTERNA"?"#FEE2E2":"#FEF9C3",
                                  color:t==="TRACTOR"?"#1e3a8a":t==="CAMION"?"#064e3b":t==="CISTERNA"?"#7f1d1d":"#713f12",
                                  fontWeight:700}}>{t}</span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <MantChoferesCard maestros={maestros} setMaestros={setMaestros} setToast={setToast}/>
              <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16}}>
                <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>🚛 Equipos <span style={{fontSize:11,color:C.txt3,fontWeight:400}}>({(maestros.equipos||[]).length})</span></div>
                <div style={{maxHeight:160,overflowY:"auto",marginBottom:10}}>
                  {(maestros.equipos||[]).map((e,i)=>(
                    <div key={e.id} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 4px"}}>
                      <span style={{fontSize:10,padding:"1px 5px",borderRadius:3,background:"#F3F4F6",color:C.txt3,flexShrink:0}}>{e.tipo}</span>
                      <span style={{flex:1,fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{e.den}</span>
                      <button onClick={()=>delEquipo(i)} style={{background:"none",border:"none",color:C.txt3,cursor:"pointer",fontSize:16,padding:"0 4px",lineHeight:1}}>×</button>
                    </div>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr auto",gap:6}}>
                  <input placeholder="Nombre equipo" value={eqInput.den} onChange={e=>setEqInput(x=>({...x,den:e.target.value}))} style={{padding:"6px 8px",border:`1.5px solid ${C.bdr}`,borderRadius:7,fontSize:11,fontFamily:"inherit",outline:"none"}}/>
                  <select value={eqInput.tipo} onChange={e=>setEqInput(x=>({...x,tipo:e.target.value}))} style={{padding:"6px",border:`1.5px solid ${C.bdr}`,borderRadius:7,fontSize:11,fontFamily:"inherit",WebkitAppearance:"none"}}>
                    <option>TRACTOR</option><option>CAMION</option><option>CISTERNA</option><option>MONTACARGAS</option>
                  </select>
                  <input placeholder="Placa" value={eqInput.placa} onChange={e=>setEqInput(x=>({...x,placa:e.target.value}))} style={{padding:"6px 8px",border:`1.5px solid ${C.bdr}`,borderRadius:7,fontSize:11,fontFamily:"inherit",outline:"none"}}/>
                  <button onClick={addEquipo} style={{padding:"6px 10px",background:C.blue,color:"#fff",border:"none",borderRadius:7,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>+</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast({msg:""})}/>
      <DrawerDetalle drawer={drawer} setDrawer={setDrawer} drawerTab={drawerTab} setDrawerTab={setDrawerTab} vales={vales} maestros={maestros}/>
    </div>
  );
}
function AppAprobador({user,onLogout,vales,setVales,users,precioPorGalon=18.5}){
  const [tab,setTab]=useState("pendientes");
  const [toast,setToast]=useState({msg:""});
  const RED="#E20613";
  const misCultivos=user.cultivos||[];
  const misVales=vales.filter(v=>misCultivos.length===0||misCultivos.includes(v.cultivo))
    .sort((a,b)=>{
      // Sort cronológico descendente usando strings (estable, sin parseo de fecha)
      const fa=(a.fecha||"")+" "+(a.hora||"");
      const fb=(b.fecha||"")+" "+(b.hora||"");
      if(fa!==fb) return fb.localeCompare(fa);
      return (b.id||0)-(a.id||0);
    });
  const dentro24h=(v)=>{
    try{
      let fh=v.fecha;
      const h=(v.hora||"").trim();
      const pm=h.match(/(\d{1,2}):(\d{2})\s*p\.?\s*m\.?/i);
      const am=h.match(/(\d{1,2}):(\d{2})\s*a\.?\s*m\.?/i);
      if(pm){let hr=parseInt(pm[1]);if(hr<12)hr+=12;fh+="T"+String(hr).padStart(2,"0")+":"+pm[2]+":00";}
      else if(am){let hr=parseInt(am[1]);if(hr===12)hr=0;fh+="T"+String(hr).padStart(2,"0")+":"+am[2]+":00";}
      else if(/^\d{2}:\d{2}$/.test(h))fh+="T"+h+":00";
      else fh+="T00:00:00";
      return(new Date()-new Date(fh))<24*3600000;
    }catch{return true;}
  };
  const pendientes=misVales.filter(v=>!v.aprobado&&!v.rechazado);
  const aprobados=misVales.filter(v=>v.aprobado);
  const rechazados=misVales.filter(v=>v.rechazado);
  const vencidos=pendientes.filter(v=>!dentro24h(v));
  const aprobar=async(id,notas)=>{
    const upd=vales.map(v=>v.id===id?{...v,aprobado:true,rechazado:false,aprobadoPor:user.nombre||user.usuario,fechaAprobacion:new Date().toISOString(),notasAprobacion:notas}:v);
    await setVales(upd);setToast({msg:"✅ Vale aprobado",type:"ok"});
  };
  const rechazar=async(id,notas)=>{
    const upd=vales.map(v=>v.id===id?{...v,aprobado:false,rechazado:true,aprobadoPor:user.nombre||user.usuario,fechaAprobacion:new Date().toISOString(),notasAprobacion:notas}:v);
    await setVales(upd);setToast({msg:"⚠ Vale rechazado",type:"warn"});
  };
  const exportReporte=()=>{
    const rows=misVales.map(v=>[v.fecha,v.hora,v.fundo,v.cultivo,v.equipoDen,v.tipo,v.actividad,v.gl,v.producto,v.chofer,v.almacenero,v.aprobado?"Aprobado":v.rechazado?"Rechazado":"Pendiente",v.aprobadoPor||"",v.notasAprobacion||"",dentro24h(v)?"En plazo":"Vencido"]);
    const head=["Fecha","Hora","Fundo","Cultivo","Equipo","Tipo","Actividad","Galones","Combustible","Chofer","Almacenero","Estado","Aprobado por","Notas","Plazo"];
    const csv=[head,...rows].map(r=>r.join(",")).join("\n");
    const a=document.createElement("a");
    a.href="data:text/csv;charset=utf-8,\uFEFF"+encodeURIComponent(csv);
    a.download=`reporte_${user.nombre?.replace(/ /g,"_")}_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };
  const ValeCard=({v})=>{
    const [notas,setNotas]=useState("");
    const plazoOk=dentro24h(v);
    const tienePrevio = v.kmAnterior && v.kmAnterior > 0;
    const dif = tienePrevio ? (v.diferencia||0) : 0;
    const glEsp = (v.teoRatio && dif > 0) ? (v.teoUnit==="Km/Gl"?dif/v.teoRatio:dif*v.teoRatio) : null;
    const diffNum=glEsp?v.gl-glEsp:null;
    const desvPct=glEsp?((v.gl-glEsp)/glEsp)*100:null;
    const absDesv=desvPct!=null?Math.abs(desvPct):null;
    let rangoBg="#F3F4F6",rangoBorder=C.bdr,rangoColor=C.txt3,rangoIco="📊",rangoLabel="Sin ref.";
    if(absDesv!=null){
      if(absDesv<=5){rangoBg="#DCFCE7";rangoBorder="#16A34A";rangoColor="#166534";rangoIco="✅";rangoLabel="Dentro del rango (±5%)";}
      else if(absDesv<=10){rangoBg="#FEF3C7";rangoBorder="#D97706";rangoColor="#92400E";rangoIco="⚠";rangoLabel="Fuera parcialmente (±10%)";}
      else{rangoBg="#FEE2E2";rangoBorder="#DC2626";rangoColor="#991B1B";rangoIco="🚨";rangoLabel="Fuera de rango (>10%)";}
    }
    const pxGal=precioPorGalon||0;
    const costoReal=pxGal?v.gl*pxGal:null;
    const costoEsp=pxGal&&glEsp?glEsp*pxGal:null;
    return(
      <div style={{background:C.surf,border:`1.5px solid ${v.rechazado?C.crit:v.aprobado?C.ok:rangoBorder}`,borderRadius:12,padding:16,marginBottom:10,boxShadow:"0 1px 4px rgba(0,0,0,.07)"}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:13,marginBottom:2}}>{v.equipoDen}</div>
            <div style={{fontSize:11,color:C.txt3}}>{v.fecha} {v.hora} · {v.fundo} · {v.nVale||"V-"+String(v.id).padStart(6,"0")}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
            {v.aprobado&&<Badge type="ok">✅ Aprobado</Badge>}
            {v.rechazado&&<Badge type="warn">✕ Rechazado</Badge>}
            {!v.aprobado&&!v.rechazado&&(plazoOk?<Badge type="ok">⏱ En plazo</Badge>:<span style={{fontSize:10,fontWeight:700,color:"#D97706",background:"#FEF3C7",padding:"2px 7px",borderRadius:5}}>⚠ Vencido</span>)}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:6,marginBottom:6}}>
          <div style={{background:C.surf2,borderRadius:7,padding:"8px 10px"}}>
            <div style={{fontSize:9,color:C.txt3,textTransform:"uppercase",letterSpacing:.4,marginBottom:3}}>Actividad</div>
            <div style={{fontSize:11,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v.actividad}</div>
          </div>
          <div style={{background:"#EFF6FF",borderRadius:7,padding:"8px 10px"}}>
            <div style={{fontSize:9,color:"#1e40af",textTransform:"uppercase",letterSpacing:.4,marginBottom:3}}>Combustible</div>
            <div style={{fontSize:11,fontWeight:600,color:"#1e40af"}}>{v.producto}</div>
          </div>
          <div style={{background:"#EFF6FF",borderRadius:7,padding:"8px 10px"}}>
            <div style={{fontSize:9,color:"#1e40af",textTransform:"uppercase",letterSpacing:.4,marginBottom:3}}>Cantidad</div>
            <div style={{fontSize:14,fontWeight:700,color:C.blue}}>{v.gl?.toFixed(1)} gl</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,marginBottom:6}}>
          <div style={{background:C.surf2,borderRadius:7,padding:"8px 10px"}}>
            <div style={{fontSize:9,color:C.txt3,textTransform:"uppercase",letterSpacing:.4,marginBottom:3}}>{v.teoUnit==="Gl/Hr"?"Horómetro final":"Km final"}</div>
            <div style={{fontSize:11,fontWeight:600}}>{v.km?v.km.toLocaleString():"—"}</div>
            {v.kmAnterior&&<div style={{fontSize:9,color:C.txt3,marginTop:2}}>Ant: {v.kmAnterior.toLocaleString()}</div>}
            {v.diferencia>0&&<div style={{fontSize:9,color:C.blue,marginTop:1}}>Δ {v.diferencia?.toFixed(1)}</div>}
          </div>
          <div style={{background:C.surf2,borderRadius:7,padding:"8px 10px"}}>
            <div style={{fontSize:9,color:C.txt3,textTransform:"uppercase",letterSpacing:.4,marginBottom:3}}>Ratio teórico</div>
            <div style={{fontSize:11,fontWeight:600}}>{v.teoRatio?`${v.teoRatio} ${v.teoUnit}`:"—"}</div>
          </div>
          <div style={{background:C.surf2,borderRadius:7,padding:"8px 10px"}}>
            <div style={{fontSize:9,color:C.txt3,textTransform:"uppercase",letterSpacing:.4,marginBottom:3}}>Consumo esperado</div>
            <div style={{fontSize:11,fontWeight:600}}>{glEsp?glEsp.toFixed(1)+" gl":"—"}</div>
            {glEsp&&dif>0&&<div style={{fontSize:9,color:C.txt3,marginTop:2}}>{dif?.toFixed(1)} {v.teoUnit==="Gl/Hr"?"h":"km"} × {v.teoRatio}</div>}
          </div>
          <div style={{background:rangoBg,border:`1px solid ${rangoBorder}`,borderRadius:7,padding:"8px 10px"}}>
            <div style={{fontSize:9,color:rangoColor,textTransform:"uppercase",letterSpacing:.4,marginBottom:3}}>Consumo real</div>
            <div style={{fontSize:14,fontWeight:700,color:rangoColor}}>{v.gl?.toFixed(1)} gl</div>
            {desvPct!=null&&<div style={{fontSize:9,fontWeight:600,color:rangoColor,marginTop:2}}>{rangoIco} {desvPct>=0?"+":""}{desvPct.toFixed(1)}%</div>}
          </div>
        </div>
        {absDesv!=null&&(
          <div style={{background:"rgba(0,0,0,.06)",borderRadius:4,height:5,marginBottom:8,overflow:"hidden"}}>
            <div style={{width:Math.min(absDesv/20*100,100)+"%",height:"100%",background:absDesv<=5?"#16A34A":absDesv<=10?"#D97706":"#DC2626",borderRadius:4}}/>
          </div>
        )}
        <div style={{fontSize:10,color:rangoColor,fontWeight:600,marginBottom:8}}>
          {rangoLabel}{desvPct!=null&&` · Desviación: ${desvPct>=0?"+":""}${desvPct.toFixed(1)}%`}{diffNum!=null&&` · Dif: ${diffNum>=0?"+":""}${diffNum.toFixed(1)} gl`}
        </div>
        {costoReal!=null&&(
          <div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:8,padding:"10px 14px",marginBottom:8}}>
            <div style={{fontSize:10,fontWeight:700,color:"#166534",textTransform:"uppercase",marginBottom:8}}>💰 Costo aproximado de combustible</div>
            <div style={{display:"flex",gap:16,flexWrap:"wrap",alignItems:"center"}}>
              <div><div style={{fontSize:9,color:"#166534",marginBottom:2}}>Real ({v.gl?.toFixed(1)} gl)</div><div style={{fontSize:16,fontWeight:700,color:"#166534"}}>S/ {costoReal.toFixed(2)}</div></div>
              {costoEsp&&<div><div style={{fontSize:9,color:"#166534",marginBottom:2}}>Esperado ({glEsp?.toFixed(1)} gl)</div><div style={{fontSize:14,fontWeight:600,color:"#166534"}}>S/ {costoEsp.toFixed(2)}</div></div>}
              {costoReal&&costoEsp&&<div><div style={{fontSize:9,color:costoReal>costoEsp?"#991B1B":"#166534",marginBottom:2}}>Diferencia</div><div style={{fontSize:14,fontWeight:700,color:costoReal>costoEsp?"#991B1B":"#166534"}}>{costoReal>costoEsp?"+":""}S/ {(costoReal-costoEsp).toFixed(2)}</div></div>}
              <div style={{marginLeft:"auto",fontSize:10,color:"#166534",opacity:.7}}>@ S/ {pxGal.toFixed(2)}/gal</div>
            </div>
          </div>
        )}
        <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
          <span style={{fontSize:10,color:C.txt2}}>Chofer: <strong>{v.chofer}</strong></span>
          <span style={{color:C.txt3}}>·</span>
          <span style={{fontSize:10,color:C.txt2}}>Almacenero: <strong>{v.almacenero}</strong></span>
          {v.alertaEnviada&&<Badge type="warn">⚠ Alerta consumo</Badge>}
        </div>
        {v.fotoMedidor&&(
          <div style={{marginBottom:10}}>
            <div style={{fontSize:9,color:C.txt3,marginBottom:3,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span>📸 Foto del medidor de combustible</span>
              <button onClick={()=>verImagenAmpliada(v.fotoMedidor)}
                style={{fontSize:9,color:C.blue,background:"none",border:`1px solid ${C.blue}`,
                  borderRadius:5,padding:"1px 7px",cursor:"pointer",fontFamily:"inherit"}}>
                🔍 Ampliar
              </button>
            </div>
            <img src={v.fotoMedidor} alt="medidor"
              title="Clic para ampliar"
              onClick={()=>verImagenAmpliada(v.fotoMedidor)}
              style={{width:"100%",maxHeight:110,border:`1px solid ${C.bdr}`,borderRadius:8,
                objectFit:"cover",cursor:"zoom-in"}}/>
          </div>
        )}
        {!v.aprobado&&!v.rechazado&&(
          <div>
            <textarea placeholder="Observaciones (obligatorio para rechazar)" value={notas}
              onChange={e=>setNotas(e.target.value)}
              style={{width:"100%",padding:"7px 9px",border:`1px solid ${C.bdr}`,borderRadius:7,fontSize:11,fontFamily:"inherit",resize:"none",minHeight:40,marginBottom:8,outline:"none"}}/>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>aprobar(v.id,notas)} style={{flex:1,padding:"9px",background:C.ok,color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✅ Aprobar</button>
              <button onClick={()=>{if(!notas.trim()){alert("⚠ Debe indicar el motivo del rechazo.");return;}rechazar(v.id,notas);}} style={{flex:1,padding:"9px",background:C.critBg,color:C.crit,border:`1px solid ${C.crit}`,borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>✕ Rechazar (motivo requerido)</button>
            </div>
            <div style={{fontSize:9,color:C.crit,marginTop:4}}>* Para rechazar, el campo es obligatorio</div>
            {!plazoOk&&<div style={{marginTop:8,fontSize:11,color:C.warn,background:C.warnBg,borderRadius:7,padding:"6px 10px"}}>⚠ Superó las 24h — puede aprobar igualmente pero quedará como vencido.</div>}
          </div>
        )}
        {(v.aprobado||v.rechazado)&&v.aprobadoPor&&(
          <div style={{fontSize:10,color:C.txt3,marginTop:8}}>{v.aprobado?"✅ Aprobado":"✕ Rechazado"} por <strong>{v.aprobadoPor}</strong>{v.notasAprobacion&&` · "${v.notasAprobacion}"`}</div>
        )}
      </div>
    );
  };
  const tabData={pendientes,aprobados,rechazados};
  const tabs=[{k:"pendientes",label:"Pendientes",badge:pendientes.length,color:C.warn},{k:"aprobados",label:"Aprobados",badge:aprobados.length,color:C.ok},{k:"rechazados",label:"Rechazados",badge:rechazados.length,color:C.crit}];
  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"system-ui,sans-serif"}}>
      <style>{`*{box-sizing:border-box}`}</style>
      <div style={{background:RED,padding:"0 18px",display:"flex",alignItems:"center",height:52,gap:12,position:"sticky",top:0,zIndex:10,boxShadow:"0 2px 8px rgba(226,6,19,.3)"}}>
        <img src={LOGO_SRC} alt="Danper" style={{width:36,height:36,borderRadius:"50%",objectFit:"cover",flexShrink:0,border:"2px solid rgba(255,255,255,.25)"}}/>
        <div>
          <div style={{color:"#fff",fontSize:13,fontWeight:700}}>Panel de Aprobaciones</div>
          <div style={{color:"rgba(255,255,255,.7)",fontSize:10}}>{user.nombre} · Cultivo{misCultivos.length>1?"s":""}: {misCultivos.join(", ")||"Todos"}</div>
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <button onClick={exportReporte} style={{background:"rgba(255,255,255,.15)",border:"none",borderRadius:7,color:"#fff",padding:"6px 12px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>⬇ Exportar reporte</button>
          <button onClick={onLogout} style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:7,color:"#fff",padding:"6px 12px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Salir</button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,padding:"14px 16px 0"}}>
        {[{l:"Total mi cultivo",v:misVales.length,c:C.blue,acc:C.blue},{l:"Pendientes",v:pendientes.length,c:C.warn,acc:C.warn},{l:"Vencidos (>24h)",v:vencidos.length,c:C.crit,acc:C.crit},{l:"Aprobados",v:aprobados.length,c:C.ok,acc:C.ok}].map(k=>(
          <div key={k.l} style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:12,padding:"12px 14px",borderTop:`3px solid ${k.acc}`}}>
            <div style={{fontSize:9,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>{k.l}</div>
            <div style={{fontSize:20,fontWeight:700,color:k.c}}>{k.v}</div>
          </div>
        ))}
      </div>
      {vencidos.length>0&&<div style={{margin:"12px 16px 0",background:C.critBg,border:`1px solid ${C.crit}`,borderRadius:10,padding:"10px 14px",fontSize:12,color:C.crit,fontWeight:600}}>⚠ Tienes {vencidos.length} vale{vencidos.length>1?"s":""} vencido{vencidos.length>1?"s":""} sin aprobar (más de 24h)</div>}
      <div style={{display:"flex",gap:6,padding:"12px 16px 0"}}>
        {tabs.map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)}
            style={{flex:1,padding:"8px 6px",borderRadius:8,border:`1px solid ${tab===t.k?t.color:C.bdr}`,background:tab===t.k?t.color:"#fff",color:tab===t.k?"#fff":C.txt2,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
            {t.label}{t.badge>0&&<span style={{background:"rgba(255,255,255,.3)",color:"#fff",fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:10}}>{t.badge}</span>}
          </button>
        ))}
      </div>
      <div style={{padding:"12px 16px"}}>
        {(tabData[tab]||[]).length===0?<div style={{textAlign:"center",color:C.txt3,padding:"40px 0",fontSize:13}}>Sin registros en esta categoría</div>:(tabData[tab]||[]).map(v=><ValeCard key={v.id} v={v}/>)}
      </div>
      <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast({msg:""})}/>
    </div>
  );
}

// ─── GERENTE: MantActividadesCard con acceso total ────────────────────────────
function GerMantActividadesCard({maestros,onGuardarMaestros,setToast}){
  const acts = maestros.actividades||[];
  const [editIdx,setEditIdx] = useState(null);
  const [editData,setEditData] = useState({});
  const [newAct,setNewAct] = useState({nombre:"",ratio:"",unit:"Gl/Hr",tipos:[]});
  const inp = {width:"100%",padding:"6px 8px",border:`1px solid ${C.bdr}`,borderRadius:6,fontSize:12,fontFamily:"inherit",outline:"none"};

  const save = async(newActs) => {
    const m = {...maestros, actividades: newActs};
    try{ await onGuardarMaestros(m); setToast({msg:"✓ Guardado en Firebase",type:"ok"}); }
    catch(e){ setToast({msg:"Error: "+e.message,type:"err"}); }
  };

  const delAct = async(i) => {
    if(!window.confirm("¿Eliminar esta actividad?")) return;
    const arr=[...acts]; arr.splice(i,1); await save(arr);
  };

  const startEdit = (i) => {
    setEditIdx(i);
    setEditData({...acts[i]});
  };

  const saveEdit = async() => {
    if(!editData.nombre||!editData.ratio){ setToast({msg:"Complete nombre y ratio",type:"err"}); return; }
    const arr=[...acts];
    arr[editIdx]={...editData,ratio:parseFloat(editData.ratio)||0};
    await save(arr); setEditIdx(null);
  };

  const addAct = async() => {
    if(!newAct.nombre||!newAct.ratio||newAct.tipos.length===0){
      setToast({msg:"Complete nombre, ratio y al menos un tipo",type:"err"}); return;
    }
    const arr=[...acts,{...newAct,ratio:parseFloat(newAct.ratio)||0}]
      .sort((a,b)=>(a.nombre||"").localeCompare(b.nombre||""));
    await save(arr);
    setNewAct({nombre:"",ratio:"",unit:"Gl/Hr",tipos:[]});
  };

  const TIPOS=["TRACTOR","CAMION","CISTERNA","MONTACARGAS"];
  const UNITS=["Gl/Hr","Km/Gl"];
  const tipoBadge={TRACTOR:"#DBEAFE",CAMION:"#D1FAE5",CISTERNA:"#FEE2E2",MONTACARGAS:"#FEF9C3"};
  const tipoColor={TRACTOR:"#1e3a8a",CAMION:"#064e3b",CISTERNA:"#7f1d1d",MONTACARGAS:"#713f12"};

  return(
    <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16}}>
      <div style={{fontSize:13,fontWeight:700,marginBottom:14}}>⚙ Actividades y ratios de consumo ({acts.length})</div>
      <div style={{maxHeight:320,overflowY:"auto",marginBottom:14,border:`1px solid ${C.bdr}`,borderRadius:8}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead style={{position:"sticky",top:0}}>
            <tr style={{background:C.surf2,borderBottom:`1px solid ${C.bdr}`}}>
              {["Actividad","Ratio","Unidad","Tipos",""].map(h=>(
                <th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:10,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.4}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {acts.map((a,i)=>(
              <tr key={i} style={{borderBottom:`0.5px solid ${C.bdr}`,background:i%2===0?"#fff":C.surf2}}>
                {editIdx===i?(
                  <>
                    <td style={{padding:"5px 8px"}}><input value={editData.nombre} onChange={e=>setEditData(d=>({...d,nombre:e.target.value}))} style={inp}/></td>
                    <td style={{padding:"5px 8px"}}><input type="number" step="0.1" value={editData.ratio} onChange={e=>setEditData(d=>({...d,ratio:e.target.value}))} style={{...inp,width:70}}/></td>
                    <td style={{padding:"5px 8px"}}>
                      <select value={editData.unit} onChange={e=>setEditData(d=>({...d,unit:e.target.value}))} style={{...inp,WebkitAppearance:"none",width:80}}>
                        {UNITS.map(u=><option key={u} value={u}>{u}</option>)}
                      </select>
                    </td>
                    <td style={{padding:"5px 8px"}}>
                      <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                        {TIPOS.map(t=>{
                          const sel=(editData.tipos||[]).includes(t);
                          return(<button key={t} onClick={()=>setEditData(d=>({...d,tipos:sel?(d.tipos||[]).filter(x=>x!==t):[...(d.tipos||[]),t]}))}
                            style={{fontSize:9,padding:"2px 6px",borderRadius:3,border:`1px solid ${sel?"#2563EB":C.bdr}`,background:sel?"#DBEAFE":"#fff",color:sel?"#1e3a8a":C.txt3,cursor:"pointer",fontFamily:"inherit"}}>{t}</button>);
                        })}
                      </div>
                    </td>
                    <td style={{padding:"5px 8px"}}>
                      <div style={{display:"flex",gap:4}}>
                        <button onClick={saveEdit} style={{fontSize:10,padding:"3px 8px",background:C.ok,color:"#fff",border:"none",borderRadius:5,cursor:"pointer",fontFamily:"inherit"}}>✓</button>
                        <button onClick={()=>setEditIdx(null)} style={{fontSize:10,padding:"3px 8px",background:C.surf2,border:`1px solid ${C.bdr}`,borderRadius:5,cursor:"pointer",fontFamily:"inherit"}}>✕</button>
                      </div>
                    </td>
                  </>
                ):(
                  <>
                    <td style={{padding:"6px 10px",fontWeight:500}}>{a.nombre}</td>
                    <td style={{padding:"6px 10px",fontFamily:"monospace",fontWeight:700,color:C.navy,textAlign:"right"}}>{a.ratio}</td>
                    <td style={{padding:"6px 10px",color:C.txt3}}>{a.unit}</td>
                    <td style={{padding:"6px 10px"}}>
                      <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                        {(a.tipos||[]).map(t=>(
                          <span key={t} style={{fontSize:9,padding:"1px 5px",borderRadius:3,fontWeight:700,background:tipoBadge[t]||"#F3F4F6",color:tipoColor[t]||"#374151"}}>{t}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{padding:"6px 8px"}}>
                      <div style={{display:"flex",gap:4}}>
                        <button onClick={()=>startEdit(i)} style={{fontSize:10,padding:"2px 8px",background:C.blue,color:"#fff",border:"none",borderRadius:5,cursor:"pointer",fontFamily:"inherit"}}>✎</button>
                        <button onClick={()=>delAct(i)} style={{fontSize:10,padding:"2px 8px",background:"#FEE2E2",color:"#DC2626",border:"1px solid #FCA5A5",borderRadius:5,cursor:"pointer",fontFamily:"inherit"}}>✕</button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Nueva actividad */}
      <div style={{background:"#F8FAFC",border:`1px dashed ${C.bdr}`,borderRadius:10,padding:12}}>
        <div style={{fontSize:11,fontWeight:700,color:C.txt2,marginBottom:8}}>+ Nueva actividad</div>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:8,marginBottom:8}}>
          <div>
            <label style={{fontSize:10,color:C.txt3,display:"block",marginBottom:3}}>Nombre</label>
            <input value={newAct.nombre} onChange={e=>setNewAct(a=>({...a,nombre:e.target.value}))}
              placeholder="Ej. Chapodo Mecanizado - Rotativa" style={inp}/>
          </div>
          <div>
            <label style={{fontSize:10,color:C.txt3,display:"block",marginBottom:3}}>Ratio</label>
            <input type="number" step="0.1" value={newAct.ratio} onChange={e=>setNewAct(a=>({...a,ratio:e.target.value}))}
              placeholder="2.5" style={inp}/>
          </div>
          <div>
            <label style={{fontSize:10,color:C.txt3,display:"block",marginBottom:3}}>Unidad</label>
            <select value={newAct.unit} onChange={e=>setNewAct(a=>({...a,unit:e.target.value}))}
              style={{...inp,WebkitAppearance:"none"}}>
              {UNITS.map(u=><option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <div style={{marginBottom:8}}>
          <label style={{fontSize:10,color:C.txt3,display:"block",marginBottom:5}}>Aplica a (seleccionar al menos uno)</label>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {TIPOS.map(t=>{
              const sel=(newAct.tipos||[]).includes(t);
              return(<button key={t} onClick={()=>setNewAct(a=>({...a,tipos:sel?(a.tipos||[]).filter(x=>x!==t):[...(a.tipos||[]),t]}))}
                style={{padding:"4px 10px",borderRadius:20,fontSize:11,fontWeight:600,
                  border:`1.5px solid ${sel?C.blue:C.bdr}`,background:sel?"#EFF6FF":"#fff",
                  color:sel?C.blue:C.txt3,cursor:"pointer",fontFamily:"inherit"}}>
                {t==="TRACTOR"?"🚜":t==="CAMION"?"🚛":t==="CISTERNA"?"🚰":"🛺"} {t}
              </button>);
            })}
          </div>
        </div>
        <button onClick={addAct}
          style={{padding:"8px 20px",background:`linear-gradient(135deg,${C.navy},${C.blue})`,
            color:"#fff",border:"none",borderRadius:8,fontSize:12,fontWeight:700,
            cursor:"pointer",fontFamily:"inherit"}}>
          + Agregar actividad
        </button>
      </div>
    </div>
  );
}

function AppGerente({user,onLogout,vales,setVales,users,setUsers,maestros:maestrosProp,recargarDatos}){
  const [view,setView]=useState("vales");
  const [toast,setToast]=useState({msg:""});
  const [editId,setEditId]=useState(null);
  const [editData,setEditData]=useState({});
  const [editMotivo,setEditMotivo]=useState("");
  const [logFilter,setLogFilter]=useState("");
  const [editUser,setEditUser]=useState(null);
  const [newUser,setNewUser]=useState({usuario:"",pass:"",nombre:"",rol:"alm",cultivos:[]});
  const [gerFiltro,setGerFiltro]=useState({estado:"",fundo:"",cultivo:"",tipo:"",search:""});
  const [gerSort,setGerSort]=useState({col:"fecha",dir:-1});
  const RED="#E20613";
  // Cargar maestros propios desde Firebase (no depender del prop del padre)
  const [maestros,setMaestrosLocal]=useState(maestrosProp||{});
  useEffect(()=>{
    obtenerMaestros().then(m=>{
      if(m && Object.keys(m).length>0) setMaestrosLocal(m);
    }).catch(e=>console.warn(e));
    // Escuchar cambios en tiempo real
    const unsub = escuchar("config",(docs)=>{
      const mDoc=docs.find(d=>d._fireId==="maestros");
      if(mDoc){
        const {_fireId,_updatedAt,...m}=mDoc;
        if(Object.keys(m).length>0) setMaestrosLocal(m);
      }
    });
    return ()=>unsub();
  },[]);
  const auditLog=vales.flatMap(v=>(v._log||[]).map(l=>({...l,valeId:v.id,nVale:v.nVale,equipo:v.equipoDen}))).sort((a,b)=>(b.ts||"").localeCompare(a.ts||""));
  const startEdit=(v)=>{setEditId(v.id);setEditData({gl:v.gl??0,km:v.km??0,actividad:v.actividad||"",fundo:v.fundo||"",cultivo:v.cultivo||"",producto:v.producto||"",obs:v.obs||"",chofer:v.chofer||""});setEditMotivo("");};
  const saveEdit=async()=>{
    if(!editMotivo.trim()){alert("Debe indicar el motivo de la corrección.");return;}
    const orig=vales.find(x=>x.id===editId)||{};
    const logEntry={ts:new Date().toISOString(),editor:user.nombre||user.usuario,motivo:editMotivo,cambios:Object.entries(editData).reduce((acc,[k,v])=>{if(orig[k]!==v)acc[k]={de:orig[k],a:v};return acc;},{})};
    const upd=vales.map(v=>v.id===editId?{...v,...editData,gl:parseFloat(editData.gl)||v.gl,km:parseFloat(editData.km)||v.km,_corregido:true,_log:[...(v._log||[]),logEntry]}:v);
    await setVales(upd);setEditId(null);setToast({msg:"✓ Vale corregido con log",type:"ok"});
  };
  const inp={width:"100%",padding:"7px 9px",border:`1.5px solid ${C.bdr}`,borderRadius:7,fontSize:12,fontFamily:"inherit",outline:"none",background:"#fff"};
  return(
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"system-ui,sans-serif"}}>
      <style>{`*{box-sizing:border-box}select{-webkit-appearance:none}`}</style>
      <div style={{background:RED,padding:"0 18px",display:"flex",alignItems:"center",height:52,gap:12,position:"sticky",top:0,zIndex:10,boxShadow:"0 2px 8px rgba(226,6,19,.3)"}}>
        <img src={LOGO_SRC} alt="Danper" style={{width:36,height:36,borderRadius:"50%",objectFit:"cover",flexShrink:0,border:"2px solid rgba(255,255,255,.25)"}}/>
        <div>
          <div style={{color:"#fff",fontSize:13,fontWeight:700}}>Panel de Gerencia</div>
          <div style={{color:"rgba(255,255,255,.7)",fontSize:10}}>{user.nombre} · Edición con trazabilidad</div>
        </div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>
          {recargarDatos && <BotonRefrescar onRecargar={recargarDatos} onToast={setToast} dark/>}
          <button onClick={onLogout} style={{background:"rgba(255,255,255,.1)",border:"none",borderRadius:7,color:"#fff",padding:"6px 12px",fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Salir</button>
        </div>
      </div>
      <div style={{display:"flex",gap:6,padding:"12px 16px 0",flexWrap:"wrap"}}>
        {[["vales","📋 Registros"],["log","📜 Log auditoría"],["usuarios","👥 Usuarios"],["params","⚙ Actividades/Ratios"]].map(([t,l])=>(
          <button key={t} onClick={()=>setView(t)} style={{padding:"8px 16px",borderRadius:8,border:`1.5px solid ${view===t?RED:C.bdr}`,background:view===t?RED:"#fff",color:view===t?"#fff":C.txt2,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>
        ))}
      </div>
      <div style={{padding:14}}>
        {view==="vales"&&(()=>{
          const valesFiltrados = vales.filter(v=>{
            if(gerFiltro.estado==="aprobado"  && !v.aprobado) return false;
            if(gerFiltro.estado==="rechazado" && !v.rechazado) return false;
            if(gerFiltro.estado==="pendiente" && (v.aprobado||v.rechazado)) return false;
            if(gerFiltro.estado==="corregido" && !v._corregido) return false;
            if(gerFiltro.estado==="alerta"    && !v.alertaEnviada) return false;
            if(gerFiltro.fundo   && (v.fundo||"").trim()!==gerFiltro.fundo.trim()) return false;
            if(gerFiltro.cultivo && v.cultivo!==gerFiltro.cultivo) return false;
            if(gerFiltro.tipo    && v.tipo!==gerFiltro.tipo) return false;
            if(gerFiltro.search){
              const q = gerFiltro.search.toLowerCase();
              const hay = [v.equipoDen,v.fundo,v.chofer,v.almacenero,v.actividad,v.nVale,v.producto]
                .map(x=>(x||"").toLowerCase()).join(" ");
              if(!hay.includes(q)) return false;
            }
            return true;
          }).sort((a,b)=>{
            const c=gerSort.col, d=gerSort.dir;
            const va = c==="gl"?a.gl: c==="fecha"?`${a.fecha} ${a.hora}`: a[c]||"";
            const vb = c==="gl"?b.gl: c==="fecha"?`${b.fecha} ${b.hora}`: b[c]||"";
            if(typeof va==="number") return d*(vb-va);
            return d*String(va).localeCompare(String(vb));
          });
          const SortTh = ({col,label,right})=>(
            <th onClick={()=>setGerSort(s=>({col,dir:s.col===col?-s.dir:-1}))}
              style={{padding:"8px 10px",textAlign:right?"right":"left",fontSize:10,fontWeight:700,
                color:gerSort.col===col?RED:C.txt3,textTransform:"uppercase",letterSpacing:.4,
                whiteSpace:"nowrap",cursor:"pointer",userSelect:"none",background:C.surf2,position:"sticky",top:0,zIndex:1}}>
              {label} {gerSort.col===col?(gerSort.dir===-1?"↓":"↑"):""}
            </th>
          );
          const Th = ({children,right})=>(
            <th style={{padding:"8px 10px",textAlign:right?"right":"left",fontSize:10,fontWeight:700,
              color:C.txt3,textTransform:"uppercase",letterSpacing:.4,whiteSpace:"nowrap",
              background:C.surf2,position:"sticky",top:0,zIndex:1}}>{children}</th>
          );
          const totalGl   = valesFiltrados.reduce((s,v)=>s+(v.gl||0),0);
          const pendientes= valesFiltrados.filter(v=>!v.aprobado&&!v.rechazado).length;
          const corregidos= valesFiltrados.filter(v=>v._corregido).length;
          const alertas   = valesFiltrados.filter(v=>v.alertaEnviada).length;
          return(
            <div>
              <div style={{background:"#FEF3C7",border:"1px solid #F59E0B",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:"#92400E"}}>
                ⚠ <strong>Corrección:</strong> Clic en una fila para editar. Todos los cambios quedan en el log de auditoría.
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:14}}>
                <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:10,padding:"10px 12px",borderTop:`3px solid ${C.navy}`}}>
                  <div style={{fontSize:9,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>Total</div>
                  <div style={{fontSize:18,fontWeight:700,color:C.navy}}>{valesFiltrados.length}</div>
                </div>
                <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:10,padding:"10px 12px",borderTop:`3px solid ${C.blue}`}}>
                  <div style={{fontSize:9,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>Galones Σ</div>
                  <div style={{fontSize:18,fontWeight:700,color:C.blue}}>{totalGl.toFixed(1)} gl</div>
                </div>
                <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:10,padding:"10px 12px",borderTop:`3px solid ${C.warn}`}}>
                  <div style={{fontSize:9,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>Pendientes</div>
                  <div style={{fontSize:18,fontWeight:700,color:C.warn}}>{pendientes}</div>
                </div>
                <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:10,padding:"10px 12px",borderTop:"3px solid #F59E0B"}}>
                  <div style={{fontSize:9,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>Corregidos</div>
                  <div style={{fontSize:18,fontWeight:700,color:"#92400E"}}>{corregidos}</div>
                </div>
                <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:10,padding:"10px 12px",borderTop:`3px solid ${C.crit}`}}>
                  <div style={{fontSize:9,fontWeight:700,color:C.txt3,textTransform:"uppercase",letterSpacing:.5,marginBottom:4}}>Con alerta</div>
                  <div style={{fontSize:18,fontWeight:700,color:C.crit}}>{alertas}</div>
                </div>
              </div>
              <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:10,padding:"10px 12px",marginBottom:10,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                <input placeholder="🔍 Buscar equipo, fundo, chofer, vale..." value={gerFiltro.search}
                  onChange={e=>setGerFiltro(f=>({...f,search:e.target.value}))}
                  style={{padding:"6px 10px",border:`1px solid ${C.bdr}`,borderRadius:7,fontSize:11,fontFamily:"inherit",outline:"none",minWidth:240}}/>
                <select value={gerFiltro.estado} onChange={e=>setGerFiltro(f=>({...f,estado:e.target.value}))}
                  style={{padding:"6px 10px",border:`1px solid ${C.bdr}`,borderRadius:7,fontSize:11,fontFamily:"inherit",background:gerFiltro.estado?"#FEF3C7":"#fff",WebkitAppearance:"none"}}>
                  <option value="">— Estado —</option>
                  <option value="aprobado">✅ Aprobado</option>
                  <option value="rechazado">✕ Rechazado</option>
                  <option value="pendiente">⏳ Pendiente</option>
                  <option value="corregido">✏ Corregido</option>
                  <option value="alerta">⚠ Con alerta</option>
                </select>
                <select value={gerFiltro.fundo} onChange={e=>setGerFiltro(f=>({...f,fundo:e.target.value}))}
                  style={{padding:"6px 10px",border:`1px solid ${C.bdr}`,borderRadius:7,fontSize:11,fontFamily:"inherit",background:gerFiltro.fundo?"#FEF3C7":"#fff",WebkitAppearance:"none"}}>
                  <option value="">— Fundo —</option>
                  {(maestros.fundos||[]).map(f=><option key={f} value={f}>{f}</option>)}
                </select>
                <select value={gerFiltro.cultivo} onChange={e=>setGerFiltro(f=>({...f,cultivo:e.target.value}))}
                  style={{padding:"6px 10px",border:`1px solid ${C.bdr}`,borderRadius:7,fontSize:11,fontFamily:"inherit",background:gerFiltro.cultivo?"#FEF3C7":"#fff",WebkitAppearance:"none"}}>
                  <option value="">— Cultivo —</option>
                  {(maestros.cultivos||[]).map(c=><option key={c} value={c}>{c}</option>)}
                </select>
                <select value={gerFiltro.tipo} onChange={e=>setGerFiltro(f=>({...f,tipo:e.target.value}))}
                  style={{padding:"6px 10px",border:`1px solid ${C.bdr}`,borderRadius:7,fontSize:11,fontFamily:"inherit",background:gerFiltro.tipo?"#FEF3C7":"#fff",WebkitAppearance:"none"}}>
                  <option value="">— Tipo —</option>
                  {["TRACTOR","CAMION","CISTERNA","MONTACARGAS"].map(t=><option key={t} value={t}>{t}</option>)}
                </select>
                {(gerFiltro.estado||gerFiltro.fundo||gerFiltro.cultivo||gerFiltro.tipo||gerFiltro.search)&&(
                  <button onClick={()=>setGerFiltro({estado:"",fundo:"",cultivo:"",tipo:"",search:""})}
                    style={{padding:"5px 12px",background:"#FEE2E2",color:"#B91C1C",border:"none",borderRadius:7,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>
                    ✕ Limpiar
                  </button>
                )}
              </div>
              <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:10,overflow:"hidden"}}>
                <div style={{maxHeight:560,overflow:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                    <thead>
                      <tr style={{borderBottom:`1px solid ${C.bdr}`}}>
                        <SortTh col="nVale" label="N° Vale"/>
                        <SortTh col="fecha" label="Fecha · Hora"/>
                        <SortTh col="equipoDen" label="Equipo"/>
                        <Th>Tipo</Th>
                        <Th>Placa</Th>
                        <SortTh col="fundo" label="Fundo"/>
                        <Th>Cultivo</Th>
                        <Th>Actividad</Th>
                        <Th>Combustible</Th>
                        <SortTh col="gl" label="Galones" right/>
                        <Th right>Km/Hr</Th>
                        <Th>Chofer</Th>
                        <Th>Almacenero</Th>
                        <Th>🔒</Th>
                        <Th>Estado</Th>
                        <Th>Acciones</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {valesFiltrados.map((v,i)=>(
                        <tr key={v.id}
                          style={{borderBottom:`0.5px solid ${C.bdr}`,
                            background: v._corregido?"#FFFBEB" : v.alertaEnviada?"#FEF3C7" : i%2===0?"#fff":C.surf2,
                            cursor:"pointer"}}
                          onClick={()=>startEdit(v)}>
                          <td style={{padding:"6px 10px",fontFamily:"monospace",color:C.txt3,fontWeight:600}}>
                            {v.nVale||"V-"+String(v.id).padStart(6,"0")}
                            {v._corregido&&<span title="Editado" style={{marginLeft:4,fontSize:10,color:"#92400E"}}>✏</span>}
                          </td>
                          <td style={{padding:"6px 10px",fontFamily:"monospace",whiteSpace:"nowrap"}}>{v.fecha} {v.hora}</td>
                          <td style={{padding:"6px 10px",fontWeight:600,maxWidth:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v.equipoDen}</td>
                          <td style={{padding:"6px 10px"}}><span style={{fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:4,background:"#F3F4F6",color:C.txt2}}>{v.tipo||"—"}</span></td>
                          <td style={{padding:"6px 10px",fontFamily:"monospace",color:C.txt3}}>{v.placa||"—"}</td>
                          <td style={{padding:"6px 10px"}}>{v.fundo||"—"}</td>
                          <td style={{padding:"6px 10px"}}>
                            {v.cultivo?<span style={{fontSize:9,fontWeight:600,background:"#DCFCE7",color:"#166534",padding:"2px 6px",borderRadius:10}}>🌱 {v.cultivo}</span>:<span style={{color:C.txt3,fontSize:10}}>—</span>}
                          </td>
                          <td style={{padding:"6px 10px",color:C.txt3,maxWidth:140,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v.actividad||"—"}</td>
                          <td style={{padding:"6px 10px",fontSize:10}}>{v.producto||"—"}</td>
                          <td style={{padding:"6px 10px",fontFamily:"monospace",color:C.blue,fontWeight:700,textAlign:"right"}}>{v.gl?.toFixed(1)} gl</td>
                          <td style={{padding:"6px 10px",fontFamily:"monospace",color:C.txt3,textAlign:"right"}}>{v.km||"—"}</td>
                          <td style={{padding:"6px 10px",fontWeight:600}}>{v.chofer||"—"}</td>
                          <td style={{padding:"6px 10px",color:C.txt3,fontSize:10}}>{v.almacenero||"—"}</td>
                          <td style={{padding:"6px 8px",textAlign:"center",fontSize:14}}
                            title={v.candadoOk===true?"Candado OK":v.candadoOk===false?"⚠ Incidente":"Sin verif."}>
                            {v.candadoOk===true?"🔒":v.candadoOk===false?"🔓⚠":"—"}
                          </td>
                          <td style={{padding:"6px 10px",whiteSpace:"nowrap"}}>
                            {v.aprobado?<span style={{color:C.ok,fontSize:10,fontWeight:700}}>✅ Aprobado</span>
                              :v.rechazado?<span style={{color:C.crit,fontSize:10,fontWeight:700}}>✕ Rechazado</span>
                              :<span style={{color:C.warn,fontSize:10,fontWeight:700}}>⏳ Pendiente</span>}
                            {v.aprobadoPor && <div style={{fontSize:9,color:C.txt3,marginTop:2}}>por {v.aprobadoPor}</div>}
                          </td>
                          <td style={{padding:"6px 10px",whiteSpace:"nowrap"}}>
                            <button onClick={e=>{e.stopPropagation();startEdit(v);}}
                              style={{padding:"3px 9px",fontSize:10,background:RED,color:"#fff",border:"none",borderRadius:5,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>✏ Editar</button>
                            {v.fotoMedidor && (
                              <button onClick={e=>{e.stopPropagation();verImagenAmpliada(v.fotoMedidor);}}
                                title="Ver foto medidor"
                                style={{marginLeft:4,padding:"3px 7px",fontSize:10,background:"#F3F4F6",color:C.txt2,border:`1px solid ${C.bdr}`,borderRadius:5,cursor:"pointer",fontFamily:"inherit"}}>📸</button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {valesFiltrados.length===0 && (
                        <tr><td colSpan={16} style={{textAlign:"center",padding:"40px 20px",color:C.txt3}}>
                          {vales.length===0?"Sin vales registrados.":"Sin resultados para los filtros actuales."}
                        </td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {editId !== null && (()=>{
                const v = vales.find(x=>x.id===editId);
                if(!v) return null;
                return(
                  <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#fff",
                    borderTop:`3px solid ${RED}`,boxShadow:"0 -8px 24px rgba(0,0,0,.15)",
                    padding:"16px 24px",zIndex:50,maxHeight:"60vh",overflowY:"auto"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                      <div>
                        <div style={{fontSize:14,fontWeight:700,color:RED}}>✏ Editando: {v.nVale}</div>
                        <div style={{fontSize:11,color:C.txt3}}>{v.equipoDen} · {v.fecha} {v.hora}</div>
                      </div>
                      <button onClick={()=>setEditId(null)} style={{padding:"5px 14px",fontSize:11,border:`1px solid ${C.bdr}`,borderRadius:7,background:C.surf2,cursor:"pointer",fontFamily:"inherit"}}>Cancelar</button>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:10}}>
                      <div><label style={{fontSize:10,color:C.txt3,display:"block",marginBottom:3}}>Galones</label><input type="number" step="0.1" value={editData.gl} onChange={e=>setEditData(d=>({...d,gl:e.target.value}))} style={inp}/></div>
                      <div><label style={{fontSize:10,color:C.txt3,display:"block",marginBottom:3}}>Km / Horómetro</label><input type="number" value={editData.km} onChange={e=>setEditData(d=>({...d,km:e.target.value}))} style={inp}/></div>
                      <div><label style={{fontSize:10,color:C.txt3,display:"block",marginBottom:3}}>Fundo</label><select value={editData.fundo} onChange={e=>setEditData(d=>({...d,fundo:e.target.value}))} style={{...inp,WebkitAppearance:"none"}}>{(maestros.fundos||[]).map(f=><option key={f} value={f}>{f}</option>)}</select></div>
                      <div><label style={{fontSize:10,color:C.txt3,display:"block",marginBottom:3}}>Cultivo</label><select value={editData.cultivo||""} onChange={e=>setEditData(d=>({...d,cultivo:e.target.value}))} style={{...inp,WebkitAppearance:"none"}}><option value="">—</option>{(maestros.cultivos||[]).map(c=><option key={c} value={c}>{c}</option>)}</select></div>
                      <div><label style={{fontSize:10,color:C.txt3,display:"block",marginBottom:3}}>Actividad</label><select value={editData.actividad} onChange={e=>setEditData(d=>({...d,actividad:e.target.value}))} style={{...inp,WebkitAppearance:"none"}}>{(maestros.actividades||[]).map(a=><option key={a.nombre||a} value={a.nombre||a}>{a.nombre||a}</option>)}</select></div>
                      <div><label style={{fontSize:10,color:C.txt3,display:"block",marginBottom:3}}>Chofer</label><input value={editData.chofer} onChange={e=>setEditData(d=>({...d,chofer:e.target.value}))} style={inp}/></div>
                      <div><label style={{fontSize:10,color:C.txt3,display:"block",marginBottom:3}}>Observaciones</label><input value={editData.obs} onChange={e=>setEditData(d=>({...d,obs:e.target.value}))} style={inp}/></div>
                    </div>
                    <div style={{marginBottom:10}}>
                      <label style={{fontSize:11,fontWeight:700,color:RED,display:"block",marginBottom:4}}>* Motivo de la corrección (obligatorio)</label>
                      <textarea value={editMotivo} onChange={e=>setEditMotivo(e.target.value)} placeholder="Ej: Horómetro ingresado incorrectamente." style={{...inp,minHeight:48,resize:"vertical"}}/>
                    </div>
                    <button onClick={saveEdit} style={{padding:"10px 24px",background:RED,color:"#fff",border:"none",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✓ Guardar corrección con log</button>
                  </div>
                );
              })()}
            </div>
          );
        })()}
        {view==="log"&&(
          <div>
            <div style={{marginBottom:12,display:"flex",alignItems:"center",gap:12}}>
              <input placeholder="🔍 Buscar en el log..." value={logFilter} onChange={e=>setLogFilter(e.target.value)} style={{padding:"8px 12px",borderRadius:8,border:`1px solid ${C.bdr}`,fontSize:12,fontFamily:"inherit",outline:"none",width:280}}/>
              <span style={{fontSize:11,color:C.txt3}}>{auditLog.length} entradas</span>
            </div>
            {auditLog.filter(l=>!logFilter||(l.equipo+l.editor+l.motivo).toLowerCase().includes(logFilter.toLowerCase())).length===0
              ?<p style={{textAlign:"center",color:C.txt3,padding:32}}>Sin correcciones registradas.</p>
              :auditLog.filter(l=>!logFilter||(l.equipo+l.editor+l.motivo).toLowerCase().includes(logFilter.toLowerCase())).map((l,i)=>(
                <div key={i} style={{background:C.surf,border:"1px solid #FDE68A",borderRadius:10,padding:"12px 14px",marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <span style={{fontWeight:700,fontSize:12,color:"#92400E"}}>✏ {l.equipo}</span>
                    <span style={{fontSize:10,color:C.txt3,fontFamily:"monospace"}}>{l.ts.slice(0,19).replace("T"," ")}</span>
                  </div>
                  <div style={{fontSize:11,color:C.txt2,marginBottom:6}}><strong>Editor:</strong> {l.editor} · <strong>Vale:</strong> {l.nVale}</div>
                  <div style={{fontSize:11,color:"#92400E",background:"#FEF3C7",borderRadius:6,padding:"6px 9px",marginBottom:6}}><strong>Motivo:</strong> {l.motivo}</div>
                  {Object.keys(l.cambios||{}).length>0&&<div style={{fontSize:10,color:C.txt3}}><strong>Cambios:</strong> {Object.entries(l.cambios).map(([k,{de,a}])=>`${k}: "${de}" → "${a}"`).join(" · ")}</div>}
                </div>
              ))}
          </div>
        )}
        {view==="usuarios"&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <div style={{fontSize:13,fontWeight:700}}>👥 Usuarios del sistema</div>
                <div style={{fontSize:10,color:C.txt3,fontStyle:"italic"}}>Agrupado por rol · Use ↑↓ para reordenar</div>
              </div>
              {(()=>{
                const ROLES_ORDEN = [
                  ["ger",  "🏢 Gerentes",    "#7C2D12"],
                  ["plan", "📊 Planners",    "#1E3A8A"],
                  ["apro", "✅ Aprobadores", "#92400E"],
                  ["alm",  "🧑‍🔧 Almaceneros","#166534"],
                ];
                const moverUsuario = async (userId, direccion) => {
                  const arr = [...(users||[])];
                  const idx = arr.findIndex(u=>u.id===userId);
                  if(idx<0) return;
                  const rol = arr[idx].rol;
                  let target = -1;
                  if(direccion==="up"){
                    for(let i=idx-1;i>=0;i--) if(arr[i].rol===rol){target=i;break;}
                  }else{
                    for(let i=idx+1;i<arr.length;i++) if(arr[i].rol===rol){target=i;break;}
                  }
                  if(target<0) return;
                  [arr[idx], arr[target]] = [arr[target], arr[idx]];
                  await setUsers(arr);
                };
                return ROLES_ORDEN.map(([rolKey, rolLabel, rolColor])=>{
                  const grupo = (users||[]).filter(u=>u.rol===rolKey);
                  if(grupo.length===0) return null;
                  return(
                    <div key={rolKey} style={{marginBottom:14}}>
                      <div style={{fontSize:10,fontWeight:700,color:rolColor,
                        textTransform:"uppercase",letterSpacing:.5,marginBottom:6,
                        paddingBottom:4,borderBottom:`2px solid ${rolColor}`}}>
                        {rolLabel} <span style={{background:rolColor,color:"#fff",padding:"1px 7px",borderRadius:10,fontSize:9,marginLeft:4}}>{grupo.length}</span>
                      </div>
                      {grupo.map((u,gi)=>(
                        <div key={u.id} style={{border:`1px solid ${u.activo?C.bdr:"#FCA5A5"}`,borderRadius:10,
                          padding:"10px 12px",marginBottom:6,background:u.activo?"#fff":"#FFF5F5",
                          opacity:u.activo?1:.75}}>
                          {editUser?.id===u.id?(
                            <div>
                              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:6}}>
                                {[["nombre","Nombre"],["usuario","Usuario"],["pass","Nueva contraseña"]].map(([k,l])=>(
                                  <div key={k}>
                                    <label style={{fontSize:9,color:C.txt3,display:"block",marginBottom:2,textTransform:"uppercase"}}>{l}</label>
                                    <input value={editUser[k]||""} onChange={e=>setEditUser(eu=>({...eu,[k]:e.target.value}))}
                                      placeholder={k==="pass"?"(sin cambio)":""}
                                      style={{width:"100%",padding:"5px 8px",border:`1.5px solid ${C.blue}`,borderRadius:6,fontSize:11,fontFamily:"inherit",outline:"none"}}/>
                                  </div>
                                ))}
                                <div>
                                  <label style={{fontSize:9,color:C.txt3,display:"block",marginBottom:2,textTransform:"uppercase"}}>Rol</label>
                                  <select value={editUser.rol} onChange={e=>setEditUser(eu=>({...eu,rol:e.target.value}))}
                                    style={{width:"100%",padding:"5px 8px",border:`1.5px solid ${C.blue}`,borderRadius:6,fontSize:11,fontFamily:"inherit",WebkitAppearance:"none"}}>
                                    {[["alm","Almacenero"],["plan","Planner"],["apro","Aprobador"],["ger","Gerente"]].map(([v,l])=><option key={v} value={v}>{l}</option>)}
                                  </select>
                                </div>
                              </div>
                              {editUser.rol==="apro"&&(
                                <div style={{marginBottom:6}}>
                                  <label style={{fontSize:9,color:C.txt3,display:"block",marginBottom:3,textTransform:"uppercase"}}>Cultivos</label>
                                  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                                    {["ESPARRAGO","ARANDANO","PIMIENTO","PALTA","PALTO","ALCACHOFA","OTROS"].map(c=>{
                                      const sel=(editUser.cultivos||[]).includes(c);
                                      return(<button key={c} onClick={()=>setEditUser(eu=>({...eu,cultivos:sel?(eu.cultivos||[]).filter(x=>x!==c):[...(eu.cultivos||[]),c]}))}
                                        style={{padding:"2px 7px",borderRadius:10,fontSize:10,fontWeight:600,border:`1px solid ${sel?C.blue:C.bdr}`,background:sel?"#EFF6FF":"#fff",color:sel?C.blue:C.txt3,cursor:"pointer",fontFamily:"inherit"}}>{c}</button>);
                                    })}
                                  </div>
                                </div>
                              )}
                              <div style={{display:"flex",gap:6,marginTop:4}}>
                                <button onClick={async()=>{
                                    const upd=(users||[]).map(x=>x.id===editUser.id?{...x,...editUser,...(editUser.pass?{pass:editUser.pass}:{})}:x);
                                    await setUsers(upd);setEditUser(null);setToast({msg:"✓ Usuario actualizado",type:"ok"});
                                  }}
                                  style={{flex:1,padding:"6px",background:C.ok,color:"#fff",border:"none",borderRadius:7,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>✓ Guardar</button>
                                <button onClick={()=>setEditUser(null)}
                                  style={{padding:"6px 12px",background:C.surf2,color:C.txt2,border:`1px solid ${C.bdr}`,borderRadius:7,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>Cancelar</button>
                              </div>
                            </div>
                          ):(
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <div style={{display:"flex",flexDirection:"column",gap:2}}>
                                <button onClick={()=>moverUsuario(u.id,"up")} disabled={gi===0}
                                  title="Subir" style={{fontSize:9,padding:"1px 4px",lineHeight:1,
                                  background:gi===0?"#F3F4F6":"#fff",color:gi===0?C.txt3:C.txt2,
                                  border:`1px solid ${C.bdr}`,borderRadius:3,cursor:gi===0?"not-allowed":"pointer",fontFamily:"inherit"}}>▲</button>
                                <button onClick={()=>moverUsuario(u.id,"down")} disabled={gi===grupo.length-1}
                                  title="Bajar" style={{fontSize:9,padding:"1px 4px",lineHeight:1,
                                  background:gi===grupo.length-1?"#F3F4F6":"#fff",color:gi===grupo.length-1?C.txt3:C.txt2,
                                  border:`1px solid ${C.bdr}`,borderRadius:3,cursor:gi===grupo.length-1?"not-allowed":"pointer",fontFamily:"inherit"}}>▼</button>
                              </div>
                              <div style={{flex:1}}>
                                <div style={{fontWeight:600,fontSize:12}}>{u.nombre}</div>
                                <div style={{fontSize:10,color:C.txt3,fontFamily:"monospace"}}>{u.usuario}{(u.cultivos||[]).length>0&&` · ${u.cultivos.join(", ")}`}</div>
                              </div>
                              <Badge type={u.activo?"ok":"warn"}>{u.activo?"Activo":"Inactivo"}</Badge>
                              <div style={{display:"flex",gap:4}}>
                                <button onClick={()=>setEditUser({...u,pass:""})}
                                  style={{fontSize:10,padding:"3px 8px",borderRadius:5,background:C.blue,color:"#fff",border:"none",cursor:"pointer",fontFamily:"inherit"}}>✎</button>
                                <button onClick={async()=>{const upd=(users||[]).map(x=>x.id===u.id?{...x,activo:!x.activo}:x);await setUsers(upd);}}
                                  style={{fontSize:10,padding:"3px 8px",borderRadius:5,border:`1px solid ${C.bdr}`,background:u.activo?"#FEF2F2":"#F0FDF4",color:u.activo?C.crit:C.ok,cursor:"pointer",fontFamily:"inherit"}}>
                                  {u.activo?"Baja":"Alta"}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                });
              })()}
            </div>
            
            <div style={{background:C.surf,border:`1px solid ${C.bdr}`,borderRadius:12,padding:16}}>
              <div style={{fontSize:13,fontWeight:700,marginBottom:14}}>+ Nuevo usuario</div>
              {[{k:"nombre",label:"Nombre completo",ph:"Ej. Juan García"},{k:"usuario",label:"Usuario (login)",ph:"Ej. jgarcia"},{k:"pass",label:"Contraseña",ph:"Mínimo 6 caracteres"}].map(f=>(
                <div key={f.k} style={{marginBottom:10}}>
                  <label style={{fontSize:11,fontWeight:600,color:C.txt2,marginBottom:5,display:"block"}}>{f.label}</label>
                  <input style={{width:"100%",padding:"8px 10px",border:`1.5px solid ${C.bdr}`,borderRadius:8,fontSize:12,background:"#fff",fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}
                    placeholder={f.ph} value={newUser[f.k]}
                    onChange={e=>setNewUser(u=>({...u,[f.k]:e.target.value}))}/>
                </div>
              ))}
              <div style={{marginBottom:10}}>
                <label style={{fontSize:11,fontWeight:600,color:C.txt2,marginBottom:5,display:"block"}}>Rol</label>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                  {[["alm","🧑‍🔧 Almacenero","Registra vales"],["plan","📊 Planner","Dashboard y params."],["apro","✅ Aprobador","Aprueba por cultivo"],["ger","🏢 Gerente","Edición y usuarios"]].map(([rol,lbl,sub])=>(
                    <button key={rol} onClick={()=>setNewUser(u=>({...u,rol}))}
                      style={{padding:8,borderRadius:8,border:`2px solid ${newUser.rol===rol?C.blue:C.bdr}`,background:newUser.rol===rol?"#EFF6FF":C.surf2,color:newUser.rol===rol?C.blue:C.txt2,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
                      <div style={{fontWeight:600,fontSize:11,marginBottom:1}}>{lbl}</div>
                      <div style={{fontSize:9,opacity:.7}}>{sub}</div>
                    </button>
                  ))}
                </div>
              </div>
              {newUser.rol==="apro"&&(
                <div style={{marginBottom:10}}>
                  <label style={{fontSize:11,fontWeight:600,color:C.txt2,marginBottom:5,display:"block"}}>Cultivos asignados</label>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    {(maestros.cultivos||["ESPARRAGO","ARANDANO","PIMIENTO","PALTA","PALTO","ALCACHOFA","OTROS"]).map(c=>{
                      const sel=(newUser.cultivos||[]).includes(c);
                      return(<button key={c} onClick={()=>setNewUser(u=>({...u,cultivos:sel?(u.cultivos||[]).filter(x=>x!==c):[...(u.cultivos||[]),c]}))}
                        style={{padding:"3px 9px",borderRadius:20,fontSize:10,fontWeight:600,border:`1.5px solid ${sel?C.blue:C.bdr}`,background:sel?"#EFF6FF":"#fff",color:sel?C.blue:C.txt3,cursor:"pointer",fontFamily:"inherit"}}>{c}</button>);
                    })}
                  </div>
                </div>
              )}
              <button onClick={async()=>{
                  if(!newUser.usuario||!newUser.pass||!newUser.nombre){setToast({msg:"Complete todos los campos",type:"err"});return;}
                  if((users||[]).find(u=>u.usuario===newUser.usuario)){setToast({msg:"Usuario ya existe",type:"err"});return;}
                  await setUsers([...(users||[]),{...newUser,id:"u"+Date.now(),activo:true,cultivos:newUser.cultivos||[]}]);
                  setNewUser({usuario:"",pass:"",nombre:"",rol:"alm",cultivos:[]});
                  setToast({msg:"✓ Usuario creado",type:"ok"});
                }}
                style={{width:"100%",padding:10,background:`linear-gradient(135deg,${C.navy},${C.blue})`,color:"#fff",border:"none",borderRadius:9,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                ✓ Crear usuario
              </button>
            </div>
          </div>
        )}
        {view==="params"&&(
          <GerMantActividadesCard
            maestros={maestros}
            onGuardarMaestros={async(m)=>{
              setMaestrosLocal(m);
              try{ await guardarMaestros(m); }
              catch(e){ setToast({msg:"Error al guardar en Firebase: "+e.message,type:"err"}); throw e; }
            }}
            setToast={setToast}
          />
        )}
      </div>
      <Toast msg={toast.msg} type={toast.type} onClose={()=>setToast({msg:""})}/>
    </div>
  );
}
export default function App(){
  const [currentUser,setCurrentUser]=useState(null);
  const [maestros,setMaestrosState]=useState(INIT_MAESTROS);
  const [vales,setValesState]=useState([]);
  const [users,setUsersState]=useState(INIT_USERS);
  const [cargando,setCargando]=useState(true);

  // ── Cargar y escuchar datos desde Firebase en tiempo real ─────────────────
  useEffect(()=>{
    let unsubVales=null;
    let unsubConfig=null;
    (async()=>{
      try{
        // Carga inicial de maestros y usuarios
        const m = await obtenerMaestros();
        if(m && Object.keys(m).length>0) setMaestrosState(m);
        const u = await obtenerUsuarios();
        if(u && u.length>0) setUsersState(u);
      }catch(e){ console.warn("Error cargando config:",e); }

      // Escuchar vales en tiempo real
      unsubVales = escuchar("vales", (datos)=>{
        if(datos) setValesState(datos.sort((a,b)=>{
          const fa=(a.fecha||"")+" "+(a.hora||"");
          const fb=(b.fecha||"")+" "+(b.hora||"");
          if(fa!==fb) return fb.localeCompare(fa);
          return (b.id||0)-(a.id||0);
        }));
      });

      // Escuchar config en tiempo real (usuarios y maestros)
      unsubConfig = escuchar("config", (docs)=>{
        const maestrosDoc = docs.find(d=>d._fireId==="maestros");
        const usuariosDoc = docs.find(d=>d._fireId==="usuarios");
        if(maestrosDoc && Object.keys(maestrosDoc).length>1){
          const {_fireId, _updatedAt, ...m} = maestrosDoc;
          setMaestrosState(m);
        }
        if(usuariosDoc && usuariosDoc.lista){
          setUsersState(usuariosDoc.lista);
        }
      });

      setCargando(false);
    })();
    return ()=>{ if(unsubVales) unsubVales(); if(unsubConfig) unsubConfig(); };
  },[]);

  const setMaestros=useCallback(async(m)=>{
    setMaestrosState(m);
    try{ await guardarMaestros(m); }catch(e){ console.warn(e); }
  },[]);

  const valesRefApp=useRef([]);
  useEffect(()=>{ valesRefApp.current=vales; },[vales]);

  const setVales=useCallback(async(nuevos)=>{
    setValesState(nuevos);
    // Guardar en Firebase solo los vales que cambiaron o son nuevos
    const anteriores=valesRefApp.current||[];
    for(const v of nuevos){
      const ant=anteriores.find(a=>a.id===v.id);
      if(!ant||JSON.stringify(ant)!==JSON.stringify(v)){
        // Sanear undefined antes de enviar (Firestore lo rechazaría completo)
        await guardar("vales",String(v.id),limpiarUndefined(v));
      }
    }
  },[]);

  const setUsers=useCallback(async(u)=>{
    setUsersState(u);
    try{ await guardarUsuarios(u); }catch(e){ console.warn(e); }
  },[]);

  const recargarDatos = useCallback(async()=>{
    const [valesData, m, u] = await Promise.all([
      obtenerTodos("vales"),
      obtenerMaestros(),
      obtenerUsuarios(),
    ]);
    if(valesData) setValesState(valesData.sort((a,b)=>{
      const fa=(a.fecha||"")+" "+(a.hora||"");
      const fb=(b.fecha||"")+" "+(b.hora||"");
      if(fa!==fb) return fb.localeCompare(fa);
      return (b.id||0)-(a.id||0);
    }));
    if(m && Object.keys(m).length>0) setMaestrosState(m);
    if(u && u.length>0) setUsersState(u);
  },[]);

  if(cargando) return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
      background:"linear-gradient(145deg,#1a0305,#0B1628)",flexDirection:"column",gap:16}}>
      <div className="spin-anim" style={{width:56,height:56,border:"4px solid rgba(226,6,19,.3)",
        borderTop:"4px solid #E20613",borderRadius:"50%"}}/>
      <style>{".spin-anim{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}"}</style>
      <div style={{color:"rgba(255,255,255,.6)",fontSize:14}}>Conectando con Firebase...</div>
    </div>
  );
  if(!currentUser)
    return <Login onLogin={setCurrentUser} users={users}/>;
  if(currentUser.rol==="alm")
    return <AppAlmacenero user={currentUser} onLogout={()=>setCurrentUser(null)}
      maestros={maestros} vales={vales} setVales={setVales}/>;
  if(currentUser.rol==="apro")
    return <AppAprobador user={currentUser} onLogout={()=>setCurrentUser(null)}
      vales={vales} setVales={setVales} users={users}
      precioPorGalon={maestros.precioPorGalon||18.5}/>;
  if(currentUser.rol==="ger")
    return <AppGerente user={currentUser} onLogout={()=>setCurrentUser(null)}
      vales={vales} setVales={setVales} users={users} setUsers={setUsers}
      maestros={maestros} recargarDatos={recargarDatos}/>;
  return <DashboardPlanner user={currentUser} onLogout={()=>setCurrentUser(null)}
    maestros={maestros} setMaestros={setMaestros}
    vales={vales} users={users} setUsers={setUsers}
    recargarDatos={recargarDatos}/>;
}