"use client";

import React from "react";
import { PiTrashThin } from "react-icons/pi";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { deleteUserPro } from "@/lib/actions/action";

const DeleteUserBtn = ({ userId }: { userId: string }) => {
  const initialstate = { message: "" };
  const [state, DeleteAction] = useFormState(deleteUserPro, initialstate);

  // console.log(state);

    state?.message &&
      toast.success(state?.message, {
        style: { color: "red" },
      });

  return (
    <form action={DeleteAction}>
      <button
        type="submit"
        className="flex items-center justify-center p-0.5 rounded border border-red-600 text-red-600"
      >
        <PiTrashThin size={16} />
      </button>
      <input type="hidden" name="userId" value={userId} />
    </form>
  );
};

export default DeleteUserBtn;
