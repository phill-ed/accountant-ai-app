'use client'

import React, { useState, useRef, useCallback } from 'react'
import {
  Upload, Camera, X, Check, AlertCircle, Loader2, FileText, Receipt,
  Eye, Download, Trash2, Plus, RefreshCw, Sparkles
} from 'lucide-react'
import Tesseract from 'tesseract.js'

interface ReceiptItem {
  id: string
  description: string
  quantity: number
  price: number
}

interface ScannedReceipt {
  id: string
  vendor: string
  date: string
  items: ReceiptItem[]
  subtotal: number
  tax: number
  total: number
  confidence: number
  rawText: string
  imageUrl?: string
  processedAt: Date
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount)
}

const extractAmount = (text: string, pattern: RegExp): number => {
  const match = text.match(pattern)
  return match ? parseFloat(match[1].replace(/[^0-9.]/g, '')) : 0
}

const parseReceiptText = (text: string): Partial<ScannedReceipt> => {
  const result: Partial<ScannedReceipt> = {
    rawText: text,
    items: []
  }

  // Extract date (various formats)
  const datePatterns = [
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
    /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/,
    /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})/i
  ]
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern)
    if (match) {
      result.date = match[1]
      break
    }
  }

  // Try to find vendor (usually first meaningful line)
  const lines = text.split('\n').filter(l => l.trim().length > 3)
  if (lines.length > 0) {
    // Skip common header lines
    const skipWords = ['receipt', 'invoice', 'tax', 'total', 'thank', 'welcome', 'cashier', 'date', 'time']
    for (const line of lines) {
      const lower = line.toLowerCase()
      if (!skipWords.some(w => lower.includes(w)) && line.length > 3 && line.length < 50) {
        result.vendor = line.trim()
        break
      }
    }
  }

  // Extract total amount
  result.total = extractAmount(text, /(?:total|amount|grand\s*total)[:\s]*Rp?\s*([\d,]+\.?\d*)/i) ||
                 extractAmount(text, /(?:Rp|IDR)[\s]*([\d,]+\.?\d*)/i) ||
                 extractAmount(text, /(\d+\.\d{2})\s*$/)

  // Extract tax
  result.tax = extractAmount(text, /(?:tax|vat|gst)[:\s]*Rp?\s*([\d,]+\.?\d*)/i)

  // Extract subtotal
  result.subtotal = extractAmount(text, /(?:sub\s*total| subtotal)[:\s]*Rp?\s*([\d,]+\.?\d*)/i)

  // Try to parse line items
  const itemPatterns = [
    /(.{3,50})\s+(\d+)\s+x?\s*Rp?\s*([\d,]+\.?\d*)/gi,
    /(.{3,50})\s+([\d,]+\.?\d{2})\s*$/gm
  ]

  const foundItems: ReceiptItem[] = []
  const itemLines = text.split('\n').filter(l => {
    const lower = l.toLowerCase()
    return !['total', 'tax', 'subtotal', 'thank', 'change', 'cash', 'credit'].some(w => lower.includes(w)) &&
           /\d/.test(l) &&
           l.length > 5 &&
           l.length < 60
  })

  for (const line of itemLines.slice(0, 10)) {
    const priceMatch = line.match(/(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*$/)
    if (priceMatch) {
      const price = parseFloat(priceMatch[1].replace(/,/g, ''))
      if (price > 0 && price < 10000000) { // Reasonable price range
        const description = line.replace(priceMatch[0], '').trim()
          .replace(/\d+\s*[xX*]\s*/, '')
          .replace(/[-–—]{2,}/g, '')
          .trim()
        if (description.length > 2) {
          foundItems.push({
            id: `item-${foundItems.length + 1}`,
            description: description.slice(0, 40),
            quantity: 1,
            price
          })
        }
      }
    }
  }
  result.items = foundItems.slice(0, 8)

  // Calculate confidence based on what we found
  let confidence = 0
  if (result.vendor) confidence += 20
  if (result.date) confidence += 15
  if (result.total > 0) confidence += 30
  if (result.items.length > 0) confidence += Math.min(result.items.length * 8, 25)
  if (result.tax > 0) confidence += 10

  result.confidence = Math.min(confidence, 100)

  return result
}

