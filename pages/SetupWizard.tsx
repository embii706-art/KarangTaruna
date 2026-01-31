import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Upload, MapPin, Calendar, Globe, CheckCircle, ArrowRight } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Button, Input } from '../components/UI';
import { useTranslation } from 'react-i18next';

const SetupWizard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    orgName: '',
    region: '',
    period: '2024-2029',
    defaultLanguage: 'id'
  });

  const handleFinish = async () => {
    setLoading(true);
    try {
        // Save Organization Settings
        await setDoc(doc(db, "settings", "organization"), {
            name: formData.orgName,
            region: formData.region,
            period: formData.period,
            defaultLanguage: formData.defaultLanguage,
            setupCompletedAt: new Date().toISOString()
        });

        // Redirect to Dashboard
        navigate('/dashboard');
    } catch (error) {
        console.error("Setup failed:", error);
        alert("Gagal menyimpan pengaturan.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col animate-fade-in">
        <div className="flex-1 flex flex-col justify-center p-6 max-w-md mx-auto w-full">
            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
                    <Building2 className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Setup Organisasi</h1>
                <p className="text-slate-500 mt-2">Konfigurasi awal untuk aplikasi KARTEJI Anda.</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nama Organisasi</label>
                    <Input
                        icon={<Building2 className="w-5 h-5"/>}
                        placeholder="Contoh: Karang Taruna RW 05"
                        value={formData.orgName}
                        onChange={e => setFormData({...formData, orgName: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Wilayah / Lokasi</label>
                    <Input
                        icon={<MapPin className="w-5 h-5"/>}
                        placeholder="Kelurahan X, Kota Y"
                        value={formData.region}
                        onChange={e => setFormData({...formData, region: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Periode Kepengurusan</label>
                    <Input
                        icon={<Calendar className="w-5 h-5"/>}
                        placeholder="2024 - 2027"
                        value={formData.period}
                        onChange={e => setFormData({...formData, period: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Bahasa Default</label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setFormData({...formData, defaultLanguage: 'id'});
                                i18n.changeLanguage('id');
                            }}
                            className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-all ${formData.defaultLanguage === 'id' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-400'}`}
                        >
                            Bahasa Indonesia
                        </button>
                        <button
                            onClick={() => {
                                setFormData({...formData, defaultLanguage: 'en'});
                                i18n.changeLanguage('en');
                            }}
                            className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-all ${formData.defaultLanguage === 'en' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-400'}`}
                        >
                            English
                        </button>
                    </div>
                </div>

                <Button
                    className="w-full mt-8 py-4 text-lg shadow-xl shadow-indigo-200"
                    onClick={handleFinish}
                    disabled={!formData.orgName || !formData.region || loading}
                >
                    {loading ? 'Menyimpan...' : 'Selesai & Lanjutkan'} <ArrowRight className="w-5 h-5" />
                </Button>
            </div>
        </div>
    </div>
  );
};

export default SetupWizard;