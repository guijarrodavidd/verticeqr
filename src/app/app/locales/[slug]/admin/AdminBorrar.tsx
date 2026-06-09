"use client";

import { useState, useTransition } from "react";

type ServerAction = (formData: FormData) => Promise<void>;

export default function AdminBorrar({
  localId,
  borrarAction,
}: {
  localId: number;
  borrarAction: ServerAction;
}) {
  const [confirm, setConfirm] = useState(false);
  const [pending, startTransition] = useTransition();

  async function handleDelete() {
    const fd = new FormData();
    fd.append("id", String(localId));
    startTransition(async () => {
      await borrarAction(fd);
    });
  }

  if (!confirm) {
    return (
      <button
        type="button"
        className="vqr-modal-btn vqr-modal-btn-danger"
        onClick={() => setConfirm(true)}
        disabled={pending}
      >
        Borrar local
      </button>
    );
  }

  return (
    <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
      <button
        type="button"
        className="vqr-modal-btn vqr-modal-btn-ghost"
        onClick={() => setConfirm(false)}
        disabled={pending}
      >
        Cancelar
      </button>
      <button
        type="button"
        className="vqr-modal-btn vqr-modal-btn-danger-confirm"
        onClick={handleDelete}
        disabled={pending}
      >
        {pending ? "Borrando…" : "¿Seguro? Borrar"}
      </button>
    </div>
  );
}
