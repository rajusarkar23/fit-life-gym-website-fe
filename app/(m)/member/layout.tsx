export default function MemberLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <div>Member Area</div>
      {children}
    </div>
  );
}
