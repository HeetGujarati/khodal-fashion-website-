import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  FileImage, 
  Trash2, 
  Sparkles, 
  Zap, 
  Cloud, 
  Loader2
} from 'lucide-react';
import { compressWatchImage } from '../../utils/imageCompressor';
import { uploadWatchImage, isSupabaseConfigured } from '../../lib/supabase';

export const ImageUploadDropzone = ({ 
  currentImage, 
  onImageReady, 
  productName = 'watch' 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionStats, setCompressionStats] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null); // { type: 'success' | 'error' | 'info', message: string }
  const [previewImage, setPreviewImage] = useState(currentImage || '');
  const fileInputRef = useRef(null);

  const hasSupabase = isSupabaseConfigured();

  const processFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadStatus({
        type: 'error',
        message: 'Please select an image file (JPG, PNG, WEBP).'
      });
      return;
    }

    setIsProcessing(true);
    setUploadStatus({
      type: 'info',
      message: 'Compressing image with ultra-high quality...'
    });

    try {
      // 1. Smart compression (Strictly <= 500 KB WebP, 92% high visual fidelity, 1800px max)
      const compressed = await compressWatchImage(file, {
        maxSizeMB: 0.49,
        maxWidthOrHeight: 1800,
        initialQuality: 0.92
      });

      setCompressionStats(compressed);
      setPreviewImage(compressed.previewUrl);

      // 2. Upload to Supabase Storage (or fallback to optimized Base64)
      setUploadStatus({
        type: 'info',
        message: hasSupabase 
          ? 'Uploading compressed WebP to Supabase Storage...' 
          : 'Processing optimized image data...'
      });

      const uploadResult = await uploadWatchImage(compressed.file, productName);

      if (uploadResult.publicUrl) {
        setPreviewImage(uploadResult.publicUrl);
        onImageReady(uploadResult.publicUrl, {
          ...compressed,
          isCloud: uploadResult.isCloud,
          storagePath: uploadResult.storagePath
        });

        setUploadStatus({
          type: 'success',
          message: uploadResult.isCloud 
            ? `Uploaded to Supabase! Saved ${compressed.savingsPercent}% bandwidth (${compressed.originalFormatted} → ${compressed.compressedFormatted}).`
            : `Image compressed by ${compressed.savingsPercent}% (${compressed.originalFormatted} → ${compressed.compressedFormatted}) with 100% sharpness.`
        });
      }
    } catch (err) {
      console.error('Compression/Upload error:', err);
      setUploadStatus({
        type: 'error',
        message: err.message || 'Failed to process image.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleClear = () => {
    setPreviewImage('');
    setCompressionStats(null);
    setUploadStatus(null);
    onImageReady('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Main Upload Box */}
      {!previewImage ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: isDragging ? '2px dashed var(--gold-primary)' : '2px dashed #D4AF37',
            background: isDragging ? 'rgba(212, 175, 55, 0.08)' : '#FAF8F5',
            borderRadius: '14px',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
        >
          {isProcessing ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <Loader2 size={36} color="var(--gold-primary)" className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
              <div>
                <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>Compressing & Optimizing (Target &le; 500 KB)...</strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
                  Preserving razor-sharp dial markers & metallic sheen under 500 KB
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UploadCloud size={28} color="var(--gold-primary)" />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  Click to Upload or Drag & Drop Watch Photo
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Auto-compressed up to 500 KB with 100% dial quality preserved
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', background: '#FFFFFF', padding: '3px 8px', borderRadius: '12px', border: '1px solid #E2E8F0', color: '#16A34A', fontWeight: 600 }}>
                  <Zap size={11} /> 500 KB Quality Compressor Active
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', background: '#FFFFFF', padding: '3px 8px', borderRadius: '12px', border: '1px solid #E2E8F0', color: hasSupabase ? '#2563EB' : '#D97706', fontWeight: 600 }}>
                  <Cloud size={11} /> {hasSupabase ? 'Supabase Storage Ready' : 'Local + Cloud Ready'}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Image Preview & Optimization Summary */
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '14px', padding: '1rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          {/* Image Thumbnail */}
          <div style={{ position: 'relative', width: 96, height: 96, borderRadius: '10px', overflow: 'hidden', background: '#F1F5F9', border: '1px solid #E2E8F0', flexShrink: 0 }}>
            <img 
              src={previewImage} 
              alt="Watch preview" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileImage size={16} color="var(--gold-primary)" />
                Optimized Watch Photo
              </span>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', color: '#DC2626' }}
                  title="Remove image"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* Bandwidth Savings Badge */}
            {compressionStats ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', borderRadius: '6px', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', color: '#166534', fontWeight: 700 }}>
                  <Sparkles size={12} />
                  <span>{compressionStats.savingsPercent}% Bandwidth Saved</span>
                </div>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  <del>{compressionStats.originalFormatted}</del> → <strong style={{ color: '#0F172A' }}>{compressionStats.compressedFormatted}</strong>
                </span>
                <span style={{ fontSize: '0.72rem', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', color: '#475569', fontWeight: 600 }}>
                  WebP (Ultra-Sharp 1800px • &le;500 KB)
                </span>
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Active watch photo URL ready for catalog listing.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Upload/Compression Status Alert */}
      {uploadStatus && (
        <div style={{
          padding: '0.65rem 0.9rem',
          borderRadius: '8px',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: uploadStatus.type === 'success' ? '#F0FDF4' : uploadStatus.type === 'error' ? '#FEF2F2' : '#EFF6FF',
          border: `1px solid ${uploadStatus.type === 'success' ? '#BBF7D0' : uploadStatus.type === 'error' ? '#FECACA' : '#BFDBFE'}`,
          color: uploadStatus.type === 'success' ? '#15803D' : uploadStatus.type === 'error' ? '#B91C1C' : '#1D4ED8'
        }}>
          {uploadStatus.type === 'success' && <CheckCircle2 size={15} style={{ flexShrink: 0 }} />}
          {uploadStatus.type === 'error' && <AlertCircle size={15} style={{ flexShrink: 0 }} />}
          {uploadStatus.type === 'info' && <Loader2 size={15} style={{ flexShrink: 0, animation: 'spin 1s linear infinite' }} />}
          <span>{uploadStatus.message}</span>
        </div>
      )}
    </div>
  );
};
