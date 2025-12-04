"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { Loader, Trash2Icon } from "lucide-react";

import React, { useState } from "react";
import { toast } from "sonner";
import { DialogFooter } from "./ui/dialog";

const DeleteAbsenceButton = ({ absenceId }: { absenceId: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const handleDelete = async (absenceId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/absence-request/${absenceId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Absence supprimée avec succès", {
          style: {
            background: "#052e16",
            color: "#fff",
          },
          position: "top-right",
          duration: 5000,
        });
      } else {
        toast.error("Erreur lors de la suppression de l'absence", {
          style: {
            background: "#dc2626",
            color: "#fff",
          },
          position: "top-right",
          duration: 5000,
        });
      }
      setIsOpen(false);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message, {
        style: {
          background: "#dc2626",
          color: "#fff",
        },
        position: "top-right",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <button
      // onClick={() => handleDelete(absenceId)}
      disabled={isDisabled}
      className="bg-red-500 disabled:bg-red-300 disabled:cursor-not-allowed disabled:opacity-50 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
    >
      {isLoading ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2Icon className="w-4 h-4" />
      )}
    </button>
  );
};

export default DeleteAbsenceButton;
