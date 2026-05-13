import { useState } from 'react';
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-label">API Connections</h3>
                </div>
                <div className="space-y-4">
                  <ApiKeyField 
                    label="OpenAI" 
                    value={openaiApiKey} 
                    onChange={setOpenAIKey} 
                    placeholder="sk-..." 
                  />
                  <ApiKeyField 
                    label="Google Gemini" 
                    value={geminiApiKey} 
                    onChange={setGeminiKey} 
                    placeholder="AIza..." 
                  />
                  <ApiKeyField 
                    label="Unsplash" 
                    value={unsplashApiKey} 
                    onChange={setUnsplashKey} 
                    placeholder="Access Key" 
                  />
                  <ApiKeyField 
                    label="OpenAQ" 
                    value={openaqApiKey} 
                    onChange={setOpenAQKey} 
                    placeholder="API Key" 
                  />
                </div>
              </section>

              {/* Narration Provider */}
              <section>
                <h3 className="text-label mb-4">Narration Source</h3>
                <div className="flex gap-2 p-1 rounded-xl glass border border-white/5">
                  {(['template', 'openai', 'gemini'] as NarrationProvider[]).map((provider) => (
                    <button
                      key={provider}
                      onClick={() => setNarrationProvider(provider)}
                      className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-semibold rounded-lg transition-all cursor-pointer ${
                        narrationProvider === provider 
                          ? 'bg-bloom-glow-blue/20 text-bloom-glow-blue shadow-[0_0_15px_rgba(74,158,255,0.2)] border border-bloom-glow-blue/30'
                          : 'text-bloom-text-muted hover:text-bloom-text-secondary hover:bg-white/5'
                      }`}
                    >
                      {provider}
                    </button>
                  ))}
                </div>
              </section>

              {/* Temperature Unit */}
              <section>
                <h3 className="text-label mb-4">Unit Preference</h3>
                <div className="flex gap-2">
                  {(['celsius', 'fahrenheit'] as TemperatureUnit[]).map((unit) => (
                    <button
                      key={unit}
                      onClick={() => setTemperatureUnit(unit)}
                      className={`px-4 py-2 text-xs font-medium rounded-lg glass-hover transition-all cursor-pointer ${
                        temperatureUnit === unit 
                          ? 'text-bloom-glow-blue border border-bloom-glow-blue/30 bg-bloom-glow-blue/10' 
                          : 'text-bloom-text-muted border border-white/5'
                      }`}
                    >
                      {unit === 'celsius' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}
                    </button>
                  ))}
                </div>
              </section>

              {/* Footer */}
              <section className="pt-8 opacity-40 border-t border-white/5">
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold text-bloom-text-muted">
                  Bloom / Atmosphere Engine v1.0
                </p>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/** Reusable API key field with indicator and edit mode */
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
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [isTesting, setIsTesting] = useState(false);
  const isConnected = !!value;

  const handleSave = () => {
    onChange(inputValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInputValue(value);
    setIsEditing(false);
  };

  const handleTest = async () => {
    if (!value) return;
    setIsTesting(true);
    console.log(`[Bloom] Testing ${label} connection...`);
    
    try {
      // Small dummy input for testing
      const testInput = {
        city: 'Test City',
        country: 'Test Land',
        weather: 'Clear',
        temp: 20,
        timeOfDay: 'day',
        humidity: 50,
        windSpeed: 10
      };

      let result;
      if (label.includes('Gemini')) {
        const { generateGeminiNarration } = await import('../../services/providers/geminiProvider');
        result = await generateGeminiNarration(testInput, value);
      } else if (label.includes('OpenAI')) {
        const { generateOpenAINarration } = await import('../../services/providers/openaiProvider');
        result = await generateOpenAINarration(testInput, value);
      }

      if (result) {
        console.log(`[Bloom] ${label} Test Successful! Response:`, result);
        alert(`${label} connection successful!`);
      }
    } catch (err) {
      console.error(`[Bloom] ${label} Test Failed:`, err);
      alert(`${label} test failed. Check console for details.`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span 
            className={`w-1.5 h-1.5 rounded-full ${
              isConnected 
                ? 'bg-bloom-glow-green shadow-[0_0_8px_rgba(74,222,128,0.4)]' 
                : 'bg-white/10'
            }`} 
          />
          <label className="text-[11px] font-semibold tracking-wider uppercase text-bloom-text-secondary">
            {label}
          </label>
        </div>
        <div className="flex gap-3">
          {isConnected && !isEditing && (
            <button 
              onClick={handleTest}
              disabled={isTesting}
              className="text-[10px] font-bold text-bloom-text-muted hover:text-bloom-glow-blue transition-colors cursor-pointer uppercase tracking-tight disabled:opacity-50"
            >
              {isTesting ? 'Testing...' : 'Test'}
            </button>
          )}
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-[10px] font-bold text-bloom-glow-blue opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer uppercase tracking-tight"
            >
              {isConnected ? 'Edit' : 'Provide'}
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="flex gap-2">
          <input
            type="text"
            autoFocus
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 text-sm rounded-lg outline-none bg-white/5 border border-white/10 text-white placeholder:text-white/20"
          />
          <button 
            onClick={handleSave}
            className="px-3 py-2 text-[10px] font-bold bg-bloom-glow-blue/20 text-bloom-glow-blue border border-bloom-glow-blue/30 rounded-lg uppercase cursor-pointer"
          >
            Save
          </button>
          <button 
            onClick={handleCancel}
            className="px-3 py-2 text-[10px] font-bold bg-white/5 text-bloom-text-muted rounded-lg uppercase cursor-pointer"
          >
            ✕
          </button>
        </div>
      ) : (
        <div 
          className="w-full px-3 py-2.5 text-xs rounded-lg bg-white/[0.02] border border-white/5 text-bloom-text-muted truncate font-mono"
        >
          {isConnected ? '••••••••••••••••' : `No ${label} Key`}
        </div>
      )}
    </div>
  );
}
