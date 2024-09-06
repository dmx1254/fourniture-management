"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader } from "lucide-react";
import { inscriptionForEntreprise } from "@/lib/actions/action";
import { toast } from "sonner";
import Image from "next/image";
import { regions } from "@/lib/data";
import { Department } from "@/lib/types";

import PhoneInput from "react-phone-number-input";
import { E164Number } from "libphonenumber-js/core";
import "react-phone-number-input/style.css";

const BusinessDashboardRegister = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [departementTab, setDepartementTab] = useState<Department[] | null>(
    null
  );
  const [communeTab, setCommuneTab] = useState<string[] | null>(null);
  const [lastname, setLastname] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [lastnameError, setLastnameError] = useState<string>("");
  const [firstname, setFirstname] = useState<string>("");
  const [firstnameError, setFirstnameError] = useState<string>("");
  const [departement, setDepartement] = useState<string>("");
  const [departementError, setDepartementError] = useState<string>("");
  const [commune, setCommune] = useState<string>("");
  const [communeError, setCommuneError] = useState<string>("");
  const [quartier, setQuartier] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [regionError, setRegionError] = useState<string>("");
  const [corpsdemetiers, setCorpsdemetiers] = useState<string>("");
  const [corpsdemetiersError, setCorpsdemetiersError] = useState<string>("");
  const [entreprise, setEntreprise] = useState<string>("");
  const [entrepriseError, setEntrepriseError] = useState<string>("");
  const [formel, setFormel] = useState<string>("");
  const [formelError, setFormelError] = useState<string>("");
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [businessAutreValue, setBusinessAutreValue] = useState<string>("");
  const [businessAutreValueError, setBusinessAutreValueError] =
    useState<string>("");
  // console.log(siteExpositionChecked);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = {
      lastname,
      firstname,
      phone,
      departement,
      commune,
      quartier,
      region,
      corpsdemetiers,
      entreprise,
      formel,
    };
    if (
      !lastname ||
      !firstname ||
      phone.length !== 13 ||
      !commune ||
      !region ||
      !departement ||
      !corpsdemetiers ||
      !formel ||
      (businessAutreValue === "Autre" && !corpsdemetiers)
    ) {
      if (lastname.length < 3) {
        setLastnameError("Le prénom doit avoir 3 caractères minimum");
      } else {
        setLastnameError("");
      }
      if (firstname.length < 2) {
        setFirstnameError("Le nom doit avoir 2 caractères minimum");
      } else {
        setFirstnameError("");
      }
      if (!region) {
        setRegionError("Veuillez selectionner votre région");
      } else {
        setRegionError("");
      }
      if (phone.length !== 13) {
        setPhoneError("Numéro de téléphone incorrect");
      } else {
        setPhoneError("");
      }
      if (!commune) {
        setCommuneError("Veuillez selectionner votre commune");
      } else {
        setCommuneError("");
      }
      if (!corpsdemetiers && businessAutreValue !== "Autre") {
        setCorpsdemetiersError("Veuillez choisir votre corps de de métier");
      } else {
        setCorpsdemetiersError("");
      }

      if (businessAutreValue === "Autre" && !corpsdemetiers) {
        setBusinessAutreValueError("Veuiller saisir votre corps de de métier");
      } else {
        setBusinessAutreValueError("");
      }

      if (!departement) {
        setDepartementError("Veuillez choisir votre département");
      } else {
        setDepartementError("");
      }
      if (!formel) {
        setFormelError("Veuillez cocher une case avant de continuer");
      } else {
        setFormelError("");
      }
    } else {
      setLastnameError("");
      setFirstnameError("");
      setPhoneError("");
      setRegionError("");
      setCorpsdemetiersError("");
      setEntrepriseError("");
      setDepartementError("");
      setFormelError("");

      setBusinessAutreValueError("");

      try {
        setIsloading(true);
        const response = await inscriptionForEntreprise(user);
        setIsloading(false);
        if (response) {
          toast.success(
            "Merci pour votre inscription ! Nous vous contacterons sous peu.",
            {
              style: { color: "#16a34a" },
            }
          );
          formRef.current?.reset();
        }
      } catch (error) {
        setIsloading(false);
        console.log(error);
        toast.error(
          "Désolé, une erreur s'est produite lors de l'inscription. Veuillez réessayer ou contacter le support.",
          {
            style: { color: "#dc2626" },
          }
        );
      }
    }
    setIsloading(false);
  };

  useEffect(() => {
    const departs = regions.find((r) => r.region === region);
    if (departs) {
      setDepartementTab(departs?.departments);
      setDepartement("");
      setCommune("");
    }
  }, [region]);

  useEffect(() => {
    const comms = departementTab?.find((d) => d.department === departement);
    if (comms) {
      setCommuneTab(comms?.communes);
      setCommune("");
    }
  }, [departement, region]);

  return (
    <div
      className="w-full overflow-hidden mx-auto py-3 max-md:px-4 px-6 bg-white rounded-lg"
      style={{
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      }}
    >
      <div className="w-full flex items-start justify-between mb-6">
        <div className="flex flex-col gap-2 items-start">
          <h1 className="text-2xl font-semibold">Formulaire d'Inscription</h1>
          <p className="flex max-w-[300px] text-sm">
            Le coordonnateur du Projet Mobilier National, M. Ibrahima Tall,
            lance sa campagne de recensement. Cette initiative vise à identifier
            et regrouper les entreprises artisanales en vue de leur offrir un
            accompagnement exhaustif.
          </p>
        </div>
        <Image
          src="/pmn.jpeg"
          alt="logo"
          width={100}
          height={100}
          style={{
            objectFit: "cover",
            objectPosition: "center",
            marginTop: "-16px",
          }}
        />
      </div>
      <form onSubmit={handleSubmit} className="space-y-6" ref={formRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label
              className="block text-base font-medium text-gray-700"
              htmlFor="lastname"
            >
              Prénom
            </Label>
            <Input
              id="lastname"
              type="text"
              value={lastname}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setLastname(e.target.value)
              }
              placeholder="Prénom"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm"
            />
            {lastnameError && (
              <p className="mt-1 text-sm text-red-600">{lastnameError}</p>
            )}
          </div>
          <div>
            <Label
              className="block text-base font-medium text-gray-700"
              htmlFor="firstname"
            >
              Nom
            </Label>
            <Input
              id="firstname"
              type="text"
              value={firstname}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFirstname(e.target.value)
              }
              placeholder="Nom"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm"
            />
            {firstnameError && (
              <p className="mt-1 text-sm text-red-600">{firstnameError}</p>
            )}
          </div>
        </div>
        <div>
          <Label
            className="block text-base font-medium text-gray-700"
            htmlFor="region"
          >
            Région
          </Label>
          <select
            id="region"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm"
            value={region}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setRegion(e.target.value)
            }
          >
            <option value="">Sélectionner votre région</option>
            {regions.map(({ region }) => (
              <option key={region} value={region} className="capitalize">
                {region}
              </option>
            ))}
          </select>
          {regionError && (
            <p className="mt-2 text-sm text-red-600">{regionError}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label
              className="block text-base font-medium"
              htmlFor="departement"
            >
              Département
            </Label>
            <select
              id="region"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm"
              value={departement}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setDepartement(e.target.value)
              }
            >
              <option value="">Sélectionner votre département</option>
              {departementTab?.map(({ department }) => (
                <option
                  key={department}
                  value={department}
                  className="capitalize"
                >
                  {department}
                </option>
              ))}
            </select>
            {departementError && (
              <p className="mt-1 text-sm text-red-600">{departementError}</p>
            )}
          </div>
          <div>
            <Label className="block text-base font-medium" htmlFor="commune">
              Commune
            </Label>
            <select
              id="region"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm"
              value={commune}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setCommune(e.target.value)
              }
            >
              <option value="">Sélectionner votre commune</option>
              {communeTab?.map((commune) => (
                <option key={commune} value={commune} className="capitalize">
                  {commune?.toLowerCase()}
                </option>
              ))}
            </select>
            {communeError && (
              <p className="mt-1 text-sm text-red-600">{communeError}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <Label className="block text-base font-medium" htmlFor="village">
              Village/Quartier
            </Label>
            <Input
              id="village"
              type="text"
              value={quartier}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setQuartier(e.target.value)
              }
              placeholder="Village/Quartier"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <Label className="block text-base font-medium">
            Corps de métiers
          </Label>
          <div className="mt-2 space-y-2">
            {[
              "Filière bois",
              "Filière textile",
              "Filière peaux et cuirs",
              "Filière métallique",
              "Filière mécanique",
              "Autre",
            ].map((option) => (
              <div key={option} className="flex items-center">
                <Input
                  id={option}
                  type="checkbox"
                  value={corpsdemetiers}
                  checked={
                    option === corpsdemetiers || option === businessAutreValue
                  }
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setBusinessAutreValue(e.target.id);
                    setCorpsdemetiers(
                      e.target.id === "Autre" ? "" : e.target.id
                    );
                  }}
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <Label
                  htmlFor={option}
                  className="ml-3 block text-base text-gray-600"
                >
                  {option === "Autre" ? "Autres" : option}&nbsp;
                  {option === "Filière bois" && "( Menuisier bois)"}
                  {option === "Filière textile" && "( Tailleur )"}
                  {option === "Filière peaux et cuirs" && "( Cordonnier )"}
                  {option === "Filière métallique" &&
                    "( Menuisier Métallique )"}
                  {option === "Filière mécanique" && "( Mécanicien )"}
                </Label>
              </div>
            ))}
          </div>
          {corpsdemetiersError && (
            <p className="mt-1 text-sm text-red-600">{corpsdemetiersError}</p>
          )}
          {businessAutreValue === "Autre" ? (
            <div className="flex flex-col items-start gap-2 mt-4">
              <Label htmlFor="corps-de-metiers" className="block text-base">
                Corps de métiers
              </Label>
              <Input
                id="corps-de-metiers"
                type="text"
                placeholder="Corps de métiers"
                value={corpsdemetiers}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setCorpsdemetiers(e.target.value)
                }
                className="w-full text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              {businessAutreValueError && (
                <p className="mt-1 text-sm text-red-600">
                  {businessAutreValueError}
                </p>
              )}
            </div>
          ) : null}
        </div>
        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col items-start gap-2">
            <Label htmlFor="entreprise" className="block text-base">
              Entreprise
            </Label>
            <Input
              id="entreprise"
              type="text"
              placeholder="Nom de votre Entreprise"
              value={entreprise}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEntreprise(e.target.value)
              }
              className="w-full text-primary-600 border-gray-300 focus:ring-primary-500"
            />
            {entrepriseError && (
              <p className="mt-1 text-sm text-red-600">{entrepriseError}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-base font-medium">
            Avez vous un NINEA
          </label>
          <div className="mt-2 space-y-2">
            {["Oui ", "Non "].map((option) => (
              <div key={option} className="flex items-center">
                <input
                  id={option}
                  type="checkbox"
                  value={formel}
                  checked={formel === option}
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFormel(e.target.id)
                  }
                />
                <label
                  htmlFor={option}
                  className="ml-3 block text-base text-gray-600"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
          {formelError && (
            <p className="mt-1 text-sm text-red-600">{formelError}</p>
          )}
        </div>
        <div className="relative flex flex-col items-start gap-2">
          <Label htmlFor="phone" className="block text-base">
            Téléphone
          </Label>
          <PhoneInput
            defaultCountry="SN"
            placeholder="+221"
            international
            withCountryCallingCode
            value={phone as E164Number | undefined}
            onChange={setPhone}
            className="input-phone px-3 py-2 w-full border outline-none bg-white border-gray-300 rounded"
          />
          {phoneError && <p className="text-sm text-red-600">{phoneError}</p>}
        </div>

        <button
          type="submit"
          className="flex items-center justify-center mx-auto gap-2 text-center p-2 rounded rouded w-full bg-gray-800 text-white transition duration-100 ease-in-out hover:opacity-90"
        >
          {isLoading ? <Loader size={22} className="animate-spin" /> : ""}

          {isLoading ? "Inscription..." : "S'inscrire"}
        </button>
      </form>
    </div>
  );
};

export default BusinessDashboardRegister;
