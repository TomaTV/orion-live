export default function LoginBackground() {
  return (
    <div className="absolute inset-0 w-full h-full bg-orion-dark-bg overflow-hidden">
      {/* Gradient principal */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(92, 77, 255, 0.15) 0%, transparent 70%)",
        }}
      />

      {/* Éléments visuels minimalistes */}
      <div
        className="absolute top-0 left-0 w-[50%] h-[50%] opacity-[0.07]"
        style={{
          background:
            "linear-gradient(45deg, transparent, rgba(92, 77, 255, 0.3))",
          borderRadius: "37% 63% 70% 30% / 30% 40% 70% 70%",
          filter: "blur(3px)",
          transform: "translate(-20%, -20%)",
        }}
      />

      <div
        className="absolute bottom-0 right-0 w-[60%] h-[60%] opacity-[0.07]"
        style={{
          background:
            "linear-gradient(45deg, rgba(92, 77, 255, 0.3), transparent)",
          borderRadius: "67% 33% 30% 70% / 60% 40% 60% 40%",
          filter: "blur(3px)",
          transform: "translate(20%, 20%)",
        }}
      />
    </div>
  );
}
