interface SectionDividerProps {
  variant?: 'wave' | 'curve' | 'zigzag' | 'diagonal';
  flip?: boolean;
  className?: string;
}

export default function SectionDivider({ 
  variant = 'wave', 
  flip = false, 
  className = '' 
}: SectionDividerProps) {
  const renderPath = () => {
    switch (variant) {
      case 'wave':
        return "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z";
      
      case 'curve':
        return "M0,32L48,42.7C96,53,192,75,288,80C384,85,480,75,576,58.7C672,43,768,21,864,26.7C960,32,1056,64,1152,69.3C1248,75,1344,53,1392,42.7L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z";
      
      case 'zigzag':
        return "M0,0 L120,80 L240,0 L360,80 L480,0 L600,80 L720,0 L840,80 L960,0 L1080,80 L1200,0 V120 H0 Z";
      
      case 'diagonal':
        return "M0,0 L1200,80 V120 H0 Z";
        
      default:
        return "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z";
    }
  };

  return (
    <div className={`relative ${flip ? 'rotate-180' : ''} ${className}`}>
      <svg 
        viewBox={variant === 'zigzag' ? '0 0 1200 120' : '0 0 1200 120'}
        preserveAspectRatio="none" 
        className="w-full h-12 md:h-16 lg:h-20 fill-current"
      >
        <path d={renderPath()} />
      </svg>
    </div>
  );
}