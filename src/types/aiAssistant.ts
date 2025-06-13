
export interface AIAssistantProps {
  knowledgeBaseContext: string;
  onNavigate: (page: string) => void;
  onCreateUpdate: (updateData: any) => Promise<void>;
  onEditUpdate: (updateData: any) => Promise<void>;
  onDeleteUpdate: (updateId: string, title: string) => Promise<void>;
  onCreateProject: (projectData: any) => Promise<void>;
  onEditProject: (projectData: any) => Promise<void>;
  onDeleteProject: (projectId: string, title: string) => Promise<void>;
  onCreateGanttItem: (itemData: any) => Promise<void>;
  onEditGanttItem: (itemData: any) => Promise<void>;
  onDeleteGanttItem: (itemId: string, title: string) => Promise<void>;
  isManagingUpdates: boolean;
  isManagingProjects: boolean;
  isManagingGantt: boolean;
  onNewMessage: () => void;
  hasNewMessage: boolean;
  onMessageRead: () => void;
}
