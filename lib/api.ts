export async function submitEntry(formData: FormData) {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/submit",
    { method: "POST", body: formData }
  )
  
  if (!res.ok) {
    throw new Error("Submission failed")
  }
  
  return res.json()
}
