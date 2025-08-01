"use client";

import React, { useActionState, useEffect } from "react";
import { PiTrashThin } from "react-icons/pi";
import { toast } from "sonner";
import { deleteFormationPro } from "@/lib/actions/action";

const DeleteFormationBtn = ({ formationId }: { formationId: string }) => {
  const initialstate = { errors: {}, message: "" };
  const [state, DeleteAction, isPending] = useActionState(deleteFormationPro, initialstate);

  // console.log(state);

  useEffect(() => {
    if (state?.message) {
      toast.success(state?.message, {
        style: { color: "green" },
      });

      // Réinitialiser le message après l'affichage de la toast
      state.message = "";
    }
  }, [state?.message, DeleteAction]);

  return (
    <form action={DeleteAction}>
      <button
        type="submit"
        className="flex items-center justify-center p-0.5 rounded border border-red-600 text-red-600"
      >
        <PiTrashThin size={16} />
      </button>
      <input type="hidden" name="formationId" value={formationId} />
    </form>
  );
};

export default DeleteFormationBtn;
