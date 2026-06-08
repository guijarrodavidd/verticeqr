"use client";

export default function QrActions() {
  return (
    <div style={{ display: "flex", gap: "0.5rem" }} className="vqr-no-print">
      <button
        type="button"
        onClick={() => window.print()}
        className="vqr-modal-btn vqr-modal-btn-primary"
      >
        🖨 Imprimir
      </button>
    </div>
  );
}
