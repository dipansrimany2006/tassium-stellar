import CoreLayout from "@/components/layout/core-layout";

export default function RootGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CoreLayout>{children}</CoreLayout>;
}
