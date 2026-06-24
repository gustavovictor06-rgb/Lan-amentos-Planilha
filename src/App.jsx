import { useState, useEffect } from "react";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzl-ja73v_fLnlIc5iKB2c8aY7Ba9dhKkME7N_OxKdZa0B0qtn6mIojwIO4lVTvpbmoDw/exec";
const SHEET_ID   = "1iCxWMqO7oP5usA78OslpLfGPksgOLHw9T7m9XIAr_QI";
const LOGO_URL = "data:image/png;base64,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";

async function enviarParaSheets(form) {
  const dados = {
    data: form.data, uc: form.uc, colaborador: form.colaborador,
    solicitacao: form.solicitacao,
    parcelas: form.solicitacao === "Atualização" ? "0" : form.parcelas,
    vencimento: form.vencimento,
    intervalo: form.solicitacao === "Parcelamento" ? form.intervalo : "—",
    juros: form.juros, unificado: form.unificado, incred: form.incred,
    observacoes: form.observacoes || "—",
  };
  await fetch(SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(dados),
  });
}

const T = {
  bg: "#0a0a0a", card: "#141414", cardBorda: "#1e1e1e",
  surface: "#1a1a1a", surface2: "#222222",
  verde: "#1a5c20", verdeVivo: "#22c55e",
  txt: "#f0f0f0", txtSub: "#888888", txtMute: "#555555",
  borda: "#2a2a2a", inputBg: "#111111", inputBorda: "#333333", erro: "#ef4444",
  amarelo: "#fbbf24", amareloFundo: "#1a0a00", amareloBorda: "#b45309",
};

const PASSOS = ["Identificação", "Financeiro", "Datas", "Revisão"];
const VAZIO = { data:"",uc:"",colaborador:"",solicitacao:"",parcelas:"",vencimento:"",intervalo:"",juros:"",unificado:"",incred:"",observacoes:"" };

const TOUR_STEPS = [
  {
    icon:"👋",
    titulo:"Bem-vindo!",
    cor:"#22c55e",
    descricao:"Este sistema guia você no registro de parcelamentos e atualizações. Rápido, sem erro e direto na planilha. Veja o que vai preencher:",
    campos: null,
    dica: null,
  },
  {
    icon:"🪪",
    titulo:"Passo 1 — Identificação",
    cor:"#60a5fa",
    descricao:"Aqui você informa quem está fazendo o lançamento e o que se trata.",
    campos: [
      { label:"Colaborador", exemplo:"Ex: João Silva", info:"Seu nome — não precisa ser completo." },
      { label:"UC", exemplo:"Ex: 54321", info:"Número da Unidade Consumidora do cliente." },
      { label:"Solicitação", exemplo:"Atualização  ou  Parcelamento", info:"O que o cliente está pedindo." },
    ],
    dica: null,
  },
  {
    icon:"💰",
    titulo:"Passo 2 — Financeiro",
    cor:"#fbbf24",
    descricao:"Aqui você define as condições do acordo com o cliente.",
    campos: [
      { label:"Parcelas", exemplo:"Ex: 3 (só para parcelamento)", info:"Em quantas vezes vai ser dividido." },
      { label:"Juros", exemplo:"Sim  ou  Não", info:"Se o débito tem juros aplicados." },
      { label:"Unificado", exemplo:"Sim  ou  Não", info:"Se as faturas foram unificadas." },
      { label:"Incred", exemplo:"Sim  ou  Não", info:"Se for Sim, um e-mail deve ser enviado antes de continuar." },
    ],
    dica: "⚠ Se Incred = Sim, você precisará enviar um e-mail com os dados do cliente antes de prosseguir.",
  },
  {
    icon:"📅",
    titulo:"Passo 3 — Datas",
    cor:"#c084fc",
    descricao:"Aqui você define quando o lançamento acontece e quando vence.",
    campos: [
      { label:"Data do Lançamento", exemplo:"Ex: 23/06/2025", info:"Hoje — dia em que está registrando." },
      { label:"Data de Vencimento / 1ª Parcela", exemplo:"Ex: 10/07/2025", info:"Quando o cliente vai pagar." },
      { label:"Intervalo (parcelamento)", exemplo:"Ex: 30 dias", info:"De quanto em quanto tempo vence cada parcela." },
    ],
    dica: null,
  },
  {
    icon:"✅",
    titulo:"Passo 4 — Revisão e Envio",
    cor:"#22c55e",
    descricao:"Você vê um resumo de tudo antes de confirmar. Depois de enviar, os dados vão direto para a planilha com status Não feito — o responsável atualiza depois.",
    campos: [
      { label:"Resumo completo", exemplo:"UC · Colaborador · Parcelas · Datas...", info:"Tudo aparece aqui para você conferir." },
      { label:"Status automático", exemplo:"Não feito", info:"O responsável irá atualizar para Feito ou Pendente." },
    ],
    dica: "✓ Após enviar, aparece um botão para abrir a planilha direto.",
  },
];

