'use client';

interface JumpingTextProps {
  text: string;
  className?: string;
}

export function JumpingText({ text, className = '' }: JumpingTextProps) {
  const letters = text.split('');

  return (
    <>
      {letters.map((letter, index) => (
        <span
          key={index}
          className={`jump-letter ${className}`}
          style={{
            animationDelay: `${index * 0.05}s`
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </>
  );
}
