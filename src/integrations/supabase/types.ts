export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ads: {
        Row: {
          assigned_user_id: string | null
          assigned_user_name: string | null
          budget_amount: number
          budget_period: string
          clicks: number
          conversions: number
          cost_per_conversion: number
          created_at: string
          ctr: number
          id: string
          impressions: number
          name: string
          revenue: number
          status: string
          updated_at: string
        }
        Insert: {
          assigned_user_id?: string | null
          assigned_user_name?: string | null
          budget_amount?: number
          budget_period?: string
          clicks?: number
          conversions?: number
          cost_per_conversion?: number
          created_at?: string
          ctr?: number
          id?: string
          impressions?: number
          name: string
          revenue?: number
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_user_id?: string | null
          assigned_user_name?: string | null
          budget_amount?: number
          budget_period?: string
          clicks?: number
          conversions?: number
          cost_per_conversion?: number
          created_at?: string
          ctr?: number
          id?: string
          impressions?: number
          name?: string
          revenue?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      banned_ips: {
        Row: {
          banned_at: string
          banned_by: string | null
          created_at: string
          id: string
          ip_address: string
          is_active: boolean
          reason: string | null
          updated_at: string
        }
        Insert: {
          banned_at?: string
          banned_by?: string | null
          created_at?: string
          id?: string
          ip_address: string
          is_active?: boolean
          reason?: string | null
          updated_at?: string
        }
        Update: {
          banned_at?: string
          banned_by?: string | null
          created_at?: string
          id?: string
          ip_address?: string
          is_active?: boolean
          reason?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      billing_data: {
        Row: {
          available_funds: number
          created_at: string
          id: string
          last_payment_amount: number
          last_payment_date: string | null
          updated_at: string
        }
        Insert: {
          available_funds?: number
          created_at?: string
          id?: string
          last_payment_amount?: number
          last_payment_date?: string | null
          updated_at?: string
        }
        Update: {
          available_funds?: number
          created_at?: string
          id?: string
          last_payment_amount?: number
          last_payment_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      login_sessions: {
        Row: {
          browser_name: string | null
          browser_version: string | null
          city: string | null
          country: string | null
          created_at: string
          device_model: string | null
          device_type: string | null
          device_vendor: string | null
          id: string
          ip_address: string | null
          is_active: boolean
          last_activity: string
          latitude: number | null
          login_time: string
          longitude: number | null
          os_name: string | null
          os_version: string | null
          session_id: string
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          browser_name?: string | null
          browser_version?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_model?: string | null
          device_type?: string | null
          device_vendor?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean
          last_activity?: string
          latitude?: number | null
          login_time?: string
          longitude?: number | null
          os_name?: string | null
          os_version?: string | null
          session_id: string
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          browser_name?: string | null
          browser_version?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          device_model?: string | null
          device_type?: string | null
          device_vendor?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean
          last_activity?: string
          latitude?: number | null
          login_time?: string
          longitude?: number | null
          os_name?: string | null
          os_version?: string | null
          session_id?: string
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      monthly_billing: {
        Row: {
          adjustments: number
          campaigns: number
          created_at: string
          ending_balance: number
          funds_from_previous: number
          id: string
          month: number
          net_cost: number
          payments: number
          taxes_and_fees: number
          updated_at: string
          year: number
        }
        Insert: {
          adjustments?: number
          campaigns?: number
          created_at?: string
          ending_balance?: number
          funds_from_previous?: number
          id?: string
          month: number
          net_cost?: number
          payments?: number
          taxes_and_fees?: number
          updated_at?: string
          year: number
        }
        Update: {
          adjustments?: number
          campaigns?: number
          created_at?: string
          ending_balance?: number
          funds_from_previous?: number
          id?: string
          month?: number
          net_cost?: number
          payments?: number
          taxes_and_fees?: number
          updated_at?: string
          year?: number
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
