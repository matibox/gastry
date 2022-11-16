interface IconProps {
  name: string;
  isFilled?: boolean;
}

export function Icon({ name, isFilled = false }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${
        isFilled ? 'icons-filled' : 'icons-normal'
      }`}
    >
      {name}
    </span>
  );
}