export default function ReceiptScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanStatus, setScanStatus] = useState('')
  const [scannedReceipts, setScannedReceipts] = useState<ScannedReceipt[]>([])
  const [selectedReceipt, setSelectedReceipt] = useState<ScannedReceipt | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [manualMode, setManualMode] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleScan = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, etc.)')
      return
    }

    setIsScanning(true)
    setScanProgress(0)
    setScanStatus('Initializing OCR engine...')

    try {
      const imageUrl = URL.createObjectURL(file)
      
      // Perform OCR
      const result = await Tesseract.recognize(imageUrl, 'eng+ind', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setScanProgress(Math.round(m.progress * 100))
            setScanStatus(`Scanning receipt... ${Math.round(m.progress * 100)}%`)
          } else {
            setScanStatus(m.status)
          }
        }
      })

      setScanStatus('Processing extracted data...')
      
      // Parse the extracted text
      const parsedData = parseReceiptText(result.data.text)

      // Create receipt object
      const receipt: ScannedReceipt = {
        id: `RCP-${Date.now()}`,
        vendor: parsedData.vendor || 'Unknown Vendor',
        date: parsedData.date || new Date().toLocaleDateString('id-ID'),
        items: parsedData.items || [],
        subtotal: parsedData.subtotal || parsedData.items?.reduce((sum, i) => sum + i.price, 0) || 0,
        tax: parsedData.tax || 0,
        total: parsedData.total || parsedData.subtotal || 0,
        confidence: parsedData.confidence || 50,
        rawText: result.data.text,
        imageUrl,
        processedAt: new Date()
      }

      // If no total found, try to calculate from items
      if (receipt.total === 0 && receipt.items.length > 0) {
        receipt.total = receipt.items.reduce((sum, i) => sum + i.price, 0)
      }

      setScannedReceipts(prev => [receipt, ...prev])
      setSelectedReceipt(receipt)
      setScanStatus('Receipt processed successfully!')
      
      setTimeout(() => {
        setIsScanning(false)
        setScanProgress(0)
        setScanStatus('')
      }, 1500)

    } catch (error) {
      console.error('OCR Error:', error)
      setScanStatus('Error processing receipt. Please try again.')
      setIsScanning(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleScan(e.dataTransfer.files[0])
    }
  }, [handleScan])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(e.type === 'dragenter' || e.type === 'dragover')
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleScan(e.target.files[0])
    }
  }, [handleScan])

  const deleteReceipt = (id: string) => {
    setScannedReceipts(prev => prev.filter(r => r.id !== id))
    if (selectedReceipt?.id === id) {
      setSelectedReceipt(null)
    }
  }

  const exportReceipt = (receipt: ScannedReceipt) => {
    const text = `
RECEIPT
=======
Vendor: ${receipt.vendor}
Date: ${receipt.date}
Confidence: ${receipt.confidence}%

ITEMS:
-------
${receipt.items.map(i => `${i.description} - ${formatCurrency(i.price)}`).join('\n')}

SUBTOTAL: ${formatCurrency(receipt.subtotal)}
TAX: ${formatCurrency(receipt.tax)}
TOTAL: ${formatCurrency(receipt.total)}

Raw Text:
---------
${receipt.rawText}
    `.trim()

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${receipt.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.25rem' }}>
            📸 Receipt Scanner
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Upload receipts to automatically extract vendor, date, items, and total
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setManualMode(!manualMode)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              background: manualMode ? '#3b82f6' : 'white',
              color: manualMode ? 'white' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <FileText size={18} />
            {manualMode ? 'Switch to Scan' : 'Manual Entry'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '1.5rem' }}>
        {/* Scanner Area */}
        <div>
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            style={{
              border: `2px dashed ${dragActive ? '#3b82f6' : '#e2e8f0'}`,
              borderRadius: '12px',
              padding: '3rem',
              textAlign: 'center',
              background: dragActive ? 'rgba(59, 130, 246, 0.05)' : 'white',
              transition: 'all 0.2s',
              marginBottom: '1.5rem'
            }}
          >
            {isScanning ? (
              <div>
                <Loader2 size={48} style={{ color: '#3b82f6', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
                <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>{scanStatus}</p>
                <div style={{ width: '100%', maxWidth: 300, margin: '0 auto', height: 8, background: '#e2e8f0', borderRadius: 4 }}>
                  <div style={{ width: `${scanProgress}%`, height: '100%', background: '#3b82f6', borderRadius: 4, transition: 'width 0.3s' }} />
                </div>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>{scanProgress}% complete</p>
              </div>
            ) : (
              <>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Receipt size={32} style={{ color: '#3b82f6' }} />
                </div>
                <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Upload Receipt</h3>
                <p style={{ color: '#64748b', marginBottom: '1rem' }}>
                  Drag and drop a receipt image here, or click to browse
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  <button
                    onClick={() => inputRef.current?.click()}
                    style={{
                      padding: '0.625rem 1.5rem',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Upload size={18} />
                    Choose File
                  </button>
                  <button
                    onClick={() => {
                      // Simulate camera capture for demo
                      const video = document.createElement('video')
                      video.autoplay = true
                      document.body.appendChild(video)
                      alert('Camera feature: In a production app, this would open the device camera for real-time receipt capture.')
                      document.body.removeChild(video)
                    }}
                    style={{
                      padding: '0.625rem 1.5rem',
                      background: 'white',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Camera size={18} />
                    Take Photo
                  </button>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '1rem' }}>
                  Supports: JPG, PNG, GIF, WebP • Max size: 10MB
                </p>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  style={{ display: 'none' }}
                />
              </>
            )}
          </div>

          {/* Scanned Receipts List */}
          {scannedReceipts.length > 0 && (
            <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Scanned Receipts ({scannedReceipts.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {scannedReceipts.map(receipt => (
                  <div
                    key={receipt.id}
                    onClick={() => setSelectedReceipt(receipt)}
                    style={{
                      padding: '1rem',
                      border: `2px solid ${selectedReceipt?.id === receipt.id ? '#3b82f6' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: selectedReceipt?.id === receipt.id ? 'rgba(59, 130, 246, 0.05)' : 'white',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        {receipt.imageUrl && (
                          <img src={receipt.imageUrl} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
                        )}
                        <div>
                          <div style={{ fontWeight: 500 }}>{receipt.vendor}</div>
                          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{receipt.date}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 600, color: '#10b981' }}>{formatCurrency(receipt.total)}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {receipt.confidence}% confidence
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); exportReceipt(receipt); }}
                        style={{
                          padding: '0.375rem 0.75rem',
                          background: '#f1f5f9',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Download size={14} />
                        Export
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteReceipt(receipt.id); }}
                        style={{
                          padding: '0.375rem 0.75rem',
                          background: '#fef2f2',
                          color: '#ef4444',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Details Panel */}
        <div>
          {selectedReceipt ? (
            <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'sticky', top: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontWeight: 600 }}>Receipt Details</h3>
                <button onClick={() => setSelectedReceipt(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={20} style={{ color: '#64748b' }} />
                </button>
              </div>

              {/* Receipt Image */}
              {selectedReceipt.imageUrl && (
                <div style={{ marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={selectedReceipt.imageUrl} alt="Receipt" style={{ width: '100%', display: 'block' }} />
                </div>
              )}

              {/* Vendor Info */}
              <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>VENDOR</div>
                <div style={{ fontWeight: 600 }}>{selectedReceipt.vendor}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>{selectedReceipt.date}</div>
              </div>

              {/* Items */}
              {selectedReceipt.items.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>ITEMS DETECTED</div>
                  {selectedReceipt.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ flex: 1 }}>{item.description}</span>
                      <span style={{ fontWeight: 500 }}>{formatCurrency(item.price)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Totals */}
              <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b' }}>Subtotal</span>
                  <span>{formatCurrency(selectedReceipt.subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#64748b' }}>Tax</span>
                  <span>{formatCurrency(selectedReceipt.tax)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.125rem' }}>
                  <span>TOTAL</span>
                  <span style={{ color: '#10b981' }}>{formatCurrency(selectedReceipt.total)}</span>
                </div>
              </div>

              {/* Confidence */}
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: selectedReceipt.confidence > 70 ? 'rgba(16, 185, 129, 0.1)' : selectedReceipt.confidence > 40 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {selectedReceipt.confidence > 70 ? (
                    <Check size={16} style={{ color: '#10b981' }} />
                  ) : selectedReceipt.confidence > 40 ? (
                    <AlertCircle size={16} style={{ color: '#f59e0b' }} />
                  ) : (
                    <AlertCircle size={16} style={{ color: '#ef4444' }} />
                  )}
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    {selectedReceipt.confidence}% confidence
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                  {selectedReceipt.confidence > 70 ? 'Data looks accurate' : selectedReceipt.confidence > 40 ? 'Some data may need verification' : 'Please review carefully'}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button style={{ flex: 1, padding: '0.75rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Plus size={18} />
                  Add to Expenses
                </button>
                <button style={{ padding: '0.75rem', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer' }} onClick={() => exportReceipt(selectedReceipt)}>
                  <Download size={18} style={{ color: '#64748b' }} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
              <Receipt size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
              <p style={{ color: '#64748b' }}>Select a scanned receipt to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
