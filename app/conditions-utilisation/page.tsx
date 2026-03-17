"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Lock,
  Shield,
  Stethoscope,
  Server,
  CheckCircle2,
  Hand,
  Award,
  AlertTriangle,
  RefreshCw,
  MessageCircle,
  ShieldCheck,
  XCircle,
  ArrowLeft,
  Mail,
  Phone,
  Send,
  Loader,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const conditionsSections = [
  {
    title: "Objet et champ d'application",
    icon: FileText,
    content:
      "Ces Conditions d'utilisation et l'EULA encadrent l'usage de l'app mobile PMN Absences par les employés et administrateurs de l'entreprise. L'app sert uniquement à gérer les demandes d'absence et les congés au sein de PMN.",
  },
  {
    title: "Accès et authentification",
    icon: Lock,
    content:
      "Les comptes sont créés et gérés par l'administrateur PMN. Les identifiants sont fournis à l'employé et peuvent être réinitialisés uniquement par l'administrateur. L'utilisateur doit conserver la confidentialité de ses accès.",
  },
  {
    title: "Données traitées (pas de géolocalisation, pas de tracking)",
    icon: Shield,
    content:
      "Nous ne collectons pas de géolocalisation ni de données de navigation/trackers publicitaires. Les données traitées se limitent aux informations nécessaires à la gestion des absences : identité professionnelle (nom, prénom, email, téléphone, code d'identification), rôle, occupation, historique des demandes, et, lorsque la raison est un repos médical, un justificatif (image/PDF) fourni par l'utilisateur.",
  },
  {
    title: "Utilisation des justificatifs",
    icon: Stethoscope,
    content:
      "Le justificatif médical (image/PDF) n'est demandé que pour les demandes d'absence « repos medicale ». Il est stocké et accessible uniquement aux personnes autorisées (ex. validateurs, administrateurs) pour vérifier la demande.",
  },
  {
    title: "Hébergement et sécurité",
    icon: Server,
    content:
      "Les données sont hébergées sur l'infrastructure PMN (API https://pmn.vercel.app). L'accès est sécurisé par token et limité aux utilisateurs autorisés. Aucune donnée n'est partagée à des tiers à des fins commerciales.",
  },
  {
    title: "Droits des utilisateurs",
    icon: CheckCircle2,
    content:
      "Vous pouvez demander l'accès, la rectification ou la suppression de vos données en contactant l'administrateur PMN. La suppression de compte ou la réinitialisation du mot de passe est effectuée par l'administrateur. Les demandes d'export ou d'effacement sont traitées selon la politique interne et les obligations légales applicables.",
  },
  {
    title: "Obligations des utilisateurs",
    icon: Hand,
    content:
      "Utiliser l'app uniquement dans le cadre professionnel PMN, fournir des informations exactes, ne pas détourner l'app (ex. diffusion de contenu non autorisé), respecter la confidentialité des données consultées.",
  },
  {
    title: "Propriété intellectuelle",
    icon: Award,
    content:
      "L'app, ses contenus et éléments visuels restent la propriété de PMN ou de ses concédants. Toute reproduction ou distribution non autorisée est interdite.",
  },
  {
    title: "Limitation de responsabilité",
    icon: AlertTriangle,
    content:
      "L'app est fournie « en l'état ». PMN met en œuvre les moyens raisonnables pour assurer disponibilité et sécurité, sans garantie absolue d'absence d'erreurs ou d'interruptions. En cas d'indisponibilité, contactez l'administrateur.",
  },
  {
    title: "Mises à jour et modifications",
    icon: RefreshCw,
    content:
      "PMN peut mettre à jour l'app ou ces Conditions/EULA pour des raisons légales, de sécurité ou d'amélioration. En continuant d'utiliser l'app après publication, vous acceptez les nouvelles conditions.",
  },
  {
    title: "Loi applicable et contact",
    icon: MessageCircle,
    content:
      "La loi applicable est celle du pays d'implantation de PMN. Pour toute question ou demande liée aux données ou aux présentes conditions, contactez l'administrateur PMN ou le support interne.",
  },
  {
    title: "Contact",
    icon: Mail,
    content:
      "Pour toute question ou préoccupation concernant ces termes et conditions, veuillez nous contacter via : info@pmn.sn ou par téléphone au +221766248505.",
  },
];

const eulaSections = [
  {
    title: "Licence d'utilisation interne",
    icon: ShieldCheck,
    content:
      "Licence non exclusive, non transférable, réservée aux employés et administrateurs PMN pour un usage interne de gestion d'absences. Aucune revente ou redistribution.",
  },
  {
    title: "Limitations et restrictions",
    icon: Hand,
    content:
      "Interdiction de contourner la sécurité, de décompiler, de copier le code ou de détourner l'app à d'autres fins. Pas de modification ou d'usage en dehors du périmètre PMN.",
  },
  {
    title: "Absence de garanties",
    icon: AlertTriangle,
    content:
      "L'app est fournie « en l'état ». PMN vise la disponibilité et la sécurité mais ne garantit pas l'absence d'erreurs ou d'interruptions.",
  },
  {
    title: "Support et mises à jour",
    icon: RefreshCw,
    content:
      "Mises à jour possibles pour sécurité, corrections ou améliorations. L'usage continu vaut acceptation des mises à jour et des conditions révisées.",
  },
  {
    title: "Résiliation",
    icon: XCircle,
    content:
      "PMN peut suspendre ou retirer l'accès en cas d'usage abusif ou sur décision interne. Les comptes et mots de passe sont gérés et révoqués par l'administrateur.",
  },
  {
    title: "Loi applicable",
    icon: MessageCircle,
    content:
      "La loi du pays d'implantation de PMN s'applique. Contactez l'administrateur ou le support interne pour toute question.",
  },
];

