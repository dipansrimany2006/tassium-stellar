import Navbar from "@/components/navbar";

const CoreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full min-h-screen bg-neutral-900 flex flex-col items-center">
      <div className="max-w-6xl w-full py-4">
        <Navbar />
        <main className="py-4">{children}</main>
      </div>
    </div>
  );
};

export default CoreLayout;
