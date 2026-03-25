import EntryKernel from "@/components/EntryKernel"
import ParticleNetwork from "@/components/ParticleNetwork"
import Footer from "@/components/Footer"
import Image from "next/image"

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-bg text-textPrimary px-8">
      <ParticleNetwork />

      <div className="absolute top-10 z-20 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full border-2 border-accent/30 animate-pulse" style={{ padding: '8px' }} />
          <div className="relative rounded-full border border-accent/20 p-2 bg-bg/50 backdrop-blur-sm overflow-hidden">
            <Image 
              src="/Logo1.png" 
              alt="SYNTX" 
              width={120} 
              height={120}
              className="opacity-90 rounded-full"
            />
          </div>
        </div>
      </div>

      <EntryKernel />
      <Footer />
    </main>
  )
}
