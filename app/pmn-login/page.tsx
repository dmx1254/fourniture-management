"use client";

import React, { useState } from "react";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      setLoading(false);
      return;
    }

    try {
      // Replace with your actual login API endpoint
      const response = await fetch("/api/login", { // Adjust this API route as needed
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful login, e.g., redirect to dashboard
        console.log("Login successful:", data);
        // router.push('/dashboard'); // Example redirect
      } else {
        setError(data.errorMessage || "Échec de la connexion.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Une erreur s\'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8 md:p-12">
        <h1 className="text-4xl font-bold text-center text-slate-800 mb-8">
          Connexion
        </h1>

        {error && (
          <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-6 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="vous@exemple.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="Votre mot de passe"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#052e16] hover:bg-[#052e16]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#052e16] disabled:opacity-50 transition duration-150 ease-in-out"
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">
          Vous n\'avez pas de compte ?{" "}
          <Link
            href="/pmn-signup" // Adjust if your register page route is different
            className="font-medium text-[#052e16] hover:text-[#052e16]/90 transition duration-150 ease-in-out"
          >
            Inscrivez-vous
          </Link>
        </p>
      </div>
      <footer className="mt-12 text-center text-sm text-slate-400">
        <p>&copy; {new Date().getFullYear()} PMN Stock. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default LoginPage;
