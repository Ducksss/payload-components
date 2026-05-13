'use client'

import React, { createContext, useCallback, use, useState } from 'react'

import type { Theme, ThemeContextType } from './types'

import canUseDOM from '@/utilities/canUseDOM'
import { defaultTheme, getImplicitPreference, themeLocalStorageKey } from './shared'
import { themeIsValid } from './types'

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: undefined,
}

const ThemeContext = createContext(initialContext)

const getPreferredTheme = (): Theme => {
  const preference = window.localStorage.getItem(themeLocalStorageKey)

  if (themeIsValid(preference)) {
    return preference
  }

  return getImplicitPreference() || defaultTheme
}

const getInitialTheme = (): Theme | undefined => {
  if (!canUseDOM) {
    return undefined
  }

  const themeToSet = getPreferredTheme()

  document.documentElement.setAttribute('data-theme', themeToSet)

  return themeToSet
}

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme | undefined>(getInitialTheme)

  const setTheme = useCallback((themeToSet: Theme | null) => {
    if (themeToSet === null) {
      window.localStorage.removeItem(themeLocalStorageKey)
      const implicitPreference = getImplicitPreference() || defaultTheme
      document.documentElement.setAttribute('data-theme', implicitPreference)
      setThemeState(implicitPreference)
    } else {
      setThemeState(themeToSet)
      window.localStorage.setItem(themeLocalStorageKey, themeToSet)
      document.documentElement.setAttribute('data-theme', themeToSet)
    }
  }, [])

  return <ThemeContext value={{ setTheme, theme }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
