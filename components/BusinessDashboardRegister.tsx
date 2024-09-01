"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader, Phone, Mail } from "lucide-react";
import { inscriptionForEntreprise } from "@/lib/actions/action";
import { toast } from "sonner";
import Image from "next/image";

const BusinessDashboardRegister = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [lastname, setLastname] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [lastnameError, setLastnameError] = useState<string>("");
  const [firstname, setFirstname] = useState<string>("");
  const [firstnameError, setFirstnameError] = useState<string>("");
  const [departement, setDepartement] = useState<string>("");
  const [departementError, setDepartementError] = useState<string>("");
  const [commune, setCommune] = useState<string>("");
  const [village, setVillage] = useState<string>("");
  const [quartier, setQuartier] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [regionError, setRegionError] = useState<string>("");
  const [corpsdemetiers, setCorpsdemetiers] = useState<string>("");
  const [corpsdemetiersError, setCorpsdemetiersError] = useState<string>("");
  const [statusEntreprise, setStatusEntreprise] = useState<string>("");
  const [statusEntrepriseError, setStatusEntrepriseError] =
    useState<string>("");
  const [entreprise, setEntreprise] = useState<string>("");
  const [entrepriseError, setEntrepriseError] = useState<string>("");
  const [formel, setFormel] = useState<string>("");
  const [formelError, setFormelError] = useState<string>("");
  const [formation, setFormation] = useState<string>("");
  const [formationError, setFormationError] = useState<string>("");
  const [besoinFormation, setBesoinFormation] = useState<string>("");
  const [besoinFormationError, setBesoinFormationError] = useState<string>("");
  const [financementEtat, setFinancementEtat] = useState<string>("");
  const [financementEtatError, setFinancementEtatError] = useState<string>("");
  const [accesZonesExpositions, setAccesZonesExpositions] =
    useState<string>("");
  const [accesZonesExpositionsError, setAccesZonesExpositionsError] =
    useState<string>("");
  const [siteExposition, setSiteExposition] = useState<string>("");
  const [laquelle, setLaquelle] = useState<string>("");
  const [siteExpositionError, setSiteExpositionError] = useState<string>("");
  const [siteExpositionChecked, setSiteExpositionChecked] =
    useState<boolean>(false);
  const [siteExpositionCheckedError, setSiteExpositionCheckedError] =
    useState<string>("");
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [businessAutreBool, setBusinessAutreBool] = useState<boolean>(false);
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
      email,
      departement,
      commune,
      village,
      quartier,
      region,
      corpsdemetiers,
      statusEntreprise,
      entreprise,
      formel,
      formation,
      besoinFormation,
      financementEtat,
      accesZonesExpositions,
      siteExposition,
    };
    if (
      !lastname ||
      !firstname ||
      !phone ||
      !region ||
      !corpsdemetiers ||
      !statusEntreprise ||
      !entreprise ||
      !formel ||
      !formation ||
      !financementEtat ||
      !accesZonesExpositions ||
      (accesZonesExpositions.trim() === "Oui" && !siteExposition) ||
      (businessAutreValue === "Autre" && !corpsdemetiers) ||
      (accesZonesExpositions.trim() === "Oui" && siteExposition === "Autres")
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
      if (!phone) {
        setPhoneError("Veuillez saisir un numéro de téléphone");
      } else {
        setPhoneError("");
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
      if (!entreprise) {
        setEntrepriseError("Veuillez saisir votre entreprise");
      } else {
        setEntrepriseError("");
      }
      if (!formel) {
        setFormelError("Veuillez cocher une case avant de continuer");
      } else {
        setFormelError("");
      }
      if (!formation) {
        setFormationError("Veuillez cocher une case avant de continuer");
      } else {
        setFormationError("");
        if (formation.trim() === "Non" && !besoinFormation) {
          setBesoinFormationError(
            "Veuillez cocher une case avant de continuer"
          );
        } else {
          setBesoinFormationError("");
        }
      }
      if (!financementEtat) {
        setFinancementEtatError("Veuillez cocher une case avant de continuer");
      } else {
        setFinancementEtatError("");
      }
      if (!accesZonesExpositions) {
        setAccesZonesExpositionsError(
          "Veuillez cocher une case avant de continuer"
        );
      } else {
        setAccesZonesExpositionsError("");
      }

      if (accesZonesExpositions.trim() === "Oui" && !siteExposition) {
        setSiteExpositionCheckedError(
          "Veuillez cocher une case avant de continuer"
        );
      } else {
        setSiteExpositionCheckedError("");
      }

      if (
        accesZonesExpositions.trim() === "Oui" &&
        siteExposition === "Autres"
      ) {
        setSiteExpositionError("Veuillez saisir le nom du site");
      } else {
        setSiteExpositionError("");
      }

      if (!statusEntreprise) {
        setStatusEntrepriseError(
          "Veuillez saisir le status de votre entreprise"
        );
      } else {
        setStatusEntrepriseError("");
      }

      if (siteExpositionChecked && !besoinFormation) {
        setBesoinFormationError("Veuillez cocher une case avant de continuer");
      }
    } else {
      setLastnameError("");
      setFirstnameError("");
      setPhoneError("");
      setRegionError("");
      setCorpsdemetiersError("");
      setSiteExpositionError("");
      setBesoinFormationError("");
      setEntrepriseError("");
      setStatusEntrepriseError("");
      setDepartementError("");
      setFormelError("");
      setFormationError("");
      setFinancementEtatError("");
      setAccesZonesExpositionsError("");
      setSiteExpositionCheckedError("");
      setSiteExpositionError("");
      setBusinessAutreValueError("");

      // console.log(user);

      try {
        setIsloading(true);
        const response = await inscriptionForEntreprise(user);
        setIsloading(false);
        if (response) {
          toast.success("Inscription effectuée avec succès.", {
            style: { color: "#16a34a" },
          });
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

  return (
    <div
      className="w-full overflow-hidden max-w-6xl mx-auto py-3 max-md:px-4 px-6 bg-white rounded-lg"
      style={{
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      }}
    >
      <div className="w-full flex items-start justify-between mb-6">
        <div className="flex flex-col gap-2 items-start">
          <h1 className="text-2xl font-bold">Formulaire d'Inscription</h1>
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
            <option value="">Sélectionner une région</option>
            <option value="Dakar">Dakar</option>
            <option value="Diourbel">Diourbel</option>
            <option value="Fatick">Fatick</option>
            <option value="Kaolack">Kaolack</option>
            <option value="Kolda">Kolda</option>
            <option value="Louga">Louga</option>
            <option value="Matam">Matam</option>
            <option value="St Louis">St Louis</option>
            <option value="Tambacounda">Tambacounda</option>
            <option value="Thiès">Thiès</option>
            <option value="Ziguinchor">Ziguinchor</option>
            <option value="Kaffrine">Kaffrine</option>
            <option value="Kédougou">Kédougou</option>
            <option value="Sédhiou">Sédhiou</option>
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
            <Input
              id="departement"
              type="text"
              value={departement}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDepartement(e.target.value)
              }
              placeholder="Département"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm"
            />
            {departementError && (
              <p className="mt-1 text-sm text-red-600">{departementError}</p>
            )}
          </div>
          <div>
            <Label className="block text-base font-medium" htmlFor="commune">
              Commune
            </Label>
            <Input
              id="commune"
              type="text"
              value={commune}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCommune(e.target.value)
              }
              placeholder="Commune"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="block text-base font-medium" htmlFor="village">
              Village
            </Label>
            <Input
              id="village"
              type="text"
              value={village}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setVillage(e.target.value)
              }
              placeholder="Village"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <Label className="block text-base font-medium" htmlFor="quartier">
              Quartier
            </Label>
            <Input
              id="quartier"
              type="text"
              value={quartier}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setQuartier(e.target.value)
              }
              placeholder="Quartier"
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
                  {option === "Autre" ? "Autres" : option}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-start gap-2">
            <Label htmlFor="entreprise" className="block text-base">
              Entreprise
            </Label>
            <Input
              id="entreprise"
              type="text"
              placeholder="Entreprise"
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
          <div className="flex flex-col items-start gap-2">
            <Label htmlFor="statusEntreprise" className="block text-base">
              Status de l'entreprise
            </Label>
            <Input
              id="statusEntreprise"
              type="text"
              placeholder="Status de l'entreprise"
              value={statusEntreprise}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setStatusEntreprise(e.target.value)
              }
              className="w-full text-primary-600 border-gray-300 focus:ring-primary-500"
            />
            {statusEntrepriseError && (
              <p className="mt-1 text-sm text-red-600">
                {statusEntrepriseError}
              </p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-base font-medium">
            Vous êtes dans le formel
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
        <div className="flex flex-col items-start gap-2">
          <Label className="block text-base font-medium" htmlFor="formation">
            Avez-vous une formation dans votre secteur d'activité ?
          </Label>
          <div className="mt-2 space-y-2">
            {["Oui", "Non"].map((option) => (
              <div key={option} className="flex items-center">
                <input
                  id={option}
                  type="checkbox"
                  value={formation}
                  checked={formation === option}
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFormation(e.target.id)
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
            {formationError && (
              <p className="mt-1 text-sm text-red-600">{formationError}</p>
            )}
          </div>
        </div>
        {formation === "Non" ? (
          <div className="flex flex-col items-start gap-2">
            <Label className="block text-base font-medium" htmlFor="formation">
              Avez-vous besoin d'une formation ?
            </Label>
            <div className="mt-2 space-y-2">
              {["Oui  ", "Non  "].map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    id={option}
                    type="checkbox"
                    value={besoinFormation}
                    checked={besoinFormation === option}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setBesoinFormation(e.target.id)
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
            {besoinFormationError && (
              <p className="text-sm text-red-600">{besoinFormationError}</p>
            )}
          </div>
        ) : null}
        <div className="flex flex-col items-start gap-2">
          <Label className="block text-base font-medium" htmlFor="formation">
            Avez-vous bénéficié d'un financement de l'état ?
          </Label>
          <div className="mt-2 space-y-2">
            {[" Oui", " Non"].map((option) => (
              <div key={option} className="flex items-center">
                <input
                  id={option}
                  type="checkbox"
                  value={financementEtat}
                  checked={financementEtat === option}
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFinancementEtat(e.target.id)
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
            {financementEtatError && (
              <p className="mt-1 text-sm text-red-600">
                {financementEtatError}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start gap-2">
          <Label className="block text-base font-medium" htmlFor="formation">
            Avez-vous accès aux zones et sites d'expositions ?
          </Label>
          <div className="mt-2 space-y-2">
            {["  Oui", "  Non"].map((option) => (
              <div key={option} className="flex items-center">
                <input
                  id={option}
                  type="checkbox"
                  value={accesZonesExpositions}
                  checked={accesZonesExpositions === option}
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setAccesZonesExpositions(e.target.id)
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
            {accesZonesExpositionsError && (
              <p className="mt-1 text-sm text-red-600">
                {accesZonesExpositionsError}
              </p>
            )}
          </div>
        </div>
        {accesZonesExpositions === "  Oui" ? (
          <div className="flex flex-col items-start gap-2">
            <Label className="block text-base font-medium" htmlFor="formation">
              Si oui, laquelle ?
            </Label>
            <div className="mt-2 space-y-2">
              {["SECA", "ZODA", "Autres"].map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    id={option}
                    type="checkbox"
                    value={siteExposition}
                    checked={siteExposition === option || option === laquelle}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setSiteExposition(e.target.id);
                      setSiteExpositionChecked(
                        e.target.id === "Autres" ? e.target.checked : false
                      );
                      setLaquelle(e.target.id === "Autres" ? e.target.id : "");
                    }}
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
            {siteExpositionCheckedError && (
              <p className="mt-1 text-sm text-red-600">
                {siteExpositionCheckedError}
              </p>
            )}
          </div>
        ) : null}
        {siteExpositionChecked ? (
          <div className="flex flex-col items-start gap-2">
            <Label htmlFor="siteExposition" className="block text-base">
              Site d'exposition
            </Label>
            <Input
              id="siteExposition"
              type="text"
              placeholder="Site d'exposition"
              value={siteExposition !== "Autres" ? siteExposition : ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setSiteExposition(e.target.value)
              }
              className="w-full text-primary-600 border-gray-300 focus:ring-primary-500"
            />
            {siteExpositionError && (
              <p className="text-sm text-red-600">{siteExpositionError}</p>
            )}
          </div>
        ) : null}
        <div className="relative flex flex-col items-start gap-2">
          <Label htmlFor="phone" className="block text-base">
            Téléphone
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Téléphone"
            value={phone}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPhone(e.target.value)
            }
            className="w-full pl-10 text-primary-600 border-gray-300 focus:ring-primary-500"
          />
          <Phone
            className="absolute text-gray-400 top-[60%] left-[1%]"
            size={20}
          />
        </div>
        {phoneError && <p className="text-sm text-red-600">{phoneError}</p>}
        <div className="relative flex flex-col items-start gap-2">
          <Label htmlFor="email" className="block text-base">
            E-mail (si disponible)
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="E-mail (si disponible)"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            className="w-full pl-10 text-primary-600 border-gray-300 focus:ring-primary-500"
          />
          <Mail
            className="absolute text-gray-400 top-[60%] left-[1%]"
            size={20}
          />
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
