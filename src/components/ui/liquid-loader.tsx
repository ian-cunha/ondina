import { cn } from '@/lib/utils';

interface LiquidLoaderProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function LiquidLoader({ className, size = 'md' }: LiquidLoaderProps) {
    const sizeClasses = {
        sm: 'h-5 w-5',
        md: 'h-12 w-12',
        lg: 'h-24 w-24',
    };

    const borderClasses = {
        sm: 'border-2',
        md: 'border-4',
        lg: 'border-8',
    };

    const insetClasses = {
        sm: 'inset-[3px]',
        md: 'inset-[8px]',
        lg: 'inset-[16px]',
    };

    const dotClasses = {
        sm: 'h-1 w-1 -translate-y-0.5',
        md: 'h-2 w-2 -translate-y-1',
        lg: 'h-4 w-4 -translate-y-2',
    };

    return (
        <div className={cn("relative flex items-center justify-center shrink-0", sizeClasses[size], className)}>
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-fuchsia-500 blur-md opacity-40 animate-pulse" />
            
            {/* Outer spinning ring */}
            <div className={cn("absolute inset-0 rounded-full border-white/10 dark:border-white/5 border-t-primary border-r-fuchsia-500 animate-spin drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]", borderClasses[size])} />
            
            {/* Inner counter-spinning droplet/lens */}
            <div className={cn("absolute rounded-full bg-white/40 dark:bg-white/10 backdrop-blur-md shadow-inner flex items-center justify-center animate-[spin_1.5s_linear_infinite_reverse]", insetClasses[size])}>
                <div className={cn("rounded-full bg-white shadow-[0_0_3px_white]", dotClasses[size])} />
            </div>
        </div>
    );
}
