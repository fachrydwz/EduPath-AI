export default function StatsCard({
  icon,
  label,
  value,
  sub,
}) {
  return (
    <div
      style={{
        background: 'white',
        padding: '24px',
        borderRadius: '20px',
        boxShadow:
          '0 4px 20px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          fontSize: '22px',
          marginBottom: '8px',
        }}
      >
        {icon}
      </div>

      <div
        style={{
          fontSize: '13px',
          color: '#64748b',
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: '26px',
          fontWeight: '700',
          color: '#1e293b',
          marginTop: '4px',
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontSize: '12px',
          color: '#94a3b8',
          marginTop: '4px',
        }}
      >
        {sub}
      </div>
    </div>
  );
}