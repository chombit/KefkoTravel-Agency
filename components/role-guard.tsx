"use client"

import { ReactNode } from 'react'
import { useAuth } from '@/contexts/auth-context'

interface RoleGuardProps {
  children: ReactNode
  requiredRole?: 'USER' | 'ADMIN' | 'AGENT'
  fallback?: ReactNode
}

export function RoleGuard({ children, requiredRole, fallback = null }: RoleGuardProps) {
  const { user } = useAuth()

  if (!user) {
    return fallback
  }

  if (requiredRole) {
    const roleHierarchy = {
      'USER': 1,
      'AGENT': 2,
      'ADMIN': 3
    }

    const userRoleLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0

    if (userRoleLevel < requiredRoleLevel) {
      return fallback
    }
  }

  return <>{children}</>
}

export function AdminOnly({ children, fallback }: RoleGuardProps) {
  return (
    <RoleGuard requiredRole="ADMIN" fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

export function AgentOnly({ children, fallback }: RoleGuardProps) {
  return (
    <RoleGuard requiredRole="AGENT" fallback={fallback}>
      {children}
    </RoleGuard>
  )
}
