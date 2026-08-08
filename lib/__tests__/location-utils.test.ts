import { describe, it, expect } from "vitest";
import { extractCoordsFromGoogleMaps } from "../utils";

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

  it("extracts coordinates from share sheet text pasted from mobile apps", () => {
    const shareText =
      "Veja este local no Google Maps: https://www.google.com/maps/place/Campo/@-23.55052,-46.63330,17z.";
    const coords = extractCoordsFromGoogleMaps(shareText);
    expect(coords).not.toBeNull();
    expect(coords?.latitude).toBe(-23.55052);
    expect(coords?.longitude).toBe(-46.6333);
  });

  it("extracts coordinates from direct lat,lon input", () => {
    const coords = extractCoordsFromGoogleMaps(" -23.55052 , -46.6333 ");
    expect(coords).toEqual({ latitude: -23.55052, longitude: -46.6333 });
  });

  it("extracts coordinates from query parameters (q, query, ll, destination)", () => {
    const url = "https://www.google.com/maps/search/?api=1&query=-23.55052%2C-46.6333";
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
  });
});
