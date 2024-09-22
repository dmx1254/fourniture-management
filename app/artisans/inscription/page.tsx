import BusinessRegister from "@/components/BusinessRegister";
import Image from "next/image";

const InscriptionPage = () => {
  return (
    <div className="font-sans min-h-screen flex-col py-4 px-4 w-full max-w-[700px] flex items-center justify-center mx-auto">
      <div className="flex flex-col items-center gap-1 mt-4 mb-1">
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
        <p className="text-xl font-bold text-center">
          MINISTERE DU TOURISME ET DE L'ARTISANAT
        </p>
        <p className="text-lg font-extrabold">*******</p>
        <p className="text-2xl font-semibold text-center">
          PROJET DU MOBILIER NATIONAL
        </p>
      </div>
      <BusinessRegister />
    </div>
  );
};

export default InscriptionPage;
