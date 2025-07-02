export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          context_type: string | null
          created_at: string
          id: string
          is_active: boolean | null
          summary: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          context_type?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          summary?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          context_type?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          summary?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string
          files_context: Json | null
          id: string
          model_used: string | null
          sender: string
          token_count: number | null
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string
          files_context?: Json | null
          id?: string
          model_used?: string | null
          sender: string
          token_count?: number | null
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string
          files_context?: Json | null
          id?: string
          model_used?: string | null
          sender?: string
          token_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_tasks: {
        Row: {
          context: Json | null
          conversation_id: string | null
          created_at: string
          description: string | null
          id: string
          status: string | null
          task_type: string
          updated_at: string
        }
        Insert: {
          context?: Json | null
          conversation_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          status?: string | null
          task_type: string
          updated_at?: string
        }
        Update: {
          context?: Json | null
          conversation_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          status?: string | null
          task_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_tasks_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          created_at: string | null
          creator_id: string
          description: string | null
          end_time: string
          event_type: Database["public"]["Enums"]["event_type"] | null
          id: string
          location: string | null
          meeting_type: Database["public"]["Enums"]["meeting_type"] | null
          parent_event_id: string | null
          poll_id: string | null
          recurrence_end: string | null
          recurrence_type: Database["public"]["Enums"]["recurrence_type"] | null
          start_time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          description?: string | null
          end_time: string
          event_type?: Database["public"]["Enums"]["event_type"] | null
          id?: string
          location?: string | null
          meeting_type?: Database["public"]["Enums"]["meeting_type"] | null
          parent_event_id?: string | null
          poll_id?: string | null
          recurrence_end?: string | null
          recurrence_type?:
            | Database["public"]["Enums"]["recurrence_type"]
            | null
          start_time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          description?: string | null
          end_time?: string
          event_type?: Database["public"]["Enums"]["event_type"] | null
          id?: string
          location?: string | null
          meeting_type?: Database["public"]["Enums"]["meeting_type"] | null
          parent_event_id?: string | null
          poll_id?: string | null
          recurrence_end?: string | null
          recurrence_type?:
            | Database["public"]["Enums"]["recurrence_type"]
            | null
          start_time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_parent_event_id_fkey"
            columns: ["parent_event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "meeting_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      company_reports: {
        Row: {
          author: string
          content: string | null
          created_at: string
          description: string | null
          id: string
          report_type: string
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          report_type?: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          report_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_attendees: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_reminders: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          reminder_time: string
          sent: boolean | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          reminder_time: string
          sent?: boolean | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          reminder_time?: string
          sent?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "event_reminders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "calendar_events"
            referencedColumns: ["id"]
          },
        ]
      }
      gantt_items: {
        Row: {
          assignee: string
          created_at: string | null
          dependencies: string[] | null
          description: string | null
          end_date: string
          id: string
          parent_id: string | null
          priority: Database["public"]["Enums"]["gantt_item_priority"] | null
          progress: number | null
          resources: string[] | null
          start_date: string
          status: Database["public"]["Enums"]["gantt_item_status"] | null
          title: string
          type: Database["public"]["Enums"]["gantt_item_type"] | null
          updated_at: string | null
        }
        Insert: {
          assignee: string
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          end_date: string
          id?: string
          parent_id?: string | null
          priority?: Database["public"]["Enums"]["gantt_item_priority"] | null
          progress?: number | null
          resources?: string[] | null
          start_date: string
          status?: Database["public"]["Enums"]["gantt_item_status"] | null
          title: string
          type?: Database["public"]["Enums"]["gantt_item_type"] | null
          updated_at?: string | null
        }
        Update: {
          assignee?: string
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          end_date?: string
          id?: string
          parent_id?: string | null
          priority?: Database["public"]["Enums"]["gantt_item_priority"] | null
          progress?: number | null
          resources?: string[] | null
          start_date?: string
          status?: Database["public"]["Enums"]["gantt_item_status"] | null
          title?: string
          type?: Database["public"]["Enums"]["gantt_item_type"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gantt_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "gantt_items"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base_articles: {
        Row: {
          author: string
          category:
            | Database["public"]["Enums"]["knowledge_base_category"]
            | null
          content: string | null
          created_at: string | null
          description: string | null
          id: string
          read_time: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author: string
          category?:
            | Database["public"]["Enums"]["knowledge_base_category"]
            | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          read_time?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string
          category?:
            | Database["public"]["Enums"]["knowledge_base_category"]
            | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          read_time?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      knowledge_base_links: {
        Row: {
          created_at: string | null
          id: string
          title: string
          type: Database["public"]["Enums"]["link_type"] | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          title: string
          type?: Database["public"]["Enums"]["link_type"] | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string
          type?: Database["public"]["Enums"]["link_type"] | null
          url?: string | null
        }
        Relationships: []
      }
      latest_updates: {
        Row: {
          attachments: string[] | null
          author: string
          content: string
          created_at: string | null
          department: string | null
          id: string
          preview: string
          priority: Database["public"]["Enums"]["update_priority"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          attachments?: string[] | null
          author: string
          content: string
          created_at?: string | null
          department?: string | null
          id?: string
          preview: string
          priority?: Database["public"]["Enums"]["update_priority"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          attachments?: string[] | null
          author?: string
          content?: string
          created_at?: string | null
          department?: string | null
          id?: string
          preview?: string
          priority?: Database["public"]["Enums"]["update_priority"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      meeting_polls: {
        Row: {
          created_at: string | null
          creator_id: string
          deadline: string
          description: string | null
          id: string
          selected_option_id: string | null
          status: Database["public"]["Enums"]["poll_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          deadline: string
          description?: string | null
          id?: string
          selected_option_id?: string | null
          status?: Database["public"]["Enums"]["poll_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          deadline?: string
          description?: string | null
          id?: string
          selected_option_id?: string | null
          status?: Database["public"]["Enums"]["poll_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      milestones: {
        Row: {
          assignee: string
          created_at: string
          description: string | null
          due_date: string
          id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assignee: string
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assignee?: string
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      poll_attendees: {
        Row: {
          created_at: string | null
          id: string
          is_required: boolean | null
          poll_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          poll_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_required?: boolean | null
          poll_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_attendees_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "meeting_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_options: {
        Row: {
          created_at: string | null
          end_time: string
          id: string
          poll_id: string | null
          start_time: string
        }
        Insert: {
          created_at?: string | null
          end_time: string
          id?: string
          poll_id?: string | null
          start_time: string
        }
        Update: {
          created_at?: string | null
          end_time?: string
          id?: string
          poll_id?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "meeting_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_responses: {
        Row: {
          created_at: string | null
          id: string
          option_id: string | null
          poll_id: string | null
          updated_at: string | null
          user_id: string
          vote: Database["public"]["Enums"]["vote_type"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          option_id?: string | null
          poll_id?: string | null
          updated_at?: string | null
          user_id: string
          vote: Database["public"]["Enums"]["vote_type"]
        }
        Update: {
          created_at?: string | null
          id?: string
          option_id?: string | null
          poll_id?: string | null
          updated_at?: string | null
          user_id?: string
          vote?: Database["public"]["Enums"]["vote_type"]
        }
        Relationships: [
          {
            foreignKeyName: "poll_responses_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poll_responses_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "meeting_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      project_knowledge_links: {
        Row: {
          id: string
          link_id: string | null
          project_id: string | null
        }
        Insert: {
          id?: string
          link_id?: string | null
          project_id?: string | null
        }
        Update: {
          id?: string
          link_id?: string | null
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_knowledge_links_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "knowledge_base_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_knowledge_links_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_tasks: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          in_progress: boolean | null
          name: string
          project_id: string | null
          sort_order: number | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          in_progress?: boolean | null
          name: string
          project_id?: string | null
          sort_order?: number | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          in_progress?: boolean | null
          name?: string
          project_id?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_tasks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          attachments: string[] | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          lead: string
          priority: Database["public"]["Enums"]["project_priority"] | null
          progress: number | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          team: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          lead: string
          priority?: Database["public"]["Enums"]["project_priority"] | null
          progress?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          team?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          attachments?: string[] | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          lead?: string
          priority?: Database["public"]["Enums"]["project_priority"] | null
          progress?: number | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          team?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      roadmap_items: {
        Row: {
          completion: number
          created_at: string
          description: string | null
          id: string
          quarter: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          completion?: number
          created_at?: string
          description?: string | null
          id?: string
          quarter: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          completion?: number
          created_at?: string
          description?: string | null
          id?: string
          quarter?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      task_assignments: {
        Row: {
          assignee: string
          completed: boolean
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string
          id: string
          priority: string
          project: string
          status: string
          task: string
          updated_at: string
        }
        Insert: {
          assignee: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          priority?: string
          project: string
          status?: string
          task: string
          updated_at?: string
        }
        Update: {
          assignee?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          priority?: string
          project?: string
          status?: string
          task?: string
          updated_at?: string
        }
        Relationships: []
      }
      update_knowledge_links: {
        Row: {
          id: string
          link_id: string | null
          update_id: string | null
        }
        Insert: {
          id?: string
          link_id?: string | null
          update_id?: string | null
        }
        Update: {
          id?: string
          link_id?: string | null
          update_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "update_knowledge_links_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "knowledge_base_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "update_knowledge_links_update_id_fkey"
            columns: ["update_id"]
            isOneToOne: false
            referencedRelation: "latest_updates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_ai_preferences: {
        Row: {
          created_at: string
          enable_conversation_summary: boolean | null
          id: string
          max_context_messages: number | null
          preferred_model: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          enable_conversation_summary?: boolean | null
          id?: string
          max_context_messages?: number | null
          preferred_model?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          enable_conversation_summary?: boolean | null
          id?: string
          max_context_messages?: number | null
          preferred_model?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      event_type: "meeting" | "deadline" | "reminder" | "other"
      gantt_item_priority: "High" | "Medium" | "Low"
      gantt_item_status: "Not Started" | "In Progress" | "Completed" | "On Hold"
      gantt_item_type: "milestone" | "task" | "subtask"
      knowledge_base_category:
        | "all"
        | "hr"
        | "engineering"
        | "sales"
        | "finance"
        | "operations"
        | "research-development"
        | "sustainability-compliance"
        | "marketing-brand"
        | "quality-testing"
      link_type: "document" | "image" | "guide" | "policy" | "other"
      meeting_type: "in-person" | "video-call" | "hybrid"
      poll_status: "active" | "closed" | "resolved"
      project_priority: "High" | "Medium" | "Low"
      project_status: "Planning" | "In Progress" | "Completed"
      recurrence_type: "none" | "daily" | "weekly" | "monthly"
      update_priority: "high" | "medium" | "low"
      vote_type: "available" | "busy" | "maybe"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      event_type: ["meeting", "deadline", "reminder", "other"],
      gantt_item_priority: ["High", "Medium", "Low"],
      gantt_item_status: ["Not Started", "In Progress", "Completed", "On Hold"],
      gantt_item_type: ["milestone", "task", "subtask"],
      knowledge_base_category: [
        "all",
        "hr",
        "engineering",
        "sales",
        "finance",
        "operations",
        "research-development",
        "sustainability-compliance",
        "marketing-brand",
        "quality-testing",
      ],
      link_type: ["document", "image", "guide", "policy", "other"],
      meeting_type: ["in-person", "video-call", "hybrid"],
      poll_status: ["active", "closed", "resolved"],
      project_priority: ["High", "Medium", "Low"],
      project_status: ["Planning", "In Progress", "Completed"],
      recurrence_type: ["none", "daily", "weekly", "monthly"],
      update_priority: ["high", "medium", "low"],
      vote_type: ["available", "busy", "maybe"],
    },
  },
} as const
