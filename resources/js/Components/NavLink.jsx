import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ' +
                (active
                    ? 'bg-primary text-primary-foreground shadow-md border-l-4 border-primary-foreground/20'
                    : 'text-muted-foreground hover:bg-muted hover:text-primary hover:shadow-sm') +
                ' ' + className
            }
        >
            {children}
        </Link>
    );
}
