export async function submitAudit(formData: FormData) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/submit`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Submission failed");
  }

  return response.json();
}
