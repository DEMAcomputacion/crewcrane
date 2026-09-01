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
})();
