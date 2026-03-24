'use client'

import { motion } from 'framer-motion'
import { FiUpload, FiFile, FiX } from 'react-icons/fi'
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

interface SLADocument {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  validUntil: string;
  uploadedDate: string;
  status: string;
}

interface UploadSLADocumentProps {
  documents?: SLADocument[];
  onDelete?: (docId: string) => void;
  onUpload?: (doc: SLADocument) => void;
}

export default function UploadSLADocument({ documents = [], onDelete, onUpload }: UploadSLADocumentProps) {

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Camera capture state
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | 'environment'>('environment')
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ]
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Unsupported file type. Please upload a PDF, DOC, DOCX, or image.')
      setSelectedFile(null)
      setPreviewUrl(null)
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File is too large. Max size is 10 MB.')
      setSelectedFile(null)
      setPreviewUrl(null)
      return
    }

    setError(null)
    setSelectedFile(file)

    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacingMode },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play().catch(() => {})
      }
    } catch (err) {
      setError('Unable to access camera. Please allow camera permissions or try a different browser.')
      setIsCameraOpen(false)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current) return

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], `photo-${Date.now()}.png`, { type: 'image/png' })
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(blob))
      setError(null)
      setIsCameraOpen(false)
    }, 'image/png')
  }

  const [recentDocs, setRecentDocs] = useState<SLADocument[]>(documents)

  const loadSlaDocuments = async () => {
    try {
      const response = await fetch('/api/business/settings/sla')
      if (!response.ok) {
        const err = await response.json().catch(() => null)
        setError(err?.error || 'Unable to load SLA documents')
        return
      }
      const data = await response.json()
      if (Array.isArray(data)) {
        setRecentDocs(data)
      }
    } catch (err) {
      console.error('Failed to fetch SLA documents:', err)
      setError('Unable to load SLA documents')
    }
  }

  useEffect(() => {
    if (isCameraOpen) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => stopCamera()
  }, [isCameraOpen, cameraFacingMode])

  useEffect(() => {
    loadSlaDocuments()
  }, [])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!selectedFile) {
      setError('Please select a file before uploading.')
      return
    }

    setIsSubmitting(true)

    const uploadDoc = {
      fileName: selectedFile.name,
      fileUrl: URL.createObjectURL(selectedFile),
      fileSize: `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB`,
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      uploadedDate: new Date().toISOString(),
      status: 'active',
    }

    try {
      const response = await fetch('/api/business/settings/sla', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadDoc),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => null)
        setError(err?.error || 'Failed to upload SLA document')
        return
      }

      const savedDoc = await response.json()

      const newDoc: SLADocument = {
        id: savedDoc.id || `${Date.now()}`,
        fileName: savedDoc.fileName || uploadDoc.fileName,
        fileUrl: savedDoc.fileUrl || uploadDoc.fileUrl,
        fileSize: savedDoc.fileSize || uploadDoc.fileSize,
        validUntil: savedDoc.validUntil || uploadDoc.validUntil,
        uploadedDate: savedDoc.uploadedDate || uploadDoc.uploadedDate,
        status: savedDoc.status || 'active',
      }

      if (onUpload) {
        onUpload(newDoc)
      }

      await loadSlaDocuments()

      setSelectedFile(null)
      setPreviewUrl(null)
      setError(null)
      toast.success('SLA document uploaded successfully')
    } catch (err) {
      console.error('SLA upload error:', err)
      setError('Network error uploading SLA document')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col space-y-6"
    >
        <div className='flex flex-col space-y-6 bg-[#ffffff] p-8 rounded-[10px]'>
            {/* Header */}
            <div>
                <h2 className="text-xl font-bold">Upload SLA Document</h2>
            </div>

            {/* Upload Area */}
            <motion.div
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 w-[90%] md:w-[80%] mx-auto text-center hover:border-blue-400 transition-colors cursor-pointer group"
                whileHover={{ backgroundColor: '#f0f9ff' }}
            >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-200 transition-colors">
                      <FiUpload className="text-2xl text-[#49A5EF]" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Drop your SLA document here</h3>
                  <div className="flex flex-col items-center gap-3 w-full max-w-md">
                    <div className="flex items-center flex-col justify-center gap-3 w-full">
                      <p className="text-sm text-gray-500 text-center">
                        or click to browse. Supported formats: PDF, DOC, DOCX, image
                      </p>
                      <div className='md:space-x-4 space-y-2 md:space-y-0 md:space-y-0 flex flex-col md:flex-row items-center justify-center w-full'>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-[#49A5EF] text-white rounded-lg hover:bg-blue-500 transition-colors text-sm font-medium"
                          >
                          Upload document
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCameraOpen(true)}
                          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                          >
                          Take photo
                        </button>
                      </div>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <input type="hidden" name="documentType" value="sla" />

                    {isCameraOpen && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="relative w-full max-w-lg rounded-xl bg-white p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold">Take a photo</p>
                            <button
                              type="button"
                              onClick={() => setIsCameraOpen(false)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              Close
                            </button>
                          </div>
                          <div className="mt-4">
                            <video
                              ref={videoRef}
                              className="h-64 w-full rounded-lg bg-black object-cover"
                              playsInline
                              muted
                            />
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setCameraFacingMode((prev) =>
                                  prev === 'user' ? 'environment' : 'user'
                                )
                              }
                              className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                            >
                              Switch camera
                            </button>
                            <button
                              type="button"
                              onClick={capturePhoto}
                              className="flex-1 px-3 py-2 bg-[#49A5EF] text-white rounded-lg hover:bg-blue-500 text-sm"
                            >
                              Capture
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {error && (
                      <p className="text-sm text-red-600 mt-2">{error}</p>
                    )}

                    {selectedFile && (
                      <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-4 text-left">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{selectedFile.name}</p>
                            <p className="text-xs text-gray-500">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null)
                              setPreviewUrl(null)
                              setError(null)
                            }}
                            className="p-1 rounded-full text-gray-500 hover:text-gray-700"
                          >
                            <FiX />
                          </button>
                        </div>

                        {previewUrl && (
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="mt-3 max-h-40 w-full object-contain rounded-md border border-gray-200"
                          />
                        )}

                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 bg-[#49A5EF] text-white rounded-lg hover:bg-blue-500 disabled:opacity-50"
                        >
                          {isSubmitting ? 'Uploading…' : 'Submit'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
            </motion.div>
        </div>

      {/* Documents List */}
      <div className='flex flex-col space-y-6 bg-[#ffffff] p-8 rounded-[10px]'>
        <h3 className="font-semibold text-gray-900 mb-4">Recent Documents</h3>
        <div className="space-y-3">
          {(recentDocs.length ? recentDocs : documents).map((doc) => (
            <motion.div
              key={doc.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              whileHover={{ backgroundColor: '#f9fafb' }}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <FiFile className="text-lg text-red-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{doc.fileName}</h4>
                  <p className="text-xs text-gray-500">
                    {new Date(doc.uploadedDate).toLocaleDateString()} • {doc.fileSize}
                  </p>
                </div>
              </div>
              <div className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium capitalize">
                {doc.status}
              </div>
              <button
                onClick={() => onDelete?.(doc.id)}
                className="p-2 hover:bg-red-50 rounded transition-colors"
                title="Delete document"
              >
                <FiX className="text-lg text-red-600" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