function Tour({ onConcluir }) {
  const [step, setStep] = useState(0);
  const atual = TOUR_STEPS[step];
  const ultimo = step === TOUR_STEPS.length - 1;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.92)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16, fontFamily:"'Inter',system-ui,sans-serif", overflowY:"auto" }}>
      <div style={{ background:"#141414", border:`1px solid #2a2a2a`, borderRadius:20, padding:"28px 28px 22px", maxWidth:500, width:"100%", boxShadow:"0 30px 80px rgba(0,0,0,.9)" }}>

        {/* Dots */}
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:22 }}>
          {TOUR_STEPS.map((_,i) => (
            <div key={i} style={{ width:i===step?24:8, height:8, borderRadius:99, background:i<=step?atual.cor:"#2a2a2a", transition:"all .3s" }} />
          ))}
        </div>

        {/* Icon + titulo */}
        <div style={{ textAlign:"center", marginBottom:16 }}>
          <div style={{ fontSize:44, marginBottom:8 }}>{atual.icon}</div>
          <h2 style={{ fontSize:18, fontWeight:800, color:"#f0f0f0", margin:"0 0 8px", lineHeight:1.3 }}>{atual.titulo}</h2>
          <p style={{ fontSize:13, color:"#888", lineHeight:1.6, margin:0 }}>{atual.descricao}</p>
        </div>

        {/* Campos simulados */}
        {atual.campos && (
          <div style={{ marginTop:16, display:"flex", flexDirection:"column", gap:10 }}>
            {atual.campos.map((c,i) => (
              <div key={i} style={{ background:"#1a1a1a", border:`1px solid #2a2a2a`, borderRadius:10, padding:"10px 14px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:atual.cor }}>{c.label}</span>
                  <span style={{ fontSize:11, color:"#555", background:"#111", padding:"2px 8px", borderRadius:99, border:"1px solid #2a2a2a" }}>{c.exemplo}</span>
                </div>
                <p style={{ margin:0, fontSize:12, color:"#666", lineHeight:1.4 }}>→ {c.info}</p>
              </div>
            ))}
          </div>
        )}

        {/* Dica */}
        {atual.dica && (
          <div style={{ marginTop:12, background:"#1a1000", border:"1px solid #b45309", borderRadius:8, padding:"10px 14px" }}>
            <p style={{ margin:0, fontSize:12, color:"#fbbf24", lineHeight:1.5 }}>{atual.dica}</p>
          </div>
        )}

        {/* Botões */}
        <div style={{ display:"flex", gap:10, marginTop:20 }}>
          {step > 0 && (
            <button onClick={()=>setStep(s=>s-1)} style={{ flex:1, padding:"11px", borderRadius:10, border:"1.5px solid #2a2a2a", background:"transparent", color:"#888", fontWeight:600, fontSize:14, cursor:"pointer" }}>← Voltar</button>
          )}
          <button onClick={()=>ultimo?onConcluir():setStep(s=>s+1)} style={{ flex:2, padding:"11px", borderRadius:10, background:ultimo?T.verdeVivo:"#222", color:ultimo?"#000":"#f0f0f0", fontWeight:700, fontSize:14, border:`1.5px solid ${ultimo?T.verdeVivo:"#2a2a2a"}`, cursor:"pointer", transition:"all .2s" }}>
            {ultimo?"Começar a usar 🚀":"Próximo →"}
          </button>
        </div>

        {!ultimo && (
          <button onClick={onConcluir} style={{ display:"block", margin:"12px auto 0", background:"none", border:"none", color:"#555", fontSize:11, cursor:"pointer", textDecoration:"underline" }}>Pular apresentação</button>
        )}
      </div>
    </div>
  );
}

