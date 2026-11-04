/** Téléchargement d'un fichier produit dans le navigateur (aucun envoi sur Internet). */
export function telechargerBlob(blob: Blob, nom: string): void {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = nom;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
}
