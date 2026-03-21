import { TopicCategory } from "@/lib/types";

const CATEGORY_PATTERNS: [TopicCategory, RegExp][] = [
  ["Housing", /miete|wohn|enteign|räumung|gentri/i],
  ["Climate", /klima|umwelt|letzte.generation|fridays/i],
  [
    "International Solidarity",
    /iran|palästin|israel|gaza|ukraine|krieg|solidarität/i,
  ],
  ["Anti-Fascism", /nazi|rechts|antifa|faschis|afd/i],
  ["Labor", /arbeit|streik|lohn|löhn|gewerkschaft|tarif/i],
  ["Commemoration", /gedenk|erinnerung|mahnung|opfer/i],
  ["Gender & LGBTQ+", /queer|pride|lgbtq|frauen|feminis/i],
];

const categoryCache = new Map<string, TopicCategory>();

export function classifyTopic(topic: string): TopicCategory {
  const cached = categoryCache.get(topic);
  if (cached) return cached;

  for (const [category, pattern] of CATEGORY_PATTERNS) {
    if (pattern.test(topic)) {
      categoryCache.set(topic, category);
      return category;
    }
  }
  categoryCache.set(topic, "Other");
  return "Other";
}
