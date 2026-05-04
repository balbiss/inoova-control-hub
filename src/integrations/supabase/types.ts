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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      agendamentos: {
        Row: {
          chat_id: string
          created_at: string | null
          data_agendamento: string
          google_event_id: string | null
          id: string
          owner_id: string
          profissional_id: string
          status: string | null
        }
        Insert: {
          chat_id: string
          created_at?: string | null
          data_agendamento: string
          google_event_id?: string | null
          id?: string
          owner_id: string
          profissional_id: string
          status?: string | null
        }
        Update: {
          chat_id?: string
          created_at?: string | null
          data_agendamento?: string
          google_event_id?: string | null
          id?: string
          owner_id?: string
          profissional_id?: string
          status?: string | null
        }
        Relationships: []
      }
      atendentes: {
        Row: {
          chatwoot_user_id: number | null
          id: string
          nome: string
          status_online: boolean | null
          ultimo_atendimento: string | null
          user_id: string
          whatsapp: string | null
        }
        Insert: {
          chatwoot_user_id?: number | null
          id?: string
          nome: string
          status_online?: boolean | null
          ultimo_atendimento?: string | null
          user_id: string
          whatsapp?: string | null
        }
        Update: {
          chatwoot_user_id?: number | null
          id?: string
          nome?: string
          status_online?: boolean | null
          ultimo_atendimento?: string | null
          user_id?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      clinic_agendas: {
        Row: {
          connected: boolean | null
          created_at: string | null
          google_access_token: string | null
          google_refresh_token: string | null
          google_token_expiry: string | null
          id: string
          owner_id: string
          updated_at: string | null
        }
        Insert: {
          connected?: boolean | null
          created_at?: string | null
          google_access_token?: string | null
          google_refresh_token?: string | null
          google_token_expiry?: string | null
          id?: string
          owner_id: string
          updated_at?: string | null
        }
        Update: {
          connected?: boolean | null
          created_at?: string | null
          google_access_token?: string | null
          google_refresh_token?: string | null
          google_token_expiry?: string | null
          id?: string
          owner_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      configuracoes: {
        Row: {
          chatwoot_account_id: string | null
          chatwoot_inbox_id: string | null
          chatwoot_token: string | null
          created_at: string | null
          followup_ativo: boolean | null
          horario_fim: string | null
          horario_inicio: string | null
          ia_nome: string | null
          id: string
          intervalo_minutos: number | null
          nicho: string | null
          pausar_followup_humano: boolean | null
          prompt_followup: string | null
          prompt_principal: string | null
          tentativas_max: number | null
          user_id: string
        }
        Insert: {
          chatwoot_account_id?: string | null
          chatwoot_inbox_id?: string | null
          chatwoot_token?: string | null
          created_at?: string | null
          followup_ativo?: boolean | null
          horario_fim?: string | null
          horario_inicio?: string | null
          ia_nome?: string | null
          id?: string
          intervalo_minutos?: number | null
          nicho?: string | null
          pausar_followup_humano?: boolean | null
          prompt_followup?: string | null
          prompt_principal?: string | null
          tentativas_max?: number | null
          user_id: string
        }
        Update: {
          chatwoot_account_id?: string | null
          chatwoot_inbox_id?: string | null
          chatwoot_token?: string | null
          created_at?: string | null
          followup_ativo?: boolean | null
          horario_fim?: string | null
          horario_inicio?: string | null
          ia_nome?: string | null
          id?: string
          intervalo_minutos?: number | null
          nicho?: string | null
          pausar_followup_humano?: boolean | null
          prompt_followup?: string | null
          prompt_principal?: string | null
          tentativas_max?: number | null
          user_id?: string
        }
        Relationships: []
      }
      controle_followup: {
        Row: {
          conversation_id: number | null
          id: string
          proxima_execucao: string | null
          status: string | null
          tentativa_atual: number | null
          user_id: string
        }
        Insert: {
          conversation_id?: number | null
          id?: string
          proxima_execucao?: string | null
          status?: string | null
          tentativa_atual?: number | null
          user_id: string
        }
        Update: {
          conversation_id?: number | null
          id?: string
          proxima_execucao?: string | null
          status?: string | null
          tentativa_atual?: number | null
          user_id?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          city_state: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string
          qualification: string | null
          service: string | null
          status: string
          urgency: string | null
        }
        Insert: {
          city_state?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone: string
          qualification?: string | null
          service?: string | null
          status?: string
          urgency?: string | null
        }
        Update: {
          city_state?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          qualification?: string | null
          service?: string | null
          status?: string
          urgency?: string | null
        }
        Relationships: []
      }
      leads_log: {
        Row: {
          contato_nome: string | null
          created_at: string | null
          id: string
          status: string
          user_id: string
        }
        Insert: {
          contato_nome?: string | null
          created_at?: string | null
          id?: string
          status: string
          user_id: string
        }
        Update: {
          contato_nome?: string | null
          created_at?: string | null
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      n8n_fila_mensagens: {
        Row: {
          id: number
          id_mensagem: string
          mensagem: string
          telefone: string
          timestamp: string
        }
        Insert: {
          id?: number
          id_mensagem: string
          mensagem: string
          telefone: string
          timestamp: string
        }
        Update: {
          id?: number
          id_mensagem?: string
          mensagem?: string
          telefone?: string
          timestamp?: string
        }
        Relationships: []
      }
      n8n_historico_mensagens: {
        Row: {
          created_at: string
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          created_at?: string
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profissionais: {
        Row: {
          created_at: string | null
          especialidade: string | null
          google_calendar_id: string | null
          id: string
          nome: string
          owner_id: string
        }
        Insert: {
          created_at?: string | null
          especialidade?: string | null
          google_calendar_id?: string | null
          id?: string
          nome: string
          owner_id: string
        }
        Update: {
          created_at?: string | null
          especialidade?: string | null
          google_calendar_id?: string | null
          id?: string
          nome?: string
          owner_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_balance: {
        Args: { amount: number; user_id: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
