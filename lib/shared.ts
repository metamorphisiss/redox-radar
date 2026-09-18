export const palette = {
  clay: "#6366F1",
  sand: "#A78BFA",
  teal: "#60A5FA",
  ink: "#111111",
  cream: "#F2F0E8",
};

const cities = ["Mumbai", "Delhi NCR", "Bengaluru", "Chennai", "Hyderabad", "Pune", "Ahmedabad", "Kolkata", "Jaipur"];

export const participants = Array.from({ length: 60 }, (_, i) => {
  const isCase = i < 30;
  const scores = isCase
    ? [55 + (i % 6) * 5, 62 - (i % 5) * 3, 47 + (i % 7) * 4]
    : [22 + (i % 4) * 3, 26 + (i % 3) * 2, 18 + (i % 5) * 2];
  const status = isCase
    ? i < 5
      ? "Action"
      : i < 15
        ? "Converging"
        : "Watch"
    : "Stable";
  const heightCm = 158 + (i % 24);
  const weightKg = 52 + (i % 35);
  const adherence = isCase ? 88 + (i % 10) : 93 + (i % 7);
  const streak = Math.max(0, 14 - (i % 7));
  return {
    id: `P-${4821 + i * 37}`,
    age: 24 + (i % 18),
    city: cities[i % cities.length],
    work:
      i % 3 === 0
        ? "Desk-based"
        : i % 3 === 1
          ? "Mixed/field-based"
          : "Manual/physical",
    group: isCase ? "Case" : "Control",
    scores,
    status,
    confidence: isCase && i < 10 ? "Moderate" : "High",
    completeness: 84 + ((i * 3) % 15),
    days: 30,
    heightCm,
    weightKg,
    adherence,
    streak,
  };
});
