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
import { useRouter } from "next/navigation";

const ProgramRegister = () => {
  const router = useRouter();
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
  const [corpsdemetiers, setCorpsdemetiers] = useState<string>("textile");
  const [corpsdemetiersError, setCorpsdemetiersError] = useState<string>("");
  const [entreprise, setEntreprise] = useState<string>("");
  const [entrepriseError, setEntrepriseError] = useState<string>("");
  const [formel, setFormel] = useState<string>("");
  const [specialCat, setSpecialCat] = useState<string>(
    "programme-confection-tenues-scolaires"
  );
  const [tenueScolaireProgram, setTenueScolaireProgram] = useState<string>("");
  const [tenueScolaireProgramError, setTenueScolaireProgramError] =
    useState<string>("");
  const [formelError, setFormelError] = useState<string>("");
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [businessAutreValue, setBusinessAutreValue] = useState<string>("");
  const [businessAutreValueError, setBusinessAutreValueError] =
    useState<string>("");

  const [formation, setFormation] = useState<string>("");
  const [formationError, setFormationError] = useState<string>("");
  const [localAdress, setLocalAdress] = useState<string>("");
  const [localAdressError, setLocalAdressError] = useState<string>("");
  const [nbrDeMachine, setNbrDeMachine] = useState<string>("");
  const [nbrDeMachineError, setNbrDeMachineError] = useState<string>("");
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

  const [cni, setCni] = useState<string>("");
  const [cniError, setCniError] = useState<string>("");
  const [isCniValid, setIsCniValid] = useState<string>("");
  const [isCniValidError, setIsCniValidError] = useState<string>("");
  const [doYouHaveLocal, setDoYouHaveLocal] = useState<string>("");
  const [doYouHaveLocalError, setDoYouHaveLocalError] = useState<string>("");
  const [businessWorker, setBusinessWorker] = useState<string>("");
  const [businessWorkerError, setBusinessWorkerError] = useState<string>("");
  const [howLongJob, setHowLongJob] = useState<string>("");
  const [howLongJobError, setHowLongJobError] = useState<string>("");

  const [genre, setGenre] = useState<string>("");
  const [genreError, setGenreError] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [ageError, setageError] = useState<string>("");

  const [besoinAutreValue, setBesoinAutreValue] = useState<string>("");
  const [besoinAutreValueError, setBesoinAutreValueError] =
    useState<string>("");

  // console.log(besoins);

  useEffect(() => {
    if (parseInt(cni[0]) === 1) {
      setGenre("homme");
    } else if (parseInt(cni[0]) === 2) {
      setGenre("femme");
    } else {
      return;
    }
  }, [cni]);

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
      specialCat,
      tenueScolaireProgram,
      localAdress,
      nbrDeMachine,
      formation,
      region,
      besoins: myNewBesoin,
      besoinFormation,
      cni,
      isCniValid,
      doYouHaveLocal,
      businessWorker,
      howLongJob,
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
      cni.length !== 13 ||
      !commune ||
      !genre ||
      !isCniValid.trim() ||
      !doYouHaveLocal.trim() ||
      Number(businessWorker) < 1 ||
      Number(howLongJob) < 1 ||
      Number(nbrDeMachine) < 1 ||
      !region ||
      !departement ||
      !chambreDemetier ||
      !formation ||
      !corpsdemetiers ||
      (formation.trim().toLowerCase() === "non" && !besoinFormation) ||
      !tenueScolaireProgram.trim().toLowerCase() ||
      (doYouHaveLocal.trim().toLowerCase() === "oui" && !localAdress) ||
      (chambreDemetier.trim().toLowerCase() === "oui" &&
        !chambreDemetierRegion) ||
      !formel
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
      if (cni.length !== 13) {
        setCniError("Numero de CNI incorrect");
      } else {
        setCniError("");
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
      if (!isCniValid.trim()) {
        setIsCniValidError("Veuillez cocher une case avant de continuer");
      } else {
        setIsCniValidError("");
      }
      if (!doYouHaveLocal.trim()) {
        setDoYouHaveLocalError("Veuillez cocher une case avant de continuer");
      } else {
        setDoYouHaveLocalError("");
      }
      if (doYouHaveLocal.trim().toLowerCase() === "oui" && !localAdress) {
        setLocalAdressError("Veuillez saisir l'adresse de votre local");
      } else {
        setLocalAdressError("");
      }
      if (Number(businessWorker) < 1) {
        setBusinessWorkerError(
          "Le nombre de vos travailleurs doit être minimum de 1"
        );
      } else {
        setBusinessWorkerError("");
      }
      if (Number(businessWorker) < 1) {
        setBusinessWorkerError(
          "Le nombre de vos travailleurs doit être minimum de 1"
        );
      } else {
        setBusinessWorkerError("");
      }
      if (!tenueScolaireProgram.trim().toLowerCase()) {
        setTenueScolaireProgramError(
          "Veuillez cocher une case avant de continuer"
        );
      } else {
        setTenueScolaireProgramError("");
      }
      if (Number(howLongJob) < 1) {
        setHowLongJobError("Vous devez exercer ce métier minimum  1 ans");
      } else {
        setHowLongJobError("");
      }
      if (Number(nbrDeMachine) < 1) {
        setNbrDeMachineError(
          "Le nombre de vos machines doit être minimum de 1"
        );
      } else {
        setNbrDeMachineError("");
      }
      // if (Number(age) < 18) {
      //   setageError("Votre âge doit être au moins 18 ans");
      // } else {
      //   setageError("");
      // }
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
      setCniError("");
      setIsCniValidError("");
      setDoYouHaveLocalError("");
      setBusinessWorkerError("");
      setHowLongJobError("");
      setTenueScolaireProgramError("");
      setLocalAdressError("");

      try {
        setIsloading(true);
        const response = await inscriptionForEntreprise(user);
        setIsloading(false);
        if (response?.sucessMessage) {
          toast.success(response?.sucessMessage, {
            style: { color: "#16a34a" },
          });
          formRef.current?.reset();
          setTimeout(() => {
            router.push(
              `/artisans/programme-confection-tenues-scolaires/${response.userId}`
            );
          }, 1000);
        } else if (response?.errorMessage) {
          toast.error(response?.errorMessage, {
            style: { color: "#dc2626" },
          });
        } else {
          return;
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
      let filtreWithoutDoublure = new Set(comms?.communes);
      setCommuneTab(Array.from(filtreWithoutDoublure));
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
      <div className="w-full flex-col items-center justify-center mx-auto gap-2 mb-14">
        <div className="flex flex-col items-center gap-1 max-sm:mb-6">
          <Image
            src="/senegal.svg"
            alt="drapeau du senegal"
            width={60}
            height={60}
            className="object-cover object-center"
          />
          <p className="text-2xl font-semibold text-center">
            REPUBLIQUE DU SENEGAL
          </p>
          <p className="font-semibold">Un Peuple - Un But - Une Foi</p>
          <p className="text-lg font-extrabold">*******</p>
        </div>
        <div className="w-full flex items-center justify-between -mt-8">
          <Image
            src="/minedu.png"
            alt="ministere education"
            width={120}
            height={120}
            className="object-cover object-center"
          />
          <Image
            src="/mintour.png"
            alt="ministere du tourisme et des Loisirs "
            width={130}
            height={130}
            className="object-cover object-center"
          />
        </div>
        <div className="flex items-center justify-center -mt-1">
          <p className="w-full max-w-[400px] text-xl text-center uppercase">
            formulaire d'inscription des artisans pour le programme de
            confection des tenues scolaires
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 -mt-8" ref={formRef}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <Label
              className="block text-base font-medium text-gray-700"
              htmlFor="cni"
            >
              Carte nationale d'identité
            </Label>
            <Input
              id="cni"
              type="number"
              value={cni}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCni(e.target.value)
              }
              placeholder="Votre CNI"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
            />
            {cniError && (
              <p className="mt-1 text-sm text-red-600">{cniError}</p>
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

        <div className="grid grid-cols-1 gap-6">
          <div className="flex flex-col items-start gap-2">
            <Label
              htmlFor="entreprise"
              className="block text-base font-medium text-gray-700"
            >
              Nom de votre entreprise
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
            Avez-vous bénéficié d’une formation dispensée par une structure de
            l'État ?
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

        <div>
          <label className="block text-base font-medium text-gray-700">
            Avez-vous déjà participé au programme des tenues scolaires ?
          </label>
          <div className="mt-2 space-y-2">
            {["Oui    ", "Non    "].map((option) => (
              <div key={option} className="flex items-center">
                <input
                  id={option}
                  type="checkbox"
                  value={tenueScolaireProgram}
                  checked={tenueScolaireProgram === option}
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 accent-green-600"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setTenueScolaireProgram(e.target.id)
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
          {tenueScolaireProgramError && (
            <p className="mt-1 text-sm text-red-600">
              {tenueScolaireProgramError}
            </p>
          )}
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
            Êtes-vous inscrit dans le répertoire de la chambre des Métiers ?
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
            Votre carte est-elle toujours valide ?
          </label>
          <div className="mt-2 space-y-2">
            {["   Oui", "   Non"].map((option) => (
              <div key={option} className="flex items-center">
                <input
                  id={option}
                  type="checkbox"
                  value={isCniValid}
                  checked={isCniValid === option}
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 accent-green-600"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setIsCniValid(e.target.id)
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
          {isCniValidError && (
            <p className="mt-1 text-sm text-red-600">{isCniValidError}</p>
          )}
        </div>
        <div>
          <label className="block text-base font-medium text-gray-700">
            Votre entreprise dispose-t-elle d'un atelier (local) ?
          </label>
          <div className="mt-2 space-y-2">
            {["    Oui", "    Non"].map((option) => (
              <div key={option} className="flex items-center">
                <input
                  id={option}
                  type="checkbox"
                  value={doYouHaveLocal}
                  checked={doYouHaveLocal === option}
                  className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500 accent-green-600"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setDoYouHaveLocal(e.target.id)
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
          {doYouHaveLocalError && (
            <p className="mt-1 text-sm text-red-600">{doYouHaveLocalError}</p>
          )}
        </div>

        <div className="flex flex-col items-start gap-2">
          <Label
            htmlFor="entreprise"
            className="block text-base font-medium text-gray-700"
          >
            Adresse de l'atelier
          </Label>
          <Input
            id="entreprise"
            type="text"
            placeholder="Adresse de votre entreprise"
            value={localAdress}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setLocalAdress(e.target.value)
            }
            className="w-full text-primary-600 border-gray-300 focus:ring-primary-500"
          />
          {localAdressError && (
            <p className="mt-1 text-sm text-red-600">{localAdressError}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label
            className="block text-base font-medium text-gray-700"
            htmlFor="businessWorker"
          >
            Quel est le nombre de vos travailleurs ?
          </Label>
          <Input
            id="businessWorker"
            type="number"
            value={businessWorker}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setBusinessWorker(e.target.value)
            }
            placeholder="Exemple: 20"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
          />
          {businessWorkerError && (
            <p className="mt-1 text-sm text-red-600">{businessWorkerError}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label
            className="block text-base font-medium text-gray-700"
            htmlFor="businessWorker"
          >
            Combien de machines avez-vous à disposition ?
          </Label>
          <Input
            id="businessWorker"
            type="number"
            value={nbrDeMachine}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNbrDeMachine(e.target.value)
            }
            placeholder="Exemple: 20"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
          />
          {nbrDeMachineError && (
            <p className="mt-1 text-sm text-red-600">{nbrDeMachineError}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label
            className="block text-base font-medium text-gray-700"
            htmlFor="cni"
          >
            Depuis combien de temps exercez-vous ce metier ?
          </Label>
          <Input
            id="cni"
            type="number"
            value={howLongJob}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setHowLongJob(e.target.value)
            }
            placeholder="Exemple: 5"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
          />
          {howLongJobError && (
            <p className="mt-1 text-sm text-red-600">{howLongJobError}</p>
          )}
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

export default ProgramRegister;
