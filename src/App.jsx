import { useState } from "react";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxUUlSfvDWDTW8RpXVehv-uOuw4Qa7a0dDeTWDTQQsFB9O4r4frsJbsr83r2uhJ8tLJOw/exec";
const SHEET_ID   = "1iCxWMqO7oP5usA78OslpLfGPksgOLHw9T7m9XIAr_QI";

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
  const res = await fetch(SCRIPT_URL, { method: "POST", body: JSON.stringify(dados) });
  const json = await res.json();
  if (!json.success) throw new Error("Erro ao salvar na planilha.");
}

const T = {
  bg: "#0a0a0a", card: "#141414", cardBorda: "#1e1e1e",
  surface: "#1a1a1a", surface2: "#222222",
  verde: "#1a5c20", verdeVivo: "#22c55e",
  txt: "#f0f0f0", txtSub: "#888888", txtMute: "#555555",
  borda: "#2a2a2a", inputBg: "#111111", inputBorda: "#333333", erro: "#ef4444",
};

const PASSOS = ["Identificação", "Financeiro", "Datas", "Revisão"];
const VAZIO = { data:"",uc:"",colaborador:"",solicitacao:"",parcelas:"",vencimento:"",intervalo:"",juros:"",unificado:"",incred:"",observacoes:"" };

function ProgressBar({ passo }) {
  return (
    <div style={{ marginBottom:28 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
        {PASSOS.map((p,i) => (
          <div key={p} style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:1 }}>
            <div style={{ width:34, height:34, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, transition:"all .3s", background: i<passo?T.verde:i===passo?T.verdeVivo:T.surface2, color:i<=passo?"#fff":T.txtMute, boxShadow:i===passo?"0 0 0 4px rgba(34,197,94,.18)":"none", border:i===passo?`2px solid ${T.verdeVivo}`:"2px solid transparent" }}>
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

export default function App() {
  const [passo,  setPasso]  = useState(0);
  const [form,   setForm]   = useState({...VAZIO});
  const [erros,  setErros]  = useState({});
  const [status, setStatus] = useState("idle");
  const [msgErro,setMsgErro]= useState("");

  const set = (k,v) => { setForm(f=>({...f,[k]:v})); setErros(e=>({...e,[k]:""})); };

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

  function avancar() { if (validar()) setPasso(p=>p+1); }
  function voltar()  { setErros({}); setPasso(p=>p-1); }

  async function salvar() {
    setStatus("salvando");
    try { await enviarParaSheets(form); setStatus("sucesso"); }
    catch(err) { setMsgErro(err.message||"Erro ao conectar."); setStatus("erro"); }
  }

  function novoLancamento() { setForm({...VAZIO}); setPasso(0); setStatus("idle"); setErros({}); }

  if (status==="sucesso") return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Inter',system-ui,sans-serif", padding:20 }}>
      <div style={{ background:T.card, border:`1px solid ${T.cardBorda}`, borderRadius:16, padding:40, maxWidth:440, width:"100%", textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,.5)" }}>
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
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'Inter',system-ui,sans-serif", padding:"32px 16px", color:T.txt }}>
      <div style={{ maxWidth:540, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:T.card, border:`1px solid ${T.borda}`, borderRadius:50, padding:"6px 18px", marginBottom:14 }}>
            <span style={{ fontSize:14 }}>📊</span>
            <span style={{ fontSize:12, fontWeight:700, color:T.verdeVivo, letterSpacing:1 }}>LANÇAMENTOS GUIADOS</span>
          </div>
          <h1 style={{ fontSize:26, fontWeight:800, color:T.txt, margin:0 }}>Novo Lançamento</h1>
          <p style={{ color:T.txtSub, fontSize:13, marginTop:6 }}>Responda as perguntas — os dados vão direto para a planilha.</p>
        </div>

        <div style={{ background:T.card, borderRadius:16, padding:28, border:`1px solid ${T.cardBorda}`, boxShadow:"0 20px 60px rgba(0,0,0,.5)" }}>
          <ProgressBar passo={passo} />
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
            <div style={{ width:3, height:20, background:T.verdeVivo, borderRadius:2 }} />
            <h2 style={{ fontSize:17, fontWeight:700, color:T.txt, margin:0 }}>{PASSOS[passo]}</h2>
          </div>

          {passo===0 && (
            <div>
              <Alerta tipo="info">Informe quem está fazendo a solicitação e do que se trata.</Alerta>
              <Campo label="UC" obrigatorio dica="Digite o número da UC." erro={erros.uc}>
                <Input value={form.uc} onChange={v=>set("uc",v)} placeholder="Ex: 12345" />
              </Campo>
              <Campo label="Colaborador" obrigatorio dica="Nome completo do colaborador responsável." erro={erros.colaborador}>
                <Input value={form.colaborador} onChange={v=>set("colaborador",v)} placeholder="Nome Sobrenome" />
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
                  <Select value={form.incred} onChange={v=>set("incred",v)} options={["Sim","Não"]} />
                </Campo>
              </div>
              <Campo label="Observações" dica="Informações adicionais (opcional).">
                <textarea value={form.observacoes} onChange={e=>set("observacoes",e.target.value)} placeholder="Ex: Cliente solicitou prazo estendido..." style={{ ...inputStyle, resize:"vertical", minHeight:70 }} />
              </Campo>
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
              ? <button onClick={avancar} style={{ flex:2, padding:12, borderRadius:10, background:T.verdeVivo, color:"#000", fontWeight:700, fontSize:14, border:"none", cursor:"pointer" }}>Continuar →</button>
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