function ProgressBar({ passo }) {
  return (
    <div style={{ marginBottom:28 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
        {PASSOS.map((p,i) => (
          <div key={p} style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
            <div style={{ width:34, height:34, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, transition:"all .3s", background:i<passo?T.verde:i===passo?T.verdeVivo:T.surface2, color:i<=passo?"#fff":T.txtMute, boxShadow:i===passo?"0 0 0 4px rgba(34,197,94,.18)":"none", border:i===passo?`2px solid ${T.verdeVivo}`:"2px solid transparent" }}>
              {i<passo?"✓":i+1}
            </div>
            <span style={{ fontSize:10, marginTop:5, color:i===passo?T.verdeVivo:i<passo?"#4ade80":T.txtMute, fontWeight:i===passo?700:400, textAlign:"center" }}>{p}</span>
          </div>
        ))}
      </div>
      <div style={{ height:3, background:T.surface2, borderRadius:99 }}>
        <div style={{ height:"100%", background:`linear-gradient(90deg,${T.verde},${T.verdeVivo})`, borderRadius:99, transition:"width .4s", width:`${(passo/(PASSOS.length-1))*100}%` }} />
      </div>
    </div>
  );
}

function Campo({ label, obrigatorio, dica, erro, children }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:"block", fontSize:13, fontWeight:600, color:T.txt, marginBottom:4 }}>
        {label} {obrigatorio && <span style={{ color:T.verdeVivo }}>*</span>}
      </label>
      {dica && <p style={{ fontSize:11, color:T.txtSub, marginBottom:4, marginTop:-2 }}>{dica}</p>}
      {children}
      {erro && <p style={{ fontSize:12, color:T.erro, marginTop:4 }}>⚠ {erro}</p>}
    </div>
  );
}

const inputStyle = { width:"100%", padding:"10px 12px", borderRadius:8, border:`1.5px solid ${T.inputBorda}`, fontSize:14, outline:"none", boxSizing:"border-box", background:T.inputBg, fontFamily:"inherit", color:T.txt };

function Input({ value, onChange, type="text", placeholder, ...rest }) {
  return <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={inputStyle} onFocus={e=>e.target.style.borderColor=T.verdeVivo} onBlur={e=>e.target.style.borderColor=T.inputBorda} {...rest} />;
}

function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)} style={{ ...inputStyle, appearance:"auto", colorScheme:"dark" }}>
      <option value="">Selecione...</option>
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function Alerta({ tipo, children }) {
  const map = { info:{bg:"#0d1f0d",borda:"#166534",cor:"#4ade80",icon:"ℹ"}, aviso:{bg:"#1a1000",borda:"#78350f",cor:"#fbbf24",icon:"⚠"}, sucesso:{bg:"#052e16",borda:"#166534",cor:"#4ade80",icon:"✓"}, erro:{bg:"#1f0000",borda:"#7f1d1d",cor:"#f87171",icon:"✗"} };
  const s = map[tipo];
  return <div style={{ background:s.bg, border:`1.5px solid ${s.borda}`, borderRadius:8, padding:"10px 14px", color:s.cor, fontSize:13, display:"flex", gap:8, marginBottom:14 }}><span style={{ fontWeight:700, flexShrink:0 }}>{s.icon}</span><span>{children}</span></div>;
}

