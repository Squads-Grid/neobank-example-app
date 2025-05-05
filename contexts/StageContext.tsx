import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Stage } from '@/components/devtools/StageSelector';

interface StageContextType {
    stage: Stage;
    setStage: (stage: Stage) => void;
}

const StageContext = createContext<StageContextType | undefined>(undefined);

export function StageProvider({ children, initialStage = 'new' }: { children: ReactNode; initialStage?: Stage }) {
    const [stage, setStage] = useState<Stage>(initialStage);

    return (
        <StageContext.Provider value={{ stage, setStage }}>
            {children}
        </StageContext.Provider>
    );
}

export function useStage() {
    const context = useContext(StageContext);
    if (context === undefined) {
        throw new Error('useStage must be used within a StageProvider');
    }
    return context;
} 