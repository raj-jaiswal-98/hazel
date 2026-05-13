import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '../../stores/useSettingsStore';
import type { NarrationProvider, TemperatureUnit } from '../../types/settings';

/** Settings panel overlay */
export function SettingsPanel() {
  const {
    settingsPanelOpen,
    toggleSettingsPanel,
    openaiApiKey,
    geminiApiKey,
    unsplashApiKey,
    openaqApiKey,
    narrationProvider,
    temperatureUnit,
    setOpenAIKey,
    setGeminiKey,
    setUnsplashKey,
    setOpenAQKey,
    setNarrationProvider,
    setTemperatureUnit,
  } = useSettingsStore();

  return (
    <AnimatePresence>
      {settingsPanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.5)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSettingsPanel}
          />

          {/* Panel */}
          <motion.div
            id="settings-panel"
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md overflow-y-auto"
            style={{
              background: 'rgba(10, 10, 20, 0.95)',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="p-6 space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">Settings</h2>
                <button
                  onClick={toggleSettingsPanel}
                  className="w-8 h-8 flex items-center justify-center rounded-full glass-hover text-bloom-text-secondary hover:text-bloom-text-primary cursor-pointer"
                  aria-label="Close settings"
                >
                  ✕
                </button>
              </div>

              {/* API Keys */}
              <section>
                <h3 className="text-label mb-4">API Keys</h3>
                <div className="space-y-4">
                  <ApiKeyField label="OpenAI" value={openaiApiKey} onChange={setOpenAIKey} placeholder="sk-..." />
                  <ApiKeyField label="Google Gemini" value={geminiApiKey} onChange={setGeminiKey} placeholder="AI..." />
                  <ApiKeyField label="Unsplash" value={unsplashApiKey} onChange={setUnsplashKey} placeholder="Access key" />
                  <ApiKeyField label="OpenAQ" value={openaqApiKey} onChange={setOpenAQKey} placeholder="API key" />
                </div>
              </section>

              {/* Narration Provider */}
              <section>
                <h3 className="text-label mb-4">Narration Provider</h3>
                <div className="flex gap-2">
                  {(['template', 'openai', 'gemini'] as NarrationProvider[]).map((provider) => (
                    <button
                      key={provider}
                      onClick={() => setNarrationProvider(provider)}
                      className="glass-pill text-xs capitalize cursor-pointer transition-all"
                      style={{
                        background: narrationProvider === provider ? 'rgba(74,158,255,0.2)' : undefined,
                        borderColor: narrationProvider === provider ? 'rgba(74,158,255,0.4)' : undefined,
                        color: narrationProvider === provider
                          ? 'var(--color-bloom-glow-blue)'
                          : 'var(--color-bloom-text-secondary)',
                      }}
                    >
                      {provider}
                    </button>
                  ))}
                </div>
              </section>

              {/* Temperature Unit */}
              <section>
                <h3 className="text-label mb-4">Temperature Unit</h3>
                <div className="flex gap-2">
                  {(['celsius', 'fahrenheit'] as TemperatureUnit[]).map((unit) => (
                    <button
                      key={unit}
                      onClick={() => setTemperatureUnit(unit)}
                      className="glass-pill text-xs cursor-pointer transition-all"
                      style={{
                        background: temperatureUnit === unit ? 'rgba(74,158,255,0.2)' : undefined,
                        borderColor: temperatureUnit === unit ? 'rgba(74,158,255,0.4)' : undefined,
                        color: temperatureUnit === unit
                          ? 'var(--color-bloom-glow-blue)'
                          : 'var(--color-bloom-text-secondary)',
                      }}
                    >
                      {unit === 'celsius' ? '°C' : '°F'}
                    </button>
                  ))}
                </div>
              </section>

              {/* About */}
              <section className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-xs" style={{ color: 'var(--color-bloom-text-muted)' }}>
                  Bloom v1.0 — Cinematic Atmospheric City Dashboard
                </p>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/** Reusable API key field */
function ApiKeyField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--color-bloom-text-secondary)' }}>
        {label}
      </label>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm rounded-lg outline-none transition-all"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'var(--color-bloom-text-primary)',
        }}
      />
    </div>
  );
}
