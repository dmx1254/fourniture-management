import { NextRequest, NextResponse } from "next/server";
import { geolocation } from "@vercel/functions";

export const config = {
  matcher: ["/api/entretiens", "/api/achats", "/api/tenues"], // ✅ Middleware appliqué aux routes API
};

export default function middleware(request: NextRequest) {
  const { country = "US" } = geolocation(request);

  console.log(`🌍 Requête depuis : ${country}`);

  // ✅ Si l'utilisateur est au Sénégal, activer un cache puissant pour booster la rapidité
  if (country === "SN") {
    return NextResponse.next({
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=30", // ⏳ Cache dynamique (60s)
        "Vercel-CDN-Cache-Control": "max-age=60, stale-while-revalidate=30", // 📌 Optimisation CDN
      },
    });
  }

  // ✅ Si l'utilisateur est ailleurs, activer un cache plus long pour éviter les requêtes répétées
  return NextResponse.next({
    headers: {
      "Cache-Control": "s-maxage=600, stale-while-revalidate=300", // ⏳ Cache de 10 minutes
      "Vercel-CDN-Cache-Control": "max-age=600, stale-while-revalidate=300",
    },
  });
}
