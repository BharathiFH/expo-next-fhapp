import React, { createContext, useContext } from 'react';
import { theme } from '../theme';

const ThemeContext = createContext();
const GutterContext = createContext();

export const MUIThemeProvider = ({ children }) => <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
export const GutterProvider = ({ children, gutter, spacing }) => {
    const contextValue = { gutter, spacing };
    return <GutterContext.Provider value={contextValue}>{children}</GutterContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
export const useGutter = () => useContext(GutterContext);
