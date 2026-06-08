"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { centsToEuros } from "@/lib/productos-shared";

export type MenuItem = { id: number; name: string; cents: number };
export type MenuCat = { cat: string; items: MenuItem[] };

type Line = {
  name: string;
  cents: number;
  qty: number;
  note: string;
  src: "qr" | "cam";
  sent: boolean;
  ts: number;
};
type Table = { opened: number | null; lines: Line[] };
type Store = { count: number; tables: Record<string, Table> };

const fmt = (cents: number) => centsToEuros(cents) + " €";

function emptyStore(): Store {
  return { count: 16, tables: {} };
}

export default function Tpv({
  localSlug,
  localNombre,
  accent,
  menu,
}: {
  localSlug: string;
  localNombre: string;
  accent: string;
  menu: MenuCat[];
}) {
  const KEY = `vqr_tpv_${localSlug}`;
  const ORDERS_KEY = `vqr_orders_${localSlug}`;

  const [store, setStore] = useState<Store>(emptyStore);
  const [mounted, setMounted] = useState(false);
  const [activeMesa, setActiveMesa] = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [, force] = useState(0); // re-render para los tiempos
  const [toast, setToast] = useState("");
  const toastT = useRef<ReturnType<typeof setTimeout> | null>(null);

  // pago
  const [payOpen, setPayOpen] = useState(false);
  const [method, setMethod] = useState<"efectivo" | "tarjeta" | null>(null);
  const [cashDigits, setCashDigits] = useState("");
  const [printChk, setPrintChk] = useState(true);

  // cargar/guardar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setStore({ ...emptyStore(), ...JSON.parse(raw) });
    } catch {}
    setMounted(true);
  }, [KEY]);
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(KEY, JSON.stringify(store));
      } catch {}
    }
  }, [store, mounted, KEY]);
  // refrescar tiempos cada 20s
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 20000);
    return () => clearInterval(id);
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    if (toastT.current) clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setToast(""), 1700);
  }

  const tables = store.tables;
  const getT = (m: string): Table => tables[m] || { opened: null, lines: [] };
  const isOcc = (m: string) => (tables[m]?.lines.length ?? 0) > 0;
  const mesaSub = (m: string) => getT(m).lines.reduce((a, l) => a + l.cents * l.qty, 0);
  const mesaUnits = (m: string) => getT(m).lines.reduce((a, l) => a + l.qty, 0);

  function mutate(fn: (s: Store) => void) {
    setStore((prev) => {
      const next: Store = JSON.parse(JSON.stringify(prev));
      fn(next);
      return next;
    });
  }
  function ensure(s: Store, m: string): Table {
    if (!s.tables[m]) s.tables[m] = { opened: null, lines: [] };
    return s.tables[m];
  }

  // ---- acciones de mesa ----
  function openMesa(m: string) {
    setActiveMesa(m);
    setActiveCat("ALL");
    setSearch("");
  }
  function closeMesa() {
    // limpia mesa abierta sin consumo
    if (activeMesa && tables[activeMesa] && tables[activeMesa].lines.length === 0) {
      mutate((s) => {
        delete s.tables[activeMesa];
      });
    }
    setActiveMesa(null);
    setPayOpen(false);
  }
  function addProduct(it: MenuItem) {
    const m = activeMesa!;
    mutate((s) => {
      const t = ensure(s, m);
      if (!t.opened) t.opened = Date.now();
      const ex = t.lines.find((l) => l.src === "cam" && !l.sent && l.name === it.name && !l.note);
      if (ex) ex.qty++;
      else
        t.lines.push({
          name: it.name,
          cents: it.cents,
          qty: 1,
          note: "",
          src: "cam",
          sent: false,
          ts: Date.now(),
        });
    });
    showToast(it.name + " añadido");
  }
  function chQty(i: number, d: number) {
    const m = activeMesa!;
    mutate((s) => {
      const t = ensure(s, m);
      const l = t.lines[i];
      if (!l) return;
      l.qty += d;
      if (l.qty <= 0) t.lines.splice(i, 1);
    });
  }
  function delLine(i: number) {
    const m = activeMesa!;
    mutate((s) => {
      ensure(s, m).lines.splice(i, 1);
    });
  }
  function sendKitchen() {
    const m = activeMesa!;
    const t = getT(m);
    const nuevos = t.lines.filter((l) => l.src === "cam" && !l.sent);
    if (!nuevos.length) return;
    const order = {
      id: "o" + Date.now() + Math.random().toString(36).slice(2, 6),
      no: Math.floor(100 + Math.random() * 899),
      mesa: m,
      ts: Date.now(),
      status: "new",
      origin: "tpv",
      items: nuevos.map((l) => ({ name: l.name, qty: l.qty, note: l.note, cents: l.cents })),
      total: nuevos.reduce((a, l) => a + l.cents * l.qty, 0),
    };
    try {
      const arr = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
      arr.push(order);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(arr));
    } catch {}
    mutate((s) => {
      ensure(s, m).lines.forEach((l) => {
        if (l.src === "cam" && !l.sent) l.sent = true;
      });
    });
    showToast("Comanda enviada a cocina 🔥");
  }

  // ---- cobro ----
  function askPay() {
    if (!isOcc(activeMesa!)) return;
    setMethod(null);
    setCashDigits("");
    setPayOpen(true);
  }
  const cashCents = parseInt(cashDigits || "0", 10);
  function keyCash(k: string) {
    if (k === "C") setCashDigits("");
    else if (k === "⌫") setCashDigits((d) => d.slice(0, -1));
    else setCashDigits((d) => (d.length < 7 ? (d + k).replace(/^0+/, "") : d));
  }
  function doPay() {
    const m = activeMesa!;
    if (!method) {
      showToast("Elige efectivo o tarjeta");
      return;
    }
    const tot = mesaSub(m);
    const given = method === "efectivo" ? cashCents : tot;
    const change = method === "efectivo" ? Math.max(0, given - tot) : 0;
    const sale = {
      mesa: m,
      ts: Date.now(),
      totalCents: tot,
      units: mesaUnits(m),
      method,
      paidCents: given,
      changeCents: change,
      items: getT(m).lines.map((l) => ({ name: l.name, qty: l.qty, cents: l.cents })),
    };
    try {
      const arr = JSON.parse(localStorage.getItem(`vqr_sales_${localSlug}`) || "[]");
      arr.push(sale);
      localStorage.setItem(`vqr_sales_${localSlug}`, JSON.stringify(arr));
    } catch {}
    if (printChk) printTicket(sale);
    mutate((s) => {
      delete s.tables[m];
    });
    setPayOpen(false);
    setActiveMesa(null);
    showToast(
      "Mesa cobrada · " +
        fmt(tot) +
        (method === "efectivo" && change > 0 ? " · cambio " + fmt(change) : "")
    );
  }
  function printTicket(sale: {
    mesa: string;
    ts: number;
    totalCents: number;
    units: number;
    method: string;
    paidCents: number;
    changeCents: number;
    items: { name: string; qty: number; cents: number }[];
  }) {
    const d = new Date(sale.ts);
    const fecha =
      d.toLocaleDateString("es-ES") +
      " " +
      d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    const mesaTxt = sale.mesa === "Barra" ? "Barra" : "Mesa " + sale.mesa;
    const rows = sale.items
      .map(
        (it) =>
          `<tr><td class="q">${it.qty}</td><td class="n">${it.name}</td><td class="p">${fmt(
            it.cents * it.qty
          )}</td></tr>`
      )
      .join("");
    const cashBlock =
      sale.method === "efectivo"
        ? `<div class="ln"><span>Entregado</span><span>${fmt(
            sale.paidCents
          )}</span></div><div class="ln"><span>Cambio</span><span>${fmt(
            sale.changeCents
          )}</span></div>`
        : "";
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Ticket ${mesaTxt}</title>
    <style>@page{size:80mm auto;margin:0}*{margin:0;padding:0;box-sizing:border-box}
    body{width:80mm;padding:6mm 5mm;font-family:ui-monospace,monospace;color:#000;font-size:12px;line-height:1.45}
    .c{text-align:center}.name{font-size:20px;font-weight:800;letter-spacing:1px}
    .tag{font-size:10px;letter-spacing:2px;text-transform:uppercase;margin-top:2px;color:${accent}}
    .hr{border-top:1px dashed #000;margin:8px 0}.meta{font-size:11px;display:flex;justify-content:space-between}
    table{width:100%;border-collapse:collapse;margin:6px 0}td{vertical-align:top;padding:2px 0;font-size:12px}
    td.q{width:26px}td.p{text-align:right;white-space:nowrap;padding-left:6px}
    .ln{display:flex;justify-content:space-between;font-size:12px;margin:2px 0}
    .tot{display:flex;justify-content:space-between;font-size:16px;font-weight:800;margin:6px 0}
    .met{text-align:center;border:1.5px solid #000;border-radius:6px;padding:5px;margin:8px 0;font-weight:700;letter-spacing:1px}
    .foot{text-align:center;font-size:10px;margin-top:10px;letter-spacing:.5px}</style></head><body>
    <div class="c"><div class="name">${localNombre.toUpperCase()}</div><div class="tag">VerticeQR</div></div>
    <div class="hr"></div>
    <div class="meta"><span>${mesaTxt}</span><span>${fecha}</span></div>
    <div class="meta"><span>${sale.units} uds</span><span>#${String(sale.ts).slice(-5)}</span></div>
    <div class="hr"></div><table>${rows}</table><div class="hr"></div>
    <div class="tot"><span>TOTAL</span><span>${fmt(sale.totalCents)}</span></div>
    <div class="met">${sale.method.toUpperCase()}</div>${cashBlock}
    <div class="hr"></div><div class="foot">IVA incluido · Gracias por su visita</div>
    </body></html>`;
    const w = window.open("", "_ticket", "width=380,height=640");
    if (!w) {
      showToast("Permite ventanas emergentes para imprimir");
      return;
    }
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 350);
  }

  // ---- helpers de presentación ----
  function sinceTxt(ts: number | null) {
    if (!ts) return "";
    const m = Math.max(0, Math.round((Date.now() - ts) / 60000));
    if (m < 1) return "ahora";
    if (m < 60) return m + " min";
    return Math.floor(m / 60) + "h " + (m % 60) + "m";
  }
  function ageClass(ts: number | null) {
    if (!ts) return "";
    const m = (Date.now() - ts) / 60000;
    if (m >= 45) return "age-old";
    if (m >= 20) return "age-mid";
    return "";
  }

  const salon = useMemo(() => {
    const arr: string[] = [];
    for (let i = 1; i <= store.count; i++) arr.push(String(i));
    Object.keys(tables).forEach((m) => {
      if (isOcc(m) && m !== "Barra" && !arr.includes(m)) arr.push(m);
    });
    arr.sort((a, b) => (parseInt(a) || 999) - (parseInt(b) || 999));
    return arr;
  }, [store.count, tables]);

  const occCount = [...salon, "Barra"].filter(isOcc).length;
  const salaTotal = [...salon, "Barra"].reduce((a, m) => a + (isOcc(m) ? mesaSub(m) : 0), 0);

  // ---- menú filtrado ----
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return menu
      .map((cat) => {
        if (q) return { cat: cat.cat, items: cat.items.filter((it) => it.name.toLowerCase().includes(q)) };
        if (activeCat !== "ALL" && activeCat !== cat.cat) return { cat: cat.cat, items: [] };
        return cat;
      })
      .filter((g) => g.items.length > 0);
  }, [menu, search, activeCat]);

  const accStyle = { ["--acc" as string]: accent } as React.CSSProperties;

  function MesaCard({ m, barra }: { m: string; barra?: boolean }) {
    const occ = isOcc(m);
    const pend = getT(m).lines.filter((l) => l.src === "cam" && !l.sent).length;
    const label = barra ? "Barra" : m;
    if (!occ) {
      return (
        <button className={`vqr-tpv-mesa free ${barra ? "barra" : ""}`} onClick={() => openMesa(m)}>
          <span className="accent" />
          <span className="top">
            <span className="no">{label}</span>
            <span className="dot free" />
          </span>
          <span className="free-hint">
            <span className="pluss">+</span>Libre
          </span>
        </button>
      );
    }
    return (
      <button
        className={`vqr-tpv-mesa occ ${ageClass(getT(m).opened)} ${barra ? "barra" : ""}`}
        onClick={() => openMesa(m)}
      >
        <span className="accent" />
        <span className="top">
          <span className="no">{label}</span>
          <span className="dot occ" />
        </span>
        <span className="total">{fmt(mesaSub(m))}</span>
        <span className="meta">
          <span className="chip uds">🍽 {mesaUnits(m)}</span>
          <span className="chip time">⏱ {sinceTxt(getT(m).opened)}</span>
        </span>
        {pend > 0 && <span className="kflag">● {pend} sin enviar</span>}
      </button>
    );
  }

  const t = activeMesa ? getT(activeMesa) : null;
  const pendUnits = t ? t.lines.filter((l) => l.src === "cam" && !l.sent).reduce((a, l) => a + l.qty, 0) : 0;
  const drawerTot = activeMesa ? mesaSub(activeMesa) : 0;
  const changeCents = cashCents - drawerTot;

  return (
    <div className="vqr-tpv" style={accStyle}>
      {/* barra de estado */}
      <div className="vqr-tpv-bar">
        <div className="stats">
          <div className="stat">
            <span className="v">{occCount}</span>
            <span className="l">Mesas activas</span>
          </div>
          <div className="stat">
            <span className="v">{fmt(salaTotal)}</span>
            <span className="l">En sala</span>
          </div>
        </div>
        <label className="cfg">
          Mesas
          <input
            type="number"
            min={1}
            max={60}
            value={store.count}
            onChange={(e) => {
              const v = Math.max(1, Math.min(60, parseInt(e.target.value) || 16));
              mutate((s) => {
                s.count = v;
              });
            }}
          />
        </label>
      </div>

      {/* plano */}
      {mounted && (
        <>
          <div className="vqr-tpv-zone">
            Salón <span className="cnt">{salon.filter(isOcc).length}/{salon.length}</span>
          </div>
          <div className="vqr-tpv-grid">
            {salon.map((m) => (
              <MesaCard key={m} m={m} />
            ))}
          </div>
          <div className="vqr-tpv-zone">Barra</div>
          <div className="vqr-tpv-grid">
            <MesaCard m="Barra" barra />
          </div>
        </>
      )}

      {/* drawer */}
      {activeMesa && t && (
        <>
          <div className="vqr-tpv-scrim" onClick={closeMesa} />
          <div className="vqr-tpv-drawer">
            <div className="dr-head">
              <div>
                <div className="num">{activeMesa === "Barra" ? "Barra" : "Mesa " + activeMesa}</div>
                <div className="sub">{t.opened ? "Abierta " + sinceTxt(t.opened) : "Mesa nueva"}</div>
              </div>
              <button className="dr-close" onClick={closeMesa}>
                ✕
              </button>
            </div>
            <div className="dr-body">
              {/* ticket */}
              <div className="ticket-col">
                <div className="tk-h">
                  <b>Ticket</b>
                  <span>{t.lines.length ? mesaUnits(activeMesa) + " uds" : ""}</span>
                </div>
                <div className="tk-lines">
                  {!t.lines.length ? (
                    <div className="tk-empty">
                      Mesa sin consumos.
                      <br />
                      Añade productos a la derecha →
                    </div>
                  ) : (
                    t.lines.map((l, i) => (
                      <div className="ln" key={i}>
                        <span className="q">{l.qty}×</span>
                        <div className="info">
                          <div className="nm">{l.name}</div>
                          <div className="tags">
                            <span className={`tag ${l.src}`}>{l.src === "qr" ? "QR cliente" : "Camarero"}</span>
                            {l.src === "cam" && (
                              <span className={`tag ${l.sent ? "sent" : "pend"}`}>
                                {l.sent ? "en cocina" : "sin enviar"}
                              </span>
                            )}
                          </div>
                          {l.note && <div className="note">⚠ {l.note}</div>}
                          <div className="ed">
                            <button onClick={() => chQty(i, -1)}>−</button>
                            <button onClick={() => chQty(i, 1)}>+</button>
                            <button className="del" onClick={() => delLine(i)}>
                              🗑
                            </button>
                          </div>
                        </div>
                        <span className="pr">{fmt(l.cents * l.qty)}</span>
                      </div>
                    ))
                  )}
                </div>
                <div className="tk-foot">
                  <div className="tk-row tot">
                    <span className="l">Total</span>
                    <span className="v">{fmt(drawerTot)}</span>
                  </div>
                  <div className="tk-actions">
                    <button className="btn kitchen" disabled={pendUnits === 0} onClick={sendKitchen}>
                      A cocina <span className="pill">{pendUnits}</span>
                    </button>
                    <button className="btn pay" disabled={t.lines.length === 0} onClick={askPay}>
                      Cobrar
                    </button>
                  </div>
                </div>
              </div>

              {/* menú */}
              <div className="menu-col">
                <div className="mc-h">
                  <b>Añadir productos (sin QR)</b>
                  <input
                    className="search"
                    placeholder="Buscar plato o bebida…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="cats">
                  <button className={activeCat === "ALL" ? "active" : ""} onClick={() => setActiveCat("ALL")}>
                    Todo
                  </button>
                  {menu.map((c) => (
                    <button
                      key={c.cat}
                      className={activeCat === c.cat ? "active" : ""}
                      onClick={() => {
                        setActiveCat(c.cat);
                        setSearch("");
                      }}
                    >
                      {c.cat}
                    </button>
                  ))}
                </div>
                <div className="items">
                  {filtered.length === 0 ? (
                    <div className="tk-empty">Sin resultados</div>
                  ) : (
                    filtered.map((c) => (
                      <div className="cat-block" key={c.cat}>
                        <div className="cat-ttl">{c.cat}</div>
                        <div className="prods">
                          {c.items.map((it) => (
                            <button className="prod" key={it.id} onClick={() => addProduct(it)}>
                              <span className="pn">{it.name}</span>
                              <span className="pf">
                                <span className="pp">{fmt(it.cents)}</span>
                                <span className="plus">+</span>
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* modal cobro */}
      {payOpen && activeMesa && (
        <div className="vqr-tpv-modal" onClick={(e) => e.target === e.currentTarget && setPayOpen(false)}>
          <div className="mbox">
            <h3>Cobrar</h3>
            <div className="pay-mesa">
              {(activeMesa === "Barra" ? "Barra" : "Mesa " + activeMesa) + " · " + mesaUnits(activeMesa) + " uds"}
            </div>
            <div className="pay-total-card">
              <span className="pl">Total a cobrar</span>
              <span className="pay-total">{fmt(drawerTot)}</span>
            </div>
            <div className="pay-method">
              <button className={`pm ${method === "efectivo" ? "active" : ""}`} onClick={() => { setMethod("efectivo"); setCashDigits(""); }}>
                <span className="pmi">💶</span>Efectivo
              </button>
              <button className={`pm ${method === "tarjeta" ? "active" : ""}`} onClick={() => setMethod("tarjeta")}>
                <span className="pmi">💳</span>Tarjeta
              </button>
            </div>
            {method === "efectivo" && (
              <div className="cash-pane">
                <div className="cash-grid">
                  <div className="cash-field">
                    <span className="cl">Paga con</span>
                    <div className="cash-amount">{fmt(cashCents)}</div>
                  </div>
                  <div className={`cash-field change ${cashCents > 0 && changeCents < 0 ? "neg" : ""}`}>
                    <span className="cl">Cambio</span>
                    <div className="change-amount">{fmt(Math.max(0, changeCents))}</div>
                  </div>
                </div>
                <div className="quick-bills">
                  {(() => {
                    const tot = drawerTot;
                    const opts: { lbl: string; val: number; exact?: boolean }[] = [
                      { lbl: "Exacto", val: tot, exact: true },
                    ];
                    [500, 1000, 2000, 5000].forEach((b) => {
                      if (b >= tot && !opts.find((o) => o.val === b)) opts.push({ lbl: b / 100 + " €", val: b });
                    });
                    return opts.slice(0, 4).map((o) => (
                      <button
                        key={o.lbl}
                        className={o.exact ? "exact" : ""}
                        onClick={() => setCashDigits(String(o.val))}
                      >
                        {o.lbl}
                      </button>
                    ));
                  })()}
                </div>
                <div className="keypad">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"].map((k) => (
                    <button key={k} className={k === "C" || k === "⌫" ? "act" : ""} onClick={() => keyCash(k)}>
                      {k}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <label className="print-toggle">
              <input type="checkbox" checked={printChk} onChange={(e) => setPrintChk(e.target.checked)} />
              <span>Imprimir ticket al cobrar</span>
            </label>
            <div className="mbtns">
              <button className="cancel" onClick={() => setPayOpen(false)}>
                Cancelar
              </button>
              <button
                className="ok"
                disabled={!method || (method === "efectivo" && cashCents < drawerTot)}
                onClick={doPay}
              >
                Cobrar y cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="vqr-tpv-toast">{toast}</div>}
    </div>
  );
}
