"use client"

import React, { useState, useEffect, createContext, useContext } from "react"
import { createClient } from "@/lib/supabase/client-with-fallback"
import { getRedirectUrl } from "@/lib/utils/get-redirect-url"
import type { User, Session } from "@supabase/supabase-js"

// 인증 컨텍스트 타입 정의
interface IAuthContext {
  user: User | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<{ error: Error | null }>
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>
  signUpWithEmail: (email: string, password: string, options?: { data?: { full_name?: string } }) => Promise<{ error: Error | null }>
}

// 인증 컨텍스트 생성
const AuthContext = createContext<IAuthContext | undefined>(undefined)

// 인증 훅
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth는 AuthProvider 내에서 사용되어야 합니다")
  }
  return context
}

// 인증 프로바이더 (전역 상태 관리용)
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // 현재 세션 확인
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error("세션 확인 오류:", error)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error("세션 가져오기 실패:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    // 인증 상태 변화 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("인증 상태 변화:", event, session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
        
        // 로그인 성공 시 리다이렉트 처리
        if (event === 'SIGNED_IN' && session) {
          const urlParams = new URLSearchParams(window.location.search)
          const redirectTo = urlParams.get('redirectTo') || '/'
          window.location.href = redirectTo
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // 구글 로그인
  const signInWithGoogle = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: getRedirectUrl('/auth/callback'),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        console.error("구글 로그인 오류:", error)
        return { error }
      }

      return { error: null }
    } catch (error) {
      console.error("구글 로그인 실패:", error)
      return { error: error as Error }
    }
  }

  // 이메일 로그인
  const signInWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("이메일 로그인 오류:", error)
        return { error }
      }

      return { error: null }
    } catch (error) {
      console.error("이메일 로그인 실패:", error)
      return { error: error as Error }
    } finally {
      setIsLoading(false)
    }
  }

  // 이메일 회원가입
  const signUpWithEmail = async (
    email: string, 
    password: string, 
    options?: { data?: { full_name?: string } }
  ) => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: options?.data || {},
        },
      })

      if (error) {
        console.error("이메일 회원가입 오류:", error)
        return { error }
      }

      return { error: null }
    } catch (error) {
      console.error("이메일 회원가입 실패:", error)
      return { error: error as Error }
    } finally {
      setIsLoading(false)
    }
  }

  // 로그아웃
  const signOut = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("로그아웃 오류:", error)
      } else {
        setUser(null)
        setSession(null)
        window.location.href = "/"
      }
    } catch (error) {
      console.error("로그아웃 실패:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const value: IAuthContext = {
    user,
    session,
    isLoading,
    signOut,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// 간단한 인증 상태만 필요한 경우를 위한 훅
export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user, isLoading }
}
