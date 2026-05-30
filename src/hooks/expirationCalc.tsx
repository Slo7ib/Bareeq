export const expirationCalc = (washType: "monthly" | "per_wash") => {
  if (washType === "monthly") {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    return expiresAt.toISOString();
  } else {
    return null;
  }
};
