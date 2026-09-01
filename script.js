(function(){
  "use strict";

  // ── EmailJS config ────────────────────────────────────────────────
  // Crear cuenta gratuita en https://www.emailjs.com, conectar el correo
  // de Crewcrane como "Email Service" y crear un "Email Template" con las
  // variables usadas más abajo (nombre, empresa, telefono, correo,
  // ubicacion, fecha, descripcion, utm_source, utm_medium, utm_campaign,
  // utm_term, utm_content). Reemplazar los 3 valores siguientes con los
  // que EmailJS te asigne (Account > General):
  var EMAILJS_PUBLIC_KEY="REEMPLAZAR_PUBLIC_KEY";
  var EMAILJS_SERVICE_ID="REEMPLAZAR_SERVICE_ID";
  var EMAILJS_TEMPLATE_ID="REEMPLAZAR_TEMPLATE_ID";
  if(window.emailjs&&EMAILJS_PUBLIC_KEY.indexOf("REEMPLAZAR")!==0){
    emailjs.init({publicKey:EMAILJS_PUBLIC_KEY});
  }

  var PHONE="50687871111";
  var MSG="Hola, necesito evaluar un trabajo de levantamiento con Crewcrane. La ubicación del proyecto es: ________. La carga que necesito levantar es: ________. Puedo enviar fotografías del sitio y de la carga.";
  var waURL="https://wa.me/"+PHONE+"?text="+encodeURIComponent(MSG);
  Array.prototype.forEach.call(document.querySelectorAll(".js-wa"),function(a){
    a.setAttribute("href",waURL);a.setAttribute("target","_blank");a.setAttribute("rel","noopener");
  });

  // year
  document.getElementById("year").textContent=new Date().getFullYear();

  // mobile menu
  var tgl=document.querySelector(".menu-toggle"),mob=document.getElementById("mobileNav");
  if(tgl){tgl.addEventListener("click",function(){
    var open=mob.classList.toggle("open");
    tgl.setAttribute("aria-expanded",open?"true":"false");
  });
  Array.prototype.forEach.call(mob.querySelectorAll("a"),function(a){a.addEventListener("click",function(){mob.classList.remove("open");tgl.setAttribute("aria-expanded","false");});});}

  // UTM capture
  try{
    var p=new URLSearchParams(location.search);
    ["utm_source","utm_medium","utm_campaign","utm_term","utm_content"].forEach(function(k){
      var el=document.getElementById(k);if(el&&p.get(k))el.value=p.get(k);
    });
  }catch(e){}

  // form validation + confirmation
  var form=document.getElementById("leadForm"),ok=document.getElementById("formSuccess");
  function validEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);}
  if(form){form.addEventListener("submit",function(e){
    e.preventDefault();var bad=false,first=null;
    Array.prototype.forEach.call(form.querySelectorAll("[required]"),function(f){
      var invalid=!f.value.trim()||(f.type==="email"&&!validEmail(f.value));
      f.setAttribute("aria-invalid",invalid?"true":"false");
      if(invalid){bad=true;if(!first)first=f;}
    });
    if(bad){if(first)first.focus();return;}

    var submitBtn=form.querySelector(".form-submit");
    var finish=function(){
      form.style.display="none";ok.classList.add("show");
      ok.scrollIntoView({behavior:"smooth",block:"center"});
      if(window.dataLayer)window.dataLayer.push({event:"generate_lead",form_id:"leadForm"});
    };

    if(window.emailjs&&EMAILJS_PUBLIC_KEY.indexOf("REEMPLAZAR")!==0){
      submitBtn.disabled=true;submitBtn.textContent="Enviando…";
      emailjs.sendForm(EMAILJS_SERVICE_ID,EMAILJS_TEMPLATE_ID,form).then(function(){
        finish();
      },function(err){
        submitBtn.disabled=false;submitBtn.textContent="Enviar solicitud de evaluación";
        alert("No se pudo enviar la solicitud. Por favor intente de nuevo o escríbanos por WhatsApp.");
        if(window.console)console.error("EmailJS error:",err);
      });
    }else{
      // EmailJS aún no configurado (ver EMAILJS_* arriba): confirmación local sin envío real.
      finish();
    }
  });
  Array.prototype.forEach.call(form.querySelectorAll("[required]"),function(f){
    f.addEventListener("input",function(){if(f.getAttribute("aria-invalid")==="true")f.setAttribute("aria-invalid","false");});
  });}

  // trabajos reales: branded play button controls the native video
  Array.prototype.forEach.call(document.querySelectorAll(".media-frame"),function(frame){
    var video=frame.querySelector(".media-video"),btn=frame.querySelector(".js-play");
    if(!video||!btn)return;
    btn.addEventListener("click",function(){video.play();});
    video.addEventListener("play",function(){btn.classList.add("hide");});
    video.addEventListener("pause",function(){btn.classList.remove("hide");});
    video.addEventListener("ended",function(){btn.classList.remove("hide");});
  });

  // single orchestrated load reveal
  var reduce=window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  var items=document.querySelectorAll(".hero .reveal");
  if(reduce){items.forEach(function(el){el.classList.add("in");});}
  else{items.forEach(function(el,i){setTimeout(function(){el.classList.add("in");},90*i);});}

  // ── tabla de cargas interactiva (hero) ──────────────────────────────
  // Valores reconstruidos a partir de la tabla de cargas real del equipo
  // (radio/altura ajustados a una elipse que respeta los extremos legibles
  // de la ficha técnica). Uso ilustrativo/comercial, no operativo.
  var LC_CURVES=[
    {id:"E",points:[{r:0.4,h:9.0,t:8},{r:1.9,h:8.1,t:7.5},{r:3.2,h:6.1,t:7},{r:4.0,h:3.3,t:4},{r:4.3,h:0,t:2}]},
    {id:"D",points:[{r:0.7,h:13.0,t:5.5},{r:2.5,h:12.3,t:5},{r:4.1,h:10.9,t:4.5},{r:5.5,h:8.8,t:4},{r:6.6,h:6.2,t:3},{r:7.3,h:3.2,t:2.5},{r:7.5,h:0,t:1.5}]},
    {id:"C",points:[{r:0.9,h:15.9,t:3.5},{r:3.5,h:15.1,t:3},{r:5.9,h:13.4,t:2.8},{r:7.9,h:10.8,t:2.2},{r:9.4,h:7.6,t:2.0},{r:10.4,h:3.9,t:1.6},{r:10.7,h:0,t:1.2}]},
    {id:"B",points:[{r:1.2,h:17.9,t:1.5},{r:4.5,h:17.0,t:1.4},{r:7.6,h:15.0,t:1.35},{r:10.3,h:12.2,t:1.2},{r:12.2,h:8.5,t:1.0},{r:13.5,h:4.4,t:0.7},{r:13.9,h:0,t:0.6}]},
    {id:"A",points:[{r:1.5,h:18.9,t:0.8},{r:5.0,h:18.2,t:0.75},{r:8.4,h:16.6,t:0.7},{r:11.3,h:14.3,t:0.65},{r:13.8,h:11.3,t:0.55},{r:15.6,h:7.8,t:0.5},{r:16.7,h:4.0,t:0.4},{r:17.1,h:0,t:0.3}]}
  ];
  (function(){
    var svg=document.querySelector(".lc-svg");
    if(!svg)return;

    var GX0=70,GX1=610,GY0=400,GY1=40,RMAX=18,HMAX=19;
    function toX(r){return GX0+(r/RMAX)*(GX1-GX0);}
    function toY(h){return GY0-(h/HMAX)*(GY0-GY1);}
    var SVGNS="http://www.w3.org/2000/svg";

    // grid
    var gridLines="";
    for(var rx=0;rx<=18;rx+=2){var gx=toX(rx);gridLines+='<path d="M'+gx+' '+GY1+' V'+GY0+'"/>';}
    [0,5,10,15,19].forEach(function(hy){var gy=toY(hy);gridLines+='<path d="M'+GX0+' '+gy+' H'+GX1+'"/>';});
    svg.querySelector(".lc-grid").innerHTML=gridLines;

    // axis labels
    var labels="";
    [0,4,8,12,16,18].forEach(function(rx){
      labels+='<text x="'+toX(rx)+'" y="'+(GY0+18)+'" text-anchor="middle" font-family="\'IBM Plex Mono\',monospace" font-size="9" fill="rgba(255,255,255,.4)">'+rx+'</text>';
    });
    [0,5,10,15,19].forEach(function(hy){
      labels+='<text x="'+(GX1+12)+'" y="'+(toY(hy)+3)+'" text-anchor="start" font-family="\'IBM Plex Mono\',monospace" font-size="9" fill="rgba(255,255,255,.4)">'+hy+'</text>';
    });
    labels+='<text x="'+((GX0+GX1)/2)+'" y="'+(GY0+34)+'" text-anchor="middle" font-family="\'IBM Plex Mono\',monospace" font-size="9" letter-spacing="1.5" fill="rgba(255,255,255,.32)">RADIO (M)</text>';
    labels+='<text x="'+(GX1+12)+'" y="'+(GY1-16)+'" text-anchor="start" font-family="\'IBM Plex Mono\',monospace" font-size="9" letter-spacing="1.5" fill="rgba(255,255,255,.32)">ALTURA (M)</text>';
    svg.querySelector(".lc-axis-labels").innerHTML=labels;

    // curves + points
    var curvesG=svg.querySelector(".lc-curves"),curveEls={};
    LC_CURVES.forEach(function(c){
      var g=document.createElementNS(SVGNS,"g");
      g.setAttribute("class","lc-curve-group");
      g.setAttribute("data-curve",c.id);
      var d="M"+c.points.map(function(p){return toX(p.r)+" "+toY(p.h);}).join(" L");
      var path=document.createElementNS(SVGNS,"path");
      path.setAttribute("class","lc-curve");path.setAttribute("d",d);path.setAttribute("fill","none");
      g.appendChild(path);
      c.points.forEach(function(p){
        var dot=document.createElementNS(SVGNS,"circle");
        dot.setAttribute("class","lc-point");
        dot.setAttribute("cx",toX(p.r));dot.setAttribute("cy",toY(p.h));dot.setAttribute("r",3);
        g.appendChild(dot);
      });
      curvesG.appendChild(g);
      curveEls[c.id]=g;
    });

    var markerLine=svg.querySelector(".lc-marker-line");
    var markerDot=svg.querySelector(".lc-marker-dot");
    var slider=document.querySelector(".lc-slider");
    var chips=document.querySelectorAll(".lc-chip");
    var outT=document.querySelector(".lc-readout-t");
    var outR=document.querySelector(".lc-readout-r");
    var outH=document.querySelector(".lc-readout-h");
    var activeId="C";

    function curveById(id){for(var i=0;i<LC_CURVES.length;i++){if(LC_CURVES[i].id===id)return LC_CURVES[i];}}

    function interp(curve,r){
      var pts=curve.points;
      if(r<=pts[0].r)return pts[0];
      if(r>=pts[pts.length-1].r)return pts[pts.length-1];
      for(var i=0;i<pts.length-1;i++){
        var a=pts[i],b=pts[i+1];
        if(r>=a.r&&r<=b.r){
          var f=(r-a.r)/(b.r-a.r);
          return {r:r,h:a.h+(b.h-a.h)*f,t:a.t+(b.t-a.t)*f};
        }
      }
      return pts[pts.length-1];
    }

    function render(){
      var curve=curveById(activeId);
      var rMax=curve.points[curve.points.length-1].r;
      slider.max=Math.round(rMax*10);
      var r=Math.min(parseInt(slider.value,10)/10,rMax);
      var res=interp(curve,r);

      Object.keys(curveEls).forEach(function(id){curveEls[id].classList.toggle("active",id===activeId);});
      Array.prototype.forEach.call(chips,function(ch){
        var on=ch.getAttribute("data-curve")===activeId;
        ch.classList.toggle("active",on);
        ch.setAttribute("aria-pressed",on?"true":"false");
      });

      var mx=toX(res.r),my=toY(res.h);
      markerLine.setAttribute("x1",mx);markerLine.setAttribute("x2",mx);
      markerDot.setAttribute("cx",mx);markerDot.setAttribute("cy",my);

      outT.textContent=res.t.toFixed(res.t<1?2:1)+" t";
      outR.textContent=res.r.toFixed(1)+" m radio";
      outH.textContent=res.h.toFixed(1)+" m altura";
    }

    slider.addEventListener("input",render);
    Array.prototype.forEach.call(chips,function(ch){
      ch.addEventListener("click",function(){
        activeId=ch.getAttribute("data-curve");
        var curve=curveById(activeId);
        var rMax=curve.points[curve.points.length-1].r;
        var mid=curve.points[Math.floor(curve.points.length/2)].r;
        slider.max=Math.round(rMax*10);
        slider.value=Math.round(mid*10);
        render();
      });
    });

    var initCurve=curveById(activeId);
    slider.value=Math.round(initCurve.points[Math.floor(initCurve.points.length/2)].r*10);
    render();
  })();
})();
