import { useState, useEffect } from 'react'
import { Database, CheckCircle2, XCircle, RefreshCw, Server, Activity, ShieldCheck } from 'lucide-react'
import { checkSupabaseConnection } from './lib/supabase'
import './App.css'

function App() {
  const [status, setStatus] = useState({
    loading: true,
    connected: false,
    latencyMs: undefined,
    message: 'Memeriksa koneksi ke Supabase...',
    url: '',
  })

  const runConnectionCheck = async () => {
    setStatus((prev) => ({ ...prev, loading: true, message: 'Menghubungkan ke Supabase...' }))
    const result = await checkSupabaseConnection()
    setStatus({
      loading: false,
      connected: result.connected,
      latencyMs: result.latencyMs,
      message: result.message,
      url: result.url,
    })
  }

  useEffect(() => {
    runConnectionCheck()
  }, [])

  return (
    <div className="attendify-container">
      <header className="attendify-header">
        <h1 className="attendify-title">Attendify</h1>
        <p className="attendify-subtitle">Sistem Absensi & Manajemen Kehadiran Berbasis Cloud</p>
      </header>

      <section className="connection-card">
        <div className="card-header">
          <div className="card-title-group">
            <Database size={24} color="#8b5cf6" />
            <h2>Status Koneksi Database</h2>
          </div>
          <div>
            {status.loading ? (
              <span className="status-badge checking">
                <RefreshCw size={14} className="spin" />
                Memeriksa...
              </span>
            ) : status.connected ? (
              <span className="status-badge connected">
                <CheckCircle2 size={16} />
                Terhubung ke Supabase
              </span>
            ) : (
              <span className="status-badge disconnected">
                <XCircle size={16} />
                Gagal Terhubung
              </span>
            )}
          </div>
        </div>

        <div className="connection-details">
          <div className="detail-item">
            <div className="detail-label">Status Server</div>
            <div className="detail-value">
              {status.loading ? 'Menghubungi...' : status.connected ? 'Online (Active)' : 'Offline'}
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-label">Endpoint URL</div>
            <div className="detail-value">{status.url || '-'}</div>
          </div>

          <div className="detail-item">
            <div className="detail-label">Latency / Respons</div>
            <div className="detail-value">
              {status.latencyMs !== undefined ? `${status.latencyMs} ms` : '-'}
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-label">Keterangan</div>
            <div className="detail-value" style={{ fontSize: '0.85rem' }}>
              {status.message}
            </div>
          </div>
        </div>

        <div className="card-actions">
          <button
            type="button"
            className="btn-refresh"
            onClick={runConnectionCheck}
            disabled={status.loading}
          >
            <RefreshCw size={16} className={status.loading ? 'spin' : ''} />
            {status.loading ? 'Menguji Ulang...' : 'Uji Koneksi Lagi'}
          </button>
        </div>
      </section>

      <div className="info-box">
        <strong>Pemberitahuan Sistem:</strong>
        <p style={{ margin: '6px 0 0' }}>
          Frontend berhasil tersambung ke gateway Supabase menggunakan variabel lingkungan Vite (`VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`). Siap untuk pembuatan tabel skema absensi (seperti tabel kehadiran, karyawan/siswa, dsb).
        </p>
      </div>
    </div>
  )
}

export default App
