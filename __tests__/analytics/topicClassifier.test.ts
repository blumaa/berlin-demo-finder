import { classifyTopic } from "@/lib/analytics/topicClassifier";

describe("classifyTopic", () => {
  it("classifies housing topics", () => {
    expect(classifyTopic("Gegen Mieterverdrängung")).toBe("Housing");
    expect(classifyTopic("Wohnraum für alle")).toBe("Housing");
    expect(classifyTopic("Enteignung großer Wohnkonzerne")).toBe("Housing");
  });

  it("classifies climate topics", () => {
    expect(classifyTopic("Klimastreik - Fridays for Future")).toBe("Climate");
    expect(classifyTopic("Umweltschutz jetzt")).toBe("Climate");
  });

  it("classifies international solidarity topics", () => {
    expect(classifyTopic("Solidarität mit der Ukraine")).toBe(
      "International Solidarity"
    );
    expect(classifyTopic("Freiheit für Palästina")).toBe(
      "International Solidarity"
    );
  });

  it("classifies anti-fascism topics", () => {
    expect(classifyTopic("Gegen Rechtsextremismus & für Demokratie")).toBe(
      "Anti-Fascism"
    );
    expect(classifyTopic("Kein Platz für Nazis")).toBe("Anti-Fascism");
  });

  it("classifies labor topics", () => {
    expect(classifyTopic("Streik der Krankenhausbeschäftigten")).toBe("Labor");
    expect(classifyTopic("Faire Löhne für alle")).toBe("Labor");
  });

  it("classifies commemoration topics", () => {
    expect(
      classifyTopic("Gedenken an die Opfer des Nationalsozialismus")
    ).toBe("Commemoration");
  });

  it("classifies gender & LGBTQ+ topics", () => {
    expect(classifyTopic("Christopher Street Day Pride")).toBe(
      "Gender & LGBTQ+"
    );
    expect(classifyTopic("Feminismus ist für alle")).toBe("Gender & LGBTQ+");
  });

  it("returns Other for unmatched topics", () => {
    expect(classifyTopic("Allgemeine Kundgebung")).toBe("Other");
  });
});
