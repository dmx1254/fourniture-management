"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiKey,
  FiLock,
  FiX,
} from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import PhoneInput from "react-phone-number-input";
import { E164Number } from "libphonenumber-js/core";
import "react-phone-number-input/style.css";
import { Eye, EyeOff, Loader } from "lucide-react";
import { toast } from "sonner";

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    firstname: "",
    lastname: "",
    occupation: "",
    identicationcode: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState<boolean>(false);
  const [isSendOtpLoading, setIsSendOtpLoading] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState<boolean>(false);

  const validateForm = () => {
    if (formData.firstname.length < 2) {
      setError("Le prénom doit contenir au moins 2 caractères");
      return false;
    }
    if (formData.lastname.length < 2) {
      setError("Le nom doit contenir au moins 2 caractères");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }
    if (formData.phone.length < 13) {
      setError("Le numéro de téléphone doit contenir 13 chiffres");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      // console.log("Response data:", data);

      if (res.ok) {
        setIsVerificationOpen(true);
      } else {
        setError(data.errorMessage);
      }
    } catch (err) {
      console.error("Erreur complète:", err);
      setError("Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    setVerificationError("");
    const data = {
      email: formData.email,
      phone: formData.phone,
      firstname: formData.firstname,
      lastname: formData.lastname,
      occupation: formData.occupation,
      identicationcode: formData.identicationcode,
      password: formData.password,
      code: verificationCode,
    };
    try {
      setIsSendOtpLoading(true);
      const res = await fetch("/api/register/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
        }),
      });

      const response = await res.json();

      if (res.ok) {
        toast.success("Inscription réussie, redirection...", {
          style: {
            background: "#052e16",
            color: "#fff",
          },
          duration: 3000,
          position: "top-right",
        });
        setTimeout(() => {
          router.push("/pmn-signin");
        }, 2000);
      } else {
        setVerificationError(
          response.errorMessage || "Code de vérification incorrect"
        );
      }
    } catch (err) {
      setVerificationError("Une erreur est survenue lors de la vérification");
    } finally {
      setIsSendOtpLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <h2 className="mt-6 text-center text-4xl font-bold text-white/90 tracking-tight">
          Créer un compte
        </h2>
        <p className="mt-3 text-center text-base text-white/80">
          Rejoignez la communauté PMN dès aujourd'hui
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="bg-white py-10 px-6 sm:px-12 rounded-2xl border border-gray-100 shadow-sm">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiX className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="firstname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Prénom
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    required
                    minLength={2}
                    value={formData.firstname}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 text-sm py-2.5 border border-gray-200 rounded-lg bg-gray-50/50 text-gray-900 placeholder-gray-400 transition-colors hover:bg-white focus:bg-white"
                    placeholder="Prénom"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="lastname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nom
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="lastname"
                    id="lastname"
                    required
                    minLength={2}
                    value={formData.lastname}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 text-sm py-2.5 border border-gray-200 rounded-lg bg-gray-50/50 text-gray-900 placeholder-gray-400 transition-colors hover:bg-white focus:bg-white"
                    placeholder="Nom"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 text-sm py-2.5 border border-gray-200 rounded-lg bg-gray-50/50 text-gray-900 placeholder-gray-400 transition-colors hover:bg-white focus:bg-white"
                    placeholder="votre-email@pmn.sn"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Téléphone
                </Label>
                <PhoneInput
                  defaultCountry="SN"
                  placeholder="+221"
                  international
                  withCountryCallingCode
                  value={formData.phone as E164Number | undefined}
                  onChange={(value) =>
                    setFormData({ ...formData, phone: value as string })
                  }
                  className="input-phone px-3 text-sm py-2.5 w-full border border-gray-200 rounded-lg bg-gray-50/50 text-gray-900 placeholder-gray-400 transition-colors hover:bg-white focus:bg-white"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="occupation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Profession
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiBriefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="occupation"
                    id="occupation"
                    required
                    value={formData.occupation}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 text-sm py-2.5 border border-gray-200 rounded-lg bg-gray-50/50 text-gray-900 placeholder-gray-400 transition-colors hover:bg-white focus:bg-white"
                    placeholder="Développeur"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="identicationcode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Code d'identification
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiKey className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="identicationcode"
                    id="identicationcode"
                    required
                    maxLength={9}
                    minLength={9}
                    value={formData.identicationcode}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 text-sm py-2.5 border border-gray-200 rounded-lg bg-gray-50/50 text-gray-900 placeholder-gray-400 transition-colors hover:bg-white focus:bg-white"
                    placeholder="9 caractères"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    name="password"
                    id="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 text-sm py-2.5 border border-gray-200 rounded-lg bg-gray-50/50 text-gray-900 placeholder-gray-400 transition-colors hover:bg-white focus:bg-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-[24%] text-slate-500 hover:text-slate-600"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? (
                      <Eye size={24} />
                    ) : (
                      <EyeOff size={24} />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    required
                    minLength={6}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 text-sm py-2.5 border border-gray-200 rounded-lg bg-gray-50/50 text-gray-900 placeholder-gray-400 transition-colors hover:bg-white focus:bg-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-[24%] text-slate-500 hover:text-slate-600"
                    onClick={() =>
                      setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                    }
                  >
                    {isConfirmPasswordVisible ? (
                      <Eye size={24} />
                    ) : (
                      <EyeOff size={24} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-[#052e16] hover:bg-[#052e16]/90 transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader className="h-5 w-5 text-white animate-spin" />
                    Inscription en cours...
                  </div>
                ) : (
                  "S'inscrire"
                )}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Déjà un compte?{" "}
                  <Link
                    href="/pmn-signin"
                    className="font-medium text-[#052e16] hover:text-[#052e16]/80 transition-colors"
                  >
                    Se connecter
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isVerificationOpen} onOpenChange={setIsVerificationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#052e16]">
              Vérification du code SMS
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Veuillez entrer le code de vérification envoyé à votre numéro de
              téléphone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50/50 text-gray-900 placeholder-gray-400 transition-colors hover:bg-white focus:bg-white"
              placeholder="Code de vérification"
            />
            {verificationError && (
              <p className="mt-2 text-sm text-red-600">{verificationError}</p>
            )}
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={handleVerification}
              className="inline-flex justify-center rounded-lg border border-transparent bg-[#052e16] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#052e16]/90 transition-colors"
            >
              {isSendOtpLoading ? (
                <div className="flex items-center gap-2">
                  <Loader className="h-5 w-5 text-white animate-spin" />
                  Vérification en cours...
                </div>
              ) : (
                "Vérifier"
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
