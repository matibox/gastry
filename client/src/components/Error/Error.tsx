import { TError } from '../../types/Error';

interface ErrorProps {
  color?: string;
  size?: 'normal' | 'small' | 'large';
  errors: TError[];
}

export function Error({
  color = 'error',
  size = 'normal',
  errors,
}: ErrorProps) {
  return (
    <div>
      {errors.map(error => (
        <p
          key={error.message}
          style={{
            color: `var(--${color})`,
            fontSize:
              size === 'normal'
                ? '2rem'
                : size === 'small'
                ? '1.5rem'
                : '2.5rem',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          {error.message}
        </p>
      ))}
    </div>
  );
}
