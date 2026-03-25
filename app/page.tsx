import EntryKernel from "@/components/EntryKernel"
import ParticleNetwork from "@/components/ParticleNetwork"
import Footer from "@/components/Footer"
import Image from "next/image"

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-bg text-textPrimary px-8">
      <ParticleNetwork />

      <div className="absolute top-10 z-20">
        <Image 
          src="/Logo1.png" 
          alt="SYNTX" 
          width={80} 
          height={80}
          className="opacity-90"
        />
      </div>

      <EntryKernel />
      <Footer />
    </main>
  )
}
