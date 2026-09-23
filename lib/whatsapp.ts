export function normalizeWhatsappNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  if (digits.startsWith("55") && (digits.length === 12 || digits.length === 13)) {
    return digits;
  }

  const brazilianNumber = digits.startsWith("0") ? digits.slice(1) : digits;
  if (brazilianNumber.length === 10 || brazilianNumber.length === 11) {
    return `55${brazilianNumber}`;
  }

  return digits;
}

export function createWhatsappUrl(number: string, message: string): string | null {
  const normalizedNumber = normalizeWhatsappNumber(number);
  if (normalizedNumber.length < 10) return null;
  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`;
}
