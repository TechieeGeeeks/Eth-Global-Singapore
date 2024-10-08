import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import DynamicWrapper from "@/dynamic/dynamicWrapper";
import ReduxProvider from "@/redux/reduxProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Eth Singapore",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <DynamicWrapper>
          <ReduxProvider>{children}</ReduxProvider>
          <Toaster />
        </DynamicWrapper>
      </body>
    </html>
  );
}