function BotaoOpcao({ selecionado, onClick, children }) {
  return <button onClick={onClick} style={{ padding:"12px 8px", borderRadius:8, fontWeight:700, fontSize:14, cursor:"pointer", transition:"all .2s", border:selecionado?`2px solid ${T.verdeVivo}`:`2px solid ${T.borda}`, background:selecionado?"#0d2e10":T.surface, color:selecionado?T.verdeVivo:T.txtSub }}>{children}</button>;
}

function AvisoIncred() {
  return (
    <div style={{ background:T.amareloFundo, border:`1.5px solid ${T.amareloBorda}`, borderRadius:10, padding:"16px 18px", marginTop:4 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
        <span style={{ fontSize:18 }}>⚠</span>
        <span style={{ fontSize:14, fontWeight:700, color:T.amarelo }}>Ação necessária antes de continuar</span>
      </div>
      <p style={{ fontSize:13, color:"#fde68a", margin:"0 0 10px", lineHeight:1.6 }}>Encaminhe um e-mail para:</p>
      <div style={{ background:"#111", borderRadius:6, padding:"10px 12px", marginBottom:10 }}>
        <p style={{ fontSize:12, color:T.amarelo, margin:"0 0 4px", fontWeight:600 }}>📧 victoria.paes@incredi.com.br</p>
        <p style={{ fontSize:12, color:T.amarelo, margin:0, fontWeight:600 }}>📧 daniele.garcia@incredi.com.br</p>
      </div>
      <p style={{ fontSize:13, color:"#fde68a", margin:"0 0 8px", lineHeight:1.6 }}>Com os dados do cliente:</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
        {["Nome","CPF","UC","Telefone"].map(tag=>(
          <span key={tag} style={{ background:"#292200", border:`1px solid ${T.amareloBorda}`, color:T.amarelo, fontSize:12, fontWeight:600, padding:"4px 10px", borderRadius:20 }}>{tag}</span>
        ))}
      </div>
      <p style={{ fontSize:13, color:"#fde68a", margin:"0 0 14px", lineHeight:1.6 }}>Para que entrem em contato com esse cliente e realizem a negociação.</p>
      <div style={{ background:"#111", borderRadius:8, padding:"10px 14px", border:`1px solid ${T.borda}` }}>
        <p style={{ fontSize:12, color:T.txtSub, margin:0, textAlign:"center" }}>
          🔒 Selecione <strong style={{ color:T.txt }}>Incred = Não</strong> para continuar o lançamento
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [passo,    setPasso]    = useState(0);
  const [form,     setForm]     = useState({...VAZIO});
  const [erros,    setErros]    = useState({});
  const [status,   setStatus]   = useState("idle");
  const [msgErro,  setMsgErro]  = useState("");
  const [showTour, setShowTour] = useState(true);

  function concluirTour() { setShowTour(false); }
  const set = (k,v) => { setForm(f=>({...f,[k]:v})); setErros(e=>({...e,[k]:""})); };
  const incredBloqueado = form.incred === "Sim";

  function validar() {
    const e = {};
    if (passo===0) {
      if (!form.uc)          e.uc          = "Informe o número da UC.";
      if (!form.colaborador) e.colaborador = "Informe o colaborador.";
      if (!form.solicitacao) e.solicitacao = "Selecione o tipo de solicitação.";
    }
    if (passo===1) {
      if (form.solicitacao==="Parcelamento" && (!form.parcelas||isNaN(form.parcelas)||Number(form.parcelas)<1)) e.parcelas = "Informe o número de parcelas (mín. 1).";
      if (!form.juros)     e.juros     = "Informe se haverá juros.";
      if (!form.unificado) e.unificado = "Informe se é unificado.";
      if (!form.incred)    e.incred    = "Informe se é Incred.";
    }
    if (passo===2) {
      if (!form.data)       e.data       = "Informe a data do lançamento.";
      if (!form.vencimento) e.vencimento = form.solicitacao==="Atualização" ? "Informe a nova data de vencimento." : "Informe a data da primeira parcela.";
      if (form.solicitacao==="Parcelamento" && !form.intervalo) e.intervalo = "Informe o intervalo entre parcelas.";
    }
    setErros(e);
    return Object.keys(e).length===0;
  }

  function avancar() { if (!incredBloqueado && validar()) setPasso(p=>p+1); }
  function voltar()  { setErros({}); setPasso(p=>p-1); }

  async function salvar() {
    setStatus("salvando");
    try { await enviarParaSheets(form); setStatus("sucesso"); }
    catch(err) { setMsgErro(err.message||"Erro ao conectar."); setStatus("erro"); }
  }

  function novoLancamento() { setForm({...VAZIO}); setPasso(0); setStatus("idle"); setErros({}); }

  if (status==="sucesso") return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Inter',system-ui,sans-serif", padding:20, position:"relative", overflow:"hidden" }}>
      <img src={LOGO_URL} alt="" style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"100vw", height:"100vh", objectFit:"cover", opacity:0.13, filter:"grayscale(100%) brightness(0.9) sepia(1) hue-rotate(90deg) saturate(5)", pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"relative", zIndex:1, background:T.card, border:`1px solid ${T.cardBorda}`, borderRadius:16, padding:40, maxWidth:440, width:"100%", textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,.5)" }}>
        <div style={{ fontSize:60, marginBottom:16 }}>✅</div>
        <h2 style={{ fontSize:22, fontWeight:800, color:T.txt, marginBottom:8 }}>Lançamento Enviado!</h2>
        <p style={{ color:T.txtSub, fontSize:14, marginBottom:24 }}>Os dados foram registrados automaticamente na planilha Google Sheets.</p>
        <a href={`https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`} target="_blank" rel="noreferrer" style={{ display:"block", padding:"11px", borderRadius:10, background:"transparent", color:T.verdeVivo, fontWeight:700, fontSize:13, border:`2px solid ${T.verde}`, textDecoration:"none", marginBottom:12 }}>
          📊 Abrir Planilha Google Sheets
        </a>
        <button onClick={novoLancamento} style={{ width:"100%", padding:12, borderRadius:10, background:T.verdeVivo, color:"#000", fontWeight:700, fontSize:14, border:"none", cursor:"pointer" }}>
          + Novo Lançamento
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'Inter',system-ui,sans-serif", padding:"32px 16px", color:T.txt, position:"relative", overflow:"hidden" }}>

      {/* MARCA D'ÁGUA */}
      <img src={LOGO_URL} alt="" style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"100vw", height:"100vh", objectFit:"cover", opacity:0.13, filter:"grayscale(100%) brightness(0.9) sepia(1) hue-rotate(90deg) saturate(5)", pointerEvents:"none", zIndex:0 }} />

      {showTour && <Tour onConcluir={concluirTour} />}

      <div style={{ maxWidth:540, margin:"0 auto", position:"relative", zIndex:1 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:T.card, border:`1px solid ${T.borda}`, borderRadius:50, padding:"6px 18px", marginBottom:14 }}>
            <span style={{ fontSize:14 }}>📊</span>
            <span style={{ fontSize:12, fontWeight:700, color:T.verdeVivo, letterSpacing:1 }}>LANÇAMENTOS GUIADOS</span>
          </div>
          <h1 style={{ fontSize:26, fontWeight:800, color:T.txt, margin:0 }}>Novo Lançamento</h1>
          <p style={{ color:T.txtSub, fontSize:13, marginTop:6 }}>Responda as perguntas — os dados vão direto para a planilha.</p>
          <button onClick={()=>setShowTour(true)} style={{ marginTop:8, background:"none", border:`1px solid ${T.borda}`, color:T.txtMute, fontSize:11, padding:"4px 12px", borderRadius:20, cursor:"pointer" }}>
            ? Ver apresentação novamente
          </button>
        </div>

        <div style={{ background:"rgba(20,20,20,0.5)", backdropFilter:"blur(12px)", borderRadius:16, padding:28, border:`1px solid ${T.cardBorda}`, boxShadow:"0 20px 60px rgba(0,0,0,.5)" }}>
          <ProgressBar passo={passo} />
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <div style={{ width:3, height:20, background:T.verdeVivo, borderRadius:2 }} />
            <h2 style={{ fontSize:17, fontWeight:700, color:T.txt, margin:0 }}>{PASSOS[passo]}</h2>
          </div>

          {passo===0 && (
            <div>
              <Alerta tipo="info">Informe quem está fazendo a solicitação e do que se trata.</Alerta>
              <Campo label="Colaborador" obrigatorio dica="Nome do colaborador responsável." erro={erros.colaborador}>
                <Input value={form.colaborador} onChange={v=>set("colaborador",v)} placeholder="Seu nome" />
              </Campo>
              <Campo label="UC" obrigatorio dica="Digite o número da UC." erro={erros.uc}>
                <Input value={form.uc} onChange={v=>set("uc",v)} placeholder="Ex: 12345" />
              </Campo>
              <Campo label="Solicitação" obrigatorio erro={erros.solicitacao}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <BotaoOpcao selecionado={form.solicitacao==="Atualização"} onClick={()=>set("solicitacao","Atualização")}>🔄 Atualização</BotaoOpcao>
                  <BotaoOpcao selecionado={form.solicitacao==="Parcelamento"} onClick={()=>set("solicitacao","Parcelamento")}>📋 Parcelamento</BotaoOpcao>
                </div>
              </Campo>
            </div>
          )}

          {passo===1 && (
            <div>
              <Alerta tipo="info">Preencha as condições financeiras do lançamento.</Alerta>
              {form.solicitacao==="Parcelamento" && (
                <Campo label="Parcelas" obrigatorio erro={erros.parcelas} dica="Número de parcelas (1 = à vista).">
                  <Input type="number" value={form.parcelas} onChange={v=>set("parcelas",v)} placeholder="1" min="1" />
                </Campo>
              )}
              {form.solicitacao==="Atualização" && <Alerta tipo="info">Atualização de vencimento — campo de parcelas não se aplica.</Alerta>}
              <Campo label="Haverá juros?" obrigatorio erro={erros.juros}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <BotaoOpcao selecionado={form.juros==="Sim"} onClick={()=>set("juros","Sim")}>✓ Sim</BotaoOpcao>
                  <BotaoOpcao selecionado={form.juros==="Não"} onClick={()=>set("juros","Não")}>✗ Não</BotaoOpcao>
                </div>
              </Campo>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <Campo label="Unificado?" obrigatorio erro={erros.unificado}>
                  <Select value={form.unificado} onChange={v=>set("unificado",v)} options={["Sim","Não"]} />
                </Campo>
                <Campo label="Incred?" obrigatorio erro={erros.incred}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    <BotaoOpcao selecionado={form.incred==="Sim"} onClick={()=>set("incred","Sim")}>✓ Sim</BotaoOpcao>
                    <BotaoOpcao selecionado={form.incred==="Não"} onClick={()=>set("incred","Não")}>✗ Não</BotaoOpcao>
                  </div>
                </Campo>
              </div>
              {incredBloqueado && <AvisoIncred />}
              {!incredBloqueado && (
                <Campo label="Observações" dica="Informações adicionais (opcional).">
                  <textarea value={form.observacoes} onChange={e=>set("observacoes",e.target.value)} placeholder="Ex: Cliente solicitou prazo estendido..." style={{ ...inputStyle, resize:"vertical", minHeight:70 }} />
                </Campo>
              )}
            </div>
          )}

          {passo===2 && (
            <div>
              <Alerta tipo="info">Defina as datas do lançamento.</Alerta>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                <Campo label="Data do Lançamento" obrigatorio erro={erros.data}>
                  <Input type="date" value={form.data} onChange={v=>set("data",v)} />
                </Campo>
                <Campo label={form.solicitacao==="Atualização" ? "Nova Data de Vencimento" : "Data da Primeira Parcela"} obrigatorio erro={erros.vencimento}>
                  <Input type="date" value={form.vencimento} onChange={v=>set("vencimento",v)} />
                </Campo>
              </div>
              {form.solicitacao==="Parcelamento" && (
                <Campo label="Intervalo entre Parcelas (dias)" obrigatorio dica="Digite o número de dias entre cada parcela." erro={erros.intervalo}>
                  <Input type="number" value={form.intervalo} onChange={v=>set("intervalo",v)} placeholder="Ex: 30" min="1" />
                </Campo>
              )}
              <Alerta tipo="aviso">O status será registrado como <strong>Não feito</strong> automaticamente. O responsável atualizará na planilha.</Alerta>
            </div>
          )}

          {passo===3 && (
            <div>
              <Alerta tipo="sucesso">Tudo certo! Confira antes de enviar para a planilha.</Alerta>
              {status==="erro" && <Alerta tipo="erro">{msgErro}</Alerta>}
              <div style={{ background:T.surface, borderRadius:10, padding:16, marginBottom:14, border:`1px solid ${T.borda}` }}>
                {[
                  ["UC",form.uc],["Colaborador",form.colaborador],["Solicitação",form.solicitacao],
                  ...(form.solicitacao==="Parcelamento"?[["Parcelas",`${form.parcelas}x`],["Intervalo",`${form.intervalo} dias`]]:[]),
                  ["Juros",form.juros],["Unificado",form.unificado],["Incred",form.incred],
                  ["Data do Lançamento",form.data],
                  [form.solicitacao==="Atualização"?"Nova Data de Vencimento":"Data da 1ª Parcela",form.vencimento],
                  ["Status","Não feito (padrão)"],
                  ...(form.observacoes?[["Observações",form.observacoes]]:[]),
                ].map(([k,v])=>(
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:13, borderBottom:`1px solid ${T.borda}`, padding:"7px 0", gap:8 }}>
                    <span style={{ color:T.txtSub, flexShrink:0 }}>{k}</span>
                    <span style={{ fontWeight:600, color:k==="Status"?"#f87171":T.txt, textAlign:"right" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display:"flex", gap:12, marginTop:22 }}>
            {passo>0 && status!=="salvando" && (
              <button onClick={voltar} style={{ flex:1, padding:12, borderRadius:10, border:`1.5px solid ${T.borda}`, background:"transparent", color:T.txtSub, fontWeight:600, fontSize:14, cursor:"pointer" }}>← Voltar</button>
            )}
            {passo<PASSOS.length-1
              ? <button onClick={avancar} disabled={incredBloqueado} style={{ flex:2, padding:12, borderRadius:10, background:incredBloqueado?T.surface2:T.verdeVivo, color:incredBloqueado?T.txtMute:"#000", fontWeight:700, fontSize:14, border:"none", cursor:incredBloqueado?"not-allowed":"pointer", opacity:incredBloqueado?0.5:1 }}>
                  Continuar →
                </button>
              : <button onClick={salvar} disabled={status==="salvando"} style={{ flex:2, padding:12, borderRadius:10, background:status==="salvando"?T.surface2:T.verde, color:"#fff", fontWeight:700, fontSize:14, border:`1px solid ${T.verdeVivo}`, cursor:status==="salvando"?"not-allowed":"pointer", opacity:status==="salvando"?0.7:1 }}>
                  {status==="salvando"?"⏳ Enviando...":"✓ Enviar para Planilha"}
                </button>
            }
          </div>
        </div>
        <p style={{ textAlign:"center", fontSize:11, color:T.txtMute, marginTop:16 }}>Os dados vão direto para o Google Sheets • Status atualizado pelo responsável</p>
      </div>
    </div>
  );
}
