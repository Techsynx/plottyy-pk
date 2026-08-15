'use client';

import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Download } from 'lucide-react';
import { bulkImportProperties, BulkPropertyRaw } from '@/lib/importers/bulk-importer';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BulkImportModal({ isOpen, onClose, onSuccess }: BulkImportModalProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('+92 300 8456123');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; count: number; errors?: string[] } | null>(null);

  if (!isOpen) return null;

  const handleImport = async () => {
    try {
      setLoading(true);
      setResult(null);
      const parsed: BulkPropertyRaw[] = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        throw new Error('Input must be a JSON array of property objects.');
      }
      const res = await bulkImportProperties(parsed, phoneInput);
      setLoading(false);
      setResult({ success: res.success, count: res.importedCount, errors: res.errors });
      if (res.success) {
        onSuccess();
      }
    } catch (e: any) {
      setLoading(false);
      setResult({ success: false, count: 0, errors: [e.message || 'Invalid JSON format'] });
    }
  };

  const sampleTemplate = JSON.stringify(
    [
      {
        title: "1 Kanal Corner Plot in DHA Phase 6 Block L Lahore",
        description: "Direct owner hot location plot facing park, possession paid.",
        purpose: "sale",
        property_type: "plot",
        subtype: "residential_plot",
        city_name: "Lahore",
        location_name: "DHA Phase 6",
        size: 1,
        size_unit: "kanal",
        price: 42000000,
        contact_phone: "+92 300 8456123",
        contact_whatsapp: "+923008456123",
        facing: "Corner & Park Facing",
        photos: [
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200"
        ]
      }
    ],
    null,
    2
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full space-y-5 border border-[#E8E3DC] shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E3DC]">
          <div className="flex items-center space-x-2">
            <UploadCloud className="w-5 h-5 text-[#0F6B5C]" />
            <h3 className="font-extrabold text-base text-[#1F2420]">
              Bulk Property Feed Importer
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#8A8D89] hover:text-[#1F2420]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#6B726D]">
          Paste your JSON property dataset below to batch-import listings with your customized contact numbers and instant live indexing.
        </p>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
            Default Seller Phone / WhatsApp Number
          </label>
          <input
            type="text"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl px-3 py-2 text-xs font-bold text-[#1F2420] focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#8A8D89] uppercase tracking-wider">
              JSON Data Feed
            </label>
            <button
              type="button"
              onClick={() => setJsonInput(sampleTemplate)}
              className="text-[11px] font-bold text-[#0F6B5C] hover:underline"
            >
              Insert Sample Template
            </button>
          </div>
          <textarea
            rows={8}
            placeholder="Paste your JSON array here..."
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full font-mono text-xs bg-[#FAF8F5] border border-[#E8E3DC] focus:border-[#0F6B5C] rounded-xl p-3 text-[#1F2420] focus:outline-none"
          />
        </div>

        {result && (
          <div
            className={`p-3.5 rounded-xl border text-xs ${
              result.success
                ? 'bg-[#EFF6EE] border-[#7FA37A]/30 text-[#0F6B5C]'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {result.success ? (
              <div className="flex items-center space-x-2 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Successfully imported {result.count} properties!</span>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center space-x-2 font-bold">
                  <AlertCircle className="w-4 h-4" />
                  <span>Failed to import properties:</span>
                </div>
                <p className="text-[11px]">{result.errors?.join(', ')}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B726D] hover:bg-[#FAF8F5]"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={loading || !jsonInput.trim()}
            className="bg-[#0F6B5C] hover:bg-[#0c564a] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? 'Importing Data...' : 'Run Bulk Import'}
          </button>
        </div>

      </div>
    </div>
  );
}
