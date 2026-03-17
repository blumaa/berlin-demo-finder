import { Demo, TopicCategory } from "@/lib/types";
import { classifyTopic } from "@/lib/analytics/topicClassifier";

export function getDemoCategory(demo: Demo): TopicCategory {
  const topicForClassification =
    "originalTopic" in demo
      ? (demo as Demo & { originalTopic: string }).originalTopic
      : demo.topic;
  return classifyTopic(topicForClassification);
}
