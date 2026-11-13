export function AuthDivider({ text = "Or continue with" }: { text?: string }) {
  return (
    <div className="relative my-5">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200/80" />
      </div>
      <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
        <span className="bg-white px-3 text-gray-400">{text}</span>
      </div>
    </div>
  );
}
