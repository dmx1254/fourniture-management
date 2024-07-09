"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { Loader } from "lucide-react";

const LoginButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="w-full outline-none bg-white/75 text-gray-800 rounded py-2 px-4 text-center transition duration-300 ease-in-out hover:opacity-80"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <Loader size={24} className="text-gray-800 animate-spin" />
          chargement
        </span>
      ) : (
        "Se connecter"
      )}
    </button>
  );
};

export default LoginButton;
