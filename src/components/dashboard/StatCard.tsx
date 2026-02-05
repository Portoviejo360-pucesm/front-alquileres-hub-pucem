import { DashboardStat } from '@/types/dashboard';

interface StatCardProps {
  stat: DashboardStat;
}

export default function StatCard({ stat }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-inner">
        <div className="stat-content">
          <p className="stat-label">{stat.label}</p>
          <h3 
            className="stat-value" 
            style={stat.label === 'Perfil' ? { fontSize: '1.125rem' } : undefined}
          >
            {stat.value}
          </h3>
          <p className={`stat-change ${stat.changeType}`}>{stat.change}</p>
        </div>
        <div className={`stat-icon ${stat.colorClass}`}>
          {stat.icon}
        </div>
      </div>
    </div>
  );
}
