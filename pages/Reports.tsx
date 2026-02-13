import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, Users, CalendarCheck, FileText, Upload, Loader2, Download, Trash2 } from 'lucide-react';
import { Card, SectionHeader, Button } from '../components/UI';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy, getDoc } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { MemberRole } from '../types';

const Reports: React.FC = () => {
  interface ReportFile {
    id: string;
    name: string;
    size: string;
    date: string;
    url: string;
  }

  const [files, setFiles] = useState<ReportFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [userRole, setUserRole] = useState<MemberRole | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!auth.currentUser) return;
    // 1. Fetch Reports
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReportFile));
        setFiles(data);
    }, (error) => {
      console.error("Error fetching reports:", error);
    });

    // 2. Fetch User Role for Permissions
    const fetchUserRole = async () => {
        if (auth.currentUser) {
            const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
            if (userDoc.exists()) {
                setUserRole(userDoc.data().role as MemberRole);
            }
        }
    };
    fetchUserRole();

    return () => unsubscribe();
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'Karteji'); 

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/dbxktcwug/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) throw new Error('Upload failed');

        const data = await response.json();
        const size = file.size > 1024 * 1024 
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${(file.size / 1024).toFixed(1)} KB`;

        // Save metadata to Firestore
        await addDoc(collection(db, "reports"), {
            name: file.name,
            size: size,
            date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
            url: data.secure_url,
            createdAt: new Date().toISOString()
        });

    } catch (error) {
        console.error("Error uploading file:", error);
        alert("Gagal mengupload file.");
    } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
      if(window.confirm("Hapus file laporan ini?")) {
          try {
            await deleteDoc(doc(db, "reports", id));
          } catch (error) {
            console.error("Error deleting file:", error);
            alert("Gagal menghapus file.");
          }
      }
  };

  // Permission Check: Super Admin, Chairman, Vice Chairman, Secretary
  const canDelete = userRole && [
      MemberRole.SUPER_ADMIN, 
      MemberRole.CHAIRMAN, 
      MemberRole.VICE_CHAIRMAN, 
      MemberRole.SECRETARY
  ].includes(userRole);

  return (
    <div className="pt-4 px-4 animate-fade-in space-y-6 pb-24">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-slate-900">Laporan</h1>
         <Button variant="outline" className="!px-3 !py-2 h-10 rounded-full text-xs">
            <CalendarCheck className="w-4 h-4 mr-1" /> {new Date().getFullYear()}
         </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="!p-4 bg-indigo-50 border-indigo-100">
           <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2">
              <TrendingUp className="w-4 h-4" />
           </div>
           <p className="text-xs text-slate-500 font-semibold uppercase">Kas Masuk</p>
           <h3 className="text-lg font-bold text-slate-900">-</h3>
           <p className="text-[10px] text-slate-400 mt-1">Cek Keuangan</p>
        </Card>
        <Card className="!p-4 bg-orange-50 border-orange-100">
           <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-2">
              <Users className="w-4 h-4" />
           </div>
           <p className="text-xs text-slate-500 font-semibold uppercase">Partisipasi</p>
           <h3 className="text-lg font-bold text-slate-900">-</h3>
           <p className="text-[10px] text-slate-400 mt-1">Kehadiran anggota</p>
        </Card>
      </div>

      {/* Downloadable Reports List */}
      <div>
        <SectionHeader 
            title="Dokumen Laporan" 
            action={
                <button 
                    onClick={handleUploadClick}
                    disabled={isUploading}
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
                >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {isUploading ? 'Uploading...' : 'Upload'}
                </button>
            } 
        />
        <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,.zip,.xls,.xlsx,.jpg,.jpeg,.png"
        />
        <div className="space-y-3">
            {files.map((file) => (
                <div key={file.id} className="bg-white p-3 rounded-2xl border border-slate-50 shadow-sm flex items-center justify-between animate-fade-in group hover:border-indigo-100 transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <h4 className="font-bold text-sm text-slate-900 truncate pr-2">{file.name}</h4>
                            <p className="text-[10px] font-bold text-slate-400">{file.date} • {file.size}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a 
                            href={file.url} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-200 flex-shrink-0 transition-all active:scale-95"
                            download={file.name}
                        >
                            <Download className="w-4 h-4" />
                        </a>
                        {canDelete && (
                            <button onClick={() => handleDelete(file.id)} className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-slate-300 hover:text-red-500 transition-all active:scale-95">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            ))}
            {files.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                    Belum ada dokumen laporan.
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Reports;