"use client";

import { useEffect } from "react";
import { BORRADOR } from "../preguntas";

// Con la auditoría ya enviada, el borrador de este dispositivo sobra.
export function BorrarBorrador() {
  useEffect(() => {
    try {
      localStorage.removeItem(BORRADOR);
    } catch {}
  }, []);
  return null;
}
