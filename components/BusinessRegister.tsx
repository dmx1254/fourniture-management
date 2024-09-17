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

const BusinessRegister = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [departementTab, setDepartementTab] = useState<Department[] | null>(
    null
  );
  const [communeTab, setCommuneTab] = useState<string[] | null>(null);
  const [lastname, setLastname] = useState<string>("");
  const [phone, setPhone] = useState<E164Number | undefined>(undefined);
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

  const [formation, setFormation] = useState<string>("");
  const [formationError, setFormationError] = useState<string>("");
  const [besoinFormation, setBesoinFormation] = useState<string>("");
  const [besoinFormationError, setBesoinFormationError] = useState<string>("");
  const [chambreDemetier, setChambreDemetier] = useState<string>("");
  const [chambreDemetierError, setChambreDemetierError] = useState<string>("");
  const [chambreDemetierRegion, setChambreDemetierRegion] =
    useState<string>("");
  const [chambreDemetierRegionError, setChambreDemetierRegionError] =
    useState<string>("");
  const [besoins, setBesoins] = useState<string[]>([]);
  const [besoinsError, setBesoinsError] = useState<string>("");
  const [inputBesoin, setInputBesoin] = useState<string>("");
  const [inputBesoinError, setInputBesoinError] = useState<string>("");

  const [genre, setGenre] = useState<string>("");
  const [genreError, setGenreError] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [ageError, setageError] = useState<string>("");

  const [besoinAutreValue, setBesoinAutreValue] = useState<string>("");
  const [besoinAutreValueError, setBesoinAutreValueError] =
    useState<string>("");

  // console.log(besoins);

  // console.log(siteExpositionChecked);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let myNewBesoin = besoins.filter((besoin) => besoin !== "Autre ");
    besoins.filter((besoin) => besoin !== "Autre ");
    if (inputBesoin) {
      myNewBesoin.push(inputBesoin);
    }

    const user = {
      lastname,
      firstname,
      phone,
      departement,
      commune,
      quartier,
      formation,
      region,
      besoins: myNewBesoin,
      besoinFormation,
      chambreDemetier,
      chambreDemetierRegion,
      corpsdemetiers,
      entreprise,
      formel,
      genre,
      age,
    };
    if (
      !lastname ||
      !firstname ||
      phone?.length !== 13 ||
      !commune ||
      !genre ||
      Number(age) < 18 ||
      myNewBesoin.length < 1 ||
      !region ||
      !departement ||
      !chambreDemetier ||
      !formation ||
      !corpsdemetiers ||
      (formation.trim().toLowerCase() === "non" && !besoinFormation) ||
      (chambreDemetier.trim().toLowerCase() === "oui" &&
        !chambreDemetierRegion) ||
      !formel ||
      (businessAutreValue === "Autre" && !corpsdemetiers) ||
      (myNewBesoin.length < 1 && besoins.includes("Autre "))
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
      if (phone?.length !== 13) {
        setPhoneError("Numéro de téléphone incorrect");
      } else {
        setPhoneError("");
      }
      if (!commune) {
        setCommuneError("Veuillez selectionner votre commune");
      } else {
        setCommuneError("");
      }
      if (!genre) {
        setGenreError("Veuillez choisir votre genre");
      } else {
        setGenreError("");
      }
      if (Number(age) < 18) {
        setageError("Votre âge doit être au moins 18 ans");
      } else {
        setageError("");
      }
      if (!corpsdemetiers && businessAutreValue !== "Autre") {
        setCorpsdemetiersError("Veuillez choisir votre corps de de métier");
      } else {
        setCorpsdemetiersError("");
      }
      if (myNewBesoin.length < 1) {
        setBesoinsError("Veuillez cocher une case avant de continuer");
      } else {
        setBesoinsError("");
      }
      if (myNewBesoin.length < 1 && besoins.includes("Autre ")) {
        setInputBesoinError(
          "Veuillez saisir la formation dont vous avez besoin"
        );
      } else {
        setInputBesoinError("");
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
      if (!formation) {
        setFormationError("Veuillez cocher une case avant de continuer");
      } else {
        setFormationError("");
      }
      if (formation.trim().toLowerCase() === "non" && !besoinFormation) {
        setBesoinFormationError("Veuillez cocher une case avant de continuer");
      } else {
        setBesoinFormationError("");
      }

      if (!chambreDemetier) {
        setChambreDemetierError("Veuillez cocher une case avant de continuer");
      } else {
        setChambreDemetierError("");
      }
      if (
        chambreDemetier.trim().toLowerCase() === "oui" &&
        !chambreDemetierRegion
      ) {
        setChambreDemetierRegionError("Veuillez selectionner la région");
      } else {
        setChambreDemetierRegionError("");
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
      setGenreError("");
      setageError("");
      setBusinessAutreValueError("");
      setFormationError("");
      setBesoinFormationError("");
      setChambreDemetierError("");
      setChambreDemetierRegionError("");
      setBesoinAutreValueError("");
      setBesoinsError("");
      setInputBesoinError("");

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
          <h1 className="text-xl font-semibold">
            FICHE DE RECENSEMENT DES ARTISANS
          </h1>
          <p className="flex max-w-[400px] text-sm text-justify">
            Le Coordonnateur du Projet Mobilier national (PMN), Monsieur
            Ibrahima TALL, lance une campagne de recensement des artisans. Cette
            initiative consistant à recenser les entreprises artisanales dans
            leurs différentes filières et à identifier leurs besoins en
            formation, formalisation, financement et en accès au foncier,
            permettra d’avoir une base de données fiable pour mieux suivre
            l’accompagnement des artisans.
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
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
            Région (Lieu de travail)
          </Label>
          <select
            id="region"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
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
              className="block text-base font-medium text-gray-700"
              htmlFor="departement"
            >
              Département
            </Label>
            <select
              id="region"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
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
            <Label
              className="block text-base font-medium text-gray-700"
              htmlFor="commune"
            >
              Commune
            </Label>
            <select
              id="region"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
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
            <Label
              className="block text-base font-medium text-gray-700"
              htmlFor="village"
            >
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <Label
              className="block text-base font-medium text-gray-700"
              htmlFor="age"
            >
              Votre âge
            </Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAge(e.target.value)
              }
              placeholder="Votre âge"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
            />
            {ageError && (
              <p className="mt-1 text-sm text-red-600">{ageError}</p>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-0 md:mt-0.5">
            <Label
              className="block text-base font-medium text-gray-700"
              htmlFor="genre"
            >
              Genre
            </Label>
            <div className="w-full flex items-center justify-between gap-4">
              {["homme", "femme"].map((option) => (
                <div
                  key={option}
                  className="flex items-center justify-center w-full px-3 py-2 border border-dashed rounded border-gray-300"
                >
                  <input
                    id={option}
                    type="radio"
                    value={genre}
                    checked={genre === option}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 accent-green-600"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setGenre(e.target.id)
                    }
                  />
                  <label
                    htmlFor={option}
                    className="ml-3 block text-base text-gray-600 capitalize"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
            {genreError && (
              <p className="mt-1 text-sm text-red-600">{genreError}</p>
            )}
          </div>
        </div>
        <div>
          <Label className="block text-base font-medium text-gray-700">
            Corps de métiers
          </Label>
          <div className="mt-2 space-y-2">
            {[
              "Filière bois",
              "Filière textile",
              "Filière peaux et cuirs",
              "Filière métallique",
              "Filière mécanique",
              "Filière sculpteur",
              "Filière aluminium",
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
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 accent-green-700"
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
              <Label
                htmlFor="corps-de-metiers"
                className="block text-base font-medium text-gray-700"
              >
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
        <div>
          <label className="block text-base font-medium text-gray-700">
            Avez-vous bénéficier d’une formation ?
          </label>
          <div className="mt-2 space-y-2">
            {["Oui  ", "Non  "].map((option) => (
              <div key={option} className="flex items-center">
                <input
                  id={option}
                  type="checkbox"
                  value={formation}
                  checked={formation === option}
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 accent-green-600"
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
          </div>
          {formationError && (
            <p className="mt-1 text-sm text-red-600">{formationError}</p>
          )}
        </div>
        {formation === "Non  " && (
          <div>
            <label className="block text-base font-medium text-gray-700">
              Avez-vous besoin d’une formation ?
            </label>
            <div className="mt-2 space-y-2">
              {["Oui   ", "Non   "].map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    id={option}
                    type="checkbox"
                    value={besoinFormation}
                    checked={besoinFormation === option}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 accent-green-600"
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
              <p className="mt-1 text-sm text-red-600">
                {besoinFormationError}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col items-start gap-2">
            <Label
              htmlFor="entreprise"
              className="block text-base font-medium text-gray-700"
            >
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
          <label className="block text-base font-medium text-gray-700">
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
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 accent-green-600"
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
        <div>
          <label className="block text-base font-medium text-gray-700">
            Êtes-vous inscrit dans une Chambre de Métiers ?
          </label>
          <div className="mt-2 space-y-2">
            {[" Oui", " Non"].map((option) => (
              <div key={option} className="flex items-center">
                <input
                  id={option}
                  type="checkbox"
                  value={chambreDemetier}
                  checked={chambreDemetier === option}
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 accent-green-600"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setChambreDemetier(e.target.id)
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
          {chambreDemetierError && (
            <p className="mt-1 text-sm text-red-600">{chambreDemetierError}</p>
          )}
        </div>
        {chambreDemetier === " Oui" && (
          <div>
            <Label
              className="block text-base font-medium text-gray-700"
              htmlFor="chambreDemetierRegion"
            >
              Si OUI, dans quelle région
            </Label>
            <select
              id="chambreDemetierRegion"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
              value={chambreDemetierRegion}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setChambreDemetierRegion(e.target.value)
              }
            >
              <option value="">Sélectionner votre région</option>
              {regions.map(({ region }) => (
                <option key={region} value={region} className="capitalize">
                  {region}
                </option>
              ))}
            </select>
            {chambreDemetierRegionError && (
              <p className="mt-1 text-sm text-red-600">
                {chambreDemetierRegionError}
              </p>
            )}
          </div>
        )}
        <div>
          <label className="block text-base font-medium text-gray-700">
            Besoins ?
          </label>
          <div className="mt-2 space-y-2">
            {["formation", "formalisation", "financement", "Autre "].map(
              (option) => (
                <div key={option} className="flex items-center">
                  <input
                    id={option}
                    type="checkbox"
                    value={besoins}
                    checked={besoins.includes(option)}
                    className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 accent-green-600"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (!besoins.includes(e.target.id)) {
                        setBesoins((prevBesoin) => [
                          ...prevBesoin,
                          e.target.id,
                        ]);
                      } else {
                        setBesoins((prevBesoin) =>
                          prevBesoin.filter((besoin) => besoin !== e.target.id)
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor={option}
                    className="ml-3 block text-base text-gray-600 capitalize"
                  >
                    {option === "Autre " ? "Autres" : option}&nbsp;
                  </label>
                </div>
              )
            )}
          </div>
          {besoinsError && (
            <p className="mt-1 text-sm text-red-600">{besoinsError}</p>
          )}
        </div>
        {besoins.includes("Autre ") ? (
          <div className="flex flex-col items-start gap-2 mt-4">
            <Label
              htmlFor="besoins"
              className="block text-base font-medium text-gray-700"
            >
              Besoins
            </Label>
            <Input
              id="besoins"
              type="text"
              placeholder="Besoin"
              value={inputBesoin}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInputBesoin(e.target.value)
              }
              className="w-full text-primary-600 border-gray-300 focus:ring-primary-500 text-base"
            />
            {inputBesoinError && (
              <p className="mt-1 text-sm text-red-600">{inputBesoinError}</p>
            )}
          </div>
        ) : null}
        <div className="relative flex flex-col items-start gap-2">
          <Label
            htmlFor="phone"
            className="block text-base font-medium text-gray-700"
          >
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

export default BusinessRegister;
