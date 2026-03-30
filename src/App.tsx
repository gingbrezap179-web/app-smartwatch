import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Watch, Battery, Bluetooth, Shield, AlertCircle, Users, Phone, MapPin, 
  Settings, ChevronLeft, Search, Plus, Trash2, GripVertical, Bell, 
  Vibrate, Sliders, CheckCircle2, Navigation, Activity, Timer, 
  RefreshCw, Cpu, Smartphone
} from 'lucide-react';
import { SystemStatus, Contact, WatchState, SafeZone, HapticSettings, SensorSettings, BluetoothDevice } from './types';

const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Elena', photoUrl: 'https://picsum.photos/seed/elena/100/100', phone: '+34 600 000 001', priority: 1 },
  { id: '2', name: 'Marco', photoUrl: 'https://picsum.photos/seed/marco/100/100', phone: '+34 600 000 002', priority: 2 },
  { id: '3', name: 'Sofía', photoUrl: 'https://picsum.photos/seed/sofia/100/100', phone: '+34 600 000 003', priority: 3 },
];

const MOCK_ZONES: SafeZone[] = [
  { id: '1', name: 'Casa', address: 'Calle Mayor 12, Madrid', radius: 100, lat: 40.4168, lng: -3.7038 },
  { id: '2', name: 'Trabajo', address: 'Paseo de la Castellana 200, Madrid', radius: 50, lat: 40.4668, lng: -3.6838 },
];

