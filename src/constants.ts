export const durationMs = 5000 as const;
export const inputColor = "#41ae6e" as const;
export const input = "0123456789" as const;
export const fontDefaults = {
  family: `"Courier New", Courier, monospace`,
  size: 16,
} as const;
export const fontSizeDefault = "16" as const;
export const randMultipliers = {
  input: input.length,
  sleep: 200,
} as const;

export const straplineLines = ["Animated with 💚", "by Miles Nash"] as const;
