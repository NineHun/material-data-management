const DAY_NAMES_ID = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
const EMOJI_BY_PHASE = { morning: "☀️", noon: "🌤️", afternoon: "🌇", evening: "🌙" };
function phaseByHour(h) {
  if (h < 11) return "morning";
  if (h < 15) return "noon";
  if (h < 19) return "afternoon";
  return "evening";
}
function seededPick(arr, seed) {return arr[seed % arr.length];}

export function getGreeting(name, date = new Date()) {
  const h = date.getHours();
  const phase = phaseByHour(h);
  const seed = Number(`${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`);
  const variants = {
    morning: ["Selamat pagi", "Pagi, semangat", "Good morning"],
    noon: ["Selamat siang", "Siang, tetap semangat"],
    afternoon: ["Selamat sore", "Sore yang produktif"],
    evening: ["Selamat malam", "Malam, rehat sejenak"],
  };
  const base = seededPick(variants[phase], seed);
  const day = DAY_NAMES_ID[date.getDay()];
  const subs = [
    `Selamat ${day}!`,
    "Semoga harimu lancar.",
    "Jaga fokus & hidrasi ya.",
    "Ada target spesial hari ini?",
  ];
  const subtitle = seededPick(subs, seed + 1);
  return { title: `${base}, ${name} ${EMOJI_BY_PHASE[phase]}`, subtitle };
}