type View = 'dashboard' | 'settings' | 'contacts' | 'zones' | 'haptics' | 'sensors' | 'device';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [status, setStatus] = useState<SystemStatus>('ready');
  const [watch, setWatch] = useState<WatchState>({ 
    battery: 85, 
    isConnected: true,
    firmwareVersion: 'v2.4.1',
    lastSync: 'Hace 5 min'
  });
  const [isSOSActive, setIsSOSActive] = useState(false);
  
  // Settings State
  const [sosMessage, setSosMessage] = useState('Necesito ayuda, esta es mi ubicación actual...');
  const [allow911, setAllow911] = useState(true);
  const [hapticIntensity, setHapticIntensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [zones, setZones] = useState<SafeZone[]>(MOCK_ZONES);
  const [sensorSettings, setSensorSettings] = useState<SensorSettings>({
    fallSensitivity: 'medium',
    inactivityTimer: 2,
    sosCountdown: 15
  });
  const [isSyncing, setIsSyncing] = useState(false);

  // Simulate status changes for demo
  useEffect(() => {
    const timer = setTimeout(() => setStatus('syncing'), 3000);
    const timer2 = setTimeout(() => setStatus('ready'), 6000);
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'ready': return '#10B981';
      case 'syncing': return '#F59E0B';
      case 'error': return '#EF4444';
      default: return '#10B981';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'ready': return 'Sistema Listo / Escucha Activa';
      case 'syncing': return 'Sincronizando...';
      case 'error': return 'Error de Conexión / Smartwatch Desconectado';
      default: return '';
    }
  };

  const renderDashboard = () => (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex-1 flex flex-col items-center justify-center gap-12"
    >
      {/* Status Indicator */}
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-64 h-64 rounded-full border border-white/10"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.05, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-80 h-80 rounded-full border border-white/5"
        />
        <motion.div 
          className="relative w-48 h-48 rounded-full flex flex-col items-center justify-center text-center p-6 z-10"
          style={{
            background: `radial-gradient(circle at center, ${getStatusColor()}20 0%, transparent 70%)`,
            border: `2px solid ${getStatusColor()}40`
          }}
        >
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-4 h-4 rounded-full mb-4"
            style={{ backgroundColor: getStatusColor() }}
          />
          <h2 className="text-sm font-medium text-white/90 leading-tight">{getStatusText()}</h2>
        </motion.div>
      </div>

      {/* Watch Status */}
      <div className="w-full glass rounded-3xl p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
            <Watch className="w-6 h-6 text-white/80" />
          </div>
          <div>
            <p className="text-xs text-white/50 font-medium uppercase tracking-wider">Smartwatch</p>
            <p className="text-sm font-semibold">{watch.isConnected ? 'Conectado' : 'Desconectado'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-white/70">
            <Battery className="w-4 h-4" />
            <span className="text-sm font-medium">{watch.battery}%</span>
          </div>
          <Bluetooth className={`w-4 h-4 ${watch.isConnected ? 'text-blue-400' : 'text-white/20'}`} />
        </div>
      </div>

      {/* Quick Access Escorts */}
      <div className="w-full">
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-sm font-semibold text-white/70 flex items-center gap-2 uppercase tracking-widest">
            <Users className="w-4 h-4" /> Escoltas
          </h3>
          <button onClick={() => setCurrentView('contacts')} className="text-xs text-white/40 font-medium hover:text-white transition-colors">Ver todos</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {MOCK_CONTACTS.map((contact) => (
            <motion.button key={contact.id} whileHover={{ y: -4 }} className="flex flex-col items-center gap-2 min-w-[70px]">
              <div className="relative">
                <img src={contact.photoUrl} alt={contact.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/10" referrerPolicy="no-referrer" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#0A0A0A] flex items-center justify-center">
                  <Phone className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <span className="text-xs font-medium text-white/60">{contact.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderContacts = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col gap-8"
    >
      <div className="flex items-center gap-4">
        <button onClick={() => setCurrentView('dashboard')} className="w-10 h-10 rounded-full glass flex items-center justify-center">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold">Gestión de Escoltas</h2>
      </div>

      {/* SOS Message Config */}
      <div className="glass rounded-3xl p-6 flex flex-col gap-4">
        <label className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
          <Bell className="w-4 h-4" /> Mensaje SOS Predefinido
        </label>
        <textarea 
          value={sosMessage}
          onChange={(e) => setSosMessage(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-white/30 transition-colors h-24 resize-none"
        />
      </div>

      {/* Contacts List */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Contactos de Emergencia</h3>
          <button className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
            <Plus className="w-3 h-3" /> Importar
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {MOCK_CONTACTS.map((contact, index) => (
            <div key={contact.id} className="glass rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <GripVertical className="w-4 h-4 text-white/20 cursor-grab" />
                <img src={contact.photoUrl} alt={contact.name} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                <div>
                  <p className="text-sm font-bold">{contact.name}</p>
                  <p className="text-xs text-white/40">{contact.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                  {index + 1}
                </div>
                <button className="text-red-400/50 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call Permissions */}
      <div className="glass rounded-3xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
            <Phone className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-bold">Llamada al 911</p>
            <p className="text-xs text-white/40">Autorizar llamada automática</p>
          </div>
        </div>
        <button 
          onClick={() => setAllow911(!allow911)}
          className={`w-12 h-6 rounded-full transition-colors relative ${allow911 ? 'bg-blue-500' : 'bg-white/10'}`}
        >
          <motion.div 
            animate={{ x: allow911 ? 24 : 4 }}
            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
          />
        </button>
      </div>
    </motion.div>
  );

  const renderZones = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col gap-8"
    >
      <div className="flex items-center gap-4">
        <button onClick={() => setCurrentView('dashboard')} className="w-10 h-10 rounded-full glass flex items-center justify-center">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold">Zonas Seguras</h2>
      </div>

      {/* Map Placeholder */}
      <div className="relative w-full aspect-square rounded-[40px] overflow-hidden glass border-2 border-white/5">
        <div className="absolute inset-0 bg-[#1A1A1A] flex items-center justify-center">
          {/* Simulated Map Grid */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          
          {/* Simulated Zone Circle */}
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-48 h-48 rounded-full bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center"
          >
            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
          </motion.div>
          
          {/* Map Controls */}
          <div className="absolute top-4 left-4 right-4 flex gap-2">
            <div className="flex-1 h-12 glass rounded-2xl flex items-center px-4 gap-3">
              <Search className="w-4 h-4 text-white/40" />
              <input type="text" placeholder="Buscar dirección..." className="bg-transparent text-sm focus:outline-none w-full" />
            </div>
          </div>
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button className="w-10 h-10 glass rounded-xl flex items-center justify-center"><Plus className="w-5 h-5" /></button>
            <button className="w-10 h-10 glass rounded-xl flex items-center justify-center"><Navigation className="w-5 h-5 text-blue-400" /></button>
          </div>
        </div>
      </div>

      {/* Zones List */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Mis Zonas</h3>
        <div className="flex flex-col gap-3">
          {zones.map((zone) => (
            <div key={zone.id} className="glass rounded-3xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{zone.name}</p>
                    <p className="text-xs text-white/40">{zone.address}</p>
                  </div>
                </div>
                <button className="text-white/20 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                  <span>Radio de Seguridad</span>
                  <span className="text-blue-400">{zone.radius}m</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="500" 
                  step="50"
                  value={zone.radius}
                  onChange={(e) => {
                    const newZones = zones.map(z => z.id === zone.id ? { ...z, radius: parseInt(e.target.value) } : z);
                    setZones(newZones);
                  }}
                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderHaptics = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col gap-8"
    >
      <div className="flex items-center gap-4">
        <button onClick={() => setCurrentView('dashboard')} className="w-10 h-10 rounded-full glass flex items-center justify-center">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold">Configuración Háptica</h2>
      </div>

      {/* Intensity Slider */}
      <div className="glass rounded-3xl p-6 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
            <Sliders className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm font-bold">Intensidad de Vibración</p>
            <p className="text-xs text-white/40">Ajusta la fuerza del motor háptico</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center gap-4">
          {['low', 'medium', 'high'].map((level) => (
            <button
              key={level}
              onClick={() => setHapticIntensity(level as any)}
              className={`flex-1 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                hapticIntensity === level 
                  ? 'bg-purple-500 border-purple-400 text-white' 
                  : 'bg-white/5 border-white/10 text-white/40'
              }`}
            >
              {level === 'low' ? 'Suave' : level === 'medium' ? 'Media' : 'Fuerte'}
            </button>
          ))}
        </div>
      </div>

      {/* Pattern Tester */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Probador de Patrones</h3>
        <div className="grid grid-cols-1 gap-4">
          <button className="glass rounded-3xl p-6 flex items-center justify-between group hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                <Vibrate className="w-6 h-6 text-white/60 group-hover:text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold">Giro a la Izquierda</p>
                <p className="text-xs text-white/40 italic">Vibración Larga</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white/20" />
            </div>
          </button>

          <button className="glass rounded-3xl p-6 flex items-center justify-between group hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                <Vibrate className="w-6 h-6 text-white/60 group-hover:text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold">Giro a la Derecha</p>
                <p className="text-xs text-white/40 italic">Dos Vibraciones Cortas</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white/20" />
            </div>
          </button>
        </div>
      </div>

      <div className="mt-auto glass rounded-2xl p-4 flex items-center gap-3 border-purple-500/20">
        <AlertCircle className="w-5 h-5 text-purple-400" />
        <p className="text-[10px] font-medium text-white/50 leading-relaxed">
          Los patrones hápticos ayudan a navegar sin mirar el móvil, reduciendo distracciones en la vía pública.
        </p>
      </div>
    </motion.div>
  );

  const renderSensors = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col gap-8"
    >
      <div className="flex items-center gap-4">
        <button onClick={() => setCurrentView('dashboard')} className="w-10 h-10 rounded-full glass flex items-center justify-center">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold">Sensores</h2>
      </div>

      {/* Fall Detection */}
      <div className="glass rounded-3xl p-6 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-sm font-bold">Detección de Caídas</p>
            <p className="text-xs text-white/40">Sensibilidad del acelerómetro</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center gap-4">
          {['low', 'medium', 'high'].map((level) => (
            <button
              key={level}
              onClick={() => setSensorSettings({ ...sensorSettings, fallSensitivity: level as any })}
              className={`flex-1 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                sensorSettings.fallSensitivity === level 
                  ? 'bg-orange-500 border-orange-400 text-white' 
                  : 'bg-white/5 border-white/10 text-white/40'
              }`}
            >
              {level === 'low' ? 'Baja' : level === 'medium' ? 'Media' : 'Alta'}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-white/30 italic px-1">
          * Alta sensibilidad puede dar falsos positivos si el usuario baila o corre.
        </p>
      </div>

      {/* Inactivity Timer */}
      <div className="glass rounded-3xl p-6 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
            <Timer className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-bold">Temporizador de Inactividad</p>
            <p className="text-xs text-white/40">Tiempo sin movimiento para alerta</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center gap-4">
          {[1, 2, 5].map((mins) => (
            <button
              key={mins}
              onClick={() => setSensorSettings({ ...sensorSettings, inactivityTimer: mins })}
              className={`flex-1 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                sensorSettings.inactivityTimer === mins 
                  ? 'bg-blue-500 border-blue-400 text-white' 
                  : 'bg-white/5 border-white/10 text-white/40'
              }`}
            >
              {mins} min
            </button>
          ))}
        </div>
      </div>

      {/* SOS Countdown */}
      <div className="glass rounded-3xl p-6 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-bold">Cuenta Regresiva SOS</p>
            <p className="text-xs text-white/40">Tiempo para cancelar alerta</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center gap-4">
          {[10, 15, 30].map((secs) => (
            <button
              key={secs}
              onClick={() => setSensorSettings({ ...sensorSettings, sosCountdown: secs })}
              className={`flex-1 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                sensorSettings.sosCountdown === secs 
                  ? 'bg-red-500 border-red-400 text-white' 
                  : 'bg-white/5 border-white/10 text-white/40'
              }`}
            >
              {secs}s
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderDevice = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col gap-8"
    >
      <div className="flex items-center gap-4">
        <button onClick={() => setCurrentView('dashboard')} className="w-10 h-10 rounded-full glass flex items-center justify-center">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold">Dispositivo</h2>
      </div>

      {/* Device Info & Sync */}
      <div className="glass rounded-[40px] p-8 flex flex-col items-center text-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/20">
          <motion.div 
            animate={isSyncing ? { x: ['-100%', '100%'] } : { x: '-100%' }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-1/3 h-full bg-blue-500"
          />
        </div>

        <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center relative">
          <Watch className="w-12 h-12 text-white/80" />
          {watch.isConnected && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-[#1A1A1A] flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold">SafeGuard Watch Pro</h3>
          <p className="text-sm text-white/40">Firmware {watch.firmwareVersion}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="glass rounded-2xl p-4">
            <p className="text-[10px] font-bold text-white/30 uppercase mb-1">Batería</p>
            <p className="text-sm font-bold flex items-center justify-center gap-2">
              <Battery className="w-4 h-4 text-green-500" /> {watch.battery}%
            </p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-[10px] font-bold text-white/30 uppercase mb-1">Sincronizado</p>
            <p className="text-sm font-bold text-white/70">{watch.lastSync}</p>
          </div>
        </div>

        <button 
          onClick={() => {
            setIsSyncing(true);
            setTimeout(() => setIsSyncing(false), 2000);
          }}
          disabled={isSyncing}
          className="w-full py-4 rounded-2xl bg-white text-black font-bold uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Sincronizando...' : 'Sincronizar Ahora'}
        </button>
      </div>

      {/* Bluetooth Pairing */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Emparejamiento Bluetooth</h3>
        <div className="glass rounded-3xl p-2 flex flex-col gap-1">
          <div className="p-4 flex items-center justify-between bg-white/5 rounded-2xl">
            <div className="flex items-center gap-4">
              <Smartphone className="w-5 h-5 text-blue-400" />
              <p className="text-sm font-medium">SafeGuard Watch Pro</p>
            </div>
            <span className="text-[10px] font-bold text-blue-400 uppercase">Conectado</span>
          </div>
          <div className="p-4 flex items-center justify-between opacity-40">
            <div className="flex items-center gap-4">
              <Smartphone className="w-5 h-5" />
              <p className="text-sm font-medium">Galaxy Watch 4</p>
            </div>
            <button className="text-[10px] font-bold uppercase">Vincular</button>
          </div>
        </div>
      </div>

      {/* Firmware Update */}
      <div className="glass rounded-3xl p-6 flex items-center justify-between border-blue-500/20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-bold">Actualización de Software</p>
            <p className="text-xs text-white/40">Tu software está al día</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold tracking-tight">SafeGuard</span>
        </div>
        <div className="flex gap-2">
          {currentView === 'dashboard' && (
            <button onClick={() => setCurrentView('contacts')} className="w-10 h-10 rounded-full glass flex items-center justify-center">
              <Users className="w-5 h-5 text-white/70" />
            </button>
          )}
          <button 
            onClick={() => setCurrentView(currentView === 'dashboard' ? 'contacts' : 'dashboard')} 
            className="w-10 h-10 rounded-full glass flex items-center justify-center"
          >
            <Settings className="w-5 h-5 text-white/70" />
          </button>
        </div>
      </header>

      {/* View Content */}
      <AnimatePresence mode="wait">
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'contacts' && renderContacts()}
        {currentView === 'zones' && renderZones()}
        {currentView === 'haptics' && renderHaptics()}
        {currentView === 'sensors' && renderSensors()}
        {currentView === 'device' && renderDevice()}
      </AnimatePresence>

      {/* Footer Navigation */}
      <footer className="mt-8 pb-4 flex flex-col items-center gap-6">
        {currentView === 'dashboard' && (
          <motion.button
            onClick={() => setIsSOSActive(true)}
            whileTap={{ scale: 0.95 }}
            className="w-full h-16 rounded-2xl sos-gradient flex items-center justify-center gap-3 shadow-2xl shadow-red-900/20"
            id="sos-button"
          >
            <AlertCircle className="w-6 h-6" />
            <span className="text-lg font-bold tracking-wider uppercase">Botón de Pánico</span>
          </motion.button>
        )}
        
        <div className="flex gap-6 text-white/30">
          <button 
            onClick={() => setCurrentView('zones')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'zones' ? 'text-white' : ''}`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase tracking-tighter">Zonas</span>
          </button>
          <button 
            onClick={() => setCurrentView('sensors')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'sensors' ? 'text-white' : ''}`}
          >
            <Activity className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase tracking-tighter">Sensores</span>
          </button>
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'dashboard' ? 'text-white' : ''}`}
          >
            <Shield className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase tracking-tighter">Home</span>
          </button>
          <button 
            onClick={() => setCurrentView('haptics')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'haptics' ? 'text-white' : ''}`}
          >
            <Vibrate className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase tracking-tighter">Háptica</span>
          </button>
          <button 
            onClick={() => setCurrentView('device')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === 'device' ? 'text-white' : ''}`}
          >
            <Watch className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase tracking-tighter">Reloj</span>
          </button>
        </div>
      </footer>

      {/* SOS Active Overlay */}
      <AnimatePresence>
        {isSOSActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-red-600 flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-32 h-32 rounded-full bg-white flex items-center justify-center mb-8"
            >
              <AlertCircle className="w-16 h-16 text-red-600" />
            </motion.div>
            <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">ALERTA SOS</h1>
            <p className="text-xl font-medium mb-12 opacity-90">Enviando ubicación y alerta a tus escoltas...</p>
            <button 
              onClick={() => setIsSOSActive(false)}
              className="px-8 py-4 bg-white text-red-600 rounded-2xl font-bold uppercase tracking-widest"
            >
              Cancelar Alerta
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
