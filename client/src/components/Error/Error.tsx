import { TError } from '../../types/Error';

interface ErrorProps {
  color?: string;
  size?: 'normal' | 'small' | 'large';
  errors: TError[];
  centered?: boolean;
}

export function Error({
  color = 'error',
  size = 'normal',
  errors,
  centered = false,
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
                ? '1.7rem'
                : 'clamp(2.4rem, 5vw, 3.6rem)',
            fontFamily: 'Montserrat, sans-serif',
            textAlign: centered ? 'center' : 'left',
          }}
        >
          {error.message}
        </p>
      ))}
    </div>
  );
}
