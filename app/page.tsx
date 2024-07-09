"use client";
import LoginButton from "@/components/LoginButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/actions/action";
import { useFormState } from "react-dom";

export default function Home() {
  const initialState = { errors: {}, message: "" };
  const [state, loginAction] = useFormState(login, initialState);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <form
        action={loginAction}
        className="w-full max-w-80 flex flex-col items-center gap-4 rounded-[10px] bg-[#111b21] p-4"
      >
        <div className="w-full flex flex-col items-start gap-3">
          <Label htmlFor="email" className="text-gray-600">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            autoComplete="off"
            placeholder="Votre adresse email"
            className="w-full bg-transparent text-gray-600 outline-none border border-gray-600 placeholder:text-gray-600"
          />
          <div className="flex flex-col items-start gap-2">
            {state?.errors?.email?.map((emailError: string, index: number) => {
              return (
                <p
                  key={index}
                  className="flex text-xs text-red-500 line-clamp-1 mt-1"
                  aria-live="polite"
                >
                  {emailError}
                </p>
              );
            })}
          </div>
        </div>
        <div className="w-full flex flex-col items-start gap-3">
          <Label htmlFor="password" className="text-gray-600">
            Mot de passe
          </Label>
          <Input
            type="password"
            id="password"
            name="password"
            autoComplete="off"
            placeholder="Votre mot de passe"
            className="w-full bg-transparent text-gray-600 outline-none border border-gray-600 placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0"
          />
          <div className="flex flex-col items-start gap-2">
            {state?.errors?.password?.map(
              (passError: string, index: number) => {
                return (
                  <p
                    key={index}
                    className="flex text-xs text-red-500 line-clamp-1 mt-1"
                    aria-live="polite"
                  >
                    {passError}
                  </p>
                );
              }
            )}
          </div>
        </div>

        <LoginButton />
      </form>
    </main>
  );
}
