import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Globe, Lock, Cpu, Eye } from 'lucide-react';
import ParallaxSection, {
  AnimatedCount, DataGauge, PulseDot, GridOverlay
} from '../components/ParallaxSection';

/* ─── mini stat badge ─── */
const SBadge = ({ label, val, color }) => (
  <div className="glass-card" style={{ padding:'1rem 1.5rem', borderColor:`${color}33`, display:'flex', flexDirection:'column', gap:4 }}>
    <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'1.4rem', fontWeight:900, color, textShadow:`0 0 12px ${color}66` }}>{val}</span>
    <span style={{ fontSize:'0.7rem', color:'#666', letterSpacing:'2px', textTransform:'uppercase' }}>{label}</span>
  </div>
);

/* ─── feature card ─── */
const FC = ({ icon, title, desc, color }) => (
  <div className="glass-card" style={{ padding:'2rem', borderColor:`${color}22`, transition:'all .3s' }}
    onMouseEnter={e=>{ e.currentTarget.style.borderColor=`${color}55`; e.currentTarget.style.transform='translateY(-6px)'; }}
    onMouseLeave={e=>{ e.currentTarget.style.borderColor=`${color}22`; e.currentTarget.style.transform='none'; }}>
    <div style={{ width:48, height:48, borderRadius:12, background:`${color}18`, border:`1px solid ${color}44`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.2rem' }}>{icon}</div>
    <h3 style={{ fontSize:'1.1rem', marginBottom:8, color:'#fff', fontWeight:700 }}>{title}</h3>
    <p style={{ color:'#777', lineHeight:1.7, fontSize:'0.875rem' }}>{desc}</p>
  </div>
);

export default function LandingPage() {
  const nav = useNavigate();
  const [scroll, setScroll] = useState(0);

  React.useEffect(() => {
    const h = () => setScroll(window.scrollY);
    window.addEventListener('scroll', h, { passive:true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <div style={{ background:'#000', color:'#fff', fontFamily:"'Outfit',sans-serif" }}>

      {/* ══ NAVBAR ══ */}
      <nav style={{ position:'fixed', top:0, width:'100%', zIndex:1000,
        display:'flex', justifyContent:'space-between', alignItems:'center',
        padding:'1.5rem var(--grid-gutter-width)',
        background: scroll>60 ? 'rgba(0,0,0,0.85)' : 'transparent',
        backdropFilter: scroll>60 ? 'blur(16px)' : 'none',
        borderBottom: scroll>60 ? '1px solid rgba(255,255,255,0.05)' : 'none',
        transition:'all .3s' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:'#00f0ff', boxShadow:'0 0 8px #00f0ff', display:'inline-block' }} />
          <span style={{ fontWeight:900, letterSpacing:3, fontSize:'1rem' }}>INFINITE BANK</span>
        </div>
        <div style={{ display:'flex', gap:'2rem', alignItems:'center' }}>
          {['Fonctionnalités','Sécurité','API'].map(x=>(
            <span key={x} style={{ color:'#666', cursor:'pointer', fontSize:'0.875rem', transition:'color .2s' }}
              onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='#666'}>{x}</span>
          ))}
          <button className="btn-ghost" onClick={()=>nav('/login')} style={{ padding:'0.75rem 1.5rem', fontSize:'0.85rem' }}>Connexion</button>
        </div>
      </nav>

      {/* ══ SECTION 1 — HERO (Robot) ══ */}
      <ParallaxSection id="hero" videoSrc="/assets/videos/Android_bust_floating_cybernetic…_202606181412_2.mp4" height="160vh" showScrollHint trackMouse={true}>
        {(p) => (
          <div style={{ display:'grid', gridTemplateColumns:'1.1fr 0.9fr', gap:'4rem', alignItems:'center', width:'100%' }}>
            {/* GAUCHE — texte */}
            <div style={{ opacity: p<0.9?1:0, transform:`translateY(${p<0.9?0:'-30px'})`, transition:'all .2s' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:'1.5rem', fontFamily:"'JetBrains Mono',monospace", fontSize:'0.72rem', color:'#00f0ff', letterSpacing:4 }}>
                <PulseDot />&nbsp;CORE SYSTEM v9.0 — EN LIGNE
              </div>
              <h1 style={{ fontSize:'clamp(2.8rem,4.5vw,4.8rem)', fontWeight:900, lineHeight:1.05, marginBottom:'1.2rem' }}>
                La Banque<br />
                <span style={{ background:'linear-gradient(90deg,#00f0ff,#7b2ff7)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Sans Frontières.</span>
              </h1>
              <p style={{ fontSize:'1rem', color:'#888', lineHeight:1.75, marginBottom:'2rem', maxWidth:460 }}>
                Une infrastructure financière vivante. Conçue pour ceux qui refusent les limites du système traditionnel.
              </p>
              <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
                <button className="btn-primary" onClick={()=>nav('/login')}>Ouvrir un Compte <ArrowRight size={16}/></button>
                <button className="btn-ghost" onClick={()=>nav('/login')}>Explorer</button>
              </div>
            </div>
            {/* DROITE — stats permanentes */}
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              {[
                { label:'Actifs Gérés', val:'$8.42B', color:'#00f0ff' },
                { label:'Transactions/sec', val:'84,209', color:'#39ff14' },
                { label:'Clients Mondiaux', val:'14M+', color:'#7b2ff7' },
                { label:'Disponibilité', val:'99.999%', color:'#ffbd2e' },
              ].map(s=><SBadge key={s.label} {...s}/>)}
            </div>
          </div>
        )}
      </ParallaxSection>

      {/* ══ SECTION DENSE — CHIFFRES ══ */}
      <section className="conversion" style={{ background:'#000', position:'relative', overflow:'hidden' }}>
        <GridOverlay />
        <div style={{ position:'absolute', top:'50%', left:'50%', width:'50vw', height:'50vw', transform:'translate(-50%,-50%)', background:'radial-gradient(circle,rgba(123,47,247,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:1300, margin:'0 auto', position:'relative', zIndex:2 }}>
          <div className="conversion__title" style={{ textAlign:'center', marginBottom:'1.5rem', marginInline:'auto' }}>
            <p style={{ fontFamily:"'JetBrains Mono',monospace", color:'#00f0ff', letterSpacing:4, fontSize:'0.72rem', marginBottom:'0.5rem' }}>MÉTRIQUES EN TEMPS RÉEL</p>
            <h2 style={{ fontSize:'clamp(1.6rem,3vw,2.5rem)', fontWeight:900, background:'linear-gradient(180deg,#fff 0%,#555 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Des chiffres qui parlent d'eux-mêmes.
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
            {[
              { t:'Transactions / Jour', n:1200000000, suf:'', pre:'', color:'#00f0ff' },
              { t:'Pays Couverts', n:194, suf:'', pre:'', color:'#39ff14' },
              { t:'Uptime Annuel', n:99.999, suf:'%', pre:'', color:'#7b2ff7' },
              { t:'Tests Passés', n:1402, suf:'', pre:'', color:'#ffbd2e' },
            ].map(m=>(
              <div key={m.t} className="glass-card" style={{ padding:'1.5rem', textAlign:'center', borderColor:`${m.color}22` }}>
                <div style={{ fontSize:'clamp(1.8rem,2.5vw,2.5rem)', fontWeight:900, marginBottom:8 }}>
                  <AnimatedCount target={m.n} prefix={m.pre} suffix={m.suf} color={m.color} />
                </div>
                <div style={{ fontSize:'0.75rem', color:'#666', letterSpacing:2, textTransform:'uppercase' }}>{m.t}</div>
              </div>
            ))}
          </div>
          {/* Jauges */}
          <div className="glass-card" style={{ padding:'1.5rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
            <div>
              <h3 style={{ fontSize:'0.75rem', color:'#555', letterSpacing:3, marginBottom:'1.5rem', fontFamily:"'JetBrains Mono',monospace" }}>PERFORMANCE RÉSEAU</h3>
              <DataGauge label="DÉBIT TRANSACTION" value={84} max={100} color="#00f0ff" unit="k/s" />
              <DataGauge label="SANTÉ DES NŒUDS" value={99} max={100} color="#39ff14" unit="%" />
              <DataGauge label="CHARGE CPU GLOBALE" value={42} max={100} color="#7b2ff7" unit="%" />
            </div>
            <div>
              <h3 style={{ fontSize:'0.75rem', color:'#555', letterSpacing:3, marginBottom:'1.5rem', fontFamily:"'JetBrains Mono',monospace" }}>SÉCURITÉ</h3>
              <DataGauge label="SCORE SÉCURITÉ" value={98} max={100} color="#ffbd2e" unit="/100" />
              <DataGauge label="MENACES BLOQUÉES" value={100} max={100} color="#39ff14" unit="%" />
              <DataGauge label="AUDIT CONFORMITÉ" value={100} max={100} color="#00f0ff" unit="%" />
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 2 — DATA CORE ══ */}
      <ParallaxSection id="datacore" videoSrc="/assets/videos/Black_data_core_rotating_chamber_202606181412_2.mp4" height="150vh">
        {(p) => (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'center', width:'100%' }}>
            <div>
              <p style={{ fontFamily:"'JetBrains Mono',monospace", color:'#39ff14', letterSpacing:4, fontSize:'0.72rem', marginBottom:'1rem' }}>INFRASTRUCTURE CŒUR</p>
              <h2 style={{ fontSize:'clamp(2.2rem,3.5vw,3.5rem)', fontWeight:900, lineHeight:1.1, marginBottom:'1.2rem' }}>
                Le système bat<br />
                <span style={{ background:'linear-gradient(90deg,#39ff14,#00f0ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>pour vous, 24/7.</span>
              </h2>
              <p style={{ color:'#777', lineHeight:1.75, fontSize:'0.95rem', maxWidth:430 }}>
                Notre Data Core traite des milliards de micro-décisions financières en permanence. Aucune coupure, aucun délai, aucune frontière.
              </p>
            </div>
            {/* DROITE — status panel */}
            <div className="glass-card" style={{ padding:'2rem', borderColor:'rgba(57,255,20,0.2)' }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.7rem', color:'#555', marginBottom:'1.5rem', letterSpacing:3 }}>
                STATUS PANEL — LIVE
              </div>
              {[
                { label:'Nœuds actifs', val:'4,021 / 4,021', ok:true },
                { label:'Latence P95', val:'0.04ms', ok:true },
                { label:'Réplication', val:'x7 Zones', ok:true },
                { label:'Dernière panne', val:'Jamais', ok:true },
                { label:'Prochaine MAJ', val:'Auto-patching', ok:true },
              ].map(s=>(
                <div key={s.label} style={{ display:'flex', justifyContent:'space-between', padding:'0.75rem 0', borderBottom:'1px solid rgba(255,255,255,0.04)', alignItems:'center' }}>
                  <span style={{ fontSize:'0.85rem', color:'#666', fontFamily:"'JetBrains Mono',monospace" }}>{s.label}</span>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:'0.85rem', color:'#fff', fontFamily:"'JetBrains Mono',monospace" }}>{s.val}</span>
                    <PulseDot color={s.ok?'#39ff14':'#ff5f56'} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ParallaxSection>

      {/* ══ SECTION FEATURES ══ */}
      <section className="conversion" style={{ background:'linear-gradient(180deg,#000 0%,#05050d 100%)', position:'relative', overflow:'hidden' }}>
        <GridOverlay />
        <div style={{ maxWidth:1300, margin:'0 auto', position:'relative', zIndex:2 }}>
          <div className="conversion__title" style={{ textAlign:'center', marginBottom:'1.5rem', marginInline:'auto' }}>
            <p style={{ fontFamily:"'JetBrains Mono',monospace", color:'#00f0ff', letterSpacing:4, fontSize:'0.72rem', marginBottom:'0.8rem' }}>POURQUOI INFINITE BANK</p>
            <h2 style={{ fontSize:'clamp(2rem,3.5vw,3rem)', fontWeight:900, background:'linear-gradient(180deg,#fff 0%,#555 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Conçu pour l'Ère Quantique.</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
            <FC color="#00f0ff" icon={<Shield size={22} color="#00f0ff"/>} title="Chiffrement AES-256" desc="Protection de niveau militaire sur toutes vos données et transactions. Aucun accès tiers possible." />
            <FC color="#39ff14" icon={<Zap size={22} color="#39ff14"/>} title="Latence 0.04ms" desc="Infrastructure distribuée sur 127 datacenters pour des virements instantanés, sans friction." />
            <FC color="#7b2ff7" icon={<Globe size={22} color="#7b2ff7"/>} title="Réseau 24/7" desc="Aucune coupure, aucun délai bancaire. Opérez partout dans le monde sans aucune frontière." />
            <FC color="#ff5f56" icon={<Eye size={22} color="#ff5f56"/>} title="Transparence Totale" desc="Chaque opération auditée en temps réel. Consultez vos mouvements avec un niveau de détail inégalé." />
            <FC color="#ffbd2e" icon={<Cpu size={22} color="#ffbd2e"/>} title="IA Prédictive" desc="Notre moteur neuronal analyse 10M de transactions/sec pour maximiser votre capital automatiquement." />
            <FC color="#00f0ff" icon={<Lock size={22} color="#00f0ff"/>} title="Zero-Trust Security" desc="Chaque transaction nécessite une validation cryptographique multi-couche en temps réel." />
          </div>
        </div>
      </section>

      {/* ══ SECTION 3 — HOLOGRAPHIC (Dashboard demo) ══ */}
      <ParallaxSection id="dashboard" videoSrc="/assets/videos/Holographic_glass_panel_scrollin…_202606181412.mp4" height="150vh">
        {(p) => (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'center', width:'100%' }}>
            {/* GAUCHE — mock dashboard */}
            <div className="glass-card" style={{ padding:'2rem', borderColor:'rgba(0,240,255,0.2)' }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.65rem', color:'#555', marginBottom:'1rem', letterSpacing:3 }}>PORTEFEUILLE — TEMPS RÉEL</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'2.8rem', fontWeight:900, color:'#00f0ff', textShadow:'0 0 20px rgba(0,240,255,0.4)', marginBottom:'1.5rem' }}>
                $14,028,492
              </div>
              <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
                {['+ DÉPÔT','- RETRAIT','⇄ VIREMENT'].map(a=>(
                  <div key={a} className="glass-card" style={{ padding:'0.5rem 1rem', fontSize:'0.75rem', fontFamily:"'JetBrains Mono',monospace", color:'#00f0ff', borderColor:'rgba(0,240,255,0.2)', borderRadius:6, cursor:'pointer' }}>{a}</div>
                ))}
              </div>
              {[
                { hash:'0x9f2a...4bc1', type:'VIREMENT ENTRANT', amt:'+$124,500', color:'#39ff14' },
                { hash:'0x3c8e...9d0f', type:'DÉPÔT INSTITUTIONNEL', amt:'+$2,800,000', color:'#39ff14' },
                { hash:'0x7a1b...2e3d', type:'RETRAIT', amt:'-$50,000', color:'#ff5f56' },
                { hash:'0x1f4d...8a7c', type:'VIREMENT ENTRANT', amt:'+$900,000', color:'#39ff14' },
              ].map((tx,i)=>(
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'0.6rem 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <div>
                    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.65rem', color:'#444' }}>{tx.hash}</div>
                    <div style={{ fontSize:'0.8rem', color:'#999', marginTop:2 }}>{tx.type}</div>
                  </div>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", color:tx.color, fontWeight:700, fontSize:'0.9rem' }}>{tx.amt}</span>
                </div>
              ))}
            </div>
            {/* DROITE — texte */}
            <div>
              <p style={{ fontFamily:"'JetBrains Mono',monospace", color:'#00f0ff', letterSpacing:4, fontSize:'0.72rem', marginBottom:'1rem' }}>TABLEAU DE BORD CLIENT</p>
              <h2 style={{ fontSize:'clamp(2rem,3.5vw,3.2rem)', fontWeight:900, lineHeight:1.1, marginBottom:'1.2rem' }}>
                Contrôlez tout,<br />
                <span style={{ background:'linear-gradient(90deg,#00f0ff,#7b2ff7)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>en temps réel.</span>
              </h2>
              <p style={{ color:'#777', lineHeight:1.75, fontSize:'0.95rem', marginBottom:'2rem', maxWidth:420 }}>
                Chaque centime visible instantanément. Votre tableau de bord est une fenêtre directe sur le flux nerveux de votre patrimoine.
              </p>
              <button className="btn-primary" onClick={()=>nav('/login')}>Accéder à mon Portefeuille <ArrowRight size={16}/></button>
            </div>
          </div>
        )}
      </ParallaxSection>

      {/* ══ CTA FINAL DENSE ══ */}
      <section className="conversion" style={{ background:'#000', position:'relative', overflow:'hidden' }}>
        <GridOverlay />
        <div style={{ position:'absolute', top:'50%', left:'50%', width:'60vw', height:'60vw', transform:'translate(-50%,-50%)', background:'radial-gradient(circle,rgba(0,240,255,0.07) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ maxWidth:1300, margin:'0 auto', position:'relative', zIndex:2, display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5rem', alignItems:'center' }}>
          <div>
            <p style={{ fontFamily:"'JetBrains Mono',monospace", color:'#7b2ff7', letterSpacing:4, fontSize:'0.72rem', marginBottom:'1rem' }}>PRÊT À REJOINDRE LE FUTUR ?</p>
            <h2 className="conversion__title" style={{ fontSize:'clamp(2.5rem,4vw,4rem)', fontWeight:900, lineHeight:1.05, marginBottom:'1.5rem' }}>
              Entrez dans le<br />
              <span style={{ background:'linear-gradient(90deg,#00f0ff,#7b2ff7,#ff5f56)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Core System.</span>
            </h2>
            <p style={{ color:'#777', fontSize:'1rem', lineHeight:1.75, marginBottom:'2.5rem', maxWidth:450 }}>
              Des millions de clients font confiance à Infinite Bank pour gérer leurs actifs. Rejoignez la prochaine évolution de la finance mondiale.
            </p>
            <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
              <button className="btn-primary" onClick={()=>nav('/login')} style={{ fontSize:'1rem' }}>
                Créer Mon Compte <ArrowRight size={18}/>
              </button>
              <button className="btn-ghost" onClick={()=>nav('/login')}>
                En savoir plus
              </button>
            </div>
          </div>
          {/* Droite : specs techniques */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div className="glass-card" style={{ padding:'1.5rem', borderColor:'rgba(0,240,255,0.15)' }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.65rem', color:'#555', marginBottom:'1rem', letterSpacing:3 }}>STACK TECHNIQUE</div>
              {[
                ['Moteur', 'Infinite Core v9.0 (Neural)'],
                ['Chiffrement', 'AES-256-GCM + TLS 1.3'],
                ['Certification', 'ISO 27001 · PCI DSS · SOC 2'],
                ['Architecture', 'Zero-Trust Multi-Cloud'],
                ['Tests', '1,402 passing — 0 failing'],
              ].map(([k,v])=>(
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'0.6rem 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.75rem', color:'#555' }}>{k}</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'0.75rem', color:'#ccc' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              {[
                { v:'$0', l:'Frais cachés', c:'#39ff14' },
                { v:'∞', l:'Transactions', c:'#00f0ff' },
                { v:'2min', l:'Ouverture compte', c:'#7b2ff7' },
                { v:'24/7', l:'Support', c:'#ffbd2e' },
              ].map(s=><SBadge key={s.l} label={s.l} val={s.v} color={s.c}/>)}
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ padding:'4rem var(--grid-gutter-width)', borderTop:'1px solid rgba(255,255,255,0.05)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#000' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'#00f0ff', boxShadow:'0 0 6px #00f0ff', display:'inline-block' }} />
          <span style={{ fontFamily:"'JetBrains Mono',monospace", color:'#444', fontSize:'0.78rem' }}>© 2026 INFINITE BANK ∞ — CORE SYSTEM v9.0</span>
        </div>
        <div style={{ display:'flex', gap:'2rem' }}>
          {['Confidentialité','CGU','Sécurité','Contact'].map(l=>(
            <span key={l} style={{ color:'#444', fontSize:'0.8rem', cursor:'pointer', transition:'color .2s' }}
              onMouseEnter={e=>e.target.style.color='#fff'} onMouseLeave={e=>e.target.style.color='#444'}>{l}</span>
          ))}
        </div>
      </footer>

    </div>
  );
}
