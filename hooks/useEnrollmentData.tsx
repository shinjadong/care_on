import { useState, useEffect, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface UseEnrollmentListOptions {
  statusFilter?: string
  searchTerm?: string
  page?: number
  pageSize?: number
  minimalFields?: boolean
}

interface UseEnrollmentDetailOptions {
  id: string | undefined
  redirectOnError?: boolean
}

// Hook for enrollment list page with optimized field selection
export function useEnrollmentList(options: UseEnrollmentListOptions = {}) {
  const {
    statusFilter = 'all',
    searchTerm = '',
    page = 1,
    pageSize = 50,
    minimalFields = true
  } = options

  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    reviewing: 0,
    approved: 0,
    rejected: 0
  })

  // Use ref to track if component is mounted
  const isMountedRef = useRef(true)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchApplications = useCallback(async () => {
    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    setLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      // Define minimal fields for list view
      const minimalSelect = minimalFields
        ? 'id, created_at, submitted_at, business_name, representative_name, phone_number, business_type, status, business_number, business_registration_url, id_card_front_url, id_card_back_url, bankbook_url'
        : '*'

      let query = supabase
        .from('enrollment_applications')
        .select(minimalSelect, { count: 'exact' })
        .order('created_at', { ascending: false })

      // Apply status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter)
      }

      // Apply search filter at database level
      if (searchTerm) {
        query = query.or(`business_name.ilike.%${searchTerm}%, representative_name.ilike.%${searchTerm}%, phone_number.ilike.%${searchTerm}%, business_number.ilike.%${searchTerm}%`)
      }

      // Apply pagination
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      // Check if component is still mounted
      if (!isMountedRef.current) return

      if (error) throw error

      setApplications(data || [])
      setTotalCount(count || 0)

      // Fetch stats separately with minimal overhead
      if (statusFilter === 'all') {
        const { data: statsData, error: statsError } = await supabase
          .from('enrollment_applications')
          .select('status')

        if (!statsError && statsData) {
          setStats({
            total: statsData.length,
            pending: statsData.filter(a => a.status === 'submitted').length,
            reviewing: statsData.filter(a => a.status === 'reviewing').length,
            approved: statsData.filter(a => a.status === 'approved').length,
            rejected: statsData.filter(a => a.status === 'rejected').length
          })
        }
      }
    } catch (err: any) {
      // Check if error is from abort
      if (err.name === 'AbortError') return

      // Only set error if component is mounted
      if (isMountedRef.current) {
        console.error('Error fetching applications:', err)
        setError(err.message || '신청 목록을 불러오는데 실패했습니다.')
      }
    } finally {
      // Only update loading state if component is mounted
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [statusFilter, searchTerm, page, pageSize, minimalFields])

  // Fetch on mount and when statusFilter changes
  useEffect(() => {
    fetchApplications()

    // Cleanup function
    return () => {
      isMountedRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchApplications])

  // Since we're now filtering at database level, no need for client-side filtering
  return {
    applications,
    loading,
    error,
    stats,
    totalCount,
    currentPage: page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
    refetch: fetchApplications
  }
}

// Hook for fetching minimal enrollment data (for preview/quick view)
export function useEnrollmentPreview(id: string | undefined) {
  const [enrollment, setEnrollment] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPreview = useCallback(async () => {
    if (!id) return

    setLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from('enrollment_applications')
        .select('id, business_name, representative_name, phone_number, status, created_at')
        .eq('id', id)
        .single()

      if (error) throw error
      setEnrollment(data)
    } catch (err: any) {
      console.error('Error fetching preview:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchPreview()
    }
  }, [id, fetchPreview])

  return { enrollment, loading, error }
}

// Hook for enrollment detail pages
export function useEnrollmentDetail(options: UseEnrollmentDetailOptions) {
  const { id, redirectOnError = false } = options
  const router = useRouter()
  const [enrollment, setEnrollment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use ref to track if component is mounted
  const isMountedRef = useRef(true)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchEnrollment = useCallback(async () => {
    // Early return if no id
    if (!id) {
      setLoading(false)
      setError('신청 ID가 없습니다.')
      if (redirectOnError) {
        router.push('/admin/enrollments')
      }
      return
    }

    // Validate id format (should be UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      setLoading(false)
      setError('잘못된 신청 ID 형식입니다.')
      if (redirectOnError) {
        router.push('/admin/enrollments')
      }
      return
    }

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController()

    setLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from('enrollment_applications')
        .select('*')
        .eq('id', id)
        .single()

      // Check if component is still mounted
      if (!isMountedRef.current) return

      if (error) throw error

      if (!data) {
        throw new Error('신청 정보를 찾을 수 없습니다.')
      }

      setEnrollment(data)
    } catch (err: any) {
      // Check if error is from abort
      if (err.name === 'AbortError') return

      // Only set error if component is mounted
      if (isMountedRef.current) {
        console.error('Error fetching enrollment:', err)
        const errorMessage = err.message || '신청 정보를 불러오는데 실패했습니다.'
        setError(errorMessage)

        if (redirectOnError) {
          alert(errorMessage)
          router.push('/admin/enrollments')
        }
      }
    } finally {
      // Only update loading state if component is mounted
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [id, router, redirectOnError])

  // Fetch on mount and when id changes
  useEffect(() => {
    fetchEnrollment()

    // Cleanup function
    return () => {
      isMountedRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchEnrollment])

  const updateEnrollment = useCallback(async (updates: any) => {
    if (!id || !enrollment) return false

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('enrollment_applications')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error

      // Update local state
      setEnrollment((prev: any) => ({ ...prev, ...updates }))
      return true
    } catch (err: any) {
      console.error('Error updating enrollment:', err)
      setError(err.message || '업데이트에 실패했습니다.')
      return false
    }
  }, [id, enrollment])

  return {
    enrollment,
    loading,
    error,
    refetch: fetchEnrollment,
    updateEnrollment
  }
}