// Free WhatsApp integration via wa.me deep links (no Business API needed)

const DEFAULT_COUNTRY_CODE = "966";

// Normalizes a phone number into wa.me format: digits only, with country code.
// "05XXXXXXXX" -> "9665XXXXXXXX", "+966 5X..." -> "9665X...", "00966..." -> "966..."
export function formatWhatsAppPhone(phone: string) {
  let digits = phone.replace(/\D/g, "");

  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith(DEFAULT_COUNTRY_CODE)) return digits;
  if (digits.startsWith("0")) digits = digits.slice(1);

  // Local Saudi mobile numbers are 9 digits starting with 5
  if (digits.length === 9 && digits.startsWith("5")) {
    return DEFAULT_COUNTRY_CODE + digits;
  }
  return digits;
}

export function generateWhatsAppChatUrl(phone: string, message?: string) {
  const base = `https://wa.me/${formatWhatsAppPhone(phone)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

type ReceiptParams = {
  phone: string;
  customerName: string;
  packageName: string;
  expiryDate?: string | null;
  price?: number | string | null;
};

export function generateWhatsAppReceiptUrl({
  phone,
  customerName,
  packageName,
  expiryDate,
  price,
}: ReceiptParams) {
  const expiry = expiryDate
    ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(
        new Date(expiryDate),
      )
    : null;
  const hasPrice = price !== undefined && price !== null && price !== "";

  const lines = [
    `مرحباً ${customerName} 👋`,
    "شكراً لاشتراكك معنا! تم تفعيل اشتراكك بنجاح ✅",
    "",
    `📦 الباقة: ${packageName}`,
    hasPrice ? `💰 السعر: ${price} ر.س` : null,
    expiry ? `📅 تاريخ الانتهاء: ${expiry}` : null,
    "",
    "———",
    "",
    `Hello ${customerName} 👋`,
    "Thank you for subscribing! Your subscription is now active ✅",
    "",
    `📦 Package: ${packageName}`,
    hasPrice ? `💰 Price: ${price} SAR` : null,
    expiry ? `📅 Expires: ${expiry}` : null,
    "",
    "Bareeq 🚗✨",
  ].filter((line) => line !== null);

  return generateWhatsAppChatUrl(phone, lines.join("\n"));
}

export function openWhatsApp(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}
