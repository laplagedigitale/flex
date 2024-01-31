"use client";

import "./globals.css";
import Image from "next/image";
import Logo from "./logo.png";

import { AuthProvider } from "react-oidc-context";

const oidcConfig = {
  authority: "https://id.laplagedigitale.fr/application/o/flex/",
  client_id: "xB3OPRB5MoXRMSWeITHAcuAoJqfzFUBTNMaFComa",
  redirect_uri: new URL(
    "/callback",
    typeof window === "undefined" ? undefined : window.location.origin,
  ).toString(),
  scope: "openid profile email",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider {...oidcConfig}>
      <html>
        <head>
          <meta charSet="UTF-8" />
          <title>La Plage Digitale</title>
        </head>
        <body>
          <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <Image
                unoptimized
                className="mx-auto h-14 w-auto"
                src={Logo}
                alt="La Plage Digitale"
                width="285"
                height="85"
              />
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Bienvenue plagiste !
              </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              {children}
            </div>
          </div>
        </body>
      </html>
    </AuthProvider>
  );
}
