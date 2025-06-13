
export interface AIAssistantProps {
  knowledgeBaseContext: string;
  onNavigate: (page: string) => void;
  onCreateUpdate?: (update: any) => void;
  onEditUpdate?: (update: any) => void;
  onDeleteUpdate?: (updateId: string, title: string) => void;
  onCreateProject?: (project: any) => void;
  onEditProject?: (project: any) => void;
  onDeleteProject?: (projectId: string, title: string) => void;
  onCreateGanttItem?: (item: any) => void;
  onEditGanttItem?: (item: any) => void;
  onDeleteGanttItem?: (itemId: string, title: string) => void;
  isManagingUpdates?: boolean;
  isManagingProjects?: boolean;
  isManagingGantt?: boolean;
  onNewMessage?: () => void;
  hasNewMessage?: boolean;
  onMessageRead?: () => void;
}
