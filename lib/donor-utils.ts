export function resolveDonorName(
  tx: {
    user_id?: string | null;
    user?: { full_name?: string | null } | null;
    user_name?: string | null;
    account_name?: string | null;
    donation?: { title?: string; account_name?: string } | null;
    drive?: { title?: string; account_name?: string } | null;
  },
  fallback = "Anonymous"
): string {
  if (tx.user?.full_name?.trim()) return tx.user.full_name.trim();
  if (!tx.user_id) return fallback;

  const raw = (tx.user_name || tx.account_name || "").trim();
  const lower = raw.toLowerCase();
  const drive = tx.donation || tx.drive;
  const driveTitle = drive?.title?.trim().toLowerCase();
  const driveAccount = drive?.account_name?.trim().toLowerCase();

  if (
    !raw ||
    lower === "anonymous" ||
    lower === "anonymous donor" ||
    lower === "donation" ||
    lower === "general donation" ||
    lower === "jamia mosque nairobi" ||
    lower === "edu" ||
    (driveTitle && lower === driveTitle) ||
    (driveAccount && lower === driveAccount)
  ) {
    return fallback;
  }

  return raw;
}

