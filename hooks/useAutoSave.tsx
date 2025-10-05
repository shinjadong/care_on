import { useEffect, useRef, useState } from 'react'
import { FormData } from '@/app/enrollment/page'

const STORAGE_KEY = 'careon_enrollment_draft'
const AUTO_SAVE_DELAY = 3000 // 3 seconds

export function useAutoSave(formData: FormData, isEnabled: boolean = true) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load saved metadata on mount so the UI can show the previous save time
  useEffect(() => {
    if (!isEnabled) return

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsedData = JSON.parse(saved)
        if (parsedData?.timestamp) {
          setLastSaved(new Date(parsedData.timestamp))
        }
      }
    } catch (error) {
      console.error('Failed to inspect saved draft metadata:', error)
    }
  }, [isEnabled])

  // Auto-save on form data changes
  useEffect(() => {
    if (!isEnabled) return

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      saveDraft()
    }, AUTO_SAVE_DELAY)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [formData, isEnabled])

  const saveDraft = async () => {
    if (!isEnabled) return

    setIsSaving(true)
    try {
      const dataToSave = {
        data: formData,
        timestamp: new Date().toISOString(),
        version: '1.0'
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
      setLastSaved(new Date())
      console.log('Draft saved to localStorage')
    } catch (error) {
      console.error('Failed to save draft:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const clearDraft = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      console.log('Draft cleared from localStorage')
    } catch (error) {
      console.error('Failed to clear draft:', error)
    }
  }

  const loadDraft = (): FormData | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsedData = JSON.parse(saved)
        return parsedData.data
      }
    } catch (error) {
      console.error('Failed to load draft:', error)
    }
    return null
  }

  return {
    lastSaved,
    isSaving,
    saveDraft,
    clearDraft,
    loadDraft
  }
}