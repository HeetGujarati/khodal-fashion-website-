import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  FileImage, 
  Trash2, 
  Sparkles, 
  Zap, 
  Loader2
} from 'lucide-react';
import { compressWatchImage } from '../../utils/imageCompressor';
import { uploadWatchImage } from '../../lib/supabase';

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
      message: 'Uploading photo...'
    });

    try {
      // Background optimization for fast loading
      const compressed = await compressWatchImage(file, {
        maxSizeMB: 0.49,
        maxWidthOrHeight: 1800,
        initialQuality: 0.92
      });

      setCompressionStats(compressed);
      setPreviewImage(compressed.previewUrl);

      setUploadStatus({
        type: 'info',
        message: 'Processing watch photo...'
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
          message: 'Watch photo uploaded successfully.'
        });
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadStatus({
        type: 'error',
        message: err.message || 'Failed to upload image.'
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem', padding: '1rem 0' }}>
              <Loader2 size={32} color="var(--gold-primary)" className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
              <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)' }}>Uploading watch photo...</strong>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(212, 175, 55, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UploadCloud size={24} color="var(--gold-primary)" />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  Click to Upload or Drag & Drop Photo
                </p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                  Supports JPG, PNG, WEBP
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Image Preview Card */
        <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '0.85rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Image Thumbnail */}
          <div style={{ position: 'relative', width: 72, height: 72, borderRadius: '8px', overflow: 'hidden', background: '#F8FAFC', border: '1px solid #E2E8F0', flexShrink: 0 }}>
            <img 
              src={previewImage} 
              alt="Watch preview" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileImage size={15} color="var(--gold-primary)" />
                Watch Photo
              </span>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '3px 8px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', padding: '3px 7px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer', color: '#DC2626' }}
                  title="Remove image"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '0.76rem', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <CheckCircle2 size={13} /> Ready for catalog
            </p>
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
