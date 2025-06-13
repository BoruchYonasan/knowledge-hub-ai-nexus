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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
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
      link_type: "document" | "image" | "guide" | "policy" | "other"
      project_priority: "High" | "Medium" | "Low"
      project_status: "Planning" | "In Progress" | "Completed"
      update_priority: "high" | "medium" | "low"
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
      ],
      link_type: ["document", "image", "guide", "policy", "other"],
      project_priority: ["High", "Medium", "Low"],
      project_status: ["Planning", "In Progress", "Completed"],
      update_priority: ["high", "medium", "low"],
    },
  },
} as const