export default function ConditionsUtilisation() {
  const router = useRouter();
  const [tab, setTab] = useState<"conditions" | "eula">("conditions");
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const displayedSections = tab === "conditions" ? conditionsSections : eulaSections;

  const handleSubmitContact = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      toast.error("Veuillez remplir tous les champs requis", {
        style: { color: "red" },
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de l'envoi du message");
      }

      toast.success(result.message, {
        style: { color: "green" },
        duration: 5000,
        position: "top-right",
      });

      // Réinitialiser le formulaire
      setContactForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setIsContactDialogOpen(false);
    } catch (error: any) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error(error.message || "Erreur lors de l'envoi du message", {
        style: { color: "red" },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Conditions d'utilisation & EULA
                </h1>
                <p className="text-sm md:text-base text-white/90 mt-1">
                  Informations légales pour la publication en store
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <Button
            onClick={() => setTab("conditions")}
            variant={tab === "conditions" ? "default" : "outline"}
            className={`flex-1 ${
              tab === "conditions"
                ? "bg-cyan-600 hover:bg-cyan-700"
                : "bg-white hover:bg-slate-50"
            }`}
          >
            Conditions d'utilisation
          </Button>
          <Button
            onClick={() => setTab("eula")}
            variant={tab === "eula" ? "default" : "outline"}
            className={`flex-1 ${
              tab === "eula"
                ? "bg-cyan-600 hover:bg-cyan-700"
                : "bg-white hover:bg-slate-50"
            }`}
          >
            EULA
          </Button>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {displayedSections.map((section, index) => {
            const IconComponent = section.icon;
            const isContactSection = section.title === "Contact";
            
            return (
              <div
                key={section.title}
                className="p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {index + 1}. {section.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                      {section.content}
                    </p>
                    
                    {/* Informations de contact avec formulaire */}
                    {isContactSection && (
                      <div className="mt-4 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Mail className="h-4 w-4 text-cyan-600" />
                            <a
                              href="mailto:info@pmn.sn"
                              className="text-cyan-600 hover:underline"
                            >
                              info@pmn.sn
                            </a>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Phone className="h-4 w-4 text-cyan-600" />
                            <a
                              href="tel:+221766248505"
                              className="text-cyan-600 hover:underline"
                            >
                              +221 76 624 85 05
                            </a>
                          </div>
                        </div>
                        
                        <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                              <Send className="h-4 w-4 mr-2" />
                              Envoyer un message
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Formulaire de contact</DialogTitle>
                              <DialogDescription>
                                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="contact-name">
                                  Nom complet <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="contact-name"
                                  placeholder="Votre nom complet"
                                  value={contactForm.name}
                                  onChange={(e) =>
                                    setContactForm({ ...contactForm, name: e.target.value })
                                  }
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="contact-email">
                                  Email <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="contact-email"
                                  type="email"
                                  placeholder="votre.email@exemple.com"
                                  value={contactForm.email}
                                  onChange={(e) =>
                                    setContactForm({ ...contactForm, email: e.target.value })
                                  }
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="contact-phone">Téléphone</Label>
                                <Input
                                  id="contact-phone"
                                  type="tel"
                                  placeholder="+221 XX XXX XX XX"
                                  value={contactForm.phone}
                                  onChange={(e) =>
                                    setContactForm({ ...contactForm, phone: e.target.value })
                                  }
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="contact-subject">
                                  Sujet <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                  id="contact-subject"
                                  placeholder="Sujet de votre message"
                                  value={contactForm.subject}
                                  onChange={(e) =>
                                    setContactForm({ ...contactForm, subject: e.target.value })
                                  }
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="contact-message">
                                  Message <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                  id="contact-message"
                                  placeholder="Votre message..."
                                  value={contactForm.message}
                                  onChange={(e) =>
                                    setContactForm({ ...contactForm, message: e.target.value })
                                  }
                                  rows={5}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setIsContactDialogOpen(false)}
                                disabled={isSubmitting}
                              >
                                Annuler
                              </Button>
                              <Button
                                onClick={handleSubmitContact}
                                disabled={
                                  isSubmitting ||
                                  !contactForm.name ||
                                  !contactForm.email ||
                                  !contactForm.subject ||
                                  !contactForm.message
                                }
                                className="bg-cyan-600 hover:bg-cyan-700"
                              >
                                {isSubmitting ? (
                                  <>
                                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                                    Envoi...
                                  </>
                                ) : (
                                  <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Envoyer
                                  </>
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer spacing */}
        <div className="h-16" />
      </div>
    </div>
  );
}

