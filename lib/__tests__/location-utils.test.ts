import { describe, it, expect } from "vitest";
import { extractCoordsFromGoogleMaps, parseDMSCoordinates } from "../utils";

describe("parseDMSCoordinates", () => {
  it("parses standard DMS coordinates with S and W indicators", () => {
    const coords = parseDMSCoordinates(`23°33'01.9"S 46°38'00.0"W`);
    expect(coords).not.toBeNull();
    expect(coords?.latitude).toBeCloseTo(-23.550528, 4);
    expect(coords?.longitude).toBeCloseTo(-46.633333, 4);
  });

  it("parses DMS coordinates with comma and Portuguese O (Oeste)", () => {
    const coords = parseDMSCoordinates(`23°33'01.9"S, 46°38'00.0"O`);
    expect(coords).not.toBeNull();
    expect(coords?.latitude).toBeCloseTo(-23.550528, 4);
    expect(coords?.longitude).toBeCloseTo(-46.633333, 4);
  });

  it("parses DMM (Degrees Decimal Minutes) format", () => {
    const coords = parseDMSCoordinates(`23°33.031'S, 46°38.000'W`);
    expect(coords).not.toBeNull();
    expect(coords?.latitude).toBeCloseTo(-23.550517, 4);
    expect(coords?.longitude).toBeCloseTo(-46.633333, 4);
  });

  it("parses decimal degrees with cardinal letters", () => {
    const coords = parseDMSCoordinates(`23.55052S, 46.63330W`);
    expect(coords).not.toBeNull();
    expect(coords?.latitude).toBe(-23.55052);
    expect(coords?.longitude).toBe(-46.6333);
  });
});

describe("extractCoordsFromGoogleMaps", () => {
  it("prioritizes exact place pin Protobuf coords (!3d / !4d) over camera center (@lat,lon)", () => {
    // Typical Google Maps URL with BOTH camera viewport center (@-23.5000,-46.6000) AND exact pin (!3d-23.5876!4d-46.6543)
    const mobileExpandedUrl =
      "https://www.google.com/maps/place/Arena+XP/@-23.500000,-46.600000,15z/data=!3m1!4b1!4m6!3m5!1s0x...:0x...!8m2!3d-23.587654!4d-46.654321";

    const coords = extractCoordsFromGoogleMaps(mobileExpandedUrl);
    expect(coords).not.toBeNull();
    // Must return the exact pin (-23.587654, -46.654321), NOT the camera center (-23.500000, -46.600000)
    expect(coords?.latitude).toBe(-23.587654);
    expect(coords?.longitude).toBe(-46.654321);
  });

  it("handles dropped pin in the middle of a football pitch with custom name / unindexed area", () => {
    // Dropped pin URL generated when clicking on an open field
    const droppedPinUrl =
      "https://www.google.com/maps/place/Campo+do+Pilar/@-23.550520,-46.633300,18z/data=!4m6!3m5!1s0x0:0x0!8m2!3d-23.550520!4d-46.633300";
    const coords = extractCoordsFromGoogleMaps(droppedPinUrl);
    expect(coords).toEqual({ latitude: -23.55052, longitude: -46.6333 });
  });

  it("handles dropped pin without name (raw coordinates in place URL)", () => {
    const rawPlaceUrl =
      "https://www.google.com/maps/place/-23.550520,-46.633300/@-23.550520,-46.633300,18z/data=!3m1!4b1!4m4!3m3!8m2!3d-23.550520!4d-46.633300";
    const coords = extractCoordsFromGoogleMaps(rawPlaceUrl);
    expect(coords).toEqual({ latitude: -23.55052, longitude: -46.6333 });
  });

  it("extracts coordinates from DMS encoded in Google Maps URL", () => {
    const dmsUrl =
      "https://www.google.com/maps/place/23%C2%B033'01.9%22S+46%C2%B038'00.0%22W/@-23.55052,-46.6333,18z/data=!4m4!3m3!8m2!3d-23.5505278!4d-46.6333333";
    const coords = extractCoordsFromGoogleMaps(dmsUrl);
    expect(coords).not.toBeNull();
    expect(coords?.latitude).toBeCloseTo(-23.550528, 4);
    expect(coords?.longitude).toBeCloseTo(-46.633333, 4);
  });

  it("extracts coordinates from viewport-only URL when clicking on a field (@lat,lon)", () => {
    const viewportUrl = "https://www.google.com/maps/@-23.550520,-46.633300,18z";
    const coords = extractCoordsFromGoogleMaps(viewportUrl);
    expect(coords).toEqual({ latitude: -23.55052, longitude: -46.6333 });
  });

  it("extracts coordinates from directions URL with !1d lon !2d lat", () => {
    const dirUrl = "https://www.google.com/maps/dir//-23.55052,-46.6333/data=!4m2!4m1!3e0!1d-46.6333!2d-23.55052";
    const coords = extractCoordsFromGoogleMaps(dirUrl);
    expect(coords).toEqual({ latitude: -23.55052, longitude: -46.6333 });
  });

  it("extracts coordinates from share sheet text pasted from mobile apps with emojis", () => {
    const shareText =
      "📍 Veja o campo no Google Maps: https://www.google.com/maps/place/Campo/@-23.55052,-46.63330,17z.";
    const coords = extractCoordsFromGoogleMaps(shareText);
    expect(coords).not.toBeNull();
    expect(coords?.latitude).toBe(-23.55052);
    expect(coords?.longitude).toBe(-46.6333);
  });

  it("extracts coordinates from direct lat,lon input with spaces and parentheses", () => {
    const coords = extractCoordsFromGoogleMaps(" (-23.55052 , -46.6333) ");
    expect(coords).toEqual({ latitude: -23.55052, longitude: -46.6333 });
  });

  it("extracts coordinates from query parameters (q, query, ll, destination, loc)", () => {
    const url1 = "https://www.google.com/maps/search/?api=1&query=-23.55052%2C-46.6333";
    expect(extractCoordsFromGoogleMaps(url1)).toEqual({ latitude: -23.55052, longitude: -46.6333 });

    const url2 = "https://maps.google.com/?q=loc:-23.55052,-46.6333";
    expect(extractCoordsFromGoogleMaps(url2)).toEqual({ latitude: -23.55052, longitude: -46.6333 });

    const url3 = "https://maps.google.com/maps?ll=-23.55052,-46.6333&z=17";
    expect(extractCoordsFromGoogleMaps(url3)).toEqual({ latitude: -23.55052, longitude: -46.6333 });
  });

  it("extracts coordinates from Apple Maps links", () => {
    const url = "https://maps.apple.com/?ll=-23.55052,-46.6333&q=Campo+de+Futebol";
    const coords = extractCoordsFromGoogleMaps(url);
    expect(coords).toEqual({ latitude: -23.55052, longitude: -46.6333 });
  });

  it("extracts coordinates from Waze links", () => {
    const url = "https://waze.com/ul?to=ll.-23.55052,-46.6333&navigate=yes";
    const coords = extractCoordsFromGoogleMaps(url);
    expect(coords).toEqual({ latitude: -23.55052, longitude: -46.6333 });
  });

  it("returns null for non-map URLs or invalid text", () => {
    expect(extractCoordsFromGoogleMaps("https://google.com")).toBeNull();
    expect(extractCoordsFromGoogleMaps("texto aleatorio sem link")).toBeNull();
    expect(extractCoordsFromGoogleMaps("123456")).toBeNull();
  });
});

