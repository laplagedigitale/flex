"use client";

import { FormEventHandler, useCallback, useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";

export default function Home() {
  const auth = useAuth();
  const [status, setStatus] = useState<"filling" | "submitting" | "submitted">(
    "filling"
  );

  useEffect(() => {
    if (auth.isLoading || auth.error || auth.isAuthenticated) {
      console.log({ auth });
      return;
    }
    console.log("redirecting to login");
    auth.signinRedirect();
  }, [auth]);

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (e) => {
      e.preventDefault();

      if (!auth.user) return;
      const formData = new FormData(e.currentTarget);
      const time = formData.get("time");
      setStatus("submitting");
      try {
        await fetch("https://automations.laplagedigitale.fr/webhook/new-flex", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.user.access_token}`,
          },
          body: JSON.stringify({
            time: time,
          }),
        });
        setStatus("submitted");
      } catch (err) {
        setStatus("filling");
        return;
      }
    },
    [auth.user]
  );

  if (!auth.user) {
    return null;
  }

  if (status === "submitted") {
    return "merci";
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <div className="mt-2">
          <label className="text-base font-semibold text-gray-900">
            Temps passé
          </label>
          <fieldset className="mt-4">
            <legend className="sr-only">
              Comment de temps comptes-tu rester dans le flex ?
            </legend>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="half-day"
                  name="time"
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  value="half-day"
                />
                <label
                  htmlFor="half-day"
                  className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                >
                  Une demi-journée
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="day"
                  name="time"
                  type="radio"
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  value="day"
                />
                <label
                  htmlFor="day"
                  className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                >
                  Une journée
                </label>
              </div>
            </div>
          </fieldset>
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {"M'enregistrer"}
        </button>
      </div>
    </form>
  );
}
