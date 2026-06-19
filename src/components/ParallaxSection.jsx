import React, { useEffect, useRef, useState } from 'react';

export const GridOverlay = () => (
  <div style={{position:'absolute',inset:0,zIndex:2,pointerEvents:'none',
    backgroundImage:'linear-gradient(rgba(0,240,255,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(0,240,255,0.035) 1px,transparent 1px)',
    backgroundSize:'60px 60px'}} />
);

export const Scanlines = () => (
  <div style={{position:'absolute',inset:0,zIndex:3,pointerEvents:'none',
    background:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.08) 3px,rgba(0,0,0,0.08) 4px)'}} />
);

export const Vignette = () => (
  <div style={{position:'absolute',inset:0,zIndex:3,pointerEvents:'none',
    background:'radial-gradient(ellipse at center,transparent 30%,rgba(0,0,0,0.88) 100%)'}} />
);

const TICKER = '[ TPS: 84,209 ] ── [ UPTIME: 99.999% ] ── [ ACTIFS: $8.42B ] ── [ CLIENTS: 14M+ ] ── [ LATENCE: 0.04ms ] ── [ NŒUDS: 4,021 ] ── [ TX: 1.2B/jour ] ── [ AES-256 ] ── ';
export const DataTicker = () => (
  <div style={{position:'absolute',bottom:0,left:0,width:'100%',overflow:'hidden',zIndex:8,
    borderTop:'1px solid rgba(255,255,255,0.05)',padding:'5px 0',background:'rgba(0,0,0,0.5)'}}>
    <div style={{whiteSpace:'nowrap',display:'inline-block',animation:'ticker 40s linear infinite',
      fontFamily:"'JetBrains Mono',monospace",fontSize:'0.65rem',color:'#333',letterSpacing:'2px'}}>
      {TICKER.repeat(8)}
    </div>
    <style>{`@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
  </div>
);

export const SectionProgress = ({ progress }) => (
  <div style={{position:'absolute',bottom:0,left:0,width:'100%',height:'2px',background:'rgba(255,255,255,0.04)',zIndex:10}}>
    <div style={{height:'100%',width:`${Math.round(progress*100)}%`,background:'linear-gradient(90deg,#00f0ff,#7b2ff7)',
      boxShadow:'0 0 8px #00f0ff',transition:'width 0.08s linear'}} />
  </div>
);

export const PulseDot = ({ color='#39ff14' }) => (
  <span style={{display:'inline-block',width:8,height:8,borderRadius:'50%',background:color,
    boxShadow:`0 0 8px ${color}`,animation:'pulse-dot 2s ease-in-out infinite',flexShrink:0}}>
    <style>{`@keyframes pulse-dot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.3;transform:scale(0.6)}}`}</style>
  </span>
);

export const DataGauge = ({ label, value, max, color, unit='' }) => (
  <div style={{marginBottom:'0.75rem'}}>
    <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.65rem',color:'#555'}}>{label}</span>
      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.65rem',color}}>{value}{unit}</span>
    </div>
    <div style={{height:'3px',background:'rgba(255,255,255,0.06)',borderRadius:2}}>
      <div style={{height:'100%',width:`${(value/max)*100}%`,background:color,borderRadius:2,boxShadow:`0 0 6px ${color}`}} />
    </div>
  </div>
);

export const AnimatedCount = ({ target, prefix='', suffix='', color='#00f0ff' }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        let cur = 0;
        const step = target / 60;
        const t = setInterval(() => {
          cur += step;
          if (cur >= target) { setVal(target); clearInterval(t); }
          else setVal(Math.floor(cur));
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref} style={{fontFamily:"'JetBrains Mono',monospace",color,fontWeight:900,textShadow:`0 0 15px ${color}55`}}>
    {prefix}{val.toLocaleString()}{suffix}
  </span>;
};

// ── ParallaxSection : video autoplay loop + parallax CSS sur le contenu ──
const ParallaxSection = ({ id, videoSrc, height='180vh', children, showScrollHint=false, trackMouse=false }) => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (!trackMouse) return;
    const handleMouseMove = (e) => {
      requestAnimationFrame(() => {
        setMousePos({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        });
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [trackMouse]);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    let reqId;

    const loop = () => {
      if (section) {
        const rect = section.getBoundingClientRect();
        const sh = section.offsetHeight - window.innerHeight;
        const p = Math.max(0, Math.min(1, -rect.top / sh));
        setProgress(p);

        // Parallaxe CSS sur le contenu (pas sur la vidéo)
        if (content) {
          const y = (p - 0.5) * -60; // -30px à +30px
          content.style.transform = `translateY(${y}px)`;
        }
      }
      reqId = requestAnimationFrame(loop);
    };
    reqId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(reqId);
  }, []);

  return (
    <section ref={sectionRef} id={id} style={{position:'relative',height}}>
      <div style={{position:'sticky',top:0,height:'100vh',overflow:'hidden'}}>

        {/* VIDÉO — autoplay loop fluide, sans scrubbing */}
        {videoSrc && (
          <video autoPlay loop muted playsInline
            style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',
              zIndex:1,opacity:0.5,filter:'brightness(0.7) saturate(1.3) contrast(1.1)',
              transform: trackMouse ? `scale(1.05) translate(${(mousePos.x - 0.5) * -40}px, ${(mousePos.y - 0.5) * -40}px)` : 'none',
              transition: trackMouse ? 'transform 0.15s ease-out' : 'none'
            }}
            src={videoSrc}
          />
        )}

        {/* Overlays permanents */}
        <GridOverlay />
        <Scanlines />
        <Vignette />
        <DataTicker />
        <SectionProgress progress={progress} />

        {showScrollHint && (
          <div style={{position:'absolute',bottom:'3rem',left:'50%',transform:'translateX(-50%)',
            display:'flex',flexDirection:'column',alignItems:'center',gap:6,zIndex:9,
            animation:'scroll-hint 2s ease-in-out infinite'}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'0.6rem',color:'#444',letterSpacing:3}}>SCROLL</span>
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
              <path d="M1 1L8 9L15 1" stroke="#444" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <style>{`@keyframes scroll-hint{0%,100%{opacity:0.6;transform:translateX(-50%) translateY(0)}50%{opacity:1;transform:translateX(-50%) translateY(6px)}}`}</style>
          </div>
        )}

        {/* Contenu avec parallaxe smooth via CSS transform */}
        <div ref={contentRef} style={{position:'relative',zIndex:5,height:'100%',
          display:'flex',alignItems:'center',padding:'0 6%',
          maxWidth:1400,margin:'0 auto',width:'100%',willChange:'transform'}}>
          {children(progress)}
        </div>
      </div>
    </section>
  );
};

export default ParallaxSection;
