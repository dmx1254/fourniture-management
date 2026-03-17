"use client";

import React, { useState } from "react";
import { PiTrashThin } from "react-icons/pi";
import { toast } from "sonner";
import { Loader } from "lucide-react";

const DeleteUserBtn = ({ userId }: { userId: string }) => {
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    if (!userId) return;
    try {
      setIsPending(true);
      const res = await fetch(`/api/user/${userId}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(data?.error || "Erreur lors de la suppression");
        return;
      }
      toast.success(data?.message || "Utilisateur supprimé avec succès", {
        style: { color: "green" },
      });
    } catch (e) {
      toast.error("Erreur réseau lors de la suppression");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="flex items-center justify-center p-0.5 rounded border border-red-600 text-red-600 disabled:opacity-50"
      title="Supprimer l'utilisateur"
    >
      {isPending ? (
        <Loader size={16} className="animate-spin text-red-600" />
      ) : (
        <PiTrashThin size={16} />
      )}
    </button>
  );
};

export default DeleteUserBtn;
