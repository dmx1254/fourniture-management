"use client";

import React, { useState } from "react";
import {
  User,
  Building2,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Users,
  Briefcase,
  Loader,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";

interface FormData {
  // Informations personnelles
  identifiant: string;
  prenom: string;
  nom: string;
  telephone: string | number;
  genre: string;
  cni: string | number;
  validiteCni: string;
  carteProfessionnelle: string;
  validiteCartePro: string;
  adresse: string;
  region: string;
  departement: string;
  commune: string;
  villageQuartier: string;

  // Informations professionnelles
  corpsMetiers: string;
  entreprise: string;
  ninea: string;
  adresseEntreprise: string;
  nombreEmployes: string;
  anneesExperience: string;
}

const Pubtraining = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    identifiant: "",
    prenom: "",
    nom: "",
    telephone: "",
    genre: "",
    cni: "",
    validiteCni: "",
    carteProfessionnelle: "",
    validiteCartePro: "",
    adresse: "",
    region: "",
    departement: "",
    commune: "",
    villageQuartier: "",
    corpsMetiers: "",
    entreprise: "",
    ninea: "",
    adresseEntreprise: "",
    nombreEmployes: "",
    anneesExperience: "",
  });

  const corpsMetiersOptions = [
    "Menuiserie bois",
    "Menuiserie Métallique et en Aluminium",
    "Mécanique (Mécanicien, Électricien auto, Tôlier)",
    "Peaux et Cuirs (Cordonnier, Tapissier, Maroquinier)",
    "Textile (Tailleur, Brodeur, Tricoteur, Tisserant)",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (metier: string) => {
    setFormData((prev) => ({
      ...prev,
      corpsMetiers: metier,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Données du formulaire:", formData);

      setIsLoading(true);

      const res = await fetch("/api/formations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: { ...formData, corpsMetiers: formData.corpsMetiers },
        }),
      });

      const response = await res.json();

      if (res.ok) {
        toast.success(
          "Votre candidature a été soumise avec succès. Nous vous remercions pour votre inscription et vous contacterons prochainement.",
          {
            style: {
              background: "#052e16",
              color: "#fff",
            },
            duration: 5000,
            position: "top-right",
          }
        );
        console.log("Response: ", response);
      } else {
        toast.error(
          response.errorMessage ||
            "Quelque chose s'est mal passé, veuillez réessayer plus tard.",
          {
            style: {
              background: "#dc2626",
              color: "#fff",
            },
            duration: 5000,
            position: "top-right",
          }
        );
      }
    } catch (error: any) {
      console.log(error);
      toast.error(
        "Quelque chose s'est mal passé, veuillez réessayer plus tard.",
        {
          style: {
            background: "#dc2626",
            color: "#fff",
          },
          duration: 5000,
          position: "top-right",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col mx-auto items-center justify-center bg-gradient-to-br bg-white max-w-5xl">
      {/* Header */}
      <div className="bg-white py-8 border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          {/* Drapeau du Sénégal */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-12 flex">
              <div className="w-1/3 bg-green-500"></div>
              <div className="w-1/3 bg-yellow-400 flex items-center justify-center">
                <div className="text-green-600 text-xl">★</div>
              </div>
              <div className="w-1/3 bg-red-500"></div>
            </div>
          </div>

          {/* Titre République du Sénégal */}
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">
            RÉPUBLIQUE DU SÉNÉGAL
          </h1>
          <p className="text-center text-gray-700 mb-4">
            Un Peuple - Un But - Une Foi
          </p>

          {/* Séparateur */}
          <div className="text-center text-gray-600 mb-4">★★★★★★★</div>

          {/* Ministère */}
          <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-4">
            MINISTÈRE DU TOURISME ET DE L'ARTISANAT
          </h2>

          {/* Séparateur */}
          <div className="text-center text-gray-600 mb-4">★★★★★★★</div>

          {/* Projet Mobilier National */}
          <h3 className="text-lg md:text-xl font-bold text-center text-gray-800 mb-4">
            PROJET DU MOBILIER NATIONAL
          </h3>

          {/* Logo PMN (placeholder) */}
          <div className="flex justify-center mb-6">
            <div className="w-28 h-28">
              <Image
                src="/pmn.jpeg"
                alt="PMN"
                width={112}
                height={112}
                className="object-cover"
              />
            </div>
          </div>

          {/* Titre de la fiche */}
          <h4 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6">
            FICHE DE FORMATION : MAITRISE DES PROCEDURES DE PASSATION DES
            MARCHES PUBLICS
          </h4>

          {/* Message de bienvenue */}
          <p className="text-center text-gray-700 text-lg leading-relaxed">
            Bienvenue sur le portail d'inscription
            <br />
            du Projet Mobilier National.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations personnelles */}
          <div className="rounded-xl shadow-lg p-6 md:p-8">
            <div className="flex items-center mb-6">
              <User className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">
                Informations personnelles
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  placeholder="Prénom"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  placeholder="Nom"
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Téléphone *
                </label>
                <input
                  type="number"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  placeholder="Téléphone"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Genre *
                </label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="Choisissew votre genre">Sélectionner</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CreditCard className="w-4 h-4 inline mr-1" />
                  CNI *
                </label>
                <input
                  type="number"
                  name="cni"
                  value={formData.cni}
                  onChange={handleInputChange}
                  placeholder="CNI"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Validité du CNI *
                </label>
                <input
                  type="date"
                  name="validiteCni"
                  value={formData.validiteCni}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carte professionnelle d'artisan *
                </label>
                <input
                  type="text"
                  name="carteProfessionnelle"
                  value={formData.carteProfessionnelle}
                  placeholder="Carte professionnelle"
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Validité de la carte professionnelle *
                </label>
                <input
                  type="date"
                  name="validiteCartePro"
                  value={formData.validiteCartePro}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Adresse *
                </label>
                <input
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  placeholder="Votre adresse"
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Région *
                </label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  placeholder="Région"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Département *
                </label>
                <input
                  type="text"
                  name="departement"
                  value={formData.departement}
                  onChange={handleInputChange}
                  placeholder="Département"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commune *
                </label>
                <input
                  type="text"
                  name="commune"
                  value={formData.commune}
                  onChange={handleInputChange}
                  placeholder="Commune"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Village/Quartier *
                </label>
                <input
                  type="text"
                  name="villageQuartier"
                  value={formData.villageQuartier}
                  onChange={handleInputChange}
                  placeholder="Village/Quartier"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Informations professionnelles */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="flex items-center mb-6">
              <Briefcase className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">
                Informations professionnelles
              </h2>
            </div>

            <div className="space-y-6">
              {/* Corps de métiers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Corps de métiers * (Sélectionnez un ou plusieurs)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {corpsMetiersOptions.map((metier) => (
                    <label
                      key={metier}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.corpsMetiers.includes(metier)}
                        onChange={() => handleCheckboxChange(metier)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        {metier}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="w-4 h-4 inline mr-1" />
                    Entreprise *
                  </label>
                  <input
                    type="text"
                    name="entreprise"
                    value={formData.entreprise}
                    onChange={handleInputChange}
                    placeholder="Votre entreprise"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NINEA *
                  </label>
                  <input
                    type="text"
                    name="ninea"
                    value={formData.ninea}
                    onChange={handleInputChange}
                    placeholder="NINEA"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Adresse de l'entreprise *
                  </label>
                  <input
                    type="text"
                    name="adresseEntreprise"
                    value={formData.adresseEntreprise}
                    onChange={handleInputChange}
                    placeholder="Adresse de l'entreprise"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Nombre d'employés *
                  </label>
                  <select
                    name="nombreEmployes"
                    value={formData.nombreEmployes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Sélectionner</option>
                    <option value="1-5">1-5 employés</option>
                    <option value="6-10">6-10 employés</option>
                    <option value="11-20">11-20 employés</option>
                    <option value="21-50">21-50 employés</option>
                    <option value="50+">Plus de 50 employés</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Années d'expérience *
                  </label>
                  <select
                    name="anneesExperience"
                    value={formData.anneesExperience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Sélectionner</option>
                    <option value="0-2">0-2 ans</option>
                    <option value="3-5">3-5 ans</option>
                    <option value="6-10">6-10 ans</option>
                    <option value="11-15">11-15 ans</option>
                    <option value="16-20">16-20 ans</option>
                    <option value="20+">Plus de 20 ans</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-black/80 text-white px-12 py-4 rounded-lg duration-200 transition-colors hover:opacity-85"
            >
              {isLoading ? (
                <div className="flex items-center gap-2 text-sm text-white">
                  <Loader size={26} className="animate-spin text-white" /> En
                  cours d'inscription...
                </div>
              ) : (
                "Soumettre l'inscription"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Pubtraining;
