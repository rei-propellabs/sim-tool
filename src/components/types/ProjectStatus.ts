export type ProjectStatusType = "overdue" | "behind" | "onTrack" | "completed" | "filesRequired" | "calculation" | "scenariosProcessing" | "simulationReady" | "presentationCompleted";

export const ProjectStatus: Record<ProjectStatusType, any> = {
  "overdue": {
    "text": "Overdue",
    "color": "#FF6E45"
  },
  "behind": {
    "text": "Behind",
    "color": "#F7C368"
  },
  "onTrack": {
    "text": "On Track",
    "color": "#C7DBC9"
  },
  "completed": {
    "text": "Completed",
    "color": "#68DDD2"
  },
  "filesRequired": {
    "text": "Files Required",
    "color": "#C7DBC9"
  },
  "calculation": {
    "text": "Calculation",
    "color": "#37BA74"
  },
  "scenariosProcessing": {
    "text": "Scenarios Processing",
    "color": "#C7DBC9"
  },
  "simulationReady": {
    "text": "Simulation Ready",
    "color": "#68DDD2"
  },
  "presentationCompleted": {
    "text": "Presentation Completed",
    "color": "#37BA74"
  },
}
