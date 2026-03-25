import EntryKernel from "@/components/EntryKernel"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-bg text-textPrimary px-8">
      <div className="absolute top-10 text-sm tracking-widest opacity-60 z-20">
        SYNTX
      </div>

      <EntryKernel />
      <Footer />
    </main>
  )
}
