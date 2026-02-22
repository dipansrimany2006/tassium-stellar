import Navbar from "@/components/navbar";
import { WalletProvider } from "@/context/wallet-context";

const CoreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <WalletProvider>
      <div className="w-full min-h-screen bg-neutral-900 flex flex-col items-center">
        <div className="max-w-6xl w-full py-4">
          <Navbar />
          <main className="py-4">{children}</main>
        </div>
      </div>
    </WalletProvider>
  );
};

export default CoreLayout;
