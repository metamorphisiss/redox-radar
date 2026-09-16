export const palette = {
  clay: "#6366F1",
  sand: "#A78BFA",
  teal: "#60A5FA",
  ink: "#111111",
  cream: "#F2F0E8",
};

export const participants = Array.from({ length: 12 }, (_, i) => {
  const isCase = i < 6;
  const scores = isCase
    ? [58 + i * 4, 64 - i * 2, 49 + i * 5]
    : [24 + i * 2, 28 + i, 20 + i];
  const status = isCase
    ? i === 0
      ? "Action"
      : i < 3
        ? "Converging"
        : "Watch"
    : "Stable";
  return {
    id: `P-${4821 + i * 37}`,
    age: 27 + i * 2,
    city: ["Mumbai", "Delhi NCR", "Bengaluru", "Chennai", "Hyderabad", "Pune"][
      i % 6
    ],
    work:
      i % 3 === 0
        ? "Desk-based"
        : i % 3 === 1
          ? "Mixed/field-based"
          : "Manual/physical",
    group: isCase ? "Case" : "Control",
    scores,
    status,
    confidence: isCase && i < 2 ? "Moderate" : "High",
    completeness: 84 + ((i * 3) % 15),
    days: 30,
  };
});
