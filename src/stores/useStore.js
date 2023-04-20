import create from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export default create(subscribeWithSelector((set) =>
{
    return {
        phase: 'inactive',
        mode: 'default',

        start: () =>
        {
            set((state) =>
            {
                if(state.phase === 'inactive')
                    return { phase: 'playing' }

                return {}
            })
        },
        
        toggleDrive: () => {
            set((state) => {
                if (state.mode === 'default') {
                    return { mode: 'train'}
                } else if (state.mode === 'train') {
                    return { mode: 'default'}
                } else if (state.mode === 'inactive') {
                    return { mode: 'train', phase: 'playing'}
                }
            })
        },

        setMode: (mode) => {
            set((state) => {
                return { mode: mode }
            })
        },

        restart: () => 
        {
            set((state) => {
                return { phase: 'ready'}
            })
        },
    }
}))