import Navbar from "@/component/navbar";

const CoreLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default CoreLayout;
