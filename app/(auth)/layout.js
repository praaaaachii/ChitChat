import { Inter } from "next/font/google";

import "../globals.css";
import ToasterContext from "@components/ToasterContext";
import Provider from "@components/Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Auth ChitChat",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-blue-4`}>
        <Provider>
          {/* imported this toast component because we want an overlay whenever the toast is created */}
          <ToasterContext />
          {children}
        </Provider>
      </body>
    </html>
  );
}
