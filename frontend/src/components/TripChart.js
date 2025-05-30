import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const TripChart = ({ viajes }) => {
  // Process data for the chart
  const processData = () => {
    // Group viajes by date and status
    const groupedData = viajes.reduce((acc, viaje) => {
      const date = format(new Date(viaje.fecha_salida), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = {
          date,
          Programado: 0,
          'En tránsito': 0,
          Entregado: 0,
          Cancelado: 0,
        };
      }
      acc[date][viaje.estado]++;
      return acc;
    }, {});

    // Convert to array and sort by date
    return Object.values(groupedData).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const data = processData();

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(new Date(date), 'dd/MM', { locale: es })}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(date) => format(new Date(date), 'dd/MM/yyyy', { locale: es })}
            formatter={(value, name) => [value, name]}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="Programado" 
            stroke="#eab308" 
            strokeWidth={2}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="En tránsito" 
            stroke="#2563eb" 
            strokeWidth={2}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="Entregado" 
            stroke="#16a34a" 
            strokeWidth={2}
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="Cancelado" 
            stroke="#dc2626" 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TripChart;