import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  ''

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Warning: URL atau Anon/Publishable Key Supabase belum terkonfigurasi di file .env.local'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface ConnectionStatus {
  connected: boolean
  latencyMs?: number
  message: string
  url: string
}

/**
 * Memeriksa status konektivitas ke server Supabase secara real-time
 */
export async function checkSupabaseConnection(): Promise<ConnectionStatus> {
  const startTime = performance.now()
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        connected: false,
        message: 'Kredensial URL atau API Key belum disetel di file .env.local',
        url: supabaseUrl || 'Tidak ada URL',
      }
    }

    // Melakukan pengecekan ke auth session & server
    const { error } = await supabase.auth.getSession()
    const latencyMs = Math.round(performance.now() - startTime)

    if (error) {
      return {
        connected: false,
        latencyMs,
        message: `Gagal autentikasi Supabase: ${error.message}`,
        url: supabaseUrl,
      }
    }

    return {
      connected: true,
      latencyMs,
      message: 'Berhasil terhubung ke Supabase!',
      url: supabaseUrl,
    }
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - startTime)
    return {
      connected: false,
      latencyMs,
      message: err?.message || 'Gagal menghubungi server Supabase',
      url: supabaseUrl,
    }
  }
}
