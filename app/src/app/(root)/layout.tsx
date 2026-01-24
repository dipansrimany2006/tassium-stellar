import CoreLayout from "@/component/layout/core-layout";
import { WalletProvider } from "@/context/wallet-context";

export default function RootGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WalletProvider>
      <CoreLayout>{children}</CoreLayout>
    </WalletProvider>
  );
}
