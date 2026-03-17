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

export function classifyTopic(topic: string): TopicCategory {
  for (const [category, pattern] of CATEGORY_PATTERNS) {
    if (pattern.test(topic)) return category;
  }
  return "Other";
}
