"use client";

export function Hero3D() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-[-120px] top-[15%] z-0 hidden h-[420px] w-[420px] [perspective:900px] lg:block"
    >
      {/* Rotating 3D ring stack */}
      <div className="preserve-3d h-full w-full animate-spin-slow">
        <div
          className="absolute inset-[60px] rounded-full border border-[#999999]/25"
          style={{ transform: "rotateY(60deg) rotateX(70deg)", boxShadow: "0 0 60px rgba(153,153,153,0.15) inset" }}
        />
        <div
          className="absolute inset-[30px] rounded-full border border-[#999999]/20"
          style={{ transform: "rotateY(120deg) rotateX(25deg)", boxShadow: "0 0 40px rgba(153,153,153,0.1) inset" }}
        />
        <div
          className="absolute inset-0 rounded-full border border-[#999999]/30"
          style={{ transform: "rotateY(30deg) rotateX(55deg)", boxShadow: "0 0 80px rgba(153,153,153,0.2) inset" }}
        />
        {/* Floating core */}
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(180,180,180,0.5),rgba(153,153,153,0.08)_70%)] shadow-[0_0_50px_rgba(153,153,153,0.45)] animate-pulse" />
      </div>
    </div>
  );
